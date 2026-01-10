const fs = require('fs');
const path = require('path');

const schemaDir = path.join(__dirname, 'packages/db/src/schema');

function walk(dir, callback) {
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
        const filepath = path.join(dir, file);
        const stats = fs.statSync(filepath);
        if (stats.isDirectory()) {
            walk(filepath, callback);
        } else if (stats.isFile() && file.endsWith('.ts')) {
            callback(filepath);
        }
    });
}

walk(schemaDir, (filepath) => {
    let content = fs.readFileSync(filepath, 'utf8');
    let originalContent = content;

    // 1. Replace Imports
    if (content.includes('drizzle-orm/sqlite-core')) {
        content = content.replace('drizzle-orm/sqlite-core', 'drizzle-orm/pg-core');
        
        // Replace sqliteTable with pgTable
        content = content.replace(/sqliteTable/g, 'pgTable');

        // Add potentially missing imports
        const pgImports = ['pgTable', 'serial', 'text', 'integer', 'boolean', 'timestamp', 'primaryKey'];
        // Simple regex to find the import block
        const importRegex = /import\s*\{([^}]+)\}\s*from\s*"drizzle-orm\/pg-core"/;
        const match = content.match(importRegex);
        
        if (match) {
            let currentImports = match[1].split(',').map(s => s.trim()).filter(Boolean);
            let newImports = new Set([...currentImports, ...pgImports]);
            // Filter out unused ones later? No, just add them for now to be safe, tsc will complain or we clean up later.
            // Actually, adding valid ones is better.
            // Let's just ensure serial, boolean, timestamp, pgTable are present if we use them.
            
            // Reconstruct import
            // const newImportBlock = `import {\n  ${Array.from(newImports).join(',\n  ')}\n} from "drizzle-orm/pg-core"`;
            // content = content.replace(match[0], newImportBlock);
        }
    }

    // 2. Replace Column Definitions

    // integer("id").primaryKey() -> serial("id").primaryKey()
    content = content.replace(/integer\("id"\)\.primaryKey\(\)/g, 'serial("id").primaryKey()');

    // integer("active", { mode: "boolean" }) -> boolean("active")
    content = content.replace(/integer\("(\w+)",\s*\{\s*mode:\s*"boolean"\s*\}\)/g, 'boolean("$1")');

    // integer("created_at", { mode: "timestamp" }) ... -> timestamp("created_at", { mode: "date" }).defaultNow()
    // Handling the multiline strftime is tricky with simple regex, but let's try a common pattern
    // SQLite: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`)
    // Postgres: timestamp("created_at", { mode: "date" }).defaultNow()

    // Replace the timestamp fields first
    content = content.replace(/integer\("(\w+)",\s*\{\s*mode:\s*"timestamp"\s*\}\)/g, 'timestamp("$1", { mode: "date" })');

    // Replace default(sql`...`) with defaultNow()
    // Pattern 1: .default(\n    sql`(strftime('%s', 'now'))`,\n  )
    // Pattern 2: .default(sql`(strftime('%s', 'now'))`)
    // We will use a broader regex for strftime.
    
    // Replace whole default block if it contains strftime
    content = content.replace(/\.default\(\s*sql`\(strftime\('%s', 'now'\)\)`\s*(,\s*)?\)/g, '.defaultNow()');
    content = content.replace(/\.default\(\s*sql`strftime\('%s', 'now'\)`\s*(,\s*)?\)/g, '.defaultNow()');
    
    // Also handling the case where comma is trailing inside or outside
    
    // Let's try to just replace the sql part if wrapped in default.
    // Actually, .default(sql`...`) -> .defaultNow() is the goal.
    
    if (content.includes("strftime('%s', 'now')")) {
         // Regex to match .default( ... strftime ... )
         // covering potential newlines
         content = content.replace(/\.default\([\s\S]*?strftime\('%s', 'now'\)[\s\S]*?\)/g, '.defaultNow()');
    }

    // Blob -> json ??
    // blob("data", { mode: "json" }) -> json("data") or just text/jsonb
    content = content.replace(/blob\("(\w+)",\s*\{\s*mode:\s*"json"\s*\}\)/g, 'json("$1")');

    // 3. Fix Imports specifically
    // If we introduced boolean, serial, timestamp, we must ensure they are imported.
    if (content.includes('boolean(') || content.includes('serial(') || content.includes('timestamp(') || content.includes('json(')) {
        const importMatch = content.match(/import\s*\{([^}]+)\}\s*from\s*"drizzle-orm\/pg-core"/);
        if (importMatch) {
            let imports = importMatch[1].split(',').map(s => s.trim());
            if (content.includes('boolean(') && !imports.includes('boolean')) imports.push('boolean');
            if (content.includes('serial(') && !imports.includes('serial')) imports.push('serial');
            if (content.includes('timestamp(') && !imports.includes('timestamp')) imports.push('timestamp');
             if (content.includes('json(') && !imports.includes('json')) imports.push('json');
            
            const newImportStr = 'import {\n  ' + imports.filter(Boolean).sort().join(',\n  ') + '\n} from "drizzle-orm/pg-core"';
            content = content.replace(importMatch[0], newImportStr);
        }
    }

    if (content !== originalContent) {
        console.log(`Updating ${filepath}`);
        fs.writeFileSync(filepath, content);
    }
});

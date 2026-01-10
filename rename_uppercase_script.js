const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
const ignoreDirs = ['.git', 'node_modules', '.next', '.turbo', 'dist', 'build', '.gemini', 'tmp'];
// Include all relevant extensions + env files
const extensions = [
  '.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.mdx', '.css', '.toml', '.yml', '.yaml', '.html',
  '.go', '.mod', '.sum', '.proto', '.bru', '.mjs', '.mts', '.cts', '.txt', '.xml', '.config', '.env'
];
const exactFiles = ['Dockerfile', 'Makefile', 'LICENSE', 'CNAME', '.env', '.env.example', '.env.local', '.env.docker', '.env.docker.example'];

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    if (ignoreDirs.includes(file)) return;
    
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      const ext = path.extname(file);
      if (extensions.includes(ext) || exactFiles.includes(file) || file.startsWith('.env')) {
        arrayOfFiles.push(path.join(dirPath, "/", file));
      }
    }
  });

  return arrayOfFiles;
}

const files = getAllFiles(rootDir);
let changedFiles = 0;

files.forEach(file => {
  try {
    let content = fs.readFileSync(file, 'utf8');
    let originalContent = content;

    // Replace PINGORA -> PINGORA (uppercase only)
    content = content.replace(/PINGORA/g, 'PINGORA');

    if (content !== originalContent) {
      fs.writeFileSync(file, content, 'utf8');
      console.log(`Updated: ${file}`);
      changedFiles++;
    }
  } catch (err) {
    console.error(`Error processing ${file}: ${err.message}`);
  }
});

console.log(`Finished. Updated ${changedFiles} files with uppercase regex.`);

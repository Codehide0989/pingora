const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
const ignoreDirs = ['.git', 'node_modules', '.next', '.turbo', 'dist', 'build', '.gemini'];

function getAllPaths(dirPath, arrayOfPaths) {
  const items = fs.readdirSync(dirPath);

  arrayOfPaths = arrayOfPaths || [];

  items.forEach(function(item) {
    if (ignoreDirs.includes(item)) return;
    const fullPath = path.join(dirPath, item);
    arrayOfPaths.push(fullPath);
    
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfPaths = getAllPaths(fullPath, arrayOfPaths);
    }
  });

  return arrayOfPaths;
}

const paths = getAllPaths(rootDir);

// Sort paths by length descending so we rename deepest files/dirs first
paths.sort((a, b) => b.length - a.length);

let renamedCount = 0;

paths.forEach(p => {
  const dirname = path.dirname(p);
  const basename = path.basename(p);
  
  // check if basename contains openstatus (case insensitive)
  if (basename.match(/openstatus/i)) {
    let newBasename = basename.replace(/openstatus/g, 'pingora'); // lowercase
    newBasename = newBasename.replace(/OpenStatus/g, 'Pingora'); // Match case if explicit
    // Handle Title Case if not caught by above (e.g. Openstatus -> Pingora is harder without specific rule, but let's stick to the two main ones)
    // If it was "openstatus.ts", it becomes "pingora.ts".
    // If it was "OpenStatus.tsx", it becomes "Pingora.tsx".
    
    if (newBasename !== basename) {
      const newPath = path.join(dirname, newBasename);
      try {
        fs.renameSync(p, newPath);
        console.log(`Renamed: ${p} -> ${newPath}`);
        renamedCount++;
      } catch (err) {
        console.error(`Error renaming ${p}: ${err.message}`);
      }
    }
  }
});

console.log(`Finished. Renamed ${renamedCount} items.`);

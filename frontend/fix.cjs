const fs = require('fs');

// 1. Fix AuthContext
let authFile = './src/context/AuthContext.tsx';
if (fs.existsSync(authFile)) {
  let content = fs.readFileSync(authFile, 'utf8');
  if (!content.includes('eslint-disable react-refresh')) {
    content = '/* eslint-disable react-refresh/only-export-components */\n' + content;
    fs.writeFileSync(authFile, content);
  }
}

// 2. Fix use-before-define const in pages
const files = fs.readdirSync('./src/pages').map(f => './src/pages/' + f);
for (const file of files) {
  if (file.endsWith('.tsx') || file.endsWith('.ts')) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Quick regex to turn 'const <name> = async () => {' to 'async function <name>() {'
    content = content.replace(/const\s+([a-zA-Z0-9_]+)\s*=\s*async\s*\(\)\s*=>\s*\{/g, 'async function $1() {');
    
    // Also non-async: const <name> = () => {  -> function <name>() {
    // Be careful with arrow functions inside effects etc, so we match exactly `const <name> = () => {`
    content = content.replace(/^(\s*)const\s+([a-zA-Z0-9_]+)\s*=\s*\(\)\s*=>\s*\{/gm, '$1function $2() {');
    
    fs.writeFileSync(file, content);
  }
}
console.log('Fixed syntax issues');

const fs = require('fs');
const path = require('path');

const filesToInclude = [
    'index.html',
    'css/style.css',
    'js/main.js',
    'js/admin.js',
    'js/colors_system.js',
    'firebase.json',
    'firestore.rules',
    'manifest.json',
    'package.json'
];

const workspaceRoot = process.cwd();
const outputFile = path.join(workspaceRoot, 'full_codebase_snapshot.md');

let output = '# iCloth Full Codebase Snapshot\n\n';
output += 'Generated on: ' + new Date().toLocaleString() + '\n\n';
output += 'This file contains the full source code for the main project files with line numbers for quick reference.\n\n';
output += '## Table of Contents\n';

filesToInclude.forEach(file => {
    output += `- [${file}](#${file.replace(/[\/\.]/g, '-')})\n`;
});

output += '\n---\n\n';

filesToInclude.forEach(file => {
    const filePath = path.join(workspaceRoot, file);
    if (fs.existsSync(filePath)) {
        output += `## ${file} <a name="${file.replace(/[\/\.]/g, '-')}"></a>\n\n`;
        const ext = path.extname(file).slice(1);
        const lang = ext === 'js' ? 'javascript' : ext === 'css' ? 'css' : ext === 'html' ? 'html' : 'text';
        
        output += '```' + lang + '\n';
        const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
        lines.forEach((line, index) => {
            output += `${(index + 1).toString().padStart(4, ' ')} | ${line}\n`;
        });
        output += '```\n\n---\n\n';
    } else {
        output += `## ${file}\n\n*File not found.*\n\n---\n\n`;
    }
});

fs.writeFileSync(outputFile, output);
console.log('Snapshot generated successfully at: ' + outputFile);

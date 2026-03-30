const fs = require('fs');
const path = require('path');

const BASE = __dirname;
const OUT = path.join(BASE, 'FULL_CODE.md');

const FILES = [
    { label: 'index.html',             file: 'index.html' },
    { label: 'css/style.css',          file: path.join('css', 'style.css') },
    { label: 'js/main.js',             file: path.join('js', 'main.js') },
    { label: 'js/colors_system.js',    file: path.join('js', 'colors_system.js') },
    { label: 'js/admin.js',            file: path.join('js', 'admin.js') },
];

let output = `# 📂 iCloth — Full Source Code\n`;
output += `> Generated: ${new Date().toISOString()}\n\n`;
output += `---\n\n`;

// Table of contents
output += `## 📋 Files Included\n\n`;
FILES.forEach(f => {
    const fullPath = path.join(BASE, f.file);
    if (fs.existsSync(fullPath)) {
        const lines = fs.readFileSync(fullPath, 'utf8').split('\n').length;
        output += `- [\`${f.label}\`](#${f.label.replace(/[^a-z0-9]/gi,'').toLowerCase()}) — ${lines} lines\n`;
    }
});
output += `\n---\n\n`;

// Each file
FILES.forEach(f => {
    const fullPath = path.join(BASE, f.file);
    if (!fs.existsSync(fullPath)) {
        output += `## ❌ ${f.label} — NOT FOUND\n\n---\n\n`;
        return;
    }

    const content = fs.readFileSync(fullPath, 'utf8');
    const lines = content.split('\n');
    const ext = path.extname(f.file).replace('.', '') || 'text';
    const langMap = { html: 'html', css: 'css', js: 'javascript', md: 'markdown' };
    const lang = langMap[ext] || 'text';

    output += `## 📄 ${f.label}\n\n`;
    output += `> **Lines:** ${lines.length} | **Size:** ${(fs.statSync(fullPath).size / 1024).toFixed(1)} KB\n\n`;
    
    // Add line numbers
    const numbered = lines.map((line, i) => {
        const num = String(i + 1).padStart(5, ' ');
        return `${num}: ${line}`;
    }).join('\n');

    output += `\`\`\`${lang}\n${numbered}\n\`\`\`\n\n`;
    output += `---\n\n`;
    
    console.log(`✅ Added: ${f.label} (${lines.length} lines)`);
});

fs.writeFileSync(OUT, output, 'utf8');
const sizeMB = (fs.statSync(OUT).size / 1024 / 1024).toFixed(2);
console.log(`\n🎉 Done! File saved: FULL_CODE.md (${sizeMB} MB)`);

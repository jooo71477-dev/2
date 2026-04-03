
const fs = require('fs');
const path = require('path');

const fullCodePath = path.join(process.cwd(), 'FULL_CODE.md');
const content = fs.readFileSync(fullCodePath, 'utf8');
const lines = content.split('\n');

function extractFile(startLine, endLine, targetPath) {
    console.log(`Extracting ${targetPath} (Lines ${startLine}-${endLine})...`);
    // Adjust for 0-based indexing of slice
    const fileLines = lines.slice(startLine - 1, endLine);
    const cleanedLines = fileLines.map(line => {
        // Strip the line number prefix if it exists (e.g., "    1: ")
        return line.replace(/^\s*\d+:\s/, '');
    });
    fs.writeFileSync(path.join(process.cwd(), targetPath), cleanedLines.join('\n'));
    console.log(`Saved ${targetPath} (${cleanedLines.length} lines)`);
}

// Extraction map
const tasks = [
    { start: 4846, end: 7991, path: 'js/main.js' },
    { start: 8269, end: 11116, path: 'js/admin.js' },
    { start: 8000, end: 8258, path: 'js/colors_system.js' }
];

tasks.forEach(t => extractFile(t.start, t.end, t.path));

// Update index.html
const indexPath = path.join(process.cwd(), 'index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf8');
// The regex below covers the script tags we added during modularization.
const scriptRegex = /<!-- App Scripts \(Modular\) -->[\s\S]*?<script src="\.\/js\/main\.js\?v=5\.15"><\/script>/;
const restoredScripts = `<!-- App Scripts -->
    <script src="./js/colors_system.js"></script>
    <script src="./js/main.js?v=5.15"></script>`;
if (indexHtml.match(scriptRegex)) {
    indexHtml = indexHtml.replace(scriptRegex, restoredScripts);
    fs.writeFileSync(indexPath, indexHtml);
    console.log('Updated index.html');
}

// Update admin HTML (jkjJKCJQWH38H877-UGJj-Pjkhwnj.html)
const adminPath = path.join(process.cwd(), 'jkjJKCJQWH38H877-UGJj-Pjkhwnj.html');
let adminHtml = fs.readFileSync(adminPath, 'utf8');
const adminScriptRegex = /<!-- Modular Admin Logic -->[\s\S]*?<script src="\.\/js\/admin\.js\?v=20\.2"><\/script>/;
const restoredAdminScripts = `<!-- Admin Logic -->
    <script src="js/colors_system.js"></script>
    <script src="./js/admin.js?v=20.2"></script>`;
if (adminHtml.match(adminScriptRegex)) {
    adminHtml = adminHtml.replace(adminScriptRegex, restoredAdminScripts);
    fs.writeFileSync(adminPath, adminHtml);
    console.log('Updated admin HTML');
}

// Cleanup modular files
const filesToDelete = [
    'js/core.js', 'js/translations.js', 'js/firebase_init.js', 'js/ui.js', 'js/hero.js',
    'js/products.js', 'js/cart_wishlist.js', 'js/order_checkout.js', 'js/admin_api.js',
    'js/admin_common.js', 'js/admin_products.js', 'js/admin_categories.js', 'js/admin_orders.js',
    'js/admin_coupons.js', 'js/admin_cms.js', 'js/admin_analytics.js'
];

filesToDelete.forEach(f => {
    const p = path.join(process.cwd(), f);
    if (fs.existsSync(p)) {
        fs.unlinkSync(p);
        console.log(`Deleted ${f}`);
    }
});

console.log('Restoration Complete! ✅');

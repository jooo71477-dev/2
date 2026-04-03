// 🚀 iCloth Admin - Main Entry Point
// All logic is split into modular scripts loaded in index.html

document.addEventListener('DOMContentLoaded', () => {
    initAdminFirebase();
    setupAdminNavigation();
});

function setupAdminNavigation() {
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.substring(1) || 'overview';
        showSection(hash);
        loadSectionData(hash);
    });

    const initialHash = window.location.hash.substring(1) || 'overview';
    showSection(initialHash);
    loadSectionData(initialHash);
}

function showSection(id) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(s => s.classList.remove('active'));
    const section = document.getElementById(id);
    if (section) section.classList.add('active');
}

function loadSectionData(id) {
    switch (id) {
        case 'products': if (window.loadProducts) loadProducts(); break;
        case 'categories': if (window.loadCategories) loadCategories(); break;
        case 'orders': if (window.loadOrders) loadOrders(); break;
        case 'cms': if (window.loadCMS) loadCMS(); break;
        case 'overview': if (window.updateStats) updateStats(); break;
    }
}

function updateStats() {
    const pEl = document.getElementById('stat-products');
    const oEl = document.getElementById('stat-orders');
    const sEl = document.getElementById('stat-sales');
    
    if (pEl) pEl.innerText = products.length || 0;
    if (oEl) oEl.innerText = orders.length || 0;
    if (sEl) sEl.innerText = `${(orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0)).toLocaleString()} ج.م`;
}

// Global Edit/Delete Handlers for UI Buttons
window.editProduct = (id) => { if (window.openProductModal) openProductModal(id); };
window.deleteProduct = (id) => { if (window.deleteProductInDB) deleteProductInDB(id); };
window.viewOrderDetails = (id) => { if (window.openOrderDetailsModal) openOrderDetailsModal(id); };

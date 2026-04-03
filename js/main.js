// 🚀 iCloth - Main Entry Point & Orchestration
// All modules (core, translations, ui, hero, products, etc.) are loaded via index.html

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    updateLanguageUI();
    setupEventListeners();
    initHeroSlider();
});

function attachRealTimeListeners() {
    if (!db) return;
    
    // Listen for CMS settings
    db.collection('settings').doc('cms').onSnapshot(doc => {
        if (doc.exists) {
            applyCMS(doc.data());
        }
    });

    // Listen for products
    db.collection('products').onSnapshot(snapshot => {
        remoteProducts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log("📦 Products updated:", remoteProducts.length);
        if (window.renderDynamicFilters) renderDynamicFilters();
    });
}

function applyCMS(data) {
    if (!data) return;
    window.lastCMSData = data;
    
    // Update Announcement
    const ann = document.getElementById('announcement-text-display');
    if (ann) {
        let msg = data.promoText || data.announcement || '';
        if (currentLang === 'ar' && (data.promoText_ar || data.announcement_ar)) {
            msg = data.promoText_ar || data.announcement_ar;
        } else {
            msg = translateText(msg);
        }
        ann.innerText = msg;
    }
    
    // Update Slider
    if (data.heroSlides) {
        window.heroSlides = data.heroSlides;
        initHeroSlider();
    }
}

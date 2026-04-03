// 🌍 iCloth - Core State & Utilities
let cart = [];
try {
    const saved = localStorage.getItem('icloth_cart');
    if (saved) cart = JSON.parse(saved);
} catch (e) {
    cart = [];
}

let selectedProductForSize = null;
let selectedColor = null;
let aiTranslationCache = JSON.parse(localStorage.getItem('icloth_ai_cache') || '{}');
let activeAITranslations = new Set();
let activeCategory = "all";
const BOSTA_PROXY_URL = "https://bosta-proxy.jooo71477.workers.dev";
let remoteProducts = []; 
let dynamicCategories = [];
let appliedCoupon = null;
let wishlist = [];
try {
    wishlist = JSON.parse(localStorage.getItem('icloth_wishlist') || '[]');
} catch (e) { wishlist = []; }

let currentUser = null;
let db = null;
let currentLang = localStorage.getItem('icloth_lang') || 'en';

const toSlug = (text) => {
    if (!text) return "";
    return text.toString().toLowerCase().trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\u0621-\u064A-]+/g, '')
        .replace(/--+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
};

function getOptimizedImg(url, width = 600) {
    if (!url || !url.includes('cloudinary.com')) return url;
    return url.replace('/upload/', `/upload/c_limit,w_${width},q_auto,f_auto/`);
}

window.scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (window.showCategoriesView) showCategoriesView();
};

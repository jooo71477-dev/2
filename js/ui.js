// 🎨 iCloth - UI & Theme Controls
const toggleTheme = () => {
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('icloth_theme', newTheme);
};

const initTheme = () => {
    const saved = localStorage.getItem('icloth_theme') || 'dark';
    document.body.setAttribute('data-theme', saved);
};

const setLanguage = (lang) => {
    currentLang = lang;
    localStorage.setItem('icloth_lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    updateLanguageUI();
    
    if (window.renderDynamicFilters) renderDynamicFilters();
    if (window.renderSidebarCategories) renderSidebarCategories();
    if (window.applyCMS && window.lastCMSData) applyCMS(window.lastCMSData);
};

const updateLanguageUI = () => {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[currentLang] && translations[currentLang][key]) {
            el.innerHTML = translations[currentLang][key];
        }
    });

    document.querySelectorAll('input, textarea').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (key && translations[currentLang] && translations[currentLang][key]) {
            el.placeholder = translations[currentLang][key];
        }
    });

    // Update custom elements
    const footerTitle = document.querySelector('.footer-title');
    if (footerTitle) footerTitle.innerText = translations[currentLang].about_us;
    
    const footerDesc = document.querySelector('.footer-about p');
    if (footerDesc) footerDesc.innerText = translations[currentLang].about_desc;
};

const toggleSidebarMenu = () => {
    const menu = document.getElementById('side-menu');
    const overlay = document.getElementById('side-menu-overlay');
    if (menu && overlay) {
        const isActive = menu.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.style.overflow = isActive ? 'hidden' : '';
    }
};

const openCartSidebar = () => {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('cart-overlay');
    if (sidebar && overlay) {
        sidebar.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
};

const closeCartSidebar = () => {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('cart-overlay');
    if (sidebar && overlay) {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
};

function showToast(msg) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

const navbar = document.querySelector('.navbar');
const cartBtn = document.getElementById('cart-btn');
const closeCartBtn = document.getElementById('close-cart');
const cartOverlay = document.getElementById('cart-overlay');

function setupEventListeners() {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) navbar?.classList.add('scrolled');
        else navbar?.classList.remove('scrolled');
    });

    if (cartBtn) {
        cartBtn.addEventListener('click', (e) => { 
            e.preventDefault(); 
            openCartSidebar(); 
        });
    }
    
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', () => {
            closeCartSidebar();
        });
    }
    
    if (cartOverlay) {
        cartOverlay.addEventListener('click', () => {
            closeCartSidebar();
        });
    }
}

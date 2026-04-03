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

function renderSidebarCategories() {
    const sidebarCats = document.getElementById('sidebar-categories');
    const bestSellerCats = document.getElementById('best-seller-categories');
    if (!sidebarCats || !bestSellerCats) return;

    const mainCats = dynamicCategories.filter(c => !c.parentId);
    sidebarCats.innerHTML = mainCats.map(c => renderSidebarBranch(c, true)).join('');

    const getRootId = (catId) => {
        let curr = dynamicCategories.find(x => x.id === catId);
        while(curr && curr.parentId) {
            curr = dynamicCategories.find(x => x.id === curr.parentId);
        }
        return curr ? curr.id : catId;
    };

    const bestSellerProducts = remoteProducts.filter(p => p.isBestSeller === true);
    const bestSellerRootIds = [...new Set(bestSellerProducts.map(p => getRootId(p.category)))];
    const bsCats = mainCats.filter(c => bestSellerRootIds.includes(c.id));

    bestSellerCats.innerHTML = bsCats.map(c => {
        const translatedCat = (currentLang === 'ar' && c.name_ar) ? c.name_ar : translateText(c.name);
        return `
            <a href="#" class="menu-item" onclick="applyBestSellerFilter('${c.id}'); return false;" data-translate-cache="${c.name}">
                ${translatedCat}
                <i class="fas fa-fire" style="font-size: 0.8rem; opacity: 0.5; color: #ff4d4d;"></i>
            </a>
        `;
    }).join('');
}

function renderSidebarBranch(cat, forceExpand = false) {
    const subs = dynamicCategories.filter(s => s.parentId === cat.id);
    const hasSubs = subs.length > 0;
    const isMain = !cat.parentId;
    const className = isMain ? "menu-item" : "sub-menu-item";
    
    const translatedCat = (currentLang === 'ar' && cat.name_ar) ? cat.name_ar : translateText(cat.name);
    
    if (hasSubs) {
        return `
            <div class="menu-item-wrap ${forceExpand ? 'expanded' : ''}">
                <a href="#" class="${className}" onclick="toggleMenuBranch(this, event); return false;" data-translate-cache="${cat.name}">
                    ${translatedCat}
                    <i class="fas fa-chevron-down" style="font-size: 0.8rem; opacity: 0.3;"></i>
                </a>
                <div class="sub-menu-list">
                    <a href="#" class="sub-menu-item" onclick="applySideFilter('${cat.id}', 'all'); return false;" style="font-weight: 900; color: var(--primary);">
                        ${currentLang === 'ar' ? 'عرض الكل' : 'View All'}
                    </a>
                    ${subs.map(s => renderSidebarBranch(s)).join('')}
                </div>
            </div>
        `;
    } else {
        let topParent = cat.id;
        let curr = cat;
        while(curr && curr.parentId) {
            curr = dynamicCategories.find(x => x.id === curr.parentId);
            if(curr) topParent = curr.id;
        }

        return `
            <a href="#" class="${className}" onclick="applySideFilter('${topParent}', '${cat.id}'); return false;" data-translate-cache="${cat.name}">
                ${translatedCat}
                ${isMain ? '<i class="fas fa-arrow-right" style="font-size: 0.8rem; opacity: 0.2;"></i>' : ''}
            </a>
        `;
    }
}

window.toggleMenuBranch = (el, e) => {
    e.preventDefault();
    const wrap = el.closest('.menu-item-wrap');
    if (wrap) {
        const siblings = wrap.parentElement.querySelectorAll(':scope > .menu-item-wrap');
        siblings.forEach(sib => {
            if (sib !== wrap) sib.classList.remove('expanded');
        });
        wrap.classList.toggle('expanded');
    }
};

const applySideFilter = (parent, sub) => {
    toggleSidebarMenu();
    activeCategory = parent;
    
    const mainBtn = document.querySelector(`.main-filter-btn[data-parent="${parent}"]`);
    if (mainBtn) {
        document.querySelectorAll('.main-filter-btn').forEach(b => b.classList.remove('active'));
        mainBtn.classList.add('active');
    }

    if (window.subFiltersContainer) window.subFiltersContainer.innerHTML = '';
    
    if (sub !== 'all') {
        if (window.renderSubFilters) window.renderSubFilters(parent, 0);
        setTimeout(() => {
            const subBtn = document.querySelector(`.sub-btn[onclick*="'${sub}'"]`);
            if (subBtn) subBtn.click();
        }, 150);
    } else {
        if (window.renderSubFilters) window.renderSubFilters(parent, 0);
    }
    
    if (window.filterAndRender) window.filterAndRender('men', sub === 'all' ? parent : sub, 'all');
    document.getElementById('men-products')?.scrollIntoView({ behavior: 'smooth' });
}

const applyBestSellerFilter = (catId) => {
    toggleSidebarMenu();
    if (window.filterAndRender) window.filterAndRender('men', catId, 'all', true);
    document.getElementById('men-products')?.scrollIntoView({ behavior: 'smooth' });
}

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

function openProductModal(id) {
    const p = remoteProducts.find(x => x.id === id);
    if (!p) return;
    
    selectedProductForSize = p;
    selectedColor = p.colorVariants?.[0]?.name || null;
    
    document.getElementById('modal-product-name').innerText = (currentLang === 'ar' && p.name_ar) ? p.name_ar : translateText(p.name);
    document.getElementById('modal-product-price').innerText = `${p.price} ${translations[currentLang].currency}`;
    
    const imgEl = document.getElementById('modal-img');
    if (imgEl) imgEl.src = p.image || '';
    
    const colorContainer = document.getElementById('modal-color-options');
    if (colorContainer) {
        if (p.colorVariants && p.colorVariants.length > 1) {
            colorContainer.innerHTML = p.colorVariants.map(v => `
                <div class="color-swatch-item ${v.name === selectedColor ? 'selected' : ''}" 
                     onclick="modalSelectColor('${v.name}', this)" 
                     style="background: ${v.code || '#ccc'};">
                </div>
            `).join('');
            colorContainer.style.display = 'flex';
        } else {
            colorContainer.style.display = 'none';
        }
    }
    
    renderModalSizes(p, selectedColor);
    document.getElementById('size-modal').classList.add('active');
}

function modalSelectColor(color, btn) {
    selectedColor = color;
    document.querySelectorAll('.color-swatch-item').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    
    const p = selectedProductForSize;
    if (p && p.colorVariants) {
        const v = p.colorVariants.find(x => x.name === color);
        const imgEl = document.getElementById('modal-img');
        if (imgEl) {
             const vImg = (v && v.images && v.images.length > 0) ? v.images[0] : (v?.image || p.image || '');
             imgEl.src = vImg;
        }
        renderModalSizes(p, color);
    }
}

function renderModalSizes(p, color) {
    const container = document.querySelector('.size-options');
    if (!container) return;
    
    let sizes = p.sizes || ['M', 'L', 'XL', 'XXL'];
    if (p.colorVariants) {
        const v = p.colorVariants.find(x => x.name === color);
        if (v && v.sizes && v.sizes.length > 0) sizes = v.sizes;
    }

    container.innerHTML = sizes.map(s => `
        <button class="size-btn" onclick="selectSizeForCart('${s}', this)">${s}</button>
    `).join('');
}

window.selectSizeForCart = (size, btn) => {
    document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    window._selectedModalSize = size;
};

window.addToBasketFromModal = () => {
    if (!window._selectedModalSize) {
        alert(currentLang === 'ar' ? "يرجى اختيار المقاس أولاً" : "Please select a size first");
        return;
    }
    if (window.addToCartFromModal) window.addToCartFromModal(window._selectedModalSize);
};

window.openProductModal = openProductModal;
window.modalSelectColor = modalSelectColor;

function closeSizeModal() {
    const modal = document.getElementById('size-modal');
    if (modal) modal.classList.remove('active');
}
window.closeSizeModal = closeSizeModal;

function setupEventListeners() {
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 10) navbar?.classList.add('scrolled');
        else navbar?.classList.remove('scrolled');
    });

    const cartBtn = document.getElementById('cart-btn');
    if (cartBtn) {
        cartBtn.addEventListener('click', (e) => { 
            e.preventDefault(); 
            openCartSidebar(); 
        });
    }
    
    const closeCartBtn = document.getElementById('close-cart');
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', () => {
            closeCartSidebar();
        });
    }
    
    const cartOverlay = document.getElementById('cart-overlay');
    if (cartOverlay) {
        cartOverlay.addEventListener('click', () => {
            closeCartSidebar();
        });
    }
}

setupEventListeners();

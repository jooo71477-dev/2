// 👕 iCloth - Products & Categories Logic
window.loadDynamicCategories = async function() {
    if (db) {
        const snapshot = await db.collection('categories').get();
        dynamicCategories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(c => c.active !== false)
            .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
        renderDynamicFilters();
    }
}

window.renderDynamicFilters = function() {
    const categoriesView = document.getElementById('home-categories-view');
    if (!categoriesView) {
        renderSidebarCategories();
        return;
    }
    
    const mainCats = dynamicCategories.filter(c => !c.parentId);
    let html = `
        <style>
            .cats-scroll-container {
                display: flex;
                overflow-x: auto;
                gap: 15px;
                padding-bottom: 25px;
                scrollbar-width: none;
                -ms-overflow-style: none;
                scroll-snap-type: x mandatory;
                padding-left: 5px;
                padding-right: 5px;
            }
            .cats-scroll-container::-webkit-scrollbar {
                display: none;
            }
            .cats-scroll-container > .subcategory-card {
                flex: 0 0 calc(50% - 10px);
                scroll-snap-align: start;
            }
            .dots-container {
                display: flex;
                justify-content: center;
                gap: 8px;
                margin-top: -10px;
                margin-bottom: 40px;
            }
            .scroll-dot {
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background: rgba(255,255,255,0.3);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                cursor: pointer;
            }
            .scroll-dot.active {
                background: var(--primary);
                transform: scale(1.5);
                box-shadow: 0 0 15px var(--primary);
                opacity: 1;
            }
            @media (min-width: 768px) {
                .cats-scroll-container > .subcategory-card {
                    flex: 0 0 280px;
                }
            }
        </style>
    `;
    
    let initialCatSlug = null;
    if (window.location.pathname.includes('/category/')) {
        initialCatSlug = decodeURIComponent(window.location.pathname.split('/category/')[1]);
    } else {
        const params = new URLSearchParams(window.location.search);
        initialCatSlug = params.get('cat');
    }
    
    let hasMatch = false;

    mainCats.forEach((mainCat, index) => {
        const mainCatTitle = (currentLang === 'ar' && mainCat.name_ar) ? mainCat.name_ar : translateText(mainCat.name);
        if (initialCatSlug && toSlug(mainCat.name) === initialCatSlug) {
             hasMatch = true;
             setTimeout(() => openCategoryProducts(mainCat.id, mainCatTitle), 100);
        }

        const subs = dynamicCategories.filter(c => c.parentId === mainCat.id);
        
        html += `
            <div style="margin-bottom: 60px;">
                <h2 style="font-size: 2rem; font-weight: 900; margin-bottom: 25px; text-transform: uppercase; color: var(--text-main); letter-spacing: 2px; border-bottom: 2px solid rgba(212,175,55,0.2); padding-bottom: 10px;">${mainCatTitle}</h2>
                <div class="cats-scroll-container">
        `;
        
        if (subs.length > 0) {
            subs.forEach(s => {
                const subTitle = (currentLang === 'ar' && s.name_ar) ? s.name_ar : translateText(s.name);
                const imgUrl = s.imageUrl || 'images/placeholder-collection.jpg';
                if (initialCatSlug && toSlug(s.name) === initialCatSlug) {
                     hasMatch = true;
                     setTimeout(() => openCategoryProducts(s.id, subTitle), 100);
                }
                
                html += `
                    <div class="subcategory-card" onclick="openCategoryProducts('${s.id}', '${subTitle}')" style="cursor: pointer; background: #081a44; border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; transition: all 0.3s; box-shadow: 0 5px 15px rgba(0,0,0,0.3);">
                        <div style="width: 100%; height: 400px; background-image: url('${imgUrl}'); background-size: cover; background-position: center; transition: transform 0.5s;"></div>
                        <div style="padding: 20px 15px; text-align: center; background: linear-gradient(to top, rgba(0,0,0,0.9), transparent); margin-top: -60px; z-index: 2; position: relative;">
                            <h3 style="color: #fff; font-weight: 900; text-transform: uppercase; font-size: 1.1rem; margin: 0; text-shadow: 0 2px 4px rgba(0,0,0,0.8);">${subTitle}</h3>
                        </div>
                    </div>
                `;
            });
        } else {
            const imgUrl = mainCat.imageUrl || 'images/placeholder-collection.jpg';
            html += `
                <div class="subcategory-card" onclick="openCategoryProducts('${mainCat.id}', '${mainCatTitle}')" style="cursor: pointer; background: #081a44; border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; transition: all 0.3s; box-shadow: 0 5px 15px rgba(0,0,0,0.3);">
                    <div style="width: 100%; height: 400px; background-image: url('${imgUrl}'); background-size: cover; background-position: center;"></div>
                    <div style="padding: 20px 15px; text-align: center; background: linear-gradient(to top, rgba(0,0,0,0.9), transparent); margin-top: -60px; z-index: 2; position: relative;">
                         <h3 style="color: #fff; font-weight: 900; text-transform: uppercase; font-size: 1.1rem; margin: 0; text-shadow: 0 2px 4px rgba(0,0,0,0.8);">${currentLang === 'ar' ? 'جميع المنتجات' : 'View All'}</h3>
                    </div>
                </div>
            `;
        }
        
        html += `
                </div>
                <div class="dots-container"></div>
            </div>
        `;
    });
    
    categoriesView.innerHTML = html;
    
    // Initialize Scroll Dots for each container
    setTimeout(() => {
        document.querySelectorAll('.cats-scroll-container').forEach(container => {
            const parent = container.parentElement;
            const dotsContainer = parent.querySelector('.dots-container');
            if (!dotsContainer) return;

            const cards = container.querySelectorAll('.subcategory-card');
            const cardCount = cards.length;
            
            let dotsHtml = '';
            for (let i = 0; i < cardCount; i++) {
                dotsHtml += `<div class="scroll-dot ${i === 0 ? 'active' : ''}"></div>`;
            }
            dotsContainer.innerHTML = dotsHtml;

            container.addEventListener('scroll', () => {
                const scrollLeft = Math.abs(container.scrollLeft);
                const cardWidth = cards[0]?.offsetWidth + 15 || 300; 
                const activeIndex = Math.round(scrollLeft / cardWidth);
                
                dotsContainer.querySelectorAll('.scroll-dot').forEach((dot, idx) => {
                    dot.classList.toggle('active', idx === activeIndex);
                });
            });
        });
    }, 100);
    
    if (!initialCatSlug && !hasMatch) {
        showCategoriesView(); 
    }
    
    renderSidebarCategories();
}

function showCategoriesView() {
    const catsView = document.getElementById('home-categories-view');
    const prodsView = document.getElementById('home-products-view');
    if(catsView) catsView.style.display = 'block';
    if(prodsView) prodsView.style.display = 'none';
}

function showProductsView(title) {
    const catsView = document.getElementById('home-categories-view');
    const prodsView = document.getElementById('home-products-view');
    if(catsView) catsView.style.display = 'none';
    if(prodsView) prodsView.style.display = 'block';
    
    const titleEl = document.getElementById('current-category-title');
    if(titleEl) titleEl.innerText = title || '';
}

function openCategoryProducts(catId, title) {
    showProductsView(title);
    renderSubFilters(catId, 0); 
    filterAndRender('men', catId, 'all'); 
    document.getElementById('home-products-view')?.scrollIntoView({ behavior: 'smooth' });
}

window.applyMainFilter = (parentId, btn) => {
    document.querySelectorAll('.main-filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeCategory = parentId;
    
    if (window.subFiltersContainer) {
        window.subFiltersContainer.innerHTML = '';
        window.subFiltersContainer.classList.remove('active');
    }
    
    if (parentId !== 'all') {
        renderSubFilters(parentId, 0);
    }
    
    filterAndRender('men', parentId, 'all');
};

window.applySubFilter = (parent, sub, btn, level) => {
    btn.parentElement.querySelectorAll('.sub-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    const filterId = (sub === 'all') ? parent : sub;
    filterAndRender('men', filterId, 'all');

    const subFiltersContainer = document.getElementById('sub-filters-container');
    if (subFiltersContainer) {
        const rows = subFiltersContainer.querySelectorAll('.sub-filter-row');
        rows.forEach(row => {
            if (parseInt(row.dataset.level) > level) row.remove();
        });

        if (sub !== 'all') {
            renderSubFilters(sub, level + 1);
        }
    }
};

function renderSubFilters(parentId, level = 0) {
    const subFiltersContainer = document.getElementById('sub-filters-container');
    if (!subFiltersContainer) return;
    
    const subs = dynamicCategories.filter(c => c.parentId === parentId);
    if (subs.length === 0) return;

    const row = document.createElement('div');
    row.className = 'sub-filter-row';
    row.dataset.level = level;
    row.style.display = 'flex';
    row.style.gap = '10px';
    row.style.flexWrap = 'wrap';
    row.style.justifyContent = 'center';
    row.style.marginTop = '15px';
    row.style.width = '100%';

    row.innerHTML = `<button class="sub-btn active" onclick="applySubFilter('${parentId}', 'all', this, ${level})" data-i18n="all">${translations[currentLang].all}</button>` +
        subs.map(s => {
            const translatedCat = (currentLang === 'ar' && s.name_ar) ? s.name_ar : translateText(s.name);
            return `<button class="sub-btn" onclick="applySubFilter('${parentId}', '${s.id}', this, ${level})" data-translate-cache="${s.name}">${translatedCat}</button>`;
        }).join('');

    subFiltersContainer.appendChild(row);
    subFiltersContainer.classList.add('active');
    subFiltersContainer.style.display = 'block';
}

function filterAndRender(gender, catId, color, isBestSellerOnly = false) {
    const container = document.getElementById('men-products') || document.getElementById('products-list');
    if (!container) return;
    
    let filtered = remoteProducts;
    
    if (isBestSellerOnly) {
        filtered = filtered.filter(p => p.isBestSeller === true);
    }
    
    if (catId !== 'all') {
        filtered = filtered.filter(p => p.category === catId || p.parentCategory === catId);
    }
    
    if (filtered.length === 0) {
        container.innerHTML = `<div class="no-results">${translations[currentLang].no_results}</div>`;
        return;
    }
    
    container.innerHTML = filtered.map(p => renderProductCard(p)).join('');
}

function renderProductCard(p) {
    const name = (currentLang === 'ar' && p.name_ar) ? p.name_ar : translateText(p.name);
    const p1 = (p.price || 0).toLocaleString();
    const cur = translations[currentLang].currency;
    const img = (p.images && p.images.length > 0) ? getOptimizedImg(p.images[0], 400) : 'images/placeholder.jpg';
    
    return `
        <div class="product-card" onclick="openProductModal('${p.id}')">
            <div class="product-img-wrap">
                <img src="${img}" alt="${name}" loading="lazy">
            </div>
            <div class="product-info">
                <h3>${name}</h3>
                <div class="price-box">
                    <span class="price">${p1} ${cur}</span>
                </div>
            </div>
        </div>
    `;
}

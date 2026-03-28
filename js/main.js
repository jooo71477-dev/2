// 🚀 DIESEL SHOP - INVINCIBLE ENGINE (Firebase Version)
// --- LOADER LOGIC MOVED TO DATA LOAD ---

let cart = [];
try {
    const saved = localStorage.getItem('icloth_cart');
    if (saved) cart = JSON.parse(saved);
} catch (e) {
    cart = [];
}

let selectedProductForSize = null;
let selectedColor = null;
// 🚀 AI Translation Cache & State
let aiTranslationCache = JSON.parse(localStorage.getItem('icloth_ai_cache') || '{}');
let activeAITranslations = new Set();
let activeCategory = "all";
let remoteProducts = []; // To store products from Firebase
let appliedCoupon = null;
let wishlist = [];
try {
    wishlist = JSON.parse(localStorage.getItem('icloth_wishlist') || '[]');
} catch (e) { wishlist = []; }

const governorates_data = {
    en: ["Cairo", "Giza", "Alexandria", "Dakahlia", "Red Sea", "Beheira", "Faiyum", "Gharbia", "Ismailia", "Monufia", "Minya", "Qalyubia", "New Valley", "Suez", "Sharqia", "Damietta", "Port Said", "South Sinai", "Kafr El Sheikh", "Matrouh", "Luxor", "Qena", "North Sinai", "Sohag", "Beni Suef", "Asyut", "Aswan"],
    ar: ["القاهرة", "الجيزة", "الإسكندرية", "الدقهلية", "البحر الأحمر", "البحيرة", "الفيوم", "الغربية", "الإسماعيلية", "المنوفية", "المنيا", "القليوبية", "الوادي الجديد", "السويس", "الشرقية", "دمياط", "بورسعيد", "جنوب سيناء", "كفر الشيخ", "مطروح", "الأقصر", "قنا", "شمال سيناء", "سوهاج", "بني سويف", "أسيوط", "أسوان"]
};

const translations = {
    en: {
        home: "Home",
        products: "Products",
        login: "Login",
        logout: "Logout",
        shopping_cart: "Shopping Cart",
        login_prompt: "Login to track your order ✨",
        login_with_google: "Login with Google",
        total: "Total:",
        checkout: "Checkout",
        hero_title: "iCloth <br><span>FASHION</span>",
        hero_subtitle: "Latest fashion trends and modern clothing for all tastes",
        hero_motto: "The Most Stylish <br> Youth & Street Wear",
        shop_now: "Shop Collection",
        discover_more: "Discover More",
        available_categories: "Available Categories",
        featured_collection: "Our Featured Collection",
        about_us: "About Us",
        about_desc: "We bring you the finest modern clothing with the highest quality and the best designs that suit your refined taste.",
        whatsapp_contact: "Contact via WhatsApp",
        product_name: "Product Name",
        limited_stock: "Limited Stock – Get it before it's gone",
        available_color: "Available Color:",
        select_size: "Select Size:",
        complete_order_title: "Complete Order 📦",
        complete_order_desc: "Please enter your details to complete the order",
        full_name: "Full Name",
        name_placeholder: "e.g., John Doe",
        mobile_number: "Mobile Number",
        backup_mobile_number: "Backup Mobile Number (Optional)",
        governorate: "Governorate / City",
        select_city: "Select City...",
        detailed_address: "Detailed Address",
        address_placeholder: "City center, Street, Landmark...",
        payment_method: "Payment Method",
        cod: "Cash on Delivery",
        cod_desc: "Pay comfortably upon receiving your order 💰",
        shipping_cost: "Shipping Cost:",
        order_total: "Order Total:",
        confirm_order: "Confirm Order Now ✨",
        order_success_title: "Order Placed Successfully!",
        order_success_desc: "Thank you for trusting iCloth. We will contact you soon to confirm the order.",
        okay: "Okay",
        track_orders: "Track Orders",
        track_orders_desc: "Login with Google to follow your order status",
        my_orders: "My Orders",
        currency: "EGP",
        cart_empty: "Cart is empty",
        no_results: "No results found",
        loading: "Loading...",
        all: "All",
        price_label: "Price:",
        standard_color: "",
        unavailable: "Currently Unavailable",
        cod_btn: "COD (Deposit 100 EGP)",
        wallet_btn: "Mobile Wallet",
        instapay_btn: "InstaPay",
        transfer_shipping: "Confirm your order (Deposit 100 EGP)",
        transfer_shipping_desc: "Please transfer 100 EGP as a deposit to confirm your order, you will pay the remaining amount on delivery.",
        transfer_full: "Confirm your order (Transfer Full Amount)",
        transfer_full_desc: "Please transfer the total amount to confirm your order.",
        upload_receipt: "Transfer Receipt Screenshot (Required)",
        apply: "Apply",
        coupon_placeholder: "Discount Code",
        invalid_coupon: "Invalid or expired code",
        coupon_applied: "Coupon applied successfully!",
        discount: "Discount:",
        read_more: "Read More...",
        product_description: "Product Description",
        account_name: "Account Owner Name:",
        copy_btn: "Copy",
        menu: "Menu",
        best_seller: "Best Seller",
        categories: "Categories",
        size_chart: "Size Chart",
        maintenance_contact: "Maintenance Contact",
        add_to_basket: "ADD TO BASKET",
        collection_free: "Collection in-store FREE",
        you_may_also_like: "YOU MAY ALSO LIKE",
        shipping_policy: "Shipping Policy",
        returns_policy: "Returns & Exchange Policy",
        wishlist: "Favorites"
    },
    ar: {
        home: "الرئيسية",
        products: "المنتجات",
        login: "دخول",
        logout: "خروج",
        shopping_cart: "سلة التسوق",
        login_prompt: "سجل دخول لمتابعة طلبك ✨",
        login_with_google: "تسجيل الدخول بجوجل",
        total: "الإجمالي:",
        checkout: "إتمام الطلب",
        hero_title: "iCloth <br><span>FASHION</span>",
        hero_subtitle: "أحدث صيحات الموضة والملابس العصرية لكل الأذواق",
        hero_motto: "أرقى الملابس الشبابية والعصرية",
        shop_now: "تسوق المجموعة",
        discover_more: "اكتشف المزيد",
        available_categories: "الأقسام المتوفرة",
        featured_collection: "تشكيلتنا المميزة",
        about_us: "من نحن",
        about_desc: "نقدم لك أرقى الملابس العصرية بأعلى جودة وأفضل التصاميم التي تناسب ذوقك الرفيع.",
        whatsapp_contact: "تواصل عبر واتساب",
        product_name: "اسم المنتج",
        limited_stock: "العدد محدود – إلحق قبل ما يخلص",
        available_color: "اللون المتوفر:",
        select_size: "المقاس المناسب:",
        complete_order_title: "تنشيط الطلب 📦",
        complete_order_desc: "برجاء إدخال بياناتك لإتمام الطلب",
        full_name: "الاسم بالكامل",
        name_placeholder: "مثال: أحمد محمد",
        mobile_number: "رقم الموبايل",
        backup_mobile_number: "رقم الموبايل الاحتياطي (اختياري)",
        governorate: "المحافظة",
        select_city: "اختر المحافظة...",
        detailed_address: "العنوان بالتفصيل",
        address_placeholder: "المركز، الشارع، علامة مميزة...",
        payment_method: "طريقة الدفع",
        cod: "الدفع عند الاستلام",
        cod_desc: "ادفع بكل راحة عند استلام طلبك 💰",
        shipping_cost: "مصاريف الشحن:",
        order_total: "إجمالي الطلب:",
        confirm_order: "تأكيد الطلب الآن ✨",
        order_success_title: "تم استلام طلبك بنجاح!",
        order_success_desc: "شكراً لثقتك بـ آي كلوث. سيتم التواصل معك قريباً لتأكيد الطلب.",
        okay: "حسناً",
        track_orders: "تتبع طلباتك",
        track_orders_desc: "سجل دخول بحساب جوجل لمتابعة حالة طلباتك",
        my_orders: "طلباتي",
        currency: " ج.م ",
        cart_empty: "السلة فارغة",
        no_results: "لا توجد نتائج مطابقة",
        loading: "جاري التحميل...",
        all: "الكل",
        price_label: "السعر:",
        standard_color: "",
        unavailable: "غير متوفر حالياً",
        cod_btn: "دفع عند الاستلام (عربون 100ج)",
        wallet_btn: "محفظة إلكترونية",
        instapay_btn: "إنستاباي",
        transfer_shipping: "تأكيد الدفع (دفع العربون فقط)",
        transfer_shipping_desc: "قم بتحويل 100 جنيه عربون جدية لتأكيد طلبك، وسيتم دفع باقي المبلغ (للمنتجات والشحن) عند الاستلام.",
        transfer_full: "تأكيد الدفع (المبلغ الإجمالي)",
        transfer_full_desc: "قم بتحويل إجمالي الطلب لتأكيد طلبك وتجهيزه فوراً.",
        upload_receipt: "صورة إيصال التحويل (إجباري)",
        apply: "تطبيق",
        coupon_placeholder: "كود الخصم",
        invalid_coupon: "كود غير صالح أو منتهي",
        coupon_applied: "تم تطبيق الكود بنجاح!",
        discount: "الخصم:",
        read_more: "عرض المزيد...",
        product_description: "وصف المنتج",
        account_name: "اسم صاحب الحساب:",
        copy_btn: "نسخ",
        menu: "القائمة",
        best_seller: "الأكثر مبيعاً",
        categories: "الأقسام",
        size_chart: "جدول المقاسات",
        maintenance_contact: "اتصال وقت صيانه",
        add_to_basket: "أضف للسلة",
        collection_free: "التجميع من المتجر مجاناً",
        you_may_also_like: "منتجات قد تعجبك",
        wishlist: "المفضلة",
        shipping_policy: "سياسة الشحن",
        returns_policy: "سياسة الاستبدال والارجاع"
    }
};

const fashionTranslations = {
    'bag': 'حقيبة', 'bags': 'حقائب', 'blouse': 'بلوزة', 'dress': 'فستان', 'dresses': 'فساتين',
    'shirt': 'قميص', 'shirts': 'قمصان', 't-shirt': 'تيشيرت', 't-shirts': 'تيشيرتات',
    'skirt': 'جيبة', 'skirts': 'جيبات', 'suit': 'بدلة', 'suits': 'بدل', 'mini dress': 'فستان قصير',
    'vest': 'فيست', 'vist': 'فيست', 'top flat': 'توب فلات', 'hoodie': 'هوديي', 'hoodies': 'هوديز',
    'trousers': 'بنطلون', 'pants': 'بنطلون', 'jeans': 'جينز', 'jacket': 'جاكيت', 'jackets': 'جاكيتات',
    'coat': 'بالطو', 'shorts': 'شورت', 'acc': 'إكسسوارات', 'accessories': 'إكسسوارات'
};

// Color System is now handled by ColorSystem class in colors_system.js

const toSlug = (text) => {
    if (!text) return "";
    return text.toString().toLowerCase().trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\u0621-\u064A-]+/g, '')
        .replace(/--+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
};

// 🏁 Modern Hybrid Translation System (AI + Dictionary Helper)
function translateText(text) {
    if (!text) return "";
    const cleanText = text.trim();
    const cleanKey = cleanText.toLowerCase().replace(/\s+/g, '_');
    
    // 1. Check Dictionary Helper (Static UI terms)
    if (translations[currentLang]) {
        if (translations[currentLang][cleanKey]) return translations[currentLang][cleanKey];
        if (translations[currentLang][cleanText.toLowerCase()]) return translations[currentLang][cleanText.toLowerCase()];
    }

    // 2. Handle Color Translations (via ColorSystem)
    const colorTranslation = typeof ColorSystem !== 'undefined' ? ColorSystem.translate(cleanText, currentLang) : null;
    if (colorTranslation && colorTranslation !== cleanText) return colorTranslation;
    
    // 3. Fashion Dictionary (Product types)
    if (currentLang === 'ar' && fashionTranslations[cleanText.toLowerCase()]) {
        return fashionTranslations[cleanText.toLowerCase()];
    }

    // 4. Return original if English requested
    if (currentLang === 'en') return cleanText;

    // 5. AI Translation (For dynamic content like product names/descriptions)
    if (aiTranslationCache[cleanText]) return aiTranslationCache[cleanText];

    // Trigger background AI translation if not in cache
    getSmartTranslation(cleanText);

    return cleanText; // Return original while waiting for AI
}

// 🤖 Background AI Translation with Caching
async function getSmartTranslation(text) {
    if (!text || currentLang === 'en') return text;
    const cleanText = text.trim();

    // Prevent multiple calls for same text
    if (activeAITranslations.has(cleanText)) return cleanText;
    activeAITranslations.add(cleanText);

    try {
        const response = await fetch('/api/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: cleanText, targetLang: 'ar' })
        });
        
        // Safety check: Ensure the response is actually JSON
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new Error("Invalid response from translation API (Server might not be configured for Node.js)");
        }

        const data = await response.json();
        
        if (data.translated && data.translated !== cleanText) {
            aiTranslationCache[cleanText] = data.translated;
            localStorage.setItem('icloth_ai_cache', JSON.stringify(aiTranslationCache));
            
            // ⚡ Instant DOM Update (Self-healing UI)
            document.querySelectorAll(`[data-translate-cache="${cleanText}"]`).forEach(el => {
                el.innerText = data.translated;
                el.style.opacity = '0';
                setTimeout(() => el.style.opacity = '1', 10);
            });
        }
        return data.translated || cleanText;
    } catch (e) {
        // Silenced: Server API not configured for local development
        if (!window._apiWarned) {
            console.debug("AI Translation API not available (Serverless fallback active).");
            window._apiWarned = true;
        }
        return cleanText;
    } finally {
        activeAITranslations.delete(cleanText);
    }
}

let currentLang = localStorage.getItem('icloth_lang') || 'en';

// Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyByPZP1qo0sQN26xTwzpT0vnw_BTguXvSI",
    authDomain: "ic12-e6ad7.firebaseapp.com",
    projectId: "ic12-e6ad7",
    storageBucket: "ic12-e6ad7.firebasestorage.app",
    messagingSenderId: "849964207533",
    appId: "1:849964207533:web:8a6669e5c453ca08ba2524",
    measurementId: "G-H7S7W0CB7Q"
};

// Delay Firebase Initialization to improve TBT and LCP
function initFirebase() {
    if (typeof firebase === 'undefined') return;
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
        console.log("🔥 Firebase initialized (Lazy Load)!");
    }
    db = firebase.firestore();
    
    // Auth Listener
    firebase.auth().onAuthStateChanged(user => {
        currentUser = user;
        updateAuthUI();
        if (user) {
            console.log("👤 User Logged In:", user.email);
            
            // --- Auto-refresh My Orders Modal if open ---
            const ordersModal = document.getElementById('my-orders-modal');
            if (ordersModal && ordersModal.classList.contains('active')) {
                openMyOrdersModal(); // This will handle the section transition
            }

            if (sessionStorage.getItem('pendingCheckout') === 'true') {
                sessionStorage.removeItem('pendingCheckout');
                setTimeout(() => {
                    if (cart.length > 0) {
                        closeCartSidebar();
                        document.getElementById('checkout-modal').classList.add('active');
                        updateCheckoutTotal();
                    }
                }, 500);
            }
        }
    });

    // Start fetching data only after Firebase is ready
    loadDynamicCategories();
    attachRealTimeListeners();
}

// 🚀 Trigger Firebase after everything else is rendered
window.addEventListener('load', () => {
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
            initFirebase();
            // NOTE: handleUrlParams is now called automatically after products load
            // from attachRealTimeListeners (window._urlParamsHandled flag)
        }, { timeout: 2000 });
    } else {
        setTimeout(initFirebase, 1000);
    }
});

let currentUser = null;
let db = null;
// 🖼️ Cloudinary Intelligent Image Optimizer
function getOptimizedImg(url, width = 600) {
    if (!url || !url.includes('cloudinary.com')) return url;
    // Replace standard upload with optimized params
    return url.replace('/upload/', `/upload/c_limit,w_${width},q_auto,f_auto/`);
}

function applyCMS(data) {
    if (!data) return;
    window.lastCMSData = data; // Cache for language toggle
    
    // 0. Update Announcement Bar
    const announcementTxt = document.getElementById('announcement-text-display');
    if (announcementTxt) {
        let msg = data.promoText || data.announcement || '';
        if (currentLang === 'ar' && (data.promoText_ar || data.announcement_ar)) {
            msg = data.promoText_ar || data.announcement_ar;
        } else {
            msg = translateText(msg);
        }
        announcementTxt.innerText = msg;
        announcementTxt.setAttribute('data-i18n-cache', data.promoText || data.announcement || '');
    }

    // 1. Update Logo Images & Favicon
    if (data.logoUrl) {
        const logo = document.getElementById('main-logo-img');
        if (logo) logo.src = data.logoUrl;
        document.querySelectorAll('.logo-img, .navbar-brand img, .footer-logo img').forEach(img => {
            img.src = data.logoUrl;
        });
        const favicon = document.querySelector('link[rel="icon"]');
        if (favicon) favicon.href = data.logoUrl;
    }

    // 2. Handle Hero Banners (Slider)
    let banners = data.banners || [];
    if (banners.length === 0 && (data.bannerUrl || data.bannerTitle)) {
        // Fallback/Migration for old single-banner data
        banners.push({
            desktopUrl: data.bannerUrl || '',
            mobileUrl: data.bannerUrl || '',
            title: data.bannerTitle || 'iCloth FASHION',
            subtitle: data.promoText || ''
        });
    }

    if (banners.length > 0) {
        initHeroSlider(banners);
    }

    // 3. Update Preloader Text (Use first banner title)
    if (banners.length > 0 && banners[0].title) {
        const loaderH1 = document.querySelector('#loader h1');
        if (loaderH1) loaderH1.innerHTML = formatBrandTitle(banners[0].title);
    }

    // 4. Update Footer Text
    if (data.footerText) {
        const footerTextEl = document.getElementById('footer-text-content');
        if (footerTextEl) footerTextEl.innerText = data.footerText;
    }
    
    // 5. Update About Text
    if (data.aboutText) {
        const about = document.getElementById('about-content');
        if (about) about.innerText = data.aboutText;
    }
}

// Global state for hero slider
let heroSliderInterval = null;
let currentSlideIdx = 0;
let cmsBannersCache = [];

function initHeroSlider(banners) {
    const slider = document.getElementById('hero-slider');
    const heroTitle = document.getElementById('hero-title');
    const heroSubtitle = document.getElementById('hero-subtitle');
    
    if (!slider) return;
    cmsBannersCache = banners;
    
    if (heroSliderInterval) clearInterval(heroSliderInterval);
    slider.innerHTML = '';
    currentSlideIdx = 0;

    const isMobile = window.innerWidth <= 768;

    banners.forEach((b, i) => {
        const slide = document.createElement('div');
        slide.className = `hero-slide ${i === 0 ? 'active' : ''}`;
        const imgUrl = isMobile ? (b.mobileUrl || b.desktopUrl) : b.desktopUrl;
        
        // Use optimized Cloudinary URL for hero + High Priority
        const optimizedUrl = getOptimizedImg(imgUrl, isMobile ? 800 : 1600);
        const bannerAlt = b.title ? `${b.title} - iCloth Fashion` : "iCloth Fashion Streetwear Banner";
        const priority = i === 0 ? 'fetchpriority="high" loading="eager"' : 'loading="lazy"';
        slide.innerHTML = `<img src="${optimizedUrl}" ${priority} alt="${bannerAlt}" style="width:100%; height:100%; object-fit:cover; position:absolute; top:0; left:0; z-index:0;">`;
        
        slider.appendChild(slide);
    });

    // Initial text
    if (banners[0]) {
        if (heroTitle && banners[0].title) heroTitle.innerHTML = formatBrandTitle(banners[0].title);
        if (heroSubtitle && banners[0].subtitle) heroSubtitle.innerText = banners[0].subtitle;
    }

    if (banners.length <= 1) return;

    heroSliderInterval = setInterval(() => {
        const slides = slider.querySelectorAll('.hero-slide');
        if (slides.length === 0) return;

        slides[currentSlideIdx].classList.remove('active');
        currentSlideIdx = (currentSlideIdx + 1) % banners.length;
        slides[currentSlideIdx].classList.add('active');
        
        const currentB = banners[currentSlideIdx];
        if (heroTitle && currentB.title) {
            heroTitle.style.opacity = '0';
            setTimeout(() => {
                heroTitle.innerHTML = formatBrandTitle(currentB.title);
                heroTitle.style.opacity = '1';
            }, 500);
        }
        if (heroSubtitle && currentB.subtitle) {
            heroSubtitle.style.opacity = '0';
            setTimeout(() => {
                heroSubtitle.innerText = currentB.subtitle;
                heroSubtitle.style.opacity = '1';
            }, 500);
        }
    }, 5000);
}

function formatBrandTitle(titleText) {
    if (!titleText) return "";
    let t = titleText.trim();
    if (/fashion/i.test(t)) {
        return t.replace(/\s*(fashion)/i, '<br><span>$1</span>');
    }
    const words = t.split(/\s+/);
    if (words.length > 1 && !t.includes('<br>')) {
        const last = words.pop();
        return words.join(' ') + '<br><span>' + last + '</span>';
    }
    return t.replace(/\n/g, '<br>');
}

// Re-init slider img on resize (e.g. rotating phone)
window.addEventListener('resize', () => {
    if (cmsBannersCache.length > 0) {
        const slider = document.getElementById('hero-slider');
        if (!slider) return;
        const isMobile = window.innerWidth <= 768;
        const slides = slider.querySelectorAll('.hero-slide');
        cmsBannersCache.forEach((b, i) => {
            if (slides[i]) {
                const imgUrl = isMobile ? (b.mobileUrl || b.desktopUrl) : b.desktopUrl;
                slides[i].style.backgroundImage = `url('${imgUrl}')`;
            }
        });
    }
});


// Separate rendering from logic for reuse
function renderAuthUI(name) {
    const txt = document.getElementById('auth-text');
    const cartLoggedOut = document.getElementById('cart-auth-logged-out');
    const cartLoggedIn = document.getElementById('cart-auth-logged-in');
    const cartUserName = document.getElementById('cart-user-name');

    if (name) {
        if (txt) txt.innerText = name;
        if (cartLoggedOut) cartLoggedOut.style.display = 'none';
        if (cartLoggedIn) {
            cartLoggedIn.style.display = 'flex';
            if (cartUserName) cartUserName.innerText = (currentLang === 'ar' ? `أهلاً، ` : `Hello, `) + name;
        }
    } else {
        if (txt) txt.innerText = translations[currentLang].login;
        if (cartLoggedOut) cartLoggedOut.style.display = 'block';
        if (cartLoggedIn) cartLoggedIn.style.display = 'none';
    }
}

// Language Logic
function initLanguage() {
    updateLanguageUI();
    // Synchronize Google Translate after a short delay to ensure widget is ready
    setTimeout(() => {
        setGoogleTranslate(currentLang);
    }, 2000);
}

function setGoogleTranslate(lang) {
    const el = document.querySelector('.goog-te-combo');
    if (el) {
        el.value = lang;
        el.dispatchEvent(new Event('change'));
    }
}

function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'ar' : 'en';
    localStorage.setItem('icloth_lang', currentLang);
    
    // Update Static UI
    updateLanguageUI();
    
    // Force reload for perfect synchronization across all components
    location.reload(); 
}

function updateLanguageUI() {
    const lang = currentLang;
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    
    // 1. Update Elements with [data-i18n] using Helper Dictionary
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            el.innerHTML = translations[lang][key];
        }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (translations[lang] && translations[lang][key]) {
            el.placeholder = translations[lang][key];
        }
    });

    // 2. Update Toggle Button
    const langBtn = document.getElementById('lang-toggle');
    if (langBtn) {
        langBtn.innerText = lang === 'en' ? 'AR' : 'EN';
    }

    // 3. Trigger Google Translate Widget for the whole page
    setGoogleTranslate(lang);

    // 4. Force Re-render Products to pick up AI/Firestore translations
    if (remoteProducts.length > 0) {
        filterAndRender('men', activeCategory, 'all');
    }

    // 5. Update Categories/Filters if they are dynamic
    if (window.renderDynamicFilters) window.renderDynamicFilters();
    if (window.renderSidebarCategories) window.renderSidebarCategories();

    // 6. Refresh Modal if it's currently open to translate the open product
    const sizeModal = document.getElementById('size-modal');
    if (sizeModal && sizeModal.classList.contains('active') && selectedProductForSize) {
        window.openSizeModal(selectedProductForSize.id);
    }

    // 7. Refresh CMS elements (Hero, Banners, etc.)
    if (window.lastCMSData) applyCMS(window.lastCMSData);

    if (window.populateGovernorates) window.populateGovernorates();
}
// Theme Logic
function initTheme() {
    const saved = localStorage.getItem('icloth_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
    updateThemeIcon(saved);
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const target = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', target);
    localStorage.setItem('icloth_theme', target);
    updateThemeIcon(target);

    // Refresh Hero Background if it was set via JS
    const hero = document.querySelector('.hero');
    if (hero && hero.style.backgroundImage) {
        const bg = hero.style.backgroundImage;
        if (bg.includes('url(')) {
            const urlMatch = bg.match(/url\(['"]?([^'"]+)['"]?\)/);
            if (urlMatch) {
                const url = urlMatch[1];
                const overlay = target === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.3)';
                hero.style.backgroundImage = `linear-gradient(${overlay}, ${overlay}), url('${url}')`;
            }
        }
    }
}

function updateThemeIcon(theme) {
    if (!themeToggle) return;
    const icon = themeToggle.querySelector('i');
    if (theme === 'dark') {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
}

// DOM Elements
let menContainer, cartBtn, closeCartBtn, cartSidebar, cartOverlay, loader, navbar, sizeModal, closeModal, modalProductName, modalProductPrice, colorContainer, mobileMenuBtn, navLinks, themeToggle, subFiltersContainer;

const hideLoader = () => {
    const loaderEl = document.getElementById('loader');
    if (loaderEl && !loaderEl.classList.contains('fade-out')) {
        loaderEl.classList.add('fade-out');
        setTimeout(() => {
            loaderEl.style.display = 'none';
        }, 1000);
    }
};

const initAll = () => {
    if (window.initialized) return;
    window.initialized = true;

    try {
        initElements();
        initTheme();
        initLanguage();
        setupEventListeners();
        updateCartUI();
        
        // NOTE: loadDynamicCategories and attachRealTimeListeners 
        // are now called inside initFirebase to ensure TBT safety.
        
        // Audit will be triggered after products load in attachRealTimeListeners for accuracy
    } catch (error) {
        console.error("Initialization error:", error);
    }
    // Note: hideLoader is now called when first products arrive
};

// --- 🕵️ ADVANCED SYSTEM DIAGNOSTICS ---
window.runFullWebsiteAudit = () => {
    console.clear();
    console.log("%c🚀 ICLOTH SYSTEM DIAGNOSTICS v4.3", "color: #e20613; font-size: 20px; font-weight: bold;");
    console.log("%cChecking system integrity...", "color: #888;");

    const auditData = {
        "🔥 Firebase Status": db ? "✅ Connected to Cloud" : "❌ DISCONNECTED",
        "📂 Products Loaded": `${remoteProducts.length} items`,
        "📂 Categories Loaded": `${dynamicCategories.length} categories`,
        "🔧 Maintenance Mode": (settingsCache.maintenanceMode) ? "🚧 ENABLED (Site Blocked)" : "✅ LIVE (Site Open)",
        "👤 Current User": currentUser ? currentUser.email : "⚪ Guest/Anon",
        "🛒 Cart Items": cart.length
    };
    console.table(auditData);

    const checkUI = (id, label) => {
        const el = document.getElementById(id) || document.querySelector(`.${id}`);
        return el ? "✅ ACTIVE" : "❌ MISSING/FAIL";
    };

    console.log("%c🔌 Interface & Button Verification:", "font-weight: bold; color: #2196F3;");
    const uiAudit = {
        "Cart Button": checkUI('cart-btn', "Cart"),
        "Orders Button": checkUI('my-orders-btn', "Orders"),
        "Google Login": checkUI('google-login-btn', "Login"),
        "Product Grid": (document.getElementById('men-products') || document.getElementById('products-list')) ? "✅ ACTIVE" : "❌ MISSING/FAIL",
        "Checkout Modal": checkUI('checkout-modal', "Checkout"),
        "Success Modal": checkUI('success-modal', "Success")
    };
    console.table(uiAudit);

    const functionsAudit = {
        "Cart Control": typeof window.openCartSidebar === 'function' ? "✅ READY" : "❌ FAIL",
        "Order System": typeof window.openMyOrdersModal === 'function' ? "✅ READY" : "❌ FAIL",
        "Auth System": typeof window.signInWithGoogle === 'function' ? "✅ READY" : "❌ FAIL",
        "Global Quantities": typeof window.updateCartQuantity === 'function' ? "✅ READY" : "❌ FAIL"
    };
    console.log("%c🧠 Backend Functions Health:", "font-weight: bold; color: #4CAF50;");
    console.table(functionsAudit);

    console.log("%c✨ Audit Complete! Site is fully synchronized with Dashboard.", "color: #e20613; font-weight: bold;");
};

let settingsCache = {}; // Added to store site settings for audit

function attachRealTimeListeners() {
    if (!db) {
        console.warn("⚠️ Firebase db not ready, retrying in 1s...");
        setTimeout(attachRealTimeListeners, 1000);
        return;
    }

    // Real-time Products
    db.collection('products').onSnapshot(snapshot => {
        remoteProducts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log(`🔥 [Real-time] loaded ${remoteProducts.length} products`);
        
        // --- ADVANCED AUDIT LOG ---
        console.log("🕵️ [Product Audit Log]");
        const audit = remoteProducts.map(p => ({
            name: p.name,
            status: p.status,
            active: p.active,
            category: p.category,
            parent: p.parentCategory || 'NONE',
            visibility: (p.status === 'hidden' || p.active === false || p.active === "false") ? '❌ HIDDEN' : '✅ VISIBLE'
        }));
        console.table(audit);
        
        filterAndRender('men', activeCategory, 'all');
        
        // 🚀 Refresh sidebar and hide loader
        renderSidebarCategories();
        if (remoteProducts.length > 0 || snapshot.empty) {
            hideLoader();
        }
        
        // 🔗 Handle URL params once after first product load
        if (!window._urlParamsHandled && remoteProducts.length > 0) {
            window._urlParamsHandled = true;
            if (window.handleUrlParams) window.handleUrlParams();
            
            // 🚀 Run Audit now that we have data
            if (typeof window.runFullWebsiteAudit === 'function') {
                setTimeout(window.runFullWebsiteAudit, 1000);
            }
        }
    }, err => {
        console.error("❌ Firebase Products Error:", err);
    });

    // Real-time Categories
    db.collection('categories').onSnapshot(snapshot => {
        dynamicCategories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderDynamicFilters();
    });

    // Real-time CMS
    db.collection('settings').doc('cms').onSnapshot(doc => {
        if (doc.exists) applyCMS(doc.data());
    });

    // Real-time General Settings
    db.collection('settings').doc('site').onSnapshot(doc => {
        if (doc.exists) {
            const s = doc.data();
            settingsCache = s; // Update cache for audit
            console.log("⚙️ Site settings updated:", s);
            const isMainSite = !document.getElementById('admin-panel-portal') && !window.location.pathname.includes('maintenance.html');
            
            // 🛡️ Fail-safe: Only redirect if maintenanceMode is explicitly TRUE (or "true" string)
            const inMaintenance = (s.maintenanceMode === true || s.maintenanceMode === "true");
            
            if (inMaintenance && isMainSite) {
                console.log("🚧 Maintenance Mode Active - Redirecting...");
                window.location.href = 'maintenance.html';
            }
            
            // --- UPDATE WHATSAPP CONTACT ---
            const waFloat = document.querySelector('.whatsapp-float');
            const waFooter = document.querySelector('.footer-whatsapp-btn'); // زر الـ footer
            const num = s.whatsapp || '201224553486';
            const defaultMsg = encodeURIComponent('Hello, I would like to inquire about a product on icloth');
            
            if (waFloat) waFloat.href = `https://wa.me/${num}?text=${defaultMsg}`;
            if (waFooter) waFooter.href = `https://wa.me/${num}?text=${defaultMsg}`;
            
            // Store numbers for checkout
            window._transferNumbers = {
                wallet: s.transferWallet || s.transferVodafone || '',
                walletName: s.transferWalletName || s.transferVodafoneName || '',
                instapay: s.transferInstapay || '',
                instapayName: s.transferInstapayName || '',
                instapayLink: s.transferInstapayLink || '',
                cod: s.transferWallet || s.transferVodafone || s.transferOrange || s.transferInstapay || '',
                codName: s.transferWalletName || s.transferVodafoneName || s.transferOrangeName || s.transferInstapayName || ''
            };
            // Update the displayed number based on currently selected payment
            const currentMethod = document.getElementById('selected-payment')?.value || 'cod';
            updateTransferNumberDisplay(currentMethod);
        }
    }, err => {
        console.warn("⚠️ Settings listener failed:", err);
    });

    // Real-time Shipping Rates
    db.collection('settings').doc('shipping').onSnapshot(doc => {
        if (doc.exists) {
            shippingRates = doc.data().rates || {};
            console.log("🚚 Shipping rates updated");
        }
    });

    // Real-time Announcement Bar (Optimized Translation & Fallback)
    db.collection('settings').doc('announcement').onSnapshot(doc => {
        const bar = document.getElementById('announcement-bar');
        const txt = document.getElementById('announcement-text-display');
        if (doc.exists && bar && txt) {
            const data = doc.data();
            
            // 1. Get primary message based on language
            let msg = (currentLang === 'ar' ? data.textAr : data.textEn);
            
            // 2. Fallback to any available content if primary is empty
            if (!msg) {
                msg = data.text || data.textAr || data.textEn || '';
                // 3. If we are in EN and only have Arabic, try auto-translating it
                if (currentLang === 'en' && msg && /[أ-ي]/.test(msg)) {
                    msg = translateText(msg);
                }
            }
            
            if (data.enabled && msg) {
                txt.innerText = msg;
                bar.classList.add('active');
                document.body.classList.add('announcement-active');
            } else {
                bar.classList.remove('active');
                document.body.classList.remove('announcement-active');
            }
        }
    });

    window.closeAnnouncement = () => {
        const bar = document.getElementById('announcement-bar');
        if (bar) bar.classList.remove('active');
        document.body.classList.remove('announcement-active');
    };
}

function initElements() {
    // Support both 'men-products' and 'products-list' IDs for backward compatibility
    menContainer = document.getElementById('men-products') || document.getElementById('products-list');
    cartBtn = document.getElementById('cart-btn');
    closeCartBtn = document.getElementById('close-cart');
    cartSidebar = document.getElementById('cart-sidebar');
    cartOverlay = document.getElementById('cart-overlay');
    loader = document.getElementById('loader');
    navbar = document.querySelector('.navbar');
    sizeModal = document.getElementById('size-modal');
    closeModal = document.getElementById('close-modal');
    modalProductName = document.getElementById('modal-product-name');
    modalProductPrice = document.getElementById('modal-product-price');
    colorContainer = document.getElementById('modal-color-options');
    mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    navLinks = document.querySelector('.nav-links');
    themeToggle = document.getElementById('theme-toggle');
    subFiltersContainer = document.getElementById('sub-filters-container');
    window.populateGovernorates();
    
    // 🔗 PopState listener: Handle browser back/forward navigation
    window.addEventListener('popstate', (e) => {
        const path = decodeURIComponent(window.location.pathname);
        const params = new URLSearchParams(window.location.search);
        
        // If navigating back and modal is open, close it
        if (sizeModal && sizeModal.classList.contains('active')) {
            sizeModal.classList.remove('active');
            selectedProductForSize = null;
            if (window._modalCarouselInterval) clearInterval(window._modalCarouselInterval);
        }
        
        // Handle product URL
        const productSlug = path.includes('/product/') ? path.split('/product/')[1] : params.get('product');
        const catSlug = path.includes('/category/') ? path.split('/category/')[1] : params.get('cat');
        
        if (productSlug && remoteProducts.length > 0) {
            let targetId = productSlug;
            if (productSlug.includes('--')) {
                const parts = productSlug.split('--');
                targetId = parts[parts.length - 1];
            }
            const found = remoteProducts.find(x => x.id === targetId || toSlug(x.name) === toSlug(productSlug));
            if (found) window.openSizeModal(found.id);
        } else if (catSlug) {
            const filterBtns = document.querySelectorAll('.main-filter-btn');
            filterBtns.forEach(btn => {
                if (toSlug(btn.innerText.trim()) === toSlug(catSlug)) btn.click();
            });
        }
    });
}

window.populateGovernorates = function () {
    const govSelect = document.getElementById('customer-gov');
    const govs = governorates_data[currentLang];
    if (govSelect) {
        govSelect.innerHTML = `<option value="" disabled selected>${translations[currentLang].select_city}</option>` +
            govs.sort().map(g => `<option value="${g}" style="background: #111; color: #fff;">${g}</option>`).join('');
    }
}

window.updateCheckoutTotal = () => {
    const itemsTotal = cart.reduce((s, i) => s + (i.price * i.quantity), 0);
    const govSelected = document.getElementById('customer-gov').value;
    
    // Match the selected governorate to its Arabic form for lookup
    let govArabicKey = govSelected;
    const govIndex = governorates_data[currentLang].indexOf(govSelected);
    if (govIndex !== -1) {
        govArabicKey = governorates_data.ar[govIndex];
    }

    const shipCost = Number(shippingRates[govArabicKey]) || 0;
    
    let discountAmount = 0;
    if (appliedCoupon) {
        discountAmount = Math.round(itemsTotal * (appliedCoupon.discount / 100));
    }
    const finalTotal = itemsTotal - discountAmount + shipCost;

    const shipEl = document.getElementById('checkout-shipping-cost');
    if (shipEl) {
        if (shipCost === 0) {
            shipEl.innerText = currentLang === 'ar' ? "مجاناً" : "Free";
            shipEl.style.color = "#4CAF50";
            shipEl.style.fontWeight = "bold";
        } else {
            shipEl.innerText = `${shipCost} ${translations[currentLang].currency}`;
            shipEl.style.color = "";
            shipEl.style.fontWeight = "normal";
        }
    }
    
    const totalEl = document.getElementById('form-total-price');
    if (totalEl) totalEl.innerText = `${finalTotal} ${translations[currentLang].currency}`;

    // Display discount in checkout if any
    const discountRow = document.getElementById('checkout-discount-row');
    const discountAmtEl = document.getElementById('checkout-discount-amount');
    if (discountRow && discountAmtEl) {
        if (discountAmount > 0) {
            discountAmtEl.innerText = `-${discountAmount} ${translations[currentLang].currency}`;
            discountRow.style.display = 'flex';
        } else {
            discountRow.style.display = 'none';
        }
    }
};

let shippingRates = {};

let dynamicCategories = [];

async function loadDynamicCategories() {
    if (db) {
        const snapshot = await db.collection('categories').get();
        dynamicCategories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderDynamicFilters();
    }
}

function renderDynamicFilters() {
    const container = document.getElementById('main-filters-container');
    if (!container) return;
    
    const mainCats = dynamicCategories.filter(c => !c.parentId);
    container.innerHTML = `<button class="main-filter-btn active" data-parent="all" onclick="applyMainFilter('all', this)" data-i18n="all">${translations[currentLang].all}</button>` +
        mainCats.map(c => {
            const translatedCat = (currentLang === 'ar' && c.name_ar) ? c.name_ar : translateText(c.name);
            return `<button class="main-filter-btn" data-parent="${c.id}" onclick="applyMainFilter('${c.id}', this)" data-translate-cache="${c.name}">${translatedCat}</button>`;
        }).join('');
    
    renderSidebarCategories();
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

function renderSidebarCategories() {
    const sidebarCats = document.getElementById('sidebar-categories');
    const bestSellerCats = document.getElementById('best-seller-categories');
    if (!sidebarCats || !bestSellerCats) return;

    // 1. Render Hierarchical Categories
    const mainCats = dynamicCategories.filter(c => !c.parentId);
    sidebarCats.innerHTML = mainCats.map(c => renderSidebarBranch(c, true)).join('');

    // 2. Best Seller Categories: Show root categories that contain at least one best seller
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
        // Find top-heavy parent for the header filter sync
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
        // Close other branches at the same level (optional, but cleaner)
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
    
    // 1. Update Main Filter (Top Row)
    const mainBtn = document.querySelector(`.main-filter-btn[data-parent="${parent}"]`);
    if (mainBtn) {
        document.querySelectorAll('.main-filter-btn').forEach(b => b.classList.remove('active'));
        mainBtn.classList.add('active');
    }

    // 2. Clear and Render Sub-filters
    if (subFiltersContainer) subFiltersContainer.innerHTML = '';
    
    if (sub !== 'all') {
        // If it's a deep sub, we need to show the path
        // For simplicity, let's just render the descendants of the top parent
        renderSubFilters(parent, 0);
        
        // Find and click the sub button to trigger its children (if any)
        setTimeout(() => {
            const subBtn = document.querySelector(`.sub-btn[onclick*="'${sub}'"]`);
            if (subBtn) {
                // This will trigger applySubFilter which handles further levels
                subBtn.click();
            }
        }, 150);
    } else {
        renderSubFilters(parent, 0);
    }
    
    filterAndRender('men', sub === 'all' ? parent : sub, 'all');
    document.getElementById('men-products')?.scrollIntoView({ behavior: 'smooth' });
}

const applyBestSellerFilter = (catId) => {
    toggleSidebarMenu();
    filterAndRender('men', catId, 'all', true); // Pass isBestSellerOnly = true
    document.getElementById('men-products')?.scrollIntoView({ behavior: 'smooth' });
}

window.applyMainFilter = (parentId, btn) => {
    document.querySelectorAll('.main-filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeCategory = parentId;
    
    const isLocal = window.location.protocol === 'file:';
    if (!isLocal) {
        const url = new URL(window.location.origin + window.location.pathname);
        if (url.pathname.endsWith('index.html')) {
            url.pathname = url.pathname.replace('index.html', parentId === 'all' ? '' : `category/${toSlug(btn.innerText)}`);
        } else {
            url.pathname = parentId === 'all' ? '/' : `/category/${toSlug(btn.innerText)}`;
        }
        window.history.pushState({}, '', url);
        updateCanonical(url.href);
    } else {
        const url = new URL(window.location);
        if (parentId === 'all') url.searchParams.delete('cat');
        else url.searchParams.set('cat', toSlug(btn.innerText));
        window.history.pushState({}, '', url);
    }
;

    if (subFiltersContainer) {
        subFiltersContainer.innerHTML = '';
        subFiltersContainer.classList.remove('active');
    }
    
    if (parentId !== 'all') {
        renderSubFilters(parentId, 0);
    }
    
    filterAndRender('men', parentId, 'all');
};

window.applySubFilter = (parent, sub, btn, level) => {
    // 1. Mark current row active
    btn.parentElement.querySelectorAll('.sub-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // 2. Filter products
    const filterId = (sub === 'all') ? parent : sub;
    filterAndRender('men', filterId, 'all');

    // 3. Handle further levels
    if (subFiltersContainer) {
        // Clear rows below this one
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

window.copyToClipboard = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
        showToast(currentLang === 'ar' ? '✅ تم النسخ!' : '✅ Copied!');
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
};

window.selectPayment = (method, btn) => {
    document.querySelectorAll('.btn-payment').forEach(b => {
        if (!b.classList.contains('btn-shipping-sub')) b.classList.remove('active');
    });
    btn.classList.add('active');
    document.getElementById('selected-payment').value = method;
    
    const title = document.querySelector('#payment-instructions strong');
    const desc = document.getElementById('transfer-desc');
    const shipOptions = document.getElementById('shipping-options-container');
    
    if(method === 'cod') {
        title.innerText = translations[currentLang].transfer_shipping;
        desc.innerText = translations[currentLang].transfer_shipping_desc;
        if (shipOptions) shipOptions.style.display = 'flex';
        // Reset sub-method to wallet by default
        const firstSub = document.querySelector('.btn-shipping-sub');
        if (firstSub) window.selectShippingSubMethod('wallet', firstSub);
    } else {
        title.innerText = translations[currentLang].transfer_full;
        desc.innerText = translations[currentLang].transfer_full_desc;
        if (shipOptions) shipOptions.style.display = 'none';
        updateTransferNumberDisplay(method);
    }
};

window.selectShippingSubMethod = (subMethod, btn) => {
    document.querySelectorAll('.btn-shipping-sub').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    updateTransferNumberDisplay(subMethod);
};

function updateTransferNumberDisplay(method) {
    const el = document.getElementById('checkout-transfer-number');
    const nameEl = document.getElementById('checkout-transfer-name');
    const instapayLinkContainer = document.getElementById('checkout-instapay-link-container');
    const instapayLinkBtn = document.getElementById('checkout-instapay-link');

    if (!el || !nameEl || !instapayLinkContainer || !instapayLinkBtn) return;
    
    const nums = window._transferNumbers || {};
    let num = '';
    let name = '';
    let link = '';
    
    if (method === 'cod') {
        method = document.querySelector('.btn-shipping-sub.active')?.getAttribute('onclick')?.match(/'([^']+)'/)[1] || 'wallet';
    }

    if (method === 'wallet') {
        num = nums.wallet || '';
        name = nums.walletName || '';
    } else if (method === 'instapay') {
        num = nums.instapay || '';
        name = nums.instapayName || '';
        link = nums.instapayLink || '';
    } else {
        num = nums.wallet || nums.instapay || '';
        name = nums.walletName || nums.instapayName || '';
    }
    
    el.innerText = num || 'يرجى التواصل معنا عبر الواتساب';
    
    if (name) {
        nameEl.innerText = `${translations[currentLang].account_name} ${name}`;
        nameEl.style.display = 'block';
    } else {
        nameEl.style.display = 'none';
    }

    if (method === 'instapay' && link) {
        instapayLinkBtn.href = link;
        instapayLinkContainer.style.display = 'block';
    } else {
        instapayLinkContainer.style.display = 'none';
    }
}

function setupEventListeners() {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) navbar?.classList.add('scrolled');
        else navbar?.classList.remove('scrolled');
    });

    if (cartBtn) {
        cartBtn.addEventListener('click', (e) => { 
            e.preventDefault(); 
            console.log("🛒 Opening cart...");
            openCartSidebar(); 
        });
    }
    
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', () => {
            console.log("✖️ Closing cart...");
            closeCartSidebar();
        });
    }
    
    if (cartOverlay) {
        cartOverlay.addEventListener('click', () => {
            closeCartSidebar();
        });
    }

    if (mobileMenuBtn) {
        mobileMenuBtn.onclick = (e) => {
            e.stopPropagation();
            window.toggleSidebarMenu();
        };
    }

    if (themeToggle) themeToggle.onclick = (e) => { e.preventDefault(); toggleTheme(); };
    window.closeSizeModal = () => {
    sizeModal.classList.remove('active');
    selectedProductForSize = null;
    if (window._modalCarouselInterval) clearInterval(window._modalCarouselInterval);
    
    // Remove product from URL when modal closes - preserve category if active
    const isLocal = window.location.protocol === 'file:';
    if (!isLocal) {
        const activeBtn = document.querySelector('.main-filter-btn.active');
        const activeCat = activeBtn && activeBtn.dataset.parent !== 'all' ? activeBtn.innerText.trim() : null;
        let targetUrl;
        if (activeCat) {
            targetUrl = new URL(window.location.origin + `/category/${toSlug(activeCat)}`);
        } else {
            targetUrl = new URL(window.location.origin + '/');
        }
        window.history.pushState({}, '', targetUrl);
        updateCanonical(targetUrl.href);
    } else {
        const url = new URL(window.location);
        url.searchParams.delete('product');
        window.history.pushState({}, '', url);
    }
};
    if (closeModal) closeModal.onclick = () => {
        window.closeSizeModal();
    };

    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.onclick = () => {
            if (cart.length === 0) return alert(translations[currentLang].cart_empty);
            
            // 🔓 (Removed mandatory login) - Allows guest orders
            /*
            if (!currentUser) {
                sessionStorage.setItem('pendingCheckout', 'true');
                alert(currentLang === 'ar' ? "برجاء تسجيل الدخول أولاً لإتمام طلبك ✨" : "Please login first to complete your order ✨");
                signInWithGoogle();
                return;
            }
            */
            
            closeCartSidebar();
            document.getElementById('checkout-modal').classList.add('active');
            updateCheckoutTotal();

            // 🚀 Force select COD as default and show sub-options immediately
            const codBtn = document.querySelector('.btn-payment[onclick*="\'cod\'"]');
            if (codBtn) {
                window.selectPayment('cod', codBtn);
            }
        };
    }

    const closeCheckout = document.getElementById('close-checkout');
    if (closeCheckout) closeCheckout.onclick = () => document.getElementById('checkout-modal').classList.remove('active');

    window.spawnStars = (btn) => {
        const positions = [
            { x: '10%', y: '10%', tx: '-60px', ty: '-30px' },
            { x: '80%', y: '20%', tx: '50px', ty: '-40px' },
            { x: '30%', y: '50%', tx: '-30px', ty: '30px' },
            { x: '70%', y: '60%', tx: '40px', ty: '20px' },
            { x: '50%', y: '10%', tx: '10px', ty: '-50px' }
        ];
        positions.forEach(p => {
            const s = document.createElement('div');
            s.className = 'star';
            s.style.left = p.x;
            s.style.top = p.y;
            s.style.setProperty('--tx', p.tx);
            s.style.setProperty('--ty', p.ty);
            btn.appendChild(s);
            setTimeout(() => s.remove(), 800);
        });
    };

    const orderForm = document.getElementById('order-form');
    if (orderForm) {
        orderForm.onsubmit = async (e) => {
            e.preventDefault();
            const submitBtn = document.getElementById('order-submit-btn');
            if (submitBtn.dataset.running === 'true') return;
            submitBtn.dataset.running = 'true';
            submitBtn.style.cursor = 'default';
            submitBtn.disabled = true;

            const label = document.getElementById('btn-label');
            const scene = document.getElementById('btn-scene');
            const truck = document.getElementById('btn-truck');
            const successOverlay = document.getElementById('btn-success');
            
            const resetAnim = () => {
                if(scene) scene.style.display = 'none';
                if(truck) {
                    truck.style.transition = 'none';
                    truck.style.left = '-280px';
                    setTimeout(() => { truck.style.transition = 'left 3.2s cubic-bezier(0.25, 0.1, 0.25, 1)'; }, 50);
                }
                if(successOverlay) successOverlay.style.transform = 'translateY(100%)';
                if(label) { label.style.opacity = '1'; label.style.pointerEvents = 'auto'; }
                submitBtn.style.cursor = 'pointer';
                submitBtn.disabled = false;
                submitBtn.dataset.running = 'false';
            };

            const animStartTime = Date.now();
            if(label) { label.style.opacity = '0'; label.style.pointerEvents = 'none'; }
            if(scene) scene.style.display = 'block';
            setTimeout(() => { if(truck) truck.style.left = '110%'; }, 120);

            try {
                const paymentMethod = document.getElementById('selected-payment').value;
                // Determine if a transfer receipt is needed:
                // Receipt is required for wallet/instapay (full transfer) 
                // Receipt is optional for pure COD (cash on delivery with no sub-method transfer)
                // BUT for COD with deposit (sub-method = wallet/instapay), receipt IS required
                const activeSubBtn = document.querySelector('.btn-shipping-sub.active');
                const codSubMethod = activeSubBtn ? (activeSubBtn.getAttribute('onclick')?.match(/'([^']+)'/)?.[1] || '') : '';
                const needsReceipt = (paymentMethod === 'wallet' || paymentMethod === 'instapay') ||
                                     (paymentMethod === 'cod' && codSubMethod !== '');

                const receiptFile = document.getElementById('receipt-image').files[0];
                if (needsReceipt && !receiptFile) {
                    alert(currentLang === 'ar' ? 'الرجاء إرفاق صورة إيصال التحويل' : 'Please upload the transfer receipt image');
                    resetAnim();
                    return;
                }

                let receiptUrl = '';
                if (receiptFile) {
                    try {
                        // Compress image before upload and convert to Base64 string directly
                        receiptUrl = await new Promise((resolve, reject) => {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                                const img = new Image();
                                img.onload = () => {
                                    try {
                                        const canvas = document.createElement('canvas');
                                        const ctx = canvas.getContext('2d');
                                        const MAX_WIDTH = 600;
                                        let width = img.width;
                                        let height = img.height;

                                        if (width > MAX_WIDTH) {
                                            height *= MAX_WIDTH / width;
                                            width = MAX_WIDTH;
                                        }

                                        canvas.width = width;
                                        canvas.height = height;
                                        ctx.drawImage(img, 0, 0, width, height);
                                        
                                        const base64Str = canvas.toDataURL('image/jpeg', 0.6);
                                        resolve(base64Str);
                                    } catch (e) {
                                        reject(e);
                                    }
                                };
                                img.onerror = () => reject(new Error("Invalid image"));
                                img.src = event.target.result;
                            };
                            reader.onerror = () => reject(new Error("Failed to read file"));
                            reader.readAsDataURL(receiptFile);
                        });
                    } catch(e) {
                        console.error("Image processing error", e);
                        alert(currentLang === 'ar' ? 'حدث خطأ في معالجة الإيصال: ' + e.message : 'Error processing the receipt: ' + e.message);
                        resetAnim();
                        return;
                    }
                }

                const gov = document.getElementById('customer-gov').value;
                const itemsTotal = cart.reduce((s, i) => s + (i.price * i.quantity), 0);
                
                // Fix: Include shipping cost in the total
                let govArabicKey = gov;
                const govIndex = governorates_data[currentLang].indexOf(gov);
                if (govIndex !== -1) {
                    govArabicKey = governorates_data.ar[govIndex];
                }
                const shipCost = Number(shippingRates && shippingRates[govArabicKey] ? shippingRates[govArabicKey] : 0) || 0;
                let discountAmount = 0;
                if (appliedCoupon) {
                    discountAmount = Math.round(itemsTotal * (appliedCoupon.discount / 100));
                }
                const finalTotal = itemsTotal - discountAmount + shipCost;

                const paymentMethodStr = document.getElementById('selected-payment').value;

                const orderData = {
                    customerName: document.getElementById('customer-name').value,
                    phone: document.getElementById('customer-phone').value,
                    phone2: document.getElementById('customer-phone2').value || null,
                    gov: gov,
                    address: document.getElementById('customer-address').value,
                    items: cart,
                    total: finalTotal,
                    shippingCost: shipCost,
                    discount: discountAmount,
                    couponCode: appliedCoupon ? appliedCoupon.code : null,
                    status: "verifying",
                    paymentMethod: paymentMethodStr,
                    receiptUrl: receiptUrl,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    userEmail: currentUser ? currentUser.email : 'زائر',
                    userId: currentUser ? currentUser.uid : null // 🔑 UserId ضروري للقواعد الأمنية
                };

                // 1. Save to Dashboard (Firebase)
                await db.collection('orders').add(orderData);
                
                // 2. Increment Coupon UsedCount
                if (appliedCoupon) {
                    await db.collection('coupons').doc(appliedCoupon.id).update({
                        usedCount: firebase.firestore.FieldValue.increment(1)
                    });
                }
                
                // 3. Format and Send to Telegram
                let telegramMsg = `🔥 *فيه أوردر جديد على الموقع!*\n\n` +
                            `*الاسم:* ${orderData.customerName}\n` +
                            `*رقم الهاتف:* ${orderData.phone}\n` +
                            `*المحافظة:* ${orderData.gov}\n` +
                            `*العنوان:* ${orderData.address}\n` +
                            `*طريقة الدفع:* ${orderData.paymentMethod}\n` +
                            (orderData.discount > 0 ? `*الخصم:* ${orderData.discount} ج.م\n` : '') +
                            `*إجمالي المبلغ:* ${orderData.total} ج.م\n\n` +
                            `*المنتجات:*\n`;
                
                orderData.items.forEach(i => {
                    telegramMsg += `- ${window.translateText ? window.translateText(i.name) : i.name} (${i.color}, ${i.size}) x${i.quantity}\n`;
                });
                
                if (orderData.receiptUrl) {
                    telegramMsg += `\n✅ *تم إرفاق صورة الإيصال بنجاح*`;
                }
                
                // Send to Telegram silently (supports multiple receivers)
                const chatIds = ['7854847724', '578537442']; // تم إضافة حسابك وحساب الشخص التاني بنجاح!
                
                for (const chatId of chatIds) {
                    try {
                        await fetch('https://api.telegram.org/bot8283267802:AAFWHrtLepYloK5Sg0Fd0NVNqnzwxEosIss/sendMessage', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                chat_id: chatId,
                                text: telegramMsg,
                                parse_mode: 'Markdown'
                            })
                        });
                    } catch (err) {
                        console.error(`Failed to send order to Telegram (ChatID: ${chatId}):`, err);
                    }
                }
                
                // 4. Reset state & Show Success via Animation
                const timeElapsed = Date.now() - animStartTime;
                const timeToWait = Math.max(0, 3200 - timeElapsed);

                setTimeout(() => {
                    if (successOverlay) {
                        successOverlay.style.transform = 'translateY(0)';
                        spawnStars(submitBtn);
                    }
                    setTimeout(() => {
                        resetAnim();
                        appliedCoupon = null;
                        const couponInput = document.getElementById('coupon-code-input');
                        if (couponInput) couponInput.value = '';
                        const couponStatus = document.getElementById('coupon-status-msg');
                        if (couponStatus) couponStatus.style.display = 'none';

                        cart = [];
                        updateCartUI();
                        localStorage.setItem('icloth_cart', JSON.stringify(cart));
                        document.getElementById('checkout-modal').classList.remove('active');
                        document.getElementById('success-modal').classList.add('active');
                        orderForm.reset();
                    }, 2100);
                }, timeToWait);

            } catch (err) {
                console.error("Unhanded checkout error:", err);
                alert(currentLang === 'ar' ? "حدث خطأ أثناء معالجة الطلب! " + err.message : "An error occurred while processing the order! " + err.message);
                resetAnim();
            }
        };
    }

    const myOrdersBtn = document.getElementById('my-orders-btn');
    if (myOrdersBtn) {
        myOrdersBtn.onclick = (e) => {
            e.preventDefault();
            openMyOrdersModal();
        };
    }

    const closeOrders = document.getElementById('close-orders-modal');
    if (closeOrders) closeOrders.onclick = () => document.getElementById('my-orders-modal').classList.remove('active');

    const googleLoginBtn = document.getElementById('google-login-btn');
    if (googleLoginBtn) {
        googleLoginBtn.onclick = (e) => { e.preventDefault(); signInWithGoogle(); };
    }

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.onclick = (e) => { e.preventDefault(); signOutUser(); };
    }
}

function renderAll() {
    // This is now handled by attachRealTimeListeners for real-time updates
    if (remoteProducts.length > 0) {
        filterAndRender('men', activeCategory, 'all');
    }
}


const getAllChildrenIds = (catId) => {
    let ids = [catId];
    const children = dynamicCategories.filter(c => c.parentId === catId);
    children.forEach(child => {
        ids = ids.concat(getAllChildrenIds(child.id));
    });
    return ids;
};

function filterAndRender(section, parent, sub, bestSellerOnly = false) {
    // Auto-recover if menContainer is null (e.g., called before initElements)
    if (!menContainer) {
        menContainer = document.getElementById('men-products') || document.getElementById('products-list');
    }
    if (!menContainer) {
        console.error("❌ [Render] menContainer not found! (tried men-products and products-list)");
        return;
    }

    console.log(`🔍 [Render] Filtering for: Main=${parent} | Sub=${sub} | BestSeller=${bestSellerOnly}`);

    let filtered = remoteProducts.filter(p => {
        const isExplicitlyHidden = p.status === 'hidden' || p.active === false || p.active === "false";
        return !isExplicitlyHidden;
    });

    if (bestSellerOnly) {
        filtered = filtered.filter(p => p.isBestSeller === true);
    }

    // New Recursive Filter: Check if product category (or subCategory) matches any ID in the target branch
    if (sub !== 'all' && sub !== undefined) {
        const targetIds = getAllChildrenIds(sub);
        filtered = filtered.filter(p => targetIds.includes(p.category) || targetIds.includes(p.subCategory));
    } else if (parent !== 'all') {
        const targetIds = getAllChildrenIds(parent);
        filtered = filtered.filter(p => targetIds.includes(p.category) || targetIds.includes(p.subCategory));
    }

    console.log(`📦 [Render] FINAL RESULTS: ${filtered.length} products to display`);
    
    // 🔥 NEW: Sort by sortOrder (asc)
    filtered.sort((a, b) => {
        const orderA = a.sortOrder !== undefined ? a.sortOrder : 999999;
        const orderB = b.sortOrder !== undefined ? b.sortOrder : 999999;
        return orderA - orderB;
    });

    if (filtered.length === 0) {
        menContainer.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding: 40px; opacity:0.5;">${translations[currentLang].no_results}</div>`;
        return;
    }

    // Clear carousels
    if (window._carouselIntervals) {
        window._carouselIntervals.forEach(id => clearInterval(id));
    }
    window._carouselIntervals = [];

    menContainer.innerHTML = filtered.map(p => {
        const firstVariant = (p.colorVariants && p.colorVariants.length > 0) ? p.colorVariants[0] : null;
        let firstImages = [];
        
        if (p.explicitMainImage && p.image) {
            firstImages = [p.image];
        } else if (firstVariant && firstVariant.images && firstVariant.images.length > 0) {
            firstImages = firstVariant.images;
        } else if (p.image) {
            firstImages = [p.image];
        }

        const hasMultipleImages = firstImages.length > 1;
        
        // Revised Color Swatches for Card (Sorted by Hue)
        let variants = (p.colorVariants && p.colorVariants.length > 0) ? [...p.colorVariants] : [];
        if (variants.length > 0 && typeof ColorSystem !== 'undefined') {
            variants = ColorSystem.sortColors(variants.map(v => v.name), 'hue').map(name => variants.find(v => v.name === name));
        }

        const colorSwatches = variants.length > 0
            ? `<div class="card-color-swatches">${variants.slice(0, 4).map((v, i) => `<button class="card-color-dot ${i === 0 && !p.explicitMainImage ? 'active' : ''}" title="${ColorSystem.translate(v.name, currentLang)}" onclick="event.stopPropagation(); cardSelectColor('${p.id}', ${p.colorVariants.indexOf(v)}, this)" style="background:${ColorSystem.getHex(v.name)};"></button>`).join('')}${variants.length > 4 ? `<span class="color-more-count">+${variants.length - 4}</span>` : ''}</div>`
            : '';

        const mainImgRaw = firstImages[0] || '';
        // Optimized Cloudinary image for Product Cards (400px is enough for grid)
        const mainImg = mainImgRaw ? getOptimizedImg(mainImgRaw, 400) : '';
        const translatedName = (currentLang === 'ar' && p.name_ar) ? p.name_ar : translateText(p.name);
        const translatedBadge = (currentLang === 'ar' && p.badge_ar) ? p.badge_ar : (p.badge ? translateText(p.badge) : '');
        const catName = p.category || "";
        const seoAlt = `${translatedName} ${catName} - ${currentLang === 'ar' ? 'آي كلوث' : 'iCloth'}`;

        const isInW = wishlist.includes(p.id);
        const translatedProduct = (currentLang === 'ar' ? 'منتج' : 'Product');

        return `
        <div class="product-card" data-product-id="${p.id}" data-current-img="0" data-color-idx="${p.explicitMainImage ? '-1' : '0'}" onclick="openSizeModal('${p.id}')">
            <div class="product-img-wrap" style="position:relative; overflow:hidden;">
                ${p.isNew ? `<span class="badge-label" style="position: absolute; top: 12px; left: 12px; background: var(--primary); color: #000; border: none; font-weight: 900; z-index: 10; padding: 4px 8px; font-size: 0.72rem; letter-spacing: 0.5px;">NEW</span>` : ''}
                
                ${p.isBestSeller === true ? '<div class="best-seller-badge"><i class="fas fa-fire"></i></div>' : ''}

                <img class="product-card-main-img" src="${mainImg}" loading="lazy" alt="${seoAlt}" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'400\\' height=\\'400\\'><rect width=\\'400\\' height=\\'400\\' fill=\\'%23222\\'/><text x=\\'50%\\' y=\\'50%\\' fill=\\'%23666\\' font-family=\\'Arial\\' font-size=\\'24\\' text-anchor=\\'middle\\' dominant-baseline=\\'middle\\'>No Image</text></svg>'">
                
                <div class="card-overlay-name" data-translate-cache="${p.name}">${translatedName}</div>

                ${hasMultipleImages ? `
                    <button class="img-nav-btn prev" onclick="event.stopPropagation(); cardPrevImg('${p.id}')"><i class="fas fa-chevron-left"></i></button>
                    <button class="img-nav-btn next" onclick="event.stopPropagation(); cardNextImg('${p.id}')"><i class="fas fa-chevron-right"></i></button>
                    <div class="carousel-dots">${firstImages.map((_, i) => `<span class="cdot ${i === 0 ? 'active' : ''}"></span>`).join('')}</div>
                ` : ''}
            </div>
            <div class="product-info">
                <div class="product-info-stack">
                    <div class="name-row">
                        <h3 data-translate-cache="${p.name}">${translatedName}</h3>
                        <div class="add-plus-btn">+</div>
                    </div>
                    <div class="price-color-row">
                        <div class="price-box">
                            <span class="price">${p.price} ${translations[currentLang].currency}</span>
                            ${(p.priceBefore || p.oldPrice) ? `<span class="price-before" style="font-size: 0.62rem; color: var(--text-muted); text-decoration: line-through; opacity: 0.5; margin: 0 4px;">${p.priceBefore || p.oldPrice} ${translations[currentLang].currency}</span>` : ''}
                        </div>
                        ${colorSwatches}
                    </div>
                </div>
            </div>
        </div>`;
    }).join('');
}

// ======= GALLERY PANEL =======
window._galleryPanel = null;
window._galleryCurrentProduct = null;
window._galleryColorIdx = 0;
window._galleryImgIdx = 0;

// Backwards compatibility for templates
window.getColorHex = (name) => ColorSystem.getHex(name);

function updateCardImage(card, p, dir) {
    const getImages = (colorIdx) => {
        if (colorIdx === -1 && p.explicitMainImage && p.image) return [p.image];
        const colorIndex = colorIdx === -1 ? 0 : colorIdx;
        const v = p.colorVariants && p.colorVariants[colorIndex];
        if (v && v.images && v.images.length > 0) return v.images;
        return p.image ? [p.image] : [];
    };

    const colorIdx = parseInt(card.dataset.colorIdx || '0');
    const imgs = getImages(colorIdx);
    if (imgs.length <= 1) return;

    let idx = parseInt(card.dataset.currentImg || '0');
    idx = (idx + dir + imgs.length) % imgs.length;
    card.dataset.currentImg = idx;

    const imgEl = card.querySelector('.product-card-main-img');
    if (imgEl) {
        imgEl.style.opacity = '0';
        setTimeout(() => {
            imgEl.src = imgs[idx];
            imgEl.style.opacity = '1';
        }, 150);
    }
    // update dots
    const dots = card.querySelectorAll('.cdot');
    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
}

window.cardNextImg = (productId) => {
    const p = remoteProducts.find(x => x.id === productId);
    const card = document.querySelector(`[data-product-id="${productId}"]`);
    if (card && p) updateCardImage(card, p, 1);
};

window.cardPrevImg = (productId) => {
    const p = remoteProducts.find(x => x.id === productId);
    const card = document.querySelector(`[data-product-id="${productId}"]`);
    if (card && p) updateCardImage(card, p, -1);
};

window.cardSelectColor = (productId, colorIdx, btn) => {
    const p = remoteProducts.find(x => x.id === productId);
    if (!p) return;
    const card = document.querySelector(`[data-product-id="${productId}"]`);
    if (!card) return;

    // Update active swatch
    card.querySelectorAll('.card-color-dot').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    card.dataset.colorIdx = colorIdx;
    card.dataset.currentImg = '0';

    // Clear old interval, start new
    if (card._carouselInterval) clearInterval(card._carouselInterval);

    const v = p.colorVariants[colorIdx];
    const imgs = (v && v.images && v.images.length > 0) ? v.images : (p.image ? [p.image] : []);

    // Update main image
    const imgEl = card.querySelector('.product-card-main-img');
    if (imgEl) {
        imgEl.style.opacity = '0';
        setTimeout(() => { imgEl.src = imgs[0]; imgEl.style.opacity = '1'; }, 200);
    }

    // Rebuild carousel dots
    const dotsWrap = card.querySelector('.carousel-dots');
    if (dotsWrap) {
        if (imgs.length > 1) {
            dotsWrap.innerHTML = imgs.map((_, i) => `<span class="cdot ${i === 0 ? 'active' : ''}"></span>`).join('');
            dotsWrap.style.display = 'flex';
        } else {
            dotsWrap.innerHTML = '';
        }
    }

    // update nav btns display
    card.querySelectorAll('.img-nav-btn').forEach(b => b.style.display = imgs.length > 1 ? 'flex' : 'none');

    // If gallery is open for this product, refresh it
    if (window._galleryCurrentProduct && window._galleryCurrentProduct.id === productId) {
        window._galleryColorIdx = colorIdx;
        window._galleryImgIdx = 0;
        renderGalleryContent();
    }
};

window.openGalleryPanel = (productId, colorIdx) => {
    const p = remoteProducts.find(x => x.id === productId);
    if (!p) return;
    window._galleryCurrentProduct = p;
    window._galleryColorIdx = colorIdx === -1 ? 0 : (colorIdx || 0);
    window._galleryImgIdx = 0;

    let panel = document.getElementById('gallery-panel');
    if (!panel) {
        panel = document.createElement('div');
        panel.id = 'gallery-panel';
        panel.innerHTML = `
            <div class="gallery-overlay" onclick="closeGalleryPanel()"></div>
            <div class="gallery-drawer">
                <div class="gallery-header">
                    <div class="gallery-color-tabs" id="gallery-color-tabs"></div>
                    <button class="gallery-close" onclick="closeGalleryPanel()"><i class="fas fa-times"></i></button>
                </div>
                <div class="gallery-main-img-wrap">
                    <img id="gallery-main-img" src="" alt="">
                    <button class="gallery-nav prev" onclick="galleryNav(-1)"><i class="fas fa-chevron-left"></i></button>
                    <button class="gallery-nav next" onclick="galleryNav(1)"><i class="fas fa-chevron-right"></i></button>
                </div>
                <div class="gallery-thumbs" id="gallery-thumbs"></div>
                <button class="gallery-add-cart" onclick="openSizeModal(window._galleryCurrentProduct.id); closeGalleryPanel();"><i class="fas fa-shopping-cart"></i> ${currentLang === 'ar' ? 'أضف للسلة' : 'Add to Cart'}</button>
            </div>
        `;
        document.body.appendChild(panel);
    }

    renderGalleryContent();
    requestAnimationFrame(() => { panel.classList.add('open'); });
};

function renderGalleryContent() {
    const p = window._galleryCurrentProduct;
    if (!p) return;
    const colorIdx = window._galleryColorIdx;
    const v = p.colorVariants && p.colorVariants[colorIdx];
    const imgs = (v && v.images && v.images.length > 0) ? v.images : (p.image ? [p.image] : []);
    const imgIdx = Math.min(window._galleryImgIdx, imgs.length - 1);
    window._galleryImgIdx = imgIdx;

    // Color tabs
    const tabsEl = document.getElementById('gallery-color-tabs');
    if (tabsEl && p.colorVariants && p.colorVariants.length > 0) {
        tabsEl.innerHTML = ColorSystem.sortColors(p.colorVariants.map(v => v.name), 'hue').map(name => {
            const i = p.colorVariants.findIndex(v => v.name === name);
            const cv = p.colorVariants[i];
            return `
                <button class="gallery-color-tab ${i === colorIdx ? 'active' : ''}" onclick="gallerySelectColor(${i})" style="--dot-color: ${ColorSystem.getHex(cv.name)}">
                    <span class="gallery-color-dot"></span>${ColorSystem.translate(cv.name, currentLang)}
                </button>
            `;
        }).join('');
    } else if (tabsEl) {
        tabsEl.innerHTML = '';
    }

    // Main image
    const mainImg = document.getElementById('gallery-main-img');
    if (mainImg) { mainImg.src = imgs[imgIdx]; mainImg.alt = p.name; }

    // Thumbnails
    const thumbs = document.getElementById('gallery-thumbs');
    if (thumbs) {
        thumbs.innerHTML = imgs.map((src, i) => `
            <img src="${src}" class="gallery-thumb ${i === imgIdx ? 'active' : ''}" onclick="gallerySelectImg(${i})" alt="صورة ${i+1}">
        `).join('');
    }
}

window.gallerySelectColor = (colorIdx) => {
    window._galleryColorIdx = colorIdx;
    window._galleryImgIdx = 0;
    renderGalleryContent();
};

window.gallerySelectImg = (imgIdx) => {
    window._galleryImgIdx = imgIdx;
    const p = window._galleryCurrentProduct;
    const v = p.colorVariants && p.colorVariants[window._galleryColorIdx];
    const imgs = (v && v.images && v.images.length > 0) ? v.images : (p.image ? [p.image] : []);
    const mainImg = document.getElementById('gallery-main-img');
    if (mainImg) {
        mainImg.style.transform = 'scale(0.95)';
        mainImg.style.opacity = '0.5';
        setTimeout(() => {
            mainImg.src = imgs[imgIdx];
            mainImg.style.transform = 'scale(1)';
            mainImg.style.opacity = '1';
        }, 200);
    }
    document.querySelectorAll('.gallery-thumb').forEach((t, i) => t.classList.toggle('active', i === imgIdx));
};

window.galleryNav = (dir) => {
    const p = window._galleryCurrentProduct;
    const v = p.colorVariants && p.colorVariants[window._galleryColorIdx];
    const imgs = (v && v.images && v.images.length > 0) ? v.images : (p.image ? [p.image] : []);
    let idx = window._galleryImgIdx + dir;
    if (idx < 0) idx = imgs.length - 1;
    if (idx >= imgs.length) idx = 0;
    gallerySelectImg(idx);
};

window.closeGalleryPanel = () => {
    const panel = document.getElementById('gallery-panel');
    if (panel) panel.classList.remove('open');
};

window.openSizeModal = (id) => {
    const p = remoteProducts.find(prod => prod.id == id);
    if (!p) return;
    
    // Define UI Elements
    const sizeModal = document.getElementById('size-modal');
    const colorContainer = document.getElementById('modal-color-options');
    const modalProductName = document.getElementById('modal-product-name');
    
    selectedProductForSize = p;
    const firstVariant = p.colorVariants && p.colorVariants.length > 0 ? p.colorVariants[0] : null;
    selectedColor = firstVariant ? firstVariant.name : '';

    if (modalProductName) {
        modalProductName.innerText = translateText(p.name);
        modalProductName.setAttribute('data-translate-cache', p.name);
    }
    
    // 🧭 Update Breadcrumbs
    const bCat = document.getElementById('breadcrumb-cat');
    const bName = document.getElementById('breadcrumb-name');
    if (bCat && bName) {
        bCat.innerText = p.category || (currentLang === 'ar' ? 'عام' : 'General');
        bName.innerText = translateText(p.name);
    }
    
    // 🔥 Best Seller Badge & Label in Modal
    const modalBadgeContainer = document.getElementById('modal-badge-container');
    if (modalBadgeContainer) {
        let badgeHTML = '';
        if (p.isBestSeller === true) badgeHTML += '<div class="best-seller-badge"><i class="fas fa-fire"></i></div>';
        if (p.isNew) badgeHTML += `<span class="badge-label" style="position: absolute; top: 12px; left: 12px; background: var(--primary); color: #000; border: none; font-weight: 900; z-index: 10; padding: 4px 8px; font-size: 0.72rem; letter-spacing: 0.5px;">NEW</span>`;
        modalBadgeContainer.innerHTML = badgeHTML;
    }
    
    const colorLabelSpan = document.getElementById('selected-color-name');
    if (colorLabelSpan) {
        colorLabelSpan.innerText = translateText(selectedColor);
        colorLabelSpan.setAttribute('data-translate-cache', selectedColor);
    }
    
    // Set Product Ref
    const refEl = document.getElementById('modal-product-ref');
    if (refEl) refEl.innerText = p.reference ? `REF. ${p.reference}` : `REF. ${p.id.substring(0,8)}`;

    // Update Wishlist Button State in Modal (Bookmark SVG)
    const modalWB = document.getElementById('modal-wishlist-btn');
    if (modalWB) {
        const isInW = (wishlist || []).includes(p.id);
        modalWB.classList.toggle('active', isInW);
        const svg = modalWB.querySelector('svg');
        if (svg) svg.setAttribute('fill', isInW ? 'currentColor' : 'none');
    }

    const modalProductPrice = document.getElementById('modal-product-price');
    if (modalProductPrice) {
        const oldPriceVal = p.priceBefore || p.oldPrice;
        modalProductPrice.innerHTML = `
            <span class="price">${p.price} ${translations[currentLang].currency}</span>
            ${(oldPriceVal && Number(oldPriceVal) > 0) ? `<span class="price-before" style="text-decoration: line-through; color: var(--text-muted); font-size: 1.1rem; opacity: 0.6; margin: 0 15px;">${oldPriceVal} ${translations[currentLang].currency}</span>` : ''}
        `;
    }

    const modalDesc = document.getElementById('modal-product-desc');
    if (modalDesc) {
        const translatedDesc = translateText(p.description || '');
        modalDesc.innerHTML = translatedDesc.replace(/\n/g, '<br>');
        modalDesc.setAttribute('data-translate-cache', p.description || '');
        modalDesc.style.display = 'none'; 
        const icon = document.getElementById('desc-accordion-icon');
        if (icon) {
            icon.classList.remove('fa-minus');
            icon.classList.add('fa-plus');
        }
    }

    // Set main image: first image of first variant
    const modalImg = document.getElementById('modal-img');
    if (modalImg) {
        const firstImgs = firstVariant && firstVariant.images && firstVariant.images.length > 0 ? firstVariant.images : [];
        window._modalImages = firstImgs.length > 0 ? firstImgs : (p.image ? [p.image] : []);
        window._modalImgIdx = 0;
        
        modalImg.src = window._modalImages[0] || '';
        modalImg.style.cursor = window._modalImages.length > 1 ? 'pointer' : 'default';
        
        if (window._modalCarouselInterval) clearInterval(window._modalCarouselInterval);
        toggleNavButtons();
    }

    const colorVariantNames = (p.colorVariants || []).map(v => v.name);
    const sortedColorNames = ColorSystem.sortColors(colorVariantNames, 'hue');
    
    if (colorContainer) {
        if (sortedColorNames.length > 0) {
            colorContainer.innerHTML = sortedColorNames.map(name => {
                const v = p.colorVariants.find(x => x.name === name);
                const i = p.colorVariants.indexOf(v);
                return `
                    <div class="color-swatch-item ${v.name === selectedColor ? 'selected' : ''}" 
                         onclick="modalSelectColor('${v.name}', this)" 
                         style="background: ${ColorSystem.getHex(v.name)}" 
                         title="${ColorSystem.translate(v.name, currentLang)}"></div>
                `;
            }).join('');
        } else {
            colorContainer.innerHTML = '';
        }
    }

    // Reset selected size
    window._selectedModalSize = null;

    renderModalSizes(p, selectedColor);
    if (sizeModal) sizeModal.classList.add('active');

    // --- Size Chart Handling ---
    const chartContainer = document.getElementById('size-chart-container');
    const chartImg = document.getElementById('size-chart-img');
    const chartContent = document.getElementById('size-chart-content');
    const chartIcon = document.getElementById('size-chart-icon');

    if (chartContainer && chartImg) {
        if (p.sizeChartUrl) {
            chartImg.src = p.sizeChartUrl;
            chartContainer.style.display = 'block';
            // Reset accordion state
            if (chartContent) chartContent.style.display = 'none';
            if (chartIcon) {
                chartIcon.classList.remove('fa-minus');
                chartIcon.classList.add('fa-plus');
            }
        } else {
            chartContainer.style.display = 'none';
        }
    }

    renderModalSizes(p, selectedColor);
    sizeModal.classList.add('active');
    
    // Reset modal scroll to top when opening new product
    const modalContent = sizeModal.querySelector('.modal-content');
    if (modalContent) modalContent.scrollTop = 0;

    // Render Related Products
    renderRelatedProducts(p.subCategory || p.category, p.id);

    // Update URL to allow sharing this specific product (Clean URL with relative fallback)
    const isLocal = window.location.protocol === 'file:';
    if (!isLocal) {
        const url = new URL(window.location.origin + window.location.pathname);
        if (url.pathname.endsWith('index.html')) {
            url.pathname = url.pathname.replace('index.html', `product/${toSlug(p.name)}--${p.id}`);
        } else {
            url.pathname = `/product/${toSlug(p.name)}--${p.id}`;
        }
        window.history.pushState({ productId: id }, '', url);
        updateCanonical(url.href);
    } else {
        const url = new URL(window.location);
        url.searchParams.set('product', id);
        window.history.pushState({}, '', url);
    }
    
    // 🏷️ Inject Product Schema (Structured Data)
    injectProductSchema(p);
};

function updateCanonical(url) {
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
    }
    canonical.href = url;
}

function injectProductSchema(p) {
    let script = document.getElementById('dynamic-product-schema');
    if (!script) {
        script = document.createElement('script');
        script.id = 'dynamic-product-schema';
        script.type = 'application/ld+json';
        document.head.appendChild(script);
    }
    
    const schema = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": p.name,
        "image": p.image,
        "description": p.description || p.name,
        "brand": {
            "@type": "Brand",
            "name": "iCloth"
        },
        "offers": {
            "@type": "Offer",
            "price": p.price,
            "priceCurrency": "EGP",
            "availability": "https://schema.org/InStock",
            "url": window.location.href
        }
    };
    script.textContent = JSON.stringify(schema);
}

window.shareCurrentProduct = () => {
    const url = window.location.href;
    
    // Try native share API first (mobile)
    if (navigator.share && /Mobi|Android/i.test(navigator.userAgent)) {
        const p = selectedProductForSize;
        navigator.share({
            title: p ? (translateText(p.name) || 'iCloth') : 'iCloth',
            text: p ? `${translateText(p.name)} - ${p.price} ${translations[currentLang].currency}` : 'تسوق من iCloth',
            url: url
        }).catch(() => {});
        return;
    }
    
    // Fallback: copy to clipboard + show toast
    navigator.clipboard.writeText(url).then(() => {
        showToast(currentLang === 'ar' ? '✅ تم نسخ رابط المنتج!' : '✅ Product link copied!');
    }).catch(() => {
        // Last fallback: select text from temp input
        const el = document.createElement('textarea');
        el.value = url;
        el.style.position = 'fixed';
        el.style.opacity = '0';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        showToast(currentLang === 'ar' ? '✅ تم نسخ الرابط!' : '✅ Link copied!');
    });
};

// 🍞 Toast Notification System
function showToast(message, duration = 2500) {
    // Remove existing toast
    const existing = document.getElementById('icloth-toast');
    if (existing) existing.remove();
    
    const toast = document.createElement('div');
    toast.id = 'icloth-toast';
    toast.innerText = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%) translateY(20px);
        background: rgba(20, 20, 20, 0.95);
        color: #fff;
        padding: 14px 28px;
        border-radius: 50px;
        font-size: 1rem;
        font-weight: 700;
        font-family: 'Cairo', sans-serif;
        z-index: 99999;
        border: 1px solid rgba(212, 175, 55, 0.4);
        box-shadow: 0 10px 40px rgba(0,0,0,0.4);
        opacity: 0;
        transition: all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        white-space: nowrap;
        pointer-events: none;
        backdrop-filter: blur(10px);
    `;
    document.body.appendChild(toast);
    
    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) translateY(0)';
    });
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(10px)';
        setTimeout(() => toast.remove(), 400);
    }, duration);
}
window.showToast = showToast;

function renderRelatedProducts(targetCatId, currentProdId) {
    const list = document.getElementById('related-products-list');
    const sect = document.getElementById('related-products-section');
    if (!list || !sect) return;

    const related = remoteProducts.filter(p => 
        (p.category === targetCatId || p.subCategory === targetCatId) && 
        p.id !== currentProdId && 
        (p.status !== 'hidden' && p.active !== false && p.active !== "false")
    ).slice(0, 8);

    if (related.length === 0) {
        sect.style.display = 'none';
        return;
    }

    sect.style.display = 'block';
    list.innerHTML = related.map(p => `
        <div class="related-item" onclick="openSizeModal('${p.id}')" style="min-width: 140px; cursor: pointer; transition: transform 0.3s;" onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='translateY(0)'">
            <img src="${p.image}" style="width: 100%; height: 180px; object-fit: cover; margin-bottom: 8px;">
            <div style="font-size: 0.72rem; font-weight: 300; text-transform: uppercase; color: var(--text-main); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" data-translate-cache="${p.name}">${translateText(p.name)}</div>
            <div style="font-size: 0.8rem; font-weight: 950; color: var(--primary);">${p.price} ${translations[currentLang].currency}</div>
        </div>
    `).join('');
}


window.modalSelectColor = (color, btn) => {
    selectedColor = color;
    document.querySelectorAll('.color-swatch-item').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    const p = selectedProductForSize;
    if (p && p.colorVariants) {
        const v = p.colorVariants.find(x => x.name === color);
        const imgEl = document.getElementById('modal-img');
        if (imgEl) {
            window._modalImages = (v && v.images && v.images.length > 0) ? v.images : (v?.image ? [v.image] : (p.image ? [p.image] : []));
            window._modalImgIdx = 0;
            
            imgEl.style.opacity = '0';
            setTimeout(() => { imgEl.src = window._modalImages[0] || ''; imgEl.style.opacity = '1'; }, 200);
            
            imgEl.style.cursor = window._modalImages.length > 1 ? 'pointer' : 'default';
            
            if (window._modalCarouselInterval) clearInterval(window._modalCarouselInterval);
            toggleNavButtons();
        }
        const colorLabelSpan = document.getElementById('selected-color-name');
        if (colorLabelSpan) colorLabelSpan.innerText = translateText(color);
        
        // Update Ref if possible
        const refEl = document.getElementById('modal-product-ref');
        if (refEl) refEl.innerText = p.reference ? `REF. ${p.reference}` : `REF. ${p.id.substring(0,8)}`;

        renderModalSizes(p, color);
    }
};

function toggleNavButtons() {
    const modal = document.getElementById('size-modal');
    if (!modal) return;
    const navBtns = modal.querySelectorAll('.img-nav-btn');
    const hasMultiple = window._modalImages && window._modalImages.length > 1;
    navBtns.forEach(btn => btn.style.display = hasMultiple ? 'flex' : 'none');
}

window.modalNextImg = () => {
    if (!window._modalImages || window._modalImages.length <= 1) return;
    window._modalImgIdx = (window._modalImgIdx + 1) % window._modalImages.length;
    const imgEl = document.getElementById('modal-img');
    if (imgEl) {
        imgEl.style.opacity = '0';
        setTimeout(() => {
            imgEl.src = window._modalImages[window._modalImgIdx];
            imgEl.style.opacity = '1';
        }, 150);
    }
};

window.modalPrevImg = () => {
    if (!window._modalImages || window._modalImages.length <= 1) return;
    window._modalImgIdx = (window._modalImgIdx - 1 + window._modalImages.length) % window._modalImages.length;
    const imgEl = document.getElementById('modal-img');
    if (imgEl) {
        imgEl.style.opacity = '0';
        setTimeout(() => {
            imgEl.src = window._modalImages[window._modalImgIdx];
            imgEl.style.opacity = '1';
        }, 150);
    }
};

function renderModalSizes(p, color) {
    const container = document.querySelector('.size-options');
    const standardSizes = ['M', 'L', 'XL', 'XXL', '36', '38', '40', '42'];
    let sizes = p.sizes && p.sizes.length > 0 ? p.sizes : [];

    if (p.colorVariants) {
        const v = p.colorVariants.find(x => x.name === color);
        if (v && v.sizes && v.sizes.length > 0) {
            sizes = v.sizes;
        }
    }

    // Use standard sizes if no specific sizes are defined
    const finalSizes = sizes.length > 0 ? sizes : standardSizes;

    container.innerHTML = finalSizes.map(s => 
        `<button class="size-btn" onclick="selectSizeForCart('${s}', this)">${s}</button>`
    ).join('');
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
    addToCartFromModal(window._selectedModalSize);
};

window.addToCartFromModal = (size) => {
    const p = selectedProductForSize;
    const color = selectedColor;
    const cartId = `${p.id}-${size}-${color}`;

    // استخدام أول صورة من images array أو الصورة الافتراضية
    let img = p.image || '';
    if (p.colorVariants) {
        const v = p.colorVariants.find(x => x.name === color);
        if (v) {
            img = (v.images && v.images.length > 0) ? v.images[0] : (v.image || p.image || '');
        }
    }

    const existing = cart.find(i => i.cartId === cartId);
    if (existing) existing.quantity++;
    else cart.push({ ...p, cartId, size, color, quantity: 1, image: img });

    updateCartUI();
    localStorage.setItem('icloth_cart', JSON.stringify(cart));
    if (window._modalCarouselInterval) clearInterval(window._modalCarouselInterval);
    
    // Success Feedback instead of opening cart
    const btn = document.querySelector('.add-to-basket-btn');
    if (btn) {
        const originalText = btn.innerText;
        btn.classList.add('added');
        btn.innerText = currentLang === 'ar' ? '✅ تم الإضافة للسلة' : '✅ ADDED TO BASKET';
        setTimeout(() => {
            btn.classList.remove('added');
            btn.innerText = originalText;
        }, 2000);
    }
};

function updateCartUI() {
    document.querySelectorAll('.cart-count').forEach(c => c.innerText = cart.reduce((s, i) => s + i.quantity, 0));
    const list = document.getElementById('cart-items-list');
    const totalEl = document.getElementById('cart-total-price');
    if (!list) return;

    if (cart.length === 0) {
        list.innerHTML = `<p class="empty-msg">${translations[currentLang].cart_empty}</p>`;
        totalEl.innerText = `0 ${translations[currentLang].currency}`;
        if (document.getElementById('discount-display')) document.getElementById('discount-display').style.display = 'none';
    } else {
        const subtotal = cart.reduce((s, i) => s + (i.price * i.quantity), 0);
        let finalTotal = subtotal;
        const discountDisplay = document.getElementById('discount-display');
        
        if (appliedCoupon) {
            const discountAmount = Math.round(subtotal * (appliedCoupon.discount / 100));
            finalTotal = subtotal - discountAmount;
            if (discountDisplay) {
                discountDisplay.innerText = `${translations[currentLang].discount} -${discountAmount} ${translations[currentLang].currency} (${appliedCoupon.discount}%)`;
                discountDisplay.style.display = 'block';
            }
        } else if (discountDisplay) {
            discountDisplay.style.display = 'none';
        }

        list.innerHTML = cart.map(i => `
            <div class="cart-item">
                <img src="${i.image}" alt="${translateText(i.name)}">
                <div class="cart-item-info">
                    <h4 data-translate-cache="${i.name}">${translateText(i.name)}</h4>
                    <div class="cart-item-details">${i.size} | <span data-translate-cache="${i.color}">${translateText(i.color)}</span></div>
                    <div class="qty-control">
                        <button class="qty-btn" onclick="updateCartQuantity('${i.cartId}', 1)">+</button>
                        <span>${i.quantity}</span>
                        <button class="qty-btn" onclick="updateCartQuantity('${i.cartId}', -1)">−</button>
                    </div>
                </div>
                <div class="delete-btn" onclick="removeFromCart('${i.cartId}')"><i class="fas fa-trash-alt"></i></div>
            </div>
        `).join('');
        totalEl.innerText = `${finalTotal} ${translations[currentLang].currency}`;
    }
}

async function applyCouponCode() {
    const input = document.getElementById('coupon-code-input');
    const statusMsg = document.getElementById('coupon-status-msg');
    const code = input.value.trim().toUpperCase();

    if (!code) return;

    statusMsg.style.display = 'block';
    statusMsg.style.color = 'var(--primary)';
    statusMsg.innerText = translations[currentLang].loading;

    try {
        const snapshot = await db.collection('coupons').where('code', '==', code).get();
        if (snapshot.empty) {
            throw new Error(translations[currentLang].invalid_coupon);
        }

        const couponDoc = snapshot.docs[0];
        const coupon = couponDoc.data();
        coupon.id = couponDoc.id;

        // Check if expired
        const today = new Date().toISOString().split('T')[0];
        if (coupon.expiry < today) {
            throw new Error(translations[currentLang].invalid_coupon);
        }

        // Check limit
        if (coupon.usedCount >= coupon.limit) {
            throw new Error(translations[currentLang].invalid_coupon);
        }

        appliedCoupon = coupon;
        statusMsg.style.color = '#4CAF50';
        statusMsg.innerText = translations[currentLang].coupon_applied;
        updateCartUI();
        if (document.getElementById('checkout-modal').classList.contains('active')) {
            updateCheckoutTotal();
        }
    } catch (err) {
        appliedCoupon = null;
        statusMsg.style.color = '#f44336';
        statusMsg.innerText = err.message;
        updateCartUI();
        if (document.getElementById('checkout-modal').classList.contains('active')) {
            updateCheckoutTotal();
        }
    }
}

function updateCartQuantity(id, d) {
    const i = cart.find(x => x.cartId === id);
    if (i) { i.quantity += d; if (i.quantity <= 0) removeFromCart(id); else { updateCartUI(); localStorage.setItem('icloth_cart', JSON.stringify(cart)); } }
}

function removeFromCart(id) { 
    cart = cart.filter(x => x.cartId !== id); 
    updateCartUI(); 
    localStorage.setItem('icloth_cart', JSON.stringify(cart)); 
}

function openCartSidebar() { 
    if (cartSidebar) cartSidebar.classList.add('open'); 
    if (cartOverlay) cartOverlay.classList.add('show'); 
}

function closeCartSidebar() { 
    if (cartSidebar) cartSidebar.classList.remove('open'); 
    if (cartOverlay) cartOverlay.classList.remove('show'); 
}

let isLoggingIn = false;
async function signInWithGoogle() {
    if (isLoggingIn) {
        console.warn("⚠️ Already attempting to login, ignoring request.");
        return;
    }
    isLoggingIn = true;
    console.log("🔐 Opening Google Login Popup...");
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try { 
        await firebase.auth().signInWithPopup(provider); 
        console.log("✅ Google Login Success!");
    } catch (e) { 
        console.error("❌ Google Login Failed:", e);
        if (e.code !== 'auth/cancelled-popup-request') {
            alert((currentLang === 'ar' ? "خطأ في تسجيل الدخول: " : "Login Error: ") + e.message);
        }
    } finally {
        isLoggingIn = false;
    }
}

async function signOutUser() {
    await firebase.auth().signOut();
    location.reload();
}

function updateAuthUI() {
    const name = (currentUser && currentUser.displayName) ? currentUser.displayName.split(' ')[0] : (currentUser ? currentUser.email.split('@')[0] : null);
    renderAuthUI(name);
}

function openMyOrdersModal() {
    console.log("🔓 فتح modal الطلبات...");
    const modal = document.getElementById('my-orders-modal');
    const loginSection = document.getElementById('orders-login-section');
    const ordersSection = document.getElementById('orders-list-section');
    const userEmailDisplay = document.getElementById('user-email-display');

    if (!modal) {
        console.error("❌ modal الطلبات غير موجود");
        return;
    }

    modal.classList.add('active');

    // Show appropriate section based on login state
    if (currentUser) {
        console.log("✅ المستخدم مسجل دخول، عرض الطلبات");
        if (loginSection) loginSection.style.display = 'none';
        if (ordersSection) ordersSection.style.display = 'block';
        if (userEmailDisplay) userEmailDisplay.innerText = currentUser.email;
        loadMyOrders();
    } else {
        console.log("⚠️ المستخدم غير مسجل، عرض صفحة تسجيل الدخول");
        if (loginSection) {
            loginSection.style.display = 'flex';
            loginSection.style.flexDirection = 'column';
            loginSection.style.alignItems = 'center';
        }
        if (ordersSection) ordersSection.style.display = 'none';
    }
}

async function loadMyOrders() {
    const list = document.getElementById('my-orders-list');

    if (!list) {
        console.error("❌ عنصر my-orders-list غير موجود في الصفحة");
        return;
    }

    list.innerHTML = `<div style="text-align:center; padding:30px;">${translations[currentLang].loading}</div>`;

    console.log("📋 بدء تحميل الطلبات...");

    // Check if user is logged in
    if (!currentUser) {
        console.warn("⚠️ User not logged in");
        list.innerHTML = `<p style="text-align:center; padding:20px; opacity:0.7;">${translations[currentLang].login_prompt}</p>`;
        return;
    }

    // Check if Firebase is available
    if (!db) {
        console.error("❌ Firebase not connected");
        list.innerHTML = `<p style="text-align:center; padding:20px; color:#f44336;">${currentLang === 'ar' ? 'خطأ في الاتصال بقاعدة البيانات' : 'Database Connection Error'}</p>`;
        return;
    }

    try {
        console.log("🔍 البحث عن طلبات المستخدم:", currentUser.email);

        // Query by userId (UID) which matches the Firebase rules for logged-in users
        const snapshot = await db.collection('orders')
            .where('userId', '==', currentUser.uid)
            .get();

        console.log(`📦 تم العثور على ${snapshot.docs.length} طلب`);

        if (snapshot.docs.length === 0) {
            list.innerHTML = `<p style="text-align:center; padding:40px; opacity:0.7;">📭 ${currentLang === 'ar' ? 'لا توجد طلبات سابقة' : 'No previous orders'}</p>`;
            return;
        }

        // Sort orders by createdAt on client side
        const orders = snapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .sort((a, b) => {
                const aTime = a.createdAt?.toMillis() || 0;
                const bTime = b.createdAt?.toMillis() || 0;
                return bTime - aTime; // Newest first
            });

        list.innerHTML = orders.map(o => {
            console.log("📄 طلب:", o.id, o);

            return `
                <div class="order-card-mini" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 15px; margin-bottom: 15px; text-align: inherit;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                        <span style="font-size:0.85rem; opacity:0.7;">${o.createdAt ? o.createdAt.toDate().toLocaleDateString(currentLang === 'ar' ? 'ar-EG' : 'en-US') : '---'}</span>
                        <span class="order-status" style="background: #2196F3; color: #fff; padding: 4px 10px; border-radius: 20px; font-size: 0.75rem;">${o.status || (currentLang === 'ar' ? 'جديد' : 'New')}</span>
                    </div>
                    <div style="margin: 10px 0;">
                        ${o.items ? o.items.map(i => `<div style="font-size:0.9rem; margin: 5px 0;">• ${i.name} × ${i.quantity}</div>`).join('') : (currentLang === 'ar' ? 'لا توجد منتجات' : 'No items')}
                    </div>
                    <div style="margin-top:12px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.1); font-weight:bold; color: var(--primary);">
                        ${translations[currentLang].total} ${o.total || 0} ${translations[currentLang].currency}
                    </div>
                </div>
            `;
        }).join('');

        console.log("✅ تم عرض الطلبات بنجاح");

    } catch (e) {
        console.error("❌ خطأ في تحميل الطلبات:", e);
        list.innerHTML = '<p style="text-align:center; padding:20px; color:#f44336;">حدث خطأ في جلب الطلبات: ' + e.message + '</p>';
    }
}


function closeSuccessModal() {
    const modal = document.getElementById('success-modal');
    if (modal) modal.classList.remove('active');
}

// --- URL Parameter Handling (Deep Linking & Clean URLs) ---
window.handleUrlParams = () => {
    let path = decodeURIComponent(window.location.pathname).replace(/\/$/, ""); // Clear trailing slash
    const params = new URLSearchParams(window.location.search);
    
    // 1. Handle Legacy Query Params
    const legacyCat = params.get('cat');
    const legacyProduct = params.get('product');

    // 2. Handle Clean URLs
    let catSlug = null;
    let productSlug = null;

    if (path.includes('/product/')) {
        productSlug = path.split('/product/')[1];
    } else if (path.includes('/category/')) {
        catSlug = path.split('/category/')[1];
    }

    const finalCat = catSlug || legacyCat;
    const finalProduct = productSlug || legacyProduct;

    console.log(`🔗 [URL Routing] path=${path} | product=${finalProduct} | cat=${finalCat}`);

    if (finalProduct) {
        console.log("🔍 [Routing] Searching for product:", finalProduct);
        
        // Extract ID immediately if in name--id format
        let targetId = finalProduct;
        if (finalProduct.includes('--')) {
            const parts = finalProduct.split('--');
            targetId = parts[parts.length - 1];
        }
        
        const tryOpenProduct = () => {
            if (!remoteProducts || remoteProducts.length === 0) return false;
            
            const found = remoteProducts.find(x => 
                x.id === targetId || 
                x.id === finalProduct ||
                toSlug(x.name) === toSlug(finalProduct) ||
                toSlug(x.name) === toSlug(targetId) ||
                (x.name_ar && toSlug(x.name_ar) === toSlug(finalProduct))
            );
            
            if (found) {
                console.log("✅ [Routing] Product found! Opening modal:", found.name);
                // Small delay to ensure page is fully rendered
                setTimeout(() => window.openSizeModal(found.id), 300);
                return true;
            }
            return false;
        };
        
        // Try immediately first
        if (!tryOpenProduct()) {
            // If products not loaded yet, poll until they are
            let attempts = 0;
            const checkProducts = setInterval(() => {
                attempts++;
                if (tryOpenProduct()) {
                    clearInterval(checkProducts);
                } else if (attempts > 80) { // 8 seconds max
                    console.warn("⚠️ [Routing] Product not found after timeout:", finalProduct);
                    clearInterval(checkProducts);
                }
            }, 100);
        }
    } else if (finalCat) {
        const tryCat = () => {
            const filterBtns = document.querySelectorAll('.main-filter-btn');
            if (filterBtns.length === 0) return false;
            let found = false;
            filterBtns.forEach(btn => {
                const btnTextSafe = btn.innerText.trim();
                if (toSlug(btnTextSafe) === toSlug(finalCat) || btnTextSafe.toUpperCase() === finalCat.toUpperCase()) {
                    btn.click();
                    found = true;
                }
            });
            return found;
        };
        
        if (!tryCat()) {
            let attempts = 0;
            const checkCats = setInterval(() => {
                attempts++;
                if (tryCat()) {
                    clearInterval(checkCats);
                } else if (attempts > 50) {
                    clearInterval(checkCats);
                }
            }, 200);
        }
    }
};

// --- GLOBAL ASSIGNMENTS & INITIALIZATION ---
window.openCartSidebar = openCartSidebar;
window.closeCartSidebar = closeCartSidebar;
window.toggleCart = openCartSidebar;
window.closeCart = closeCartSidebar;
window.openMyOrdersModal = openMyOrdersModal;
function toggleDescription() {
    const content = document.getElementById('modal-product-desc');
    const icon = document.getElementById('desc-accordion-icon');
    if (!content) return;
    const isVisible = (content.style.display === 'block');
    content.style.display = isVisible ? 'none' : 'block';
    if (icon) {
        icon.classList.toggle('fa-plus', isVisible);
        icon.classList.toggle('fa-minus', !isVisible);
    }
}

function toggleSizeChart() {
    const content = document.getElementById('size-chart-content');
    const icon = document.getElementById('size-chart-icon');
    if (!content) return;
    const isVisible = (content.style.display === 'block');
    content.style.display = isVisible ? 'none' : 'block';
    if (icon) {
        icon.classList.toggle('fa-plus', isVisible);
        icon.classList.toggle('fa-minus', !isVisible);
    }
}

function openFullSizeChart() {
    const img = document.getElementById('size-chart-img');
    if (img && img.src) window.open(img.src, '_blank');
}

window.toggleDescription = toggleDescription;
window.toggleSizeChart = toggleSizeChart;
window.openFullSizeChart = openFullSizeChart;

window.closeSuccessModal = closeSuccessModal;
window.updateCartQuantity = updateCartQuantity;
window.removeFromCart = removeFromCart;
window.signInWithGoogle = signInWithGoogle;
window.signOutUser = signOutUser;
window.toggleLanguage = toggleLanguage;
window.applyCouponCode = applyCouponCode;

window.toggleSidebarMenu = toggleSidebarMenu;
window.applySideFilter = applySideFilter;
window.applyBestSellerFilter = applyBestSellerFilter;

// --- 💖 WISHLIST SYSTEM ---
window.toggleWishlist = (id, btn) => {
    const idx = wishlist.indexOf(id);
    const wishlistSidebar = document.getElementById('wishlist-sidebar');
    const isSidebarOpen = wishlistSidebar && wishlistSidebar.classList.contains('open');

    if (idx === -1) {
        wishlist.push(id);
        if (btn) {
            btn.classList.add('active');
            const svg = btn.querySelector('svg');
            if (svg) svg.setAttribute('fill', 'currentColor');
        }
        showToast(currentLang === 'ar' ? '🔖 تمت الإضافة للمفضلة' : '🔖 Added to favorites');
    } else {
        wishlist.splice(idx, 1);
        if (btn) {
            btn.classList.remove('active');
            const svg = btn.querySelector('svg');
            if (svg) svg.setAttribute('fill', 'none');
        }
        
        // --- Optimistic UI for fast delete ---
        if (isSidebarOpen) {
            const el = document.querySelector(`.wishlist-item[data-id="${id}"]`);
            if (el) {
                el.style.transform = 'translateX(100%)';
                el.style.opacity = '0';
                setTimeout(() => {
                    renderWishlist();
                }, 300);
            }
        }
        showToast(currentLang === 'ar' ? '🔓 تمت الإزالة من المفضلة' : '🔓 Removed from favorites');
    }
    localStorage.setItem('icloth_wishlist', JSON.stringify(wishlist));
    updateWishlistUI();
    
    // Refresh sidebar if it's already open (but not already handled by optimistic UI)
    if (isSidebarOpen && idx === -1) {
        renderWishlist();
    }
};

window.toggleWishlistFromModal = () => {
    if (!selectedProductForSize) return;
    const btn = document.getElementById('modal-wishlist-btn');
    window.toggleWishlist(selectedProductForSize.id, btn);
};

window.toggleWishlistMenu = () => {
    const menu = document.getElementById('wishlist-sidebar');
    const overlay = document.getElementById('cart-overlay');
    if (menu && overlay) {
        const isOpen = menu.classList.toggle('open');
        if (isOpen) {
            overlay.classList.add('show');
            renderWishlist();
        } else {
            overlay.classList.remove('show');
        }
    }
};

function updateWishlistUI() {
    const countBadge = document.querySelector('.wishlist-count');
    if (countBadge) {
        countBadge.innerText = wishlist.length;
        countBadge.style.display = wishlist.length > 0 ? 'flex' : 'none';
    }
    const navWishBtn = document.querySelector('#wishlist-btn');
    if (navWishBtn) {
        const svg = navWishBtn.querySelector('svg');
        if (svg) {
            const hasItems = (wishlist || []).length > 0;
            svg.setAttribute('fill', hasItems ? 'currentColor' : 'none');
            svg.style.color = hasItems ? '#d4af37' : '';
        }
    }
    // Also update modal button if open
    if (selectedProductForSize) {
        const modalWB = document.getElementById('modal-wishlist-btn');
        if (modalWB) {
            const isInW = (wishlist || []).includes(selectedProductForSize.id);
            modalWB.classList.toggle('active', isInW);
            const svg = modalWB.querySelector('svg');
            if (svg) svg.setAttribute('fill', isInW ? 'currentColor' : 'none');
        }
    }
}

function renderWishlist() {
    const list = document.getElementById('wishlist-items-list');
    if (!list) return;

    if (wishlist.length === 0) {
        list.innerHTML = `<div class="empty-wishlist" style="text-align: center; padding: 60px 20px; opacity: 0.3;">
            <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 25px;"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
            <p style="font-size: 1.1rem; letter-spacing: 0.5px;">${currentLang === 'ar' ? 'قائمة المفضلة فارغة' : 'Your favorites list is empty'}</p>
        </div>`;
        return;
    }

    const favoriteProducts = remoteProducts.filter(p => wishlist.includes(p.id));
    list.innerHTML = favoriteProducts.map(p => {
        const translatedName = (currentLang === 'ar' && p.name_ar) ? p.name_ar : translateText(p.name);
        const img = p.image || '';
        return `
            <div class="wishlist-item" data-id="${p.id}" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; padding: 12px; margin-bottom: 15px; display: flex; align-items: center; gap: 15px; position: relative; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); overflow: hidden;">
                <div class="wish-img-wrap" style="width: 85px; height: 110px; flex-shrink: 0; border-radius: 12px; overflow: hidden;">
                    <img src="${getOptimizedImg(img, 200)}" alt="${translatedName}" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                
                <div class="wish-info" style="flex: 1; display: flex; flex-direction: column; gap: 4px;">
                    <h4 style="font-size: 0.9rem; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;">${translatedName}</h4>
                    <div style="color: var(--primary); font-weight: 900; font-size: 1rem; margin-bottom: 8px;">${p.price} ${translations[currentLang].currency}</div>
                    
                    <button onclick="openSizeModal('${p.id}'); toggleWishlistMenu();" style="background: var(--primary); color: #000; border: none; padding: 10px; border-radius: 12px; cursor: pointer; font-size: 0.75rem; font-weight: 900; display: flex; align-items: center; justify-content: center; gap: 8px; transition: 0.3s; width: fit-content; min-width: 120px;">
                        <i class="fas fa-shopping-bag" style="font-size: 0.8rem;"></i> ${currentLang === 'ar' ? 'أضف للسلة' : 'Add to Cart'}
                    </button>
                </div>

                <button onclick="window.toggleWishlist('${p.id}')" style="position: absolute; top: 12px; right: 12px; background: rgba(255,77,77,0.1); color: #ff4d4d; border: 1px solid rgba(255,77,77,0.2); width: 32px; height: 32px; border-radius: 10px; cursor: pointer; transition: 0.3s; display: flex; align-items: center; justify-content: center;" title="Remove">
                    <i class="fas fa-trash-alt" style="font-size: 0.8rem;"></i>
                </button>
            </div>
        `;
    }).join('');
}

// Global update for load
setTimeout(updateWishlistUI, 3000);


// Execute Initialization
document.addEventListener('DOMContentLoaded', initAll);
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initAll();
}

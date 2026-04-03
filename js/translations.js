// 🌍 iCloth - Translation System
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
        wishlist: "Favorites",
        shipping_policy: "Shipping Policy",
        returns_policy: "Returns & Exchange Policy",
        back_to_home: "Return Home"
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
        back_to_home: "العودة للمنزل"
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

function translateText(text) {
    if (!text) return "";
    const cleanText = text.trim();
    const cleanKey = cleanText.toLowerCase().replace(/\s+/g, '_');
    
    if (translations[currentLang]) {
        if (translations[currentLang][cleanKey]) return translations[currentLang][cleanKey];
        if (translations[currentLang][cleanText.toLowerCase()]) return translations[currentLang][cleanText.toLowerCase()];
    }

    const colorTranslation = typeof ColorSystem !== 'undefined' ? ColorSystem.translate(cleanText, currentLang) : null;
    if (colorTranslation && colorTranslation !== cleanText) return colorTranslation;
    
    if (currentLang === 'ar' && fashionTranslations[cleanText.toLowerCase()]) {
        return fashionTranslations[cleanText.toLowerCase()];
    }

    if (currentLang === 'en') return cleanText;
    if (aiTranslationCache[cleanText]) return aiTranslationCache[cleanText];

    getSmartTranslation(cleanText);
    return cleanText; 
}

async function getSmartTranslation(text) {
    if (!text || currentLang === 'en') return text;
    const cleanText = text.trim();

    if (activeAITranslations.has(cleanText)) return cleanText;
    activeAITranslations.add(cleanText);

    try {
        const response = await fetch('/api/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: cleanText, targetLang: 'ar' })
        });
        
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new Error("Invalid response from translation API");
        }

        const data = await response.json();
        
        if (data.translated && data.translated !== cleanText) {
            aiTranslationCache[cleanText] = data.translated;
            localStorage.setItem('icloth_ai_cache', JSON.stringify(aiTranslationCache));
            
            document.querySelectorAll(`[data-translate-cache="${cleanText}"]`).forEach(el => {
                el.innerText = data.translated;
                el.style.opacity = '0';
                setTimeout(() => el.style.opacity = '1', 10);
            });
        }
        return data.translated || cleanText;
    } catch (e) {
        return cleanText;
    } finally {
        activeAITranslations.delete(cleanText);
    }
}

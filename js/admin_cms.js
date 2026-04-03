// 🎨 iCloth Admin - CMS & Settings Logic
async function loadCMS() {
    try {
        const doc = await db.collection('settings').doc('cms').get();
        if (doc.exists) {
            const data = doc.data();
            document.getElementById('cms-promo-text').value = data.promoText || "";
            document.getElementById('cms-footer-text').value = data.footerText || "";
            document.getElementById('cms-shipping-policy').value = data.shippingPolicy || "";
            document.getElementById('cms-returns-policy').value = data.returnsPolicy || "";
        }
    } catch (e) {
        console.error("Load CMS error:", e);
    }
}

async function saveCMS(e) {
    if (e) e.preventDefault();
    const data = {
        promoText: document.getElementById('cms-promo-text').value,
        footerText: document.getElementById('cms-footer-text').value,
        shippingPolicy: document.getElementById('cms-shipping-policy').value,
        returnsPolicy: document.getElementById('cms-returns-policy').value,
        updatedAt: new Date().toISOString()
    };
    
    try {
        await db.collection('settings').doc('cms').set(data, { merge: true });
        showToast("✅ تم حفظ إعدادات المحتوى!");
    } catch (e) {
        showToast("⚠️ خطأ في الحفظ");
    }
}

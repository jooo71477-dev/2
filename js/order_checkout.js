// 📦 iCloth - Orders & Checkout Logic
async function handleOrderSubmit() {
    const form = document.getElementById('checkout-form');
    if (!form) return;
    
    const details = {
        name: form.querySelector('#full-name').value,
        phone: form.querySelector('#mobile-number').value,
        governorate: form.querySelector('#governorate').value,
        address: form.querySelector('#detailed-address').value,
        payment: form.querySelector('#selected-payment').value,
        items: cart,
        total: (cart.reduce((s, x) => s + (x.price * (x.quantity || 1)), 0)),
        createdAt: new Date().toISOString()
    };
    
    if (!details.name || !details.phone || !details.governorate || !details.address) {
        showToast(currentLang === 'ar' ? '⚠️ يرجى إكمال البيانات' : '⚠️ Please complete your details');
        return;
    }
    
    const orderId = 'ORD-' + Math.floor(Math.random() * 1000000);
    const orderData = { ...details, orderId: orderId, userId: currentUser ? currentUser.uid : 'guest' };
    
    try {
        await db.collection('orders').add(orderData);
        showSuccessModal();
        cart = [];
        localStorage.removeItem('icloth_cart');
        updateCartUI();
    } catch (e) {
        console.error("Order failed:", e);
        showToast("Order failed – please contact support");
    }
}

function showSuccessModal() {
    const modal = document.getElementById('success-modal');
    if (modal) modal.classList.add('active');
}

function closeSuccessModal() {
    const modal = document.getElementById('success-modal');
    if (modal) modal.classList.remove('active');
    location.reload();
}

async function openMyOrdersModal() {
    const modal = document.getElementById('my-orders-modal');
    if (!modal) return;
    
    modal.classList.add('active');
    const loginSec = document.getElementById('orders-login-section');
    const listSec = document.getElementById('orders-list-section');
    
    if (!currentUser) {
        if(loginSec) loginSec.style.display = 'flex';
        if(listSec) listSec.style.display = 'none';
    } else {
        if(loginSec) loginSec.style.display = 'none';
        if(listSec) listSec.style.display = 'block';
        fetchUserOrders();
    }
}

async function fetchUserOrders() {
    const listEl = document.getElementById('my-orders-list');
    if (!listEl) return;
    
    listEl.innerHTML = '<div style="text-align: center; padding: 20px;">' + (currentLang === 'ar' ? 'جاري التحميل...' : 'Loading...') + '</div>';
    
    try {
        const snapshot = await db.collection('orders').where('userId', '==', currentUser.uid).get();
        const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        if (orders.length === 0) {
            listEl.innerHTML = '<div style="text-align: center; padding: 20px; font-weight: 900; opacity: 0.5;">' + (currentLang === 'ar' ? 'لا يوجد طلبات سابقة' : 'No previous orders') + '</div>';
            return;
        }
        
        listEl.innerHTML = orders.map(o => `
            <div class="order-item" style="padding: 15px; border-bottom: 1px solid rgba(255,255,255,0.05);">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div>
                        <strong style="font-size: 0.95rem; color: var(--text-main);">${o.orderId}</strong>
                        <p style="font-size: 0.75rem; color: var(--text-muted);">${new Date(o.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (e) {
        listEl.innerHTML = '<div style="text-align: center; padding: 20px;">' + (currentLang === 'ar' ? 'حدث خطأ' : 'Error loading orders') + '</div>';
    }
}

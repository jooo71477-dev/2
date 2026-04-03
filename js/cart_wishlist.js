// 🛒 iCloth - Cart & Wishlist System
function updateCartUI() {
    const list = document.getElementById('cart-items-list');
    const totalEl = document.getElementById('cart-total-price');
    const badge = document.querySelector('.cart-count');
    
    if (!list || !totalEl) return;
    if (badge) badge.innerText = cart.reduce((s, i) => s + i.quantity, 0);
    
    if (cart.length === 0) {
        list.innerHTML = `<p class="empty-msg">${translations[currentLang].cart_empty}</p>`;
        totalEl.innerText = `0 ${translations[currentLang].currency}`;
    } else {
        const subtotal = cart.reduce((s, i) => s + (i.price * i.quantity), 0);
        let finalTotal = subtotal;
        
        if (typeof appliedCoupon !== 'undefined' && appliedCoupon) {
            const discountAmount = Math.round(subtotal * (appliedCoupon.discount / 100));
            finalTotal = subtotal - discountAmount;
        }

        list.innerHTML = cart.map(i => {
                const name = (currentLang === 'ar' && i.name_ar) ? i.name_ar : translateText(i.name);
                return `
                <div class="cart-item">
                    <img src="${i.image}" alt="${name}">
                    <div class="cart-item-info">
                        <h4>${name}</h4>
                        <div class="cart-item-details">${i.size} | <span data-translate-cache="${i.color}">${translateText(i.color)}</span></div>
                        <div class="qty-control">
                            <button class="qty-btn" onclick="updateCartQuantity('${i.cartId}', 1)">+</button>
                            <span>${i.quantity}</span>
                            <button class="qty-btn" onclick="updateCartQuantity('${i.cartId}', -1)">−</button>
                        </div>
                    </div>
                    <div class="delete-btn" onclick="removeFromCart('${i.cartId}')"><i class="fas fa-trash-alt"></i></div>
                </div>
            `;
        }).join('');
        totalEl.innerText = `${finalTotal} ${translations[currentLang].currency}`;
    }
}

function updateCartQuantity(id, d) {
    const i = cart.find(x => x.cartId === id);
    if (i) { 
        i.quantity += d; 
        if (i.quantity <= 0) removeFromCart(id); 
        else { 
            updateCartUI(); 
            localStorage.setItem('icloth_cart', JSON.stringify(cart)); 
        } 
    }
}

function removeFromCart(id) { 
    cart = cart.filter(x => x.cartId !== id); 
    updateCartUI(); 
    localStorage.setItem('icloth_cart', JSON.stringify(cart)); 
}

function addToCartFromModal(size) {
    const p = selectedProductForSize;
    if (!p) return;
    const color = selectedColor;
    const cartId = `${p.id}-${size}-${color}`;

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
    
    showToast(currentLang === 'ar' ? '✅ تمت الإضافة للسلة' : '✅ Added to cart');
}

window.updateCartQuantity = updateCartQuantity;
window.removeFromCart = removeFromCart;
window.addToCartFromModal = addToCartFromModal;

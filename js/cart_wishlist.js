// 🛒 iCloth - Cart & Wishlist System
function updateCartUI() {
    const list = document.getElementById('cart-items-list');
    const totalEl = document.getElementById('cart-total-amount');
    const badge = document.getElementById('cart-badge');
    
    if (!list || !totalEl || !badge) return;
    
    list.innerHTML = '';
    let total = 0;
    
    cart.forEach((item, idx) => {
        total += item.price * (item.quantity || 1);
        const name = (currentLang === 'ar' && item.name_ar) ? item.name_ar : translateText(item.name);
        const img = item.image || 'images/placeholder.jpg';
        
        list.innerHTML += `
            <div class="cart-item">
                <img src="${img}" alt="${name}">
                <div class="cart-item-info">
                    <h4>${name}</h4>
                    <p>${item.size} | ${item.color}</p>
                    <div class="cart-item-price">${item.price} ${translations[currentLang].currency} x ${item.quantity}</div>
                </div>
                <button class="remove-item" onclick="removeFromCart(${idx})"><i class="fas fa-trash"></i></button>
            </div>
        `;
    });
    
    totalEl.innerText = `${total.toLocaleString()} ${translations[currentLang].currency}`;
    badge.innerText = cart.length;
    badge.style.display = cart.length > 0 ? 'flex' : 'none';
}

function addToBasket(pId, size, color) {
    const p = remoteProducts.find(x => x.id === pId);
    if (!p) return;
    
    const item = {
        id: p.id,
        name: p.name,
        name_ar: p.name_ar,
        price: p.price,
        size: size,
        color: color,
        image: (p.images && p.images.length > 0) ? p.images[0] : 'images/placeholder.jpg',
        quantity: 1
    };
    
    cart.push(item);
    localStorage.setItem('icloth_cart', JSON.stringify(cart));
    updateCartUI();
    showToast(currentLang === 'ar' ? '✅ تمت الإضافة!' : '✅ Added to cart!');
}

function removeFromCart(idx) {
    cart.splice(idx, 1);
    localStorage.setItem('icloth_cart', JSON.stringify(cart));
    updateCartUI();
}

function toggleWishlist(pId) {
    const idx = wishlist.indexOf(pId);
    if (idx === -1) {
        wishlist.push(pId);
        showToast(currentLang === 'ar' ? '❤ تمت الإضافة للمفضلة' : '❤ Added to favorites');
    } else {
        wishlist.splice(idx, 1);
    }
    localStorage.setItem('icloth_wishlist', JSON.stringify(wishlist));
    renderWishlist();
}

function renderWishlist() {
    const list = document.getElementById('wishlist-items');
    if (!list) return;
    list.innerHTML = '';
    // rendering logic...
}

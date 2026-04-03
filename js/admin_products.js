// 👕 iCloth Admin - Products Logic (Comprehensive)
async function loadProducts() {
    console.log("📡 Starting Real-time Product Listener...");
    return new Promise((resolve) => {
        db.collection('products').orderBy('sortOrder', 'asc').onSnapshot(snapshot => {
            products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            renderProducts();
            updateStats();
            resolve();
        });
    });
}

function renderProducts(data = products) {
    const list = document.getElementById('products-list');
    if (!list) return;
    
    let renderData = [...data];
    if (window.adminActiveProductFilterCategory && window.adminActiveProductFilterCategory !== 'all') {
        renderData = renderData.filter(p => p.category === window.adminActiveProductFilterCategory);
    }
    
    list.innerHTML = renderData.map(p => {
        const displayImg = p.colorVariants?.[0]?.thumbnail || p.thumbnail || p.image || '';
        return `
        <tr data-id="${p.id}">
            <td class="drag-handle"><i class="fas fa-bars"></i></td>
            <td><img src="${displayImg}" class="product-img" style="width:40px;"></td>
            <td>${p.name}</td>
            <td>${p.category || '---'}</td>
            <td>ج.م ${p.price}</td>
            <td>${p.stock || 0}</td>
            <td><span class="status-badge ${p.status === 'active' ? 'badge-success' : 'badge-danger'}">${p.status === 'active' ? 'متاح' : 'مخفي'}</span></td>
            <td>
                <button onclick="editProduct('${p.id}')">📝</button>
                <button onclick="deleteProduct('${p.id}')">🗑️</button>
            </td>
        </tr>
        `;
    }).join('');
}

function editProduct(id) {
    if (window.openProductModal) openProductModal(id);
}

async function deleteProduct(id) {
    if (!confirm("هل أنت متأكد؟")) return;
    try {
        await db.collection('products').doc(id).delete();
        showToast("✅ تم الحذف");
    } catch (e) {
        showToast("⚠️ خطأ");
    }
}

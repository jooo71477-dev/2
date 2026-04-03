// 📦 iCloth Admin - Orders Management
let orders = [];

async function loadOrders() {
    try {
        const snapshot = await db.collection('orders').orderBy('createdAt', 'desc').get();
        orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderOrders();
        updateStats();
    } catch (e) {
        console.error("Load orders error:", e);
    }
}

function renderOrders() {
    const list = document.getElementById('orders-list');
    if (!list) return;
    
    list.innerHTML = orders.map(o => `
        <tr>
            <td>${o.orderId}</td>
            <td>${o.customerName}</td>
            <td>${o.total} ج.م</td>
            <td><span class="status-badge ${getStatusClass(o.status)}">${getStatusLabel(o.status)}</span></td>
            <td>
                <button onclick="viewOrderDetails('${o.id}')"><i class="fas fa-eye"></i></button>
            </td>
        </tr>
    `).join('');
}

function viewOrderDetails(id) {
    const order = orders.find(x => x.id === id);
    if (!order) return;
    const modal = document.getElementById('order-details-modal');
    if (!modal) return;
    
    const body = document.getElementById('order-details-body');
    body.innerHTML = `
        <h3>الطلب: ${order.orderId}</h3>
        <p>العميل: ${order.customerName}</p>
        <p>التاريخ: ${order.createdAt?.toDate().toLocaleString() || '---'}</p>
        <hr>
        <h4>المنتجات:</h4>
        ${order.items.map(i => `<p>${i.name} - ${i.size} | ${i.color} (x${i.quantity})</p>`).join('')}
    `;
    modal.style.display = 'flex';
}

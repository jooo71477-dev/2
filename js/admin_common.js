// 🛠️ iCloth Admin - Common Utilities & UI
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

window.copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
        const btn = event.currentTarget;
        const originalIcon = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check" style="color:#4CAF50;"></i>';
        setTimeout(() => { btn.innerHTML = originalIcon; }, 2000);
    });
};

function getStatusClass(status) {
    switch (status) {
        case 'verifying': return 'badge-warning';
        case 'pending': return 'badge-info';
        case 'shipping': return 'badge-primary';
        case 'delivered': return 'badge-success';
        case 'cancelled': return 'badge-danger';
        default: return 'badge-info';
    }
}

function getStatusLabel(status) {
    switch (status) {
        case 'verifying': return 'جاري التأكد من إيصال الدفع';
        case 'pending': return 'جديد (تم التأكد)';
        case 'shipping': return 'جاري الشحن';
        case 'delivered': return 'تم التوصيل';
        case 'cancelled': return 'ملغي';
        default: return status;
    }
}

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    if (sidebar) sidebar.classList.toggle('active');
    if (overlay) overlay.classList.toggle('active');
}
window.toggleSidebar = toggleSidebar;

function togglePw(id, btn) {
    const input = document.getElementById(id);
    if (input.type === "password") {
        input.type = "text";
        btn.innerHTML = '<i class="fas fa-eye-slash"></i>';
    } else {
        input.type = "password";
        btn.innerHTML = '<i class="fas fa-eye"></i>';
    }
}
window.togglePw = togglePw;

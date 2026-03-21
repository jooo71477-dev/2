// 🚀 icloth ADMIN ENGINE - COMPREHENSIVE VERSION
const firebaseConfig = {
    apiKey: "AIzaSyByPZP1qo0sQN26xTwzpT0vnw_BTguXvSI",
    authDomain: "ic12-e6ad7.firebaseapp.com",
    projectId: "ic12-e6ad7",
    storageBucket: "ic12-e6ad7.firebasestorage.app",
    messagingSenderId: "849964207533",
    appId: "1:849964207533:web:8a6669e5c453ca08ba2524",
    measurementId: "G-H7S7W0CB7Q"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();
const auth = firebase.auth();

// Config & Lists (Will be moved below for cleaner top section later)
const ADMIN_EMAIL = "jooo71477@gmail.com";

// 📦 BOSTA SHIPPING CONFIGURATION (SECURED VIA GOOGLE APPS SCRIPT - FREE & NO CARD)
const BOSTA_PROXY_URL = "https://script.google.com/macros/s/AKfycbyxMfJGhogtFyK1f5kkYd6cY_cX0OWxvGl-UIVpqJxU16U8KxTlKVuyZm3hMyws7SmmaA/exec";

const bostaCityMap = {
    "القاهرة": "Cairo",
    "الجيزة": "Giza",
    "الإسكندرية": "Alexandria",
    "الدقهلية": "Dakahlia",
    "البحر الأحمر": "Red Sea",
    "البحيرة": "Beheira",
    "الفيوم": "Faiyum",
    "الغربية": "Gharbia",
    "الإسماعيلية": "Ismailia",
    "المنوفية": "Monufia",
    "المنيا": "Minya",
    "القليوبية": "Qalyubia",
    "الوادي الجديد": "New Valley",
    "السويس": "Suez",
    "الشرقية": "Sharqia",
    "دمياط": "Damietta",
    "بورسعيد": "Port Said",
    "جنوب سيناء": "South Sinai",
    "كفر الشيخ": "Kafr el-Sheikh",
    "مطروح": "Matrouh",
    "الأقصر": "Luxor",
    "قنا": "Qena",
    "شمال سيناء": "North Sinai",
    "سوهاج": "Sohag",
    "بني سويف": "Beni Suef",
    "أسيوط": "Asyut",
    "أسوان": "Aswan"
};

const governorates = [
    "القاهرة", "الجيزة", "الإسكندرية", "الدقهلية", "البحر الأحمر", "البحيرة", "الفيوم", "الغربية", "الإسماعيلية", "المنوفية", "المنيا", "القليوبية", "الوادي الجديد", "السويس", "الشرقية", "دمياط", "بورسعيد", "جنوب سيناء", "كفر الشيخ", "مطروح", "الأقصر", "قنا", "شمال سيناء", "سوهاج", "بني سويف", "أسيوط", "أسوان"
];
const commonColors = [
    { name: "أسود", color: "#000000" },
    { name: "أبيض", color: "#FFFFFF" },
    { name: "أوف وايت", color: "#F5F5F5" },
    { name: "سكري", color: "#FFFDD0" },
    { name: "كريمي", color: "#FFF8DC" },
    { name: "عاجي", color: "#FFFFF0" },
    { name: "شامبين", color: "#F7E7CE" },
    { name: "لؤلؤي", color: "#EAE0C8" },
    { name: "رمادي", color: "#808080" },
    { name: "رصاصي", color: "#A9A9A9" },
    { name: "فحمي", color: "#36454F" },
    { name: "رصاصي فاتح", color: "#D3D3D3" },
    { name: "رصاصي غامق", color: "#696969" },
    { name: "بني", color: "#5C4033" },
    { name: "هافان", color: "#8B4513" },
    { name: "جملي", color: "#C19A6B" },
    { name: "كافيه", color: "#D2B48C" },
    { name: "طحيني", color: "#E3D5B8" },
    { name: "بيج", color: "#F5F5DC" },
    { name: "رملي", color: "#C2B280" },
    { name: "خردلي", color: "#E1AD01" },
    { name: "كحلي", color: "#000080" },
    { name: "أزرق", color: "#0000FF" },
    { name: "أزرق ملكي", color: "#4169E1" },
    { name: "سماوي", color: "#87CEEB" },
    { name: "لبني", color: "#ADD8E6" },
    { name: "تركواز", color: "#40E0D0" },
    { name: "بترولي", color: "#005F6B" },
    { name: "جنزاري", color: "#2F4F4F" },
    { name: "أزرق فاتح", color: "#B0E0E6" },
    { name: "أزرق غامق", color: "#00008B" },
    { name: "أخضر", color: "#008000" },
    { name: "زيتي", color: "#4B5320" },
    { name: "زيتوني", color: "#808000" },
    { name: "بستاج", color: "#DAF7A6" },
    { name: "مينت جرين", color: "#98FF98" },
    { name: "فسفوري", color: "#00FF00" },
    { name: "أخضر فاتح", color: "#90EE90" },
    { name: "أخضر غامق", color: "#006400" },
    { name: "أخضر نعناعي", color: "#AAF0D1" },
    { name: "أخضر تفاحي", color: "#8DB600" },
    { name: "أحمر", color: "#FF0000" },
    { name: "نبيتي", color: "#800000" },
    { name: "طوبي", color: "#B22222" },
    { name: "خمري", color: "#673147" },
    { name: "برتقالي", color: "#FFA500" },
    { name: "سيمون", color: "#FFA07A" },
    { name: "مشمشي", color: "#FBCEB1" },
    { name: "خوخي", color: "#FFDAB9" },
    { name: "وردي", color: "#FFC0CB" },
    { name: "بينك", color: "#FF69B4" },
    { name: "فوشيا", color: "#FF00FF" },
    { name: "موف", color: "#E0B0FF" },
    { name: "بنفسجي", color: "#800080" },
    { name: "ليلكي", color: "#C8A2C8" },
    { name: "أرجواني", color: "#9932CC" },
    { name: "لافندر", color: "#E6E6FA" },
    { name: "أصفر", color: "#FFFF00" },
    { name: "مستردة", color: "#FFDB58" },
    { name: "ذهبي", color: "#D4AF37" },
    { name: "فضي", color: "#C0C0C0" },
    { name: "فيروزي", color: "#00CED1" },
    { name: "مرجاني", color: "#FF7F50" },
    { name: "بصلي", color: "#FF8C69" },
    { name: "عسلي", color: "#FFBF00" },
    { name: "ليموني", color: "#FFF44F" },
    { name: "تلجي", color: "#F0F8FF" },
    { name: "برونزي", color: "#CD7F32" },
    { name: "نحاسي", color: "#B87333" },
    { name: "كاكي", color: "#F0E68C" },
    { name: "مارون", color: "#800000" },
    { name: "سيينا", color: "#A0522D" },
    { name: "ياقوتي", color: "#E0115F" },
    { name: "زمردي", color: "#50C878" },
    { name: "نيلي", color: "#4B0082" },
    { name: "بني محروق", color: "#3D2B1F" },
    { name: "بترولي فاتح", color: "#008B8B" },
    { name: "أزرق بترولي", color: "#005F6B" },
    { name: "رمادي أزرق", color: "#607D8B" },
    { name: "لبني فاتح", color: "#E0F7FA" },
    { name: "ذهبي وردي", color: "#B76E79" },
    { name: "فضة معتقة", color: "#8E8E8E" },
    { name: "أخضر عسكري", color: "#4B5320" },
    { name: "برتقالي محروق", color: "#CC5500" },
    { name: "أصفر كناري", color: "#FFEF00" },
    { name: "أزرق كبالت", color: "#0047AB" },
    { name: "نيلي غامق", color: "#000080" },
    { name: "بنفسجي باهت", color: "#D8BFD8" },
    { name: "أحمر مرجاني", color: "#FF4040" },
    { name: "أخضر بحري", color: "#2E8B57" },
    { name: "رصاصي مزرق", color: "#708090" },
    { name: "بني فاتح", color: "#D2B48C" },
    { name: "بني غامق", color: "#3E2723" },
    { name: "ورد جوري", color: "#E91E63" },
    { name: "سماوي صافي", color: "#00BFFF" },
    { name: "أخضر نيون", color: "#39FF14" },
    { name: "أصفر نيون", color: "#FFFF33" },
    { name: "برتقالي نيون", color: "#FF5F1F" },
    { name: "بينك نيون", color: "#FF44CC" },
    { name: "برقوقي", color: "#8E4585" },
    { name: "توتي", color: "#8B0000" }
];



// State
let products = [];
let orders = [];
let users = [];
let currentAdmin = null;

// Auth System
const ADMIN_EMAILS = ["jooo714777@gmail.com", "jooo71477@gmail.com", "products@icloth-fashion-store.com"];

auth.onAuthStateChanged(async (user) => {
    const loginOverlay = document.getElementById('login-overlay');
    const mainContent = document.querySelector('.main-content');
    const sidebar = document.querySelector('.sidebar');
    const emailDisplay = document.getElementById('admin-email-display');

    if (user) {
        if (ADMIN_EMAILS.includes(user.email)) {
            console.log("✅ Admin verified:", user.email);
            currentAdmin = user;
            
            // Determine Role
            const role = user.email === "products@icloth-fashion-store.com" ? "products" : "all";
            window.adminRole = role; 

            // Add role-based class to body for CSS hiding
            document.body.classList.remove('role-all', 'role-products');
            document.body.classList.add('role-' + role);

            if (loginOverlay) loginOverlay.style.display = 'none';
            if (mainContent) mainContent.style.display = 'block';
            if (sidebar) sidebar.style.display = 'flex';
            if (emailDisplay) emailDisplay.innerText = user.email;
            
            // Re-initialize 
            if (products.length === 0) {
                initDashboard(role);
            }

            // FORCE VIEW FOR PRODUCTS ROLE
            if (role === 'products') {
                showSection('products');
                document.querySelectorAll('.nav-links a').forEach(a => {
                    a.classList.toggle('active', a.getAttribute('href') === '#products');
                });
            }
        } else {
            console.warn("🚫 Unauthorized access attempt:", user.email);
            alert("عذراً، هذا الحساب ليس له صلاحيات أدمن ⛔");
            await auth.signOut();
        }
    } else {
        document.body.classList.remove('role-all', 'role-products');
        if (loginOverlay) loginOverlay.style.display = 'flex';
        if (mainContent) mainContent.style.display = 'none';
        if (sidebar) sidebar.style.display = 'none';
    }
});

function applyRoleRestrictions(role) {
    const navLinks = document.querySelectorAll('.nav-links a');
    const allowedForProducts = ['#products', '#categories', '#inventory'];

    navLinks.forEach(link => {
        const target = link.getAttribute('href');
        if (role === 'products') {
            if (!allowedForProducts.includes(target)) {
                link.parentElement.style.display = 'none';
            }
        } else {
            link.parentElement.style.display = 'block';
        }
    });

    // Also hide stats in overview if he somehow gets there
    if (role === 'products') {
        const statsToHide = ['stat-sales', 'stat-orders', 'stat-users'];
        statsToHide.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.closest('.stat-card').style.display = 'none';
        });
        const overviewGrid = document.querySelector('.overview-grid');
        if (overviewGrid) overviewGrid.style.display = 'none';
    }
}

// Login Form
document.getElementById('login-form').onsubmit = async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const pass = document.getElementById('login-password').value;
    const errorEl = document.getElementById('login-error');
    const submitBtn = e.target.querySelector('button');

    submitBtn.disabled = true;
    submitBtn.innerText = "جاري التحقق من Firebase...";

    try {
        await auth.signInWithEmailAndPassword(email, pass);
        console.log("✅ Firebase Auth Success");
    } catch (err) {
        console.error("❌ Firebase Error:", err.code);
        let msg = "خطأ في الدخول";
        if (err.code === 'auth/wrong-password') msg = "كلمة المرور غير صحيحة ❌";
        else if (err.code === 'auth/user-not-found') msg = "البريد الإلكتروني غير مسجل ❌";
        else msg = "خطأ: " + err.message;
        
        errorEl.innerText = msg;
        errorEl.style.display = 'block';
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = "دخول";
    }
};



window.loginWithGoogle = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    const submitBtn = document.querySelector('#login-form button');
    
    try {
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerText = "جاري التحقق عبر جوجل...";
        }
        await auth.signInWithPopup(provider);
        console.log("✅ Google Auth Success");
    } catch (err) {
        console.error("❌ Google Auth Error:", err);
        alert("خطأ في الدخول عبر جوجل: " + err.message);
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerText = "دخول";
        }
    }
};

window.forgotPassword = async () => {
    const email = document.getElementById('login-email').value || ADMIN_EMAIL;
    if (!email) {
        alert("يرجى إدخال البريد الإلكتروني أولاً");
        return;
    }

    try {
        await auth.sendPasswordResetEmail(email);
        alert("تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني بنجاح! ✅");
    } catch (err) {
        alert("خطأ: " + err.message);
    }
};

function logout() {
    auth.signOut();
    location.reload();
}

// Navigation (Sidebar + Mobile Tabs)
function handleNavClick(e, link) {
    e.preventDefault();
    const target = link.getAttribute('href').substring(1);
    showSection(target);

    // Sync All Navigation UI
    document.querySelectorAll('.nav-links a, .mob-nav-item').forEach(l => {
        if (l.getAttribute('href') === `#${target}`) {
            l.classList.add('active');
        } else {
            l.classList.remove('active');
        }
    });

    const pageTitle = document.getElementById('page-title');
    if (pageTitle) pageTitle.innerText = link.innerText.trim();

    if (window.innerWidth < 992) {
        // Close sidebar if it was a sidebar click
        if (link.closest('.nav-links')) toggleSidebar();

        // Ensure active mobile tab is visible
        const activeTab = document.querySelector(`.mob-nav-item[href="#${target}"]`);
        if (activeTab) activeTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
}

document.querySelectorAll('.nav-links a, .mob-nav-item').forEach(link => {
    link.onclick = (e) => handleNavClick(e, link);
});

function showSection(id) {
    if (window.adminRole === 'products') {
        const forbidden = ['overview', 'orders', 'users', 'analytics', 'coupons', 'shipping', 'announcements', 'cms', 'settings'];
        if (forbidden.includes(id)) {
            console.warn("🚫 Access Denied to Section:", id);
            return;
        }
    }

    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    const section = document.getElementById(id);
    if (section) {
        section.classList.add('active');
    } else {
        document.getElementById('placeholder-section').classList.add('active');
        document.getElementById('placeholder-title').innerText = id;
    }
}

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    if (sidebar) sidebar.classList.toggle('active');
    if (overlay) overlay.classList.toggle('active');
}
window.toggleSidebar = toggleSidebar;

async function uploadSizeChart(input) {
    const file = input.files[0];
    if (!file) return;

    const label = input.parentElement;
    const originalHTML = label.innerHTML;
    label.style.pointerEvents = 'none';
    label.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الرفع...';

    try {
        const url = await uploadToCloudinary(file);
        document.getElementById('p-size-chart').value = url;
        const preview = document.getElementById('p-size-chart-preview');
        if (preview) {
            preview.src = url;
            preview.style.display = 'block';
        }
        alert("تم رفع جدول المقاسات بنجاح! ✅");
    } catch (err) {
        console.error("Upload error:", err);
        alert("خطأ في الرفع: " + err.message);
    } finally {
        label.style.pointerEvents = 'all';
        label.innerHTML = originalHTML;
    }
}
window.uploadSizeChart = uploadSizeChart;
async function initDashboard(role = 'all') {
    console.log("🛠️ Initializing Dashboard for role:", role);
    try {
        const tasks = [loadProducts(), loadCategories()];
        if (role === 'all') {
            tasks.push(loadOrders());
            tasks.push(loadUsers());
        }
        
        await Promise.all(tasks);

        if (role === 'all') {
            updateStats();
            renderRecentOrders();
            renderTopSelling();
        } else {
            // Limited update for product admins
            const statProductsEl = document.getElementById('stat-products');
            if (statProductsEl) statProductsEl.innerText = products.length;
        }
        console.log("✅ Dashboard ready!");
    } catch (err) {
        console.error("❌ Dashboard Init Error:", err);
    }
}

// Data Loaders
async function loadProducts() {
    const snapshot = await db.collection('products').get();
    products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    renderProducts();
}

async function loadOrders() {
    const snapshot = await db.collection('orders').orderBy('createdAt', 'desc').get();
    orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    renderOrders();
}

async function loadUsers() {
    try {
        const snapshot = await db.collection('users').get();
        users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
        const uniqueEmails = [...new Set(orders.map(o => o.userEmail).filter(e => e !== 'زائر'))];
        users = uniqueEmails.map(email => ({ id: email, email, name: email.split('@')[0], ordersCount: orders.filter(o => o.userEmail === email).length }));
    }
}

// UI Renderers
function updateStats() {
    document.getElementById('stat-products').innerText = products.length;
    document.getElementById('stat-orders').innerText = orders.length;
    const totalSales = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    document.getElementById('stat-sales').innerText = `${totalSales.toLocaleString()} ج.م`;
}

function renderProducts(data = products) {
    const list = document.getElementById('products-list');
    if (!list) return;
    console.log("📊 Rendering Admin Products:", data.length);
    list.innerHTML = data.map(p => {
        // Log individual product price to console for debugging
        if (p.oldPrice) console.log(`🔍 Product [${p.name}] has oldPrice: ${p.oldPrice}`);

        // استخدام thumbnail صغير للعرض في الجدول بدل الصورة الكاملة
        const displayImg = p.colorVariants?.[0]?.thumbnail
            || p.thumbnail
            || (p.image && p.image.length < 50000 ? p.image : '')
            || '';
        return `
        <tr>
            <td>${displayImg ? `<img src="${displayImg}" class="product-img" onerror="this.style.display='none'">` : '<div style="width:40px;height:40px;background:rgba(255,255,255,0.05);border-radius:8px;display:flex;align-items:center;justify-content:center;"><i class="fas fa-image" style="opacity:0.3;"></i></div>'}</td>
            <td>
                <div style="display:flex; align-items:center; gap:5px;">
                    ${p.name}
                    ${p.isBestSeller ? '<i class="fas fa-fire" style="color:#ff4d4d;" title="Best Seller"></i>' : ''}
                </div>
                <div style="display:flex; align-items:center; gap:8px; margin-top:4px;">
                    <small style="color:var(--primary); opacity:0.7;">كود: ${p.code || '---'}</small>
                    ${p.code ? `<button onclick="copyToClipboard('${p.code}')" style="background:none; border:none; color:var(--primary); cursor:pointer; font-size:0.8rem; padding:2px;" title="نسخ الكود"><i class="far fa-copy"></i></button>` : ''}
                </div>
            </td>
            <td>
                ${(() => {
                    const getPath = (id) => {
                        const cat = categories.find(c => c.id === id);
                        if (!cat) return id || '---';
                        if (cat.parentId) {
                            return getPath(cat.parentId) + " > " + cat.name;
                        }
                        return cat.name;
                    };
                    return getPath(p.category);
                })()}
            </td>
            <td>
                <div class="price-container-admin" style="display: flex; flex-direction: column; gap: 2px;">
                    <div style="font-weight:900; color: #fff;">ج.م ${p.price}</div>
                    ${(p.priceBefore || p.oldPrice) ? `<div style="text-decoration:line-through; font-size:0.75rem; opacity:0.5; color: #ff4d4d;">ج.م ${p.priceBefore || p.oldPrice}</div>` : ''}
                </div>
            </td>
            <td>${p.stock || 0}</td>
            <td><span class="status-badge ${p.status === 'active' ? 'badge-success' : 'badge-danger'}">${p.status === 'active' ? 'متاح' : 'مخفي'}</span></td>
            <td>
                <div style="display:flex; gap:10px;">
                    <button onclick="editProduct('${p.id}')" style="color:var(--secondary); background:none; border:none; cursor:pointer;"><i class="fas fa-edit"></i></button>
                    <button onclick="deleteProduct('${p.id}')" style="color:var(--danger); background:none; border:none; cursor:pointer;"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        </tr>
    `;
    }).join('');
}

// Utility: Copy to Clipboard
window.copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
        // Simple toast-like feedback
        const btn = event.currentTarget;
        const originalIcon = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check" style="color:#4CAF50;"></i>';
        setTimeout(() => { btn.innerHTML = originalIcon; }, 2000);
    });
};

// Merged into the main renderOrders function below to avoid duplication

// Order detail modal and rendering functions have been moved to the Order Management section below to maintain clean code and avoid conflicts.

function getStatusClass(status) {
    switch (status) {
        case 'verifying': return 'badge-warning'; // لون أصفر للتنبيه
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

function renderRecentOrders() {
    const list = document.querySelector('#recent-orders-table tbody');
    if (!list) return;
    list.innerHTML = orders.slice(0, 5).map(o => `
        <tr>
            <td>${o.customerName}</td>
            <td>${o.createdAt ? o.createdAt.toDate().toLocaleDateString('ar-EG') : 'اليوم'}</td>
            <td>${o.total} ج.م</td>
            <td><span class="status-badge ${getStatusClass(o.status)}">${getStatusLabel(o.status)}</span></td>
        </tr>
    `).join('');
}

function renderTopSelling() {
    const list = document.getElementById('top-products-list');
    if (!list) return;
    // Simple logic: most appearing in orders
    const counts = {};
    orders.forEach(o => {
        if (o.items) {
            o.items.forEach(i => {
                counts[i.name] = (counts[i.name] || 0) + i.quantity;
            });
        }
    });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);
    list.innerHTML = sorted.map(([name, qty]) => `
        <div style="display:flex; justify-content:space-between; margin-bottom:15px; background:rgba(255,255,255,0.02); padding:10px; border-radius:10px;">
            <span>${name}</span>
            <span style="color:var(--primary); font-weight:bold;">${qty} مبيعاً</span>
        </div>
    `).join('');
}

// Product Management
function openProductModal(id = null) {
    const modal = document.getElementById('product-modal');
    const form = document.getElementById('product-form');
    const title = document.getElementById('modal-title');

    if (id) {
        const p = products.find(x => x.id === id);
        document.getElementById('p-id').value = p.id;
        document.getElementById('p-name').value = p.name;
        document.getElementById('p-category').value = p.category;
        document.getElementById('p-image').value = p.image || '';
        if (p.image) {
            document.getElementById('p-image-preview').src = p.image;
            document.getElementById('p-image-preview').style.display = 'block';
        } else {
            document.getElementById('p-image-preview').style.display = 'none';
        }
        document.getElementById('p-status').value = p.status || 'active';
        document.getElementById('p-desc').value = p.description || '';
        document.getElementById('p-discount').value = p.discount || 0;
        document.getElementById('p-code').value = p.code || '';
        document.getElementById('p-price').value = p.price || '';
        document.getElementById('p-price-before').value = p.priceBefore || p.oldPrice || '';
        if (document.getElementById('p-badge')) document.getElementById('p-badge').value = p.badge || '';

        // --- Best Seller ---
        document.getElementById('p-best-seller').checked = !!p.isBestSeller;

        // --- Size Chart ---
        document.getElementById('p-size-chart').value = p.sizeChartUrl || '';
        if (p.sizeChartUrl) {
            document.getElementById('p-size-chart-preview').src = p.sizeChartUrl;
            document.getElementById('p-size-chart-preview').style.display = 'block';
        } else {
            document.getElementById('p-size-chart-preview').style.display = 'none';
        }

        // Render Variants
        const vContainer = document.getElementById('variants-container');
        vContainer.innerHTML = '';
        (p.colorVariants || []).forEach((v) => {
            const div = document.createElement('div');
            div.className = 'variant-item';
            div.style = 'background: rgba(255,255,255,0.03); padding: 15px; border-radius: 12px; margin-bottom: 12px; border: 1px solid var(--border);';
            div.innerHTML = buildVariantHTML(
                v.name || '',
                v.images ? v.images.join('\n') : (v.image || ''),
                v.sizes ? v.sizes.join(', ') : '',
                v.stock !== undefined ? v.stock : (p.stock || 0),
                v.thumbnail || ''
            );
            vContainer.appendChild(div);
            updateVariantPreviews(div);
        });
        updateVariantHint();

        title.innerText = "تعديل منتج";
    } else {
        form.reset();
        document.getElementById('p-id').value = "";
        document.getElementById('p-image').value = "";
        document.getElementById('p-image-preview').style.display = "none";
        document.getElementById('p-code').value = "";
        document.getElementById('p-price-before').value = "";
        document.getElementById('p-price').value = "";
        if (document.getElementById('p-badge')) document.getElementById('p-badge').value = "";
        document.getElementById('p-best-seller').checked = false;
        document.getElementById('p-size-chart').value = "";
        document.getElementById('p-size-chart-preview').style.display = "none";
        document.getElementById('variants-container').innerHTML = "";
        updateVariantHint();
        title.innerText = "إضافة منتج جديد";
    }
    modal.style.display = 'flex';
}

function closeProductModal() {
    document.getElementById('product-modal').style.display = 'none';
}

document.getElementById('product-form').onsubmit = async (e) => {
    e.preventDefault();
    const id = document.getElementById('p-id').value;
    const saveBtn = document.getElementById('save-product-btn');
    saveBtn.disabled = true;
    saveBtn.innerText = "جاري الحفظ...";

    // Collect Variants
    const variants = [];
    document.querySelectorAll('.variant-item').forEach(item => {
        const images = item.querySelector('.v-image').value.split('\n').map(s => s.trim()).filter(Boolean);
        const thumbnail = item.querySelector('.v-thumbnail')?.value || (images.length > 0 ? images[0] : '');
        variants.push({
            name: item.querySelector('.v-name').value,
            images: images,
            thumbnail: thumbnail,
            sizes: item.querySelector('.v-sizes').value.split(',').map(s => s.trim()).filter(s => s !== ""),
            stock: Number(item.querySelector('.v-stock').value) || 0
        });
    });

    const priceVal = Number(document.getElementById('p-price').value);
    const priceBeforeVal = document.getElementById('p-price-before').value;
    const finalPriceBefore = (priceBeforeVal && Number(priceBeforeVal) > 0) ? Number(priceBeforeVal) : null;

    // Auto-set main image (thumbnail) from first variant for backward compatibility
    const firstV = variants[0];
    const explicitImage = document.getElementById('p-image').value;
    const autoImage = explicitImage ? explicitImage : (firstV && firstV.thumbnail
        ? firstV.thumbnail
        : (firstV && firstV.images && firstV.images.length > 0
            ? firstV.images[0]
            : ''));

    // حساب إجمالي المخزون من مجموع كميات كل الألوان تلقائياً
    const totalStock = variants.reduce((sum, v) => sum + (v.stock || 0), 0);
    // جمع كل المقاسات الفريدة من كل الألوان
    const allSizes = [...new Set(variants.flatMap(v => v.sizes || []))];

    const data = {
        name: document.getElementById('p-name').value,
        price: Number(document.getElementById('p-price').value),
        category: document.getElementById('p-category').value,
        parentCategory: document.getElementById('p-category').value,
        stock: totalStock,
        sizes: allSizes,
        image: autoImage,
        status: document.getElementById('p-status').value,
        description: document.getElementById('p-desc').value.trim(),
        discount: Number(document.getElementById('p-discount').value) || 0,
        code: document.getElementById('p-code').value.trim(),
        priceBefore: finalPriceBefore,
        oldPrice: finalPriceBefore, // Backup for old code
        badge: document.getElementById('p-badge') ? document.getElementById('p-badge').value : '',
        explicitMainImage: !!document.getElementById('p-image').value,
        colorVariants: variants,
        isBestSeller: document.getElementById('p-best-seller').checked,
        sizeChartUrl: document.getElementById('p-size-chart').value,
        active: true, // Ensure visibility on main site
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    console.log("💾 Saving Product Data:", data);

    try {
        if (id) {
            console.log(`🔄 Updating product: ${id}`);
            await db.collection('products').doc(id).update(data);
        } else {
            console.log("➕ Adding new product");
            data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
            await db.collection('products').add(data);
        }
        console.log("✅ Save successful!");
        closeProductModal();
        loadProducts();
        alert("تم الحفظ بنجاح!");
    } catch (err) {
        alert("خطأ أثناء الحفظ: " + err.message);
    } finally {
        saveBtn.disabled = false;
        saveBtn.innerText = "حفظ المنتج";
    }
};

window.addVariantField = () => {
    const container = document.getElementById('variants-container');
    const div = document.createElement('div');
    div.className = "variant-item";
    div.style = "background: rgba(255,255,255,0.03); padding: 15px; border-radius: 12px; border: 1px solid var(--border);";
    // Pre-fill with standard sizes: M, L, XL, XXL, 36, 38, 40, 42
    div.innerHTML = buildVariantHTML('', '', 'M, L, XL, XXL, 36, 38, 40, 42', 0);
    container.appendChild(div);
    updateVariantPreviews(div);
    updateVariantHint();
};

function updateVariantHint() {
    const hint = document.getElementById('no-variants-hint');
    const container = document.getElementById('variants-container');
    if (!hint || !container) return;
    hint.style.display = container.children.length === 0 ? 'block' : 'none';
}

window.setQuickSizes = (btn, value) => {
    const parent = btn.closest('.variant-item');
    const input = parent.querySelector('.v-sizes');
    if (input) input.value = value;
};
window.setQuickColor = (el, name) => {
    const parent = el.closest('.variant-item');
    const input = parent.querySelector('.v-name');
    if (input) input.value = name;

    // Hide the picker
    const picker = el.closest('.color-picker-grid');
    if (picker) picker.style.display = 'none';
};

window.toggleColorPicker = (btn) => {
    const parent = btn.closest('.form-group');
    const picker = parent.querySelector('.color-picker-grid');
    if (picker) {
        const isVisible = picker.style.display === 'grid';
        // Close all other pickers first
        document.querySelectorAll('.color-picker-grid').forEach(p => p.style.display = 'none');
        picker.style.display = isVisible ? 'none' : 'grid';
    }
};


function buildVariantHTML(name, images, sizes, stock, thumbnail) {
    const colorOptionsUI = commonColors.map(c => `
        <div onclick="setQuickColor(this, '${c.name}')" 
             title="${c.name}" 
             style="width:28px; height:28px; background:${c.color}; border-radius:6px; cursor:pointer; border:2px solid rgba(255,255,255,0.1); transition:0.2s;"
             onmouseover="this.style.transform='scale(1.2)'; this.style.borderColor='var(--primary)'" 
             onmouseout="this.style.transform='scale(1)'; this.style.borderColor='rgba(255,255,255,0.1)'">
        </div>
    `).join('');

    const colorDatalist = `
        <datalist id="color-suggestions">
            ${commonColors.map(c => `<option value="${c.name}">`).join('')}
        </datalist>
    `;

    return `
        <div class="form-grid">
            <div class="form-group" style="position:relative;">
                <label>اسم اللون (مثلاً: أسود)</label>
                <div style="display:flex; gap:8px;">
                    <input type="text" class="v-name" value="${name}" placeholder="أسود، أزرق، أحمر..." required list="color-suggestions">
                    ${colorDatalist}
                    <button type="button" class="btn-mini" onclick="toggleColorPicker(this)" style="padding:0 12px; height:42px; display:flex; align-items:center; justify-content:center; background:rgba(212,175,55,0.1); border-color:var(--primary); color:var(--primary);">
                        <i class="fas fa-palette"></i>
                    </button>
                </div>
                <!-- Color Picker Popover -->
                <div class="color-picker-grid" style="display:none; position:absolute; top:calc(100% + 5px); right:0; z-index:1000; background:#111; border:1px solid var(--border); border-radius:12px; padding:12px; grid-template-columns: repeat(6, 1fr); gap:8px; box-shadow:0 10px 30px rgba(0,0,0,0.8); width:230px;">
                    <div style="grid-column: 1 / -1; font-size: 0.75rem; color: var(--text-dim); margin-bottom: 5px; border-bottom: 1px solid var(--border); padding-bottom: 5px;">اختر لوناً:</div>
                    ${colorOptionsUI}عاوز
                </div>
            </div>
            <div class="form-group">
                <label>المقاسات (خاصة بهذا اللون)</label>
                <input type="text" class="v-sizes" value="${sizes}" placeholder="M, L, XL">
                <div style="display:flex; gap:6px; margin-top:5px; flex-wrap:wrap;">
                    <button type="button" class="btn-mini" onclick="setQuickSizes(this, 'M, L, XL, XXL, 3XL')"><i class="fas fa-font"></i> حروف</button>
                    <button type="button" class="btn-mini" onclick="setQuickSizes(this, '36, 38, 40, 42, 44')"><i class="fas fa-hashtag"></i> أرقام</button>
                    <button type="button" class="btn-mini" onclick="setQuickSizes(this, '')" style="color:var(--danger); border-color:rgba(244,67,54,0.3); background:rgba(244,67,54,0.1);"><i class="fas fa-eraser"></i> مسح</button>
                </div>
            </div>
            <div class="form-group">
                <label>الكمية (خاصة بهذا اللون)</label>
                <input type="number" class="v-stock" value="${stock}">
            </div>
        </div>
        <input type="hidden" class="v-thumbnail" value="${thumbnail || ''}">
        <div class="form-group" style="margin-top:10px;">
            <label><i class="fas fa-images" style="color:var(--primary);"></i> صور هذا اللون (يمكن رفع أكثر من صورة)</label>
            <textarea class="v-image" rows="2" placeholder="روابط الصور (مفصولة بسطر جديد) - أو ارفع من الزر" style="font-size:0.75rem;direction:ltr;">${images}</textarea>
            <div style="display:flex; gap:8px; margin-top:8px; flex-wrap:wrap; align-items:center;">
                <label class="btn-primary" style="padding:8px 14px; cursor:pointer; font-size:0.82rem; gap:6px; display:flex; align-items:center;">
                    <i class="fas fa-upload"></i> رفع صورة
                    <input type="file" hidden accept="image/*" multiple onchange="uploadVariantImages(this)">
                </label>
                <button type="button" onclick="clearVariantImages(this)" style="padding:8px 14px; background:rgba(244,67,54,0.1); border:1px solid rgba(244,67,54,0.3); color:#f44336; border-radius:10px; cursor:pointer; font-size:0.82rem;">
                    <i class="fas fa-trash"></i> مسح الصور
                </button>
                <span style="font-size:0.75rem; color:var(--text-dim); opacity:0.7;">⚡ الصور تُضغط تلقائياً لتوفير المساحة</span>
            </div>
            <div class="variant-img-preview" style="display:flex; gap:8px; flex-wrap:wrap; margin-top:10px;"></div>
        </div>
        <button type="button" onclick="this.closest('.variant-item').remove()" style="margin-top:12px; color:var(--danger); background:none; border:none; cursor:pointer; font-size:0.85rem;"><i class="fas fa-times"></i> حذف هذا اللون</button>
    `;
}


// 🚀 Cloudinary Configuration - Double Check your Cloud Name in Dashboard
const CLOUDINARY_CLOUD_NAME = 'dprrwiqni'.trim();
const CLOUDINARY_UPLOAD_PRESET = 'product_upload'.trim();

// Helper to convert Base64 to Blob (Cloudinary loves Blobs)
function base64ToBlob(base64) {
    const byteString = atob(base64.split(',')[1]);
    const mimeString = base64.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
}

const uploadToCloudinary = async (file) => {
    // 💡 Fix: The Cloud Name is 'dprrwlqni' (letter 'l' before 'q')
    const cloudName = 'dprrwlqni';
    const uploadPreset = 'product_upload';

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    console.log(`📡 Corrected Connection: ${cloudName} | Path: /image/upload`);

    try {
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            { method: 'POST', body: formData }
        );

        const data = await response.json();

        if (data.secure_url) {
            console.log("✅ Success! Image Link:", data.secure_url);
            return data.secure_url;
        }

        console.error("❌ Cloudinary Error Detail:", data);
        throw new Error(data.error?.message || 'Unknown Error');
    } catch (error) {
        console.error("❌ Cloudinary Exception:", error);
        throw error;
    }
};

async function uploadVariantImages(input) {
    const files = Array.from(input.files);
    if (!files.length) return;

    const variantItem = input.closest('.variant-item');
    const textarea = variantItem.querySelector('.v-image');
    const thumbInput = variantItem.querySelector('.v-thumbnail');
    const uploadBtn = input.parentElement;
    const originalHTML = uploadBtn.innerHTML;
    uploadBtn.style.pointerEvents = 'none';
    uploadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الرفع للسحابة...';

    try {
        const existing = textarea.value.split('\n').map(s => s.trim()).filter(Boolean);
        const newUrls = [];

        for (const file of files) {
            const url = await uploadToCloudinary(file);
            newUrls.push(url);
        }

        const allImages = [...existing, ...newUrls];
        textarea.value = allImages.join('\n');

        // Use first URL as thumbnail for the admin table
        if (allImages.length > 0 && thumbInput) {
            thumbInput.value = allImages[0];
        }

        updateVariantPreviews(variantItem);
        console.log(`✅ ${newUrls.length} images uploaded to Cloudinary`);
    } catch (e) {
        alert('خطأ في الرفع للسحابة: ' + e.message);
    } finally {
        uploadBtn.style.pointerEvents = 'auto';
        uploadBtn.innerHTML = originalHTML;
        input.value = '';
    }
}
window.uploadVariantImages = uploadVariantImages;

window.clearVariantImages = (btn) => {
    const variantItem = btn.closest('.variant-item');
    const textarea = variantItem.querySelector('.v-image');
    textarea.value = '';
    updateVariantPreviews(variantItem);
};

function updateVariantPreviews(variantItem) {
    const textarea = variantItem.querySelector('.v-image');
    const previewArea = variantItem.querySelector('.variant-img-preview');
    if (!previewArea || !textarea) return;

    const imgs = textarea.value.split('\n').map(s => s.trim()).filter(Boolean);
    previewArea.innerHTML = imgs.map((src, i) => `
        <div style="position:relative; flex-shrink:0;">
            <img src="${src}" style="width:55px;height:55px;object-fit:cover;border-radius:8px;border:2px solid rgba(255,255,255,0.1);" onerror="this.style.display='none'">
            <button type="button" onclick="removeVariantImg(this, ${i})" style="position:absolute;top:-5px;right:-5px;background:#f44336;border:none;color:#fff;width:16px;height:16px;border-radius:50%;cursor:pointer;font-size:0.6rem;display:flex;align-items:center;justify-content:center;padding:0;"><i class="fas fa-times"></i></button>
        </div>
    `).join('');
}

window.removeVariantImg = (btn, idx) => {
    const variantItem = btn.closest('.variant-item');
    const textarea = variantItem.querySelector('.v-image');
    const imgs = textarea.value.split('\n').map(s => s.trim()).filter(Boolean);
    imgs.splice(idx, 1);
    textarea.value = imgs.join('\n');
    updateVariantPreviews(variantItem);
};

async function uploadProductImage(input) {
    const file = input.files[0];
    if (!file) return;

    const targetInput = input.parentElement.previousElementSibling;
    const parentBtn = input.parentElement;
    const originalHTML = parentBtn.innerHTML;

    parentBtn.style.pointerEvents = 'none';
    parentBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

    try {
        const imageUrl = await uploadToCloudinary(file);

        if (targetInput) {
            if (targetInput.tagName.toLowerCase() === 'textarea') {
                targetInput.value = targetInput.value ? targetInput.value + '\n' + imageUrl : imageUrl;
            } else {
                targetInput.value = imageUrl;
            }
        } else {
            const pImg = document.getElementById('p-image');
            if (pImg) pImg.value = imageUrl;
        }

        console.log("✅ Image uploaded to Cloudinary!");
        alert("تم رفع الصورة بنجاح!");
    } catch (e) {
        console.warn("⚠️ Cloudinary failed, falling back to local compression...", e);
        // FALLBACK: If Cloudinary fails, use the old Base64 method to keep the user working
        const compressedBase64 = await compressImage(file, 800, 0.6);
        if (targetInput) {
            if (targetInput.tagName.toLowerCase() === 'textarea') {
                targetInput.value = targetInput.value ? targetInput.value + '\n' + compressedBase64 : compressedBase64;
            } else {
                targetInput.value = compressedBase64;
            }
        } else {
            const pImg = document.getElementById('p-image');
            if (pImg) pImg.value = compressedBase64;
        }
        alert("تنبيه: تم حفظ الصورة محلياً (Base64) بسبب مشكلة في اتصال السحابة. يمكنك متابعة العمل.");
    } finally {
        parentBtn.style.pointerEvents = 'auto';
        parentBtn.innerHTML = originalHTML;
    }
}
async function uploadSizeChart(input) {
    const file = input.files[0];
    if (!file) return;

    const label = input.parentElement;
    const originalHTML = label.innerHTML;
    const preview = document.getElementById('p-size-chart-preview');
    const hiddenInput = document.getElementById('p-size-chart');

    label.style.pointerEvents = 'none';
    label.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الرفع...';

    try {
        const url = await uploadToCloudinary(file);
        if (hiddenInput) hiddenInput.value = url;
        if (preview) {
            preview.src = url;
            preview.style.display = 'block';
        }
        alert("تم رفع جدول المقاسات بنجاح! ✅");
    } catch (e) {
        console.error("❌ Size Chart Upload Error:", e);
        // Fallback
        try {
            const base64 = await compressImage(file, 1000, 0.7);
            if (hiddenInput) hiddenInput.value = base64;
            if (preview) {
                preview.src = base64;
                preview.style.display = 'block';
            }
            alert("تم حفظ جدول المقاسات محلياً بسبب مشكلة في الاتصال.");
        } catch (err) {
            alert("فشل الرفع: " + e.message);
        }
    } finally {
        label.style.pointerEvents = 'auto';
        label.innerHTML = originalHTML;
    }
}
window.uploadSizeChart = uploadSizeChart;

window.uploadProductImage = uploadProductImage;

async function compressImage(file, maxWidth, quality) {
    return new Promise((resolve, reject) => {
        // دعم base64 string مباشرة (للضغط الإضافي)
        if (file && file._isBase64) {
            const img = new Image();
            img.src = file._data;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                if (width > maxWidth) {
                    height = Math.round((maxWidth / width) * height);
                    width = maxWidth;
                }
                canvas.width = width;
                canvas.height = height;
                canvas.getContext('2d').drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', quality));
            };
            img.onerror = (e) => reject(e);
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > maxWidth) {
                    height = Math.round((maxWidth / width) * height);
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Convert to compressed JPEG
                const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
                resolve(compressedBase64);
            };
            img.onerror = (e) => reject(e);
        };
        reader.onerror = (e) => reject(e);
    });
}

window.editProduct = (id) => openProductModal(id);
window.deleteProduct = async (id) => {
    if (confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
        await db.collection('products').doc(id).delete();
        loadProducts();
    }
};

// Order Management
window.updateOrderStatus = async (id, status) => {
    try {
        await db.collection('orders').doc(id).update({ status });
        loadOrders();
        alert("تم تحديث حالة الطلب");
    } catch (err) {
        alert("خطأ في التحديث");
    }
};

// Search Functionality
document.getElementById('order-search')?.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = orders.filter(o =>
        o.id.toLowerCase().includes(query) ||
        o.customerName.toLowerCase().includes(query) ||
        o.phone.includes(query) ||
        (o.phone2 && o.phone2.includes(query))
    );
    renderOrders(filtered);
});

document.getElementById('product-search')?.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.price.toString().includes(query) ||
        (p.code && p.code.toLowerCase().includes(query))
    );
    renderProducts(filtered);
});

// --- Order Management ---
let activeOrderFilter = 'all';

window.filterOrders = (filter) => {
    activeOrderFilter = filter;
    document.querySelectorAll('.order-filter-btn').forEach(b => b.classList.remove('active'));
    const activeBtn = document.querySelector(`[onclick="filterOrders('${filter}')"]`);
    if (activeBtn) activeBtn.classList.add('active');

    let filtered = [...orders];
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (filter === 'today') {
        filtered = orders.filter(o => o.createdAt && o.createdAt.toDate() >= today);
    } else if (filter === 'week') {
        const lastWeek = new Date(today);
        lastWeek.setDate(lastWeek.getDate() - 7);
        filtered = orders.filter(o => o.createdAt && o.createdAt.toDate() >= lastWeek);
    }

    renderOrders(filtered);
};

function renderOrders(data = orders) {
    const list = document.getElementById('orders-list');
    if (!list) return;

    if (data.length === 0) {
        list.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:30px; opacity:0.5;">لا توجد طلبات لهذا التصنيف.</td></tr>';
        return;
    }

    list.innerHTML = data.map(o => {
        const firstItem = o.items && o.items.length > 0 ? o.items[0] : null;
        const itemImage = firstItem ? firstItem.image : 'https://via.placeholder.com/50';

        return `
        <tr onclick="openOrderDetails('${o.id}')" style="cursor:pointer; border-bottom: 1px solid rgba(255,255,255,0.03); transition: background 0.2s;">
            <td style="padding:15px; font-weight:bold; color:#d4af37;">#${o.id.substring(0, 8)}</td>
            <td style="padding:15px; white-space: nowrap;">
                <div style="display:flex; align-items:center; gap:10px;">
                    <img src="${itemImage}" style="width:40px; height:40px; border-radius:8px; object-fit:cover; border:1px solid rgba(255,255,255,0.1);">
                    <div style="font-size:0.8rem; opacity:0.7;">${o.createdAt ? o.createdAt.toDate().toLocaleDateString('ar-EG') : '---'}</div>
                </div>
            </td>
            <td style="padding:15px;">
                <div style="font-size:0.95rem;">
                    <strong>${o.customerName}</strong><br>
                    <small style="opacity:0.7;"><i class="fas fa-phone"></i> ${o.phone}${o.phone2 ? ` / ${o.phone2}` : ''}</small>
                </div>
            </td>
            <td style="padding:15px;">
                <div style="font-size:0.85rem; opacity:0.8; max-width:200px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
                    ${(o.items || []).map(i => i.name).join(', ')}
                </div>
            </td>
            <td style="padding:15px; font-weight:bold; color: #4CAF50;">${o.total} ج.م</td>
            <td style="padding:15px;"><span class="status-badge ${getStatusClass(o.status)}">${getStatusLabel(o.status)}</span></td>
            <td style="padding:15px;">
                <div style="display:flex; gap:12px; align-items:center;" onclick="event.stopPropagation()">
                    <button onclick="openOrderDetails('${o.id}')" style="color:#d4af37; background:none; border:none; cursor:pointer; font-size:1.1rem;" title="عرض التفاصيل">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button onclick="deleteOrder('${o.id}')" style="color:#f44336; background:none; border:none; cursor:pointer; font-size:1.1rem;" title="حذف">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                    ${o.trackingNumber ? 
                        `<span style="color:#4CAF50; font-size:0.8rem; font-weight:bold;"><i class="fas fa-check-circle"></i> مشحون</span>` : 
                        `<button onclick="shipToBosta('${o.id}')" style="color:#2196F3; background:none; border:none; cursor:pointer; font-size:1.1rem;" title="ارسل لبوسطة Bosta">
                            <i class="fas fa-truck-fast"></i>
                        </button>`
                    }
                </div>
            </td>
        </tr>
    `;
    }).join('');
}

window.openOrderDetails = (id) => {
    const o = orders.find(x => x.id === id);
    if (!o) return;

    const modal = document.getElementById('order-details-modal');
    const body = document.getElementById('order-details-body');
    if (!modal || !body) return;

    // Build Items List with Professional Cards
    const itemsHtml = (o.items || []).map(i => `
        <div style="background: #000; border-radius: 12px; padding: 12px; margin-bottom: 12px; border: 1px solid rgba(255,255,255,0.05); display: flex; align-items: center; gap: 15px;">
            <div style="flex: 1;">
                <h4 style="margin: 0 0 10px; font-size: 1.1rem; color: #fff;">${i.name}</h4>
                <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                    <span style="background: rgba(212,175,55,0.1); color: #d4af37; padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; border: 1px solid rgba(212,175,55,0.3); display: flex; align-items: center; gap: 5px;">
                        🎨 ${i.color} / ${i.size}
                    </span>
                    <span style="background: rgba(255,255,255,0.05); color: #888; padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; border: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; gap: 5px;">
                        🎫 SKU: ${i.code || '---'}
                        <button onclick="copyToClipboard('${i.code || ''}')" style="background:none; border:none; color:#d4af37; cursor:pointer; padding:0;"><i class="far fa-copy"></i></button>
                    </span>
                </div>
            </div>
            <img src="${i.image}" style="width: 70px; height: 70px; object-fit: cover; border-radius: 10px; border: 1px solid rgba(255,255,255,0.1);">
        </div>
    `).join('');

    body.innerHTML = `
        <style>
            .details-card { background: rgba(255,255,255,0.03); border-radius: 18px; padding: 20px; margin-bottom: 20px; border: 1px solid rgba(255,255,255,0.05); }
            .details-label { color: #d4af37; font-weight: bold; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; font-size: 1rem; }
            .details-val { color: #fff; font-size: 1.2rem; font-weight: bold; margin: 0; }
            .details-sub { color: #888; font-size: 0.9rem; margin: 5px 0 0; }
        </style>

        <!-- 1. Customer Info -->
        <div class="details-card">
            <div class="details-label">👤 بيانات العميل:</div>
            <h3 class="details-val">${o.customerName}</h3>
            <p class="details-sub">${o.phone}${o.phone2 ? ` - هاتف احتياطي: ${o.phone2}` : ''}</p>
        </div>

        <!-- 2. Address Info -->
        <div class="details-card">
            <div class="details-label">📍 العنوان والمحافظة:</div>
            <h3 class="details-val">${o.gov}</h3>
            <p class="details-sub">${o.address}</p>
        </div>

        <!-- 3. Items Info -->
        <div class="details-card">
            <div class="details-label">📦 المنتجات المطلوبة (${o.items?.length || 0}):</div>
            <div style="margin-top: 15px;">${itemsHtml}</div>
        </div>

        <!-- Receipt Info -->
        ${o.receiptUrl ? `
        <div class="details-card">
            <div class="details-label">🧾 إيصال الدفع:</div>
            <div style="margin-top: 10px; border: 1px dashed rgba(212,175,55,0.3); padding: 10px; border-radius: 12px; text-align: center;">
                <img id="receipt-img-view" src="${o.receiptUrl}" style="max-width: 100%; max-height: 350px; border-radius: 8px; cursor: pointer;">
                <p style="font-size: 0.8rem; opacity: 0.5; margin-top: 8px;">إضغط على الصورة لمشاهدتها بالحجم الكامل</p>
            </div>
        </div>
        <script>
            document.getElementById('receipt-img-view').onclick = function() {
                const win = window.open("");
                win.document.write('<img src="' + this.src + '" style="max-width:100%;">');
            };
        </script>
        ` : ''}

        <!-- 4. Price & Payment -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            <div class="details-card" style="text-align: center;">
                <div class="details-label" style="justify-content: center;">💰 الإجمالي:</div>
                <h2 style="color: #4CAF50; margin: 5px 0; font-size: 1.6rem;">${o.total} ج.م</h2>
            </div>
            <div class="details-card" style="text-align: center;">
                <div class="details-label" style="justify-content: center;">💳 الدفع:</div>
                <h3 class="details-val" style="font-size: 1.1rem;">${o.paymentMethod === 'cod' ? '💵 عند الاستلام' : '📲 تحويل بنكي'}</h3>
            </div>
        </div>

        <!-- 5. Status Control -->
        <div class="details-card">
            <div class="details-label">🔄 حالة الطلب:</div>
            <div style="background: #000; padding: 10px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; gap: 10px;">
                <select id="details-status-select" onchange="updateOrderStatus('${o.id}', this.value)" style="flex: 1; background: none; border: none; color: #fff; font-family: 'Cairo'; font-size: 1.1rem; cursor: pointer; outline: none;">
                    <option value="verifying" ${o.status === 'verifying' ? 'selected' : ''}>⏳ جاري التأكد من الإيصال</option>
                    <option value="pending" ${o.status === 'pending' ? 'selected' : ''}>🆕 جديد (تم التأكد)</option>
                    <option value="shipping" ${o.status === 'shipping' ? 'selected' : ''}>🚚 جاري الشحن</option>
                    <option value="delivered" ${o.status === 'delivered' ? 'selected' : ''}>✅ تم التوصيل</option>
                    <option value="cancelled" ${o.status === 'cancelled' ? 'selected' : ''}>❌ ملغي</option>
                </select>
            </div>
        </div>

        <!-- 7. Bosta Shipping Action -->
        <div class="details-card" style="border-color: rgba(33, 150, 243, 0.3);">
            <div class="details-label" style="color: #2196F3;"><i class="fas fa-truck-fast"></i> شحن الطلب:</div>
            ${o.trackingNumber ? `
                <div style="background: rgba(76,175,80,0.1); padding: 15px; border-radius: 12px; border: 1px solid rgba(76,175,80,0.2);">
                    <p style="color: #4CAF50; font-weight: bold; margin-bottom: 5px;">✅ تم إرسال الطلب لشركة بوسطة</p>
                    <p style="font-size: 0.9rem; opacity: 0.8;">رقم التتبع: <span style="color: #d4af37; font-family: monospace;">${o.trackingNumber}</span></p>
                    <a href="https://tracking.bosta.co/${o.trackingNumber}" target="_blank" style="display: inline-block; margin-top: 10px; color: #2196F3; text-decoration: none; font-size: 0.85rem;"><i class="fas fa-external-link-alt"></i> تتبع الشحنة الآن</a>
                </div>
            ` : `
                <button onclick="shipToBosta('${o.id}')" style="width: 100%; padding: 12px; background: #2196F3; color: #fff; border: none; border-radius: 12px; font-weight: bold; font-family: 'Cairo'; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px;">
                    <i class="fas fa-paper-plane"></i> إرسال البيانات لشركة بوسطة (Bosta)
                </button>
            `}
        </div>

        <!-- 6. Timestamp -->
        <div style="text-align: center; opacity: 0.5; font-size: 0.85rem; margin-bottom: 25px; display: flex; align-items: center; justify-content: center; gap: 8px;">
            <i class="fas fa-clock"></i> ${o.createdAt ? o.createdAt.toDate().toLocaleString('ar-EG') : '---'}
        </div>
    `;

    // Re-bind Action Buttons (WhatsApp & Delete)
    const waBtn = document.getElementById('details-whatsapp-btn');
    if (waBtn) {
        waBtn.style.background = '#25D366';
        waBtn.style.color = '#fff';
        waBtn.style.border = 'none';
        waBtn.innerHTML = '<i class="fab fa-whatsapp"></i> تواصل واتساب';
        waBtn.onclick = () => {
            const itemsList = (o.items || []).map(i => `- ${i.name} (كود: ${i.code || '---'}) [${i.color} / ${i.size}]`).join('%0A');
            const message = `أهلاً ${o.customerName}%0Aبخصوص طلبك رقم: ${o.id.substring(0, 8)}%0A%0Aالمنتجات:%0A${itemsList}%0A%0Aالإجمالي: ${o.total} ج.م%0A%0Aشكراً لتعاملك معنا ❤️`;
            const phone = o.phone.startsWith('0') ? '2' + o.phone : o.phone;
            window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
        };
    }

    const delBtn = document.getElementById('details-delete-btn');
    if (delBtn) {
        delBtn.style.background = '#e20613'; // Solid Red
        delBtn.style.color = '#fff';
        delBtn.style.border = 'none';
        delBtn.innerHTML = '<i class="fas fa-trash-alt"></i> حذف الطلب';
        delBtn.onclick = () => { deleteOrder(o.id); closeOrderDetails(); };
    }

    modal.style.display = 'flex';
};

window.closeOrderDetails = () => {
    document.getElementById('order-details-modal').style.display = 'none';
};

window.deleteOrder = async (id) => {
    if (!confirm("⚠️ هل أنت متأكد من حذف هذا الطلب نهائياً؟")) return;
    try {
        await db.collection('orders').doc(id).delete();
        alert("تم حذف الطلب بنجاح 🗑️");
        // Snapshot listener will auto-update the list
    } catch (e) {
        alert("خطأ في الحذف: " + e.message);
    }
};

window.deleteAllOrders = async () => {
    if (!confirm("🚨 تحذير: سيتم حذف كافة الطلبات نهائياً! هل أنت متأكد؟")) return;
    const items = await db.collection('orders').get();
    const batch = db.batch();
    items.forEach(doc => batch.delete(doc.ref));
    await batch.commit();
    alert("تم مسح كافة الطلبات بنجاح");
};

// --- BOSTA API INTEGRATION ---
window.shipToBosta = async (orderId) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    if (!confirm(`هل أنت متأكد من إرسال الطلب #${orderId.substring(0, 8)} لشركة بوسطة عبر السيرفر الآمن؟`)) return;

    const btn = event.currentTarget;
    const originalContent = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال الآمن...';

    try {
        const bostaCity = bostaCityMap[order.gov] || "Cairo";
        
        const payload = {
            type: 10, // Forward shipment
            specs: { packageDetails: { itemsCount: order.items?.length || 1, description: "Clothing" } },
            notes: "Please call before delivery",
            cod: Number(order.paymentMethod === 'cod' ? order.total : 0),
            dropOffAddress: {
                city: bostaCity,
                firstLine: order.address,
                buildingNumber: "N/A",
                floor: "N/A",
                apartment: "N/A"
            },
            receiver: {
                firstName: order.customerName,
                lastName: ".",
                phone: order.phone,
                email: order.userEmail || "guest@icloth.com"
            }
        };

        console.log("📡 Sending to Secure Google Proxy:", payload);

        // --- التغيير النهائي: نرسل للبروكسي المجاني في جوجل شيتس ---
        const response = await fetch(BOSTA_PROXY_URL, {
            method: 'POST',
            redirect: 'follow', // ضروري جداً لروابط جوجل سكريبت
            headers: {
                'Content-Type': 'text/plain;charset=utf-8' // جوجل سكريبت يفضل هذا النوع أحياناً في الـ POST
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (response.ok) {
            const trackingNumber = result.trackingNumber;
            const deliveryId = result._id;

            // Update Firestore
            await db.collection('orders').doc(orderId).update({
                status: 'shipping',
                trackingNumber: trackingNumber,
                bostaDeliveryId: deliveryId,
                shippedAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            alert(`✅ تم إنشاء الشحنة بنجاح!\nرقم التتبع: ${trackingNumber}`);
            
            // Re-load orders to update UI
            loadOrders();
            if (document.getElementById('order-details-modal')?.style.display === 'flex') {
                openOrderDetails(orderId);
            }
        } else {
            console.error("❌ Cloud Function Error:", result);
            alert(`خطأ: ${result.message || 'فشل إنشاء الشحنة'}`);
        }
    } catch (err) {
        console.error("❌ Network Error:", err);
        alert("حدث خطأ في الاتصال بالسيرفر. تأكد من تفعيل خطة Blaze.");
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalContent;
    }
};




// Users Management
function renderUsers() {
    const list = document.getElementById('users-list');
    if (!list) return;
    list.innerHTML = users.map(u => `
        <tr>
            <td>${u.name}</td>
            <td>${u.email}</td>
            <td>${u.ordersCount || 0}</td>
            <td><span class="status-badge ${u.blocked ? 'badge-danger' : 'badge-success'}">${u.blocked ? 'محظور' : 'نشط'}</span></td>
            <td>
                <button onclick="toggleUserBlock('${u.id}', ${u.blocked})" style="background:none; border:none; cursor:pointer; color: ${u.blocked ? 'var(--success)' : 'var(--danger)'}">
                    ${u.blocked ? 'إلغاء الحظر' : 'حظر'}
                </button>
            </td>
        </tr>
    `).join('');
}

window.toggleUserBlock = async (id, currentStatus) => {
    try {
        await db.collection('users').doc(id).set({ blocked: !currentStatus }, { merge: true });
        loadUsers();
        alert("تم تحديث حالة المستخدم");
    } catch (e) { alert("خطأ في التحديث"); }
}

// Coupons Management
let coupons = [];
async function loadCoupons() {
    const snapshot = await db.collection('coupons').get();
    coupons = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    renderCoupons();
}

function renderCoupons() {
    const list = document.getElementById('coupons-list');
    if (!list) return;
    list.innerHTML = coupons.map(c => `
        <tr>
            <td>${c.code}</td>
            <td>${c.discount}%</td>
            <td>${c.expiry}</td>
            <td>${c.limit - (c.usedCount || 0)}</td>
            <td>
                <button onclick="deleteCoupon('${c.id}')" style="color:var(--danger); background:none; border:none; cursor:pointer;"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

window.openCouponModal = () => document.getElementById('coupon-modal').style.display = 'flex';
window.closeCouponModal = () => document.getElementById('coupon-modal').style.display = 'none';

document.getElementById('coupon-form').onsubmit = async (e) => {
    e.preventDefault();
    const data = {
        code: document.getElementById('c-code').value.toUpperCase(),
        discount: Number(document.getElementById('c-percent').value),
        expiry: document.getElementById('c-expiry').value,
        limit: Number(document.getElementById('c-limit').value),
        usedCount: 0,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    try {
        await db.collection('coupons').add(data);
        closeCouponModal();
        loadCoupons();
        alert("تم إنشاء الكوبون بنجاح");
    } catch (e) { alert("خطأ في الإنشاء"); }
};

window.deleteCoupon = async (id) => {
    if (confirm("حذف هذا الكوبون؟")) {
        await db.collection('coupons').doc(id).delete();
        loadCoupons();
    }
}

// --- New Settings Management
let settingsCache = {};
async function loadSettings() {
    console.log("⚙️ Loading General Settings...");
    const doc = await db.collection('settings').doc('site').get();
    if (doc.exists) {
        const s = doc.data();
        settingsCache = s;

        // Site Status
        const stText = document.getElementById('current-status-text');
        const stBadge = document.getElementById('maintenance-status-badge');
        const btnToggle = document.getElementById('btn-toggle-maintenance');

        if (stText) stText.innerText = s.maintenanceMode ? 'وضع الصيانة فعال' : 'المتجر يعمل بشكل طبيعي';
        if (stBadge) {
            stBadge.className = 'status-badge ' + (s.maintenanceMode ? 'badge-danger' : 'badge-success');
            stBadge.innerText = s.maintenanceMode ? 'MAINTENANCE' : 'LIVE';
        }
        if (s.maintenanceMode) {
            if (btnToggle) {
                btnToggle.innerHTML = '<i class="fas fa-play"></i> تشغيل الموقع الآن';
                btnToggle.style.background = 'var(--success)';
            }
        } else {
            if (btnToggle) {
                btnToggle.innerHTML = '<i class="fas fa-stop"></i> إيقاف الموقع (وضع الصيانة)';
                btnToggle.style.background = 'var(--danger)';
            }
        }

        const maintenanceReasonEl = document.getElementById('maintenance-reason');
        if (maintenanceReasonEl) maintenanceReasonEl.value = s.maintenanceReason || '';
        const maintenanceDurationEl = document.getElementById('maintenance-duration');
        if (maintenanceDurationEl) maintenanceDurationEl.value = s.maintenanceDuration || '';
        const maintenanceMsgEl = document.getElementById('maintenance-msg');
        if (maintenanceMsgEl) maintenanceMsgEl.value = s.maintenanceMsg || '';

        // WhatsApp and Transfer Numbers
        const settingWa1 = document.getElementById('setting-wa-1');
        if (settingWa1) settingWa1.value = s.whatsapp || '';
        const settingWa2 = document.getElementById('setting-wa-2');
        if (settingWa2) settingWa2.value = s.whatsapp2 || '';
        const settingTransferVodafone = document.getElementById('setting-transfer-vodafone');
        if (settingTransferVodafone) settingTransferVodafone.value = s.transferVodafone || '';
        const settingTransferVodafoneName = document.getElementById('setting-transfer-vodafone-name');
        if (settingTransferVodafoneName) settingTransferVodafoneName.value = s.transferVodafoneName || '';

        const settingTransferOrange = document.getElementById('setting-transfer-orange');
        if (settingTransferOrange) settingTransferOrange.value = s.transferOrange || '';
        const settingTransferOrangeName = document.getElementById('setting-transfer-orange-name');
        if (settingTransferOrangeName) settingTransferOrangeName.value = s.transferOrangeName || '';

        const settingTransferInstapay = document.getElementById('setting-transfer-instapay');
        if (settingTransferInstapay) settingTransferInstapay.value = s.transferInstapay || '';
        const settingTransferInstapayName = document.getElementById('setting-transfer-instapay-name');
        if (settingTransferInstapayName) settingTransferInstapayName.value = s.transferInstapayName || '';
        const settingTransferInstapayLink = document.getElementById('setting-transfer-instapay-link');
        if (settingTransferInstapayLink) settingTransferInstapayLink.value = s.transferInstapayLink || '';

        const settingWaTemplate = document.getElementById('setting-wa-template');
        if (settingWaTemplate) settingWaTemplate.value = s.waTemplate || '';
    }
}

// Helper: Toggle Maintenance
document.getElementById('maintenance-form').onsubmit = async (e) => {
    e.preventDefault();
    const currentMode = settingsCache.maintenanceMode || false;
    const targetMode = !currentMode;

    const maintenanceReasonEl = document.getElementById('maintenance-reason');
    const maintenanceDurationEl = document.getElementById('maintenance-duration');
    const maintenanceMsgEl = document.getElementById('maintenance-msg');

    const data = {
        maintenanceMode: targetMode,
        maintenanceReason: maintenanceReasonEl ? maintenanceReasonEl.value : '',
        maintenanceDuration: maintenanceDurationEl ? maintenanceDurationEl.value : '',
        maintenanceMsg: maintenanceMsgEl ? maintenanceMsgEl.value : '',
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    try {
        await db.collection('settings').doc('site').set(data, { merge: true });
        console.log(`🚀 Site status changed to: ${targetMode ? 'MAINTENANCE' : 'LIVE'}`);
        alert(targetMode ? "تم إدخال الموقع في وضع الصيانة" : "تم فتح الموقع بنجاح (سيرجع الزوار تلقائياً للموقع)");
        loadSettings();
    } catch (e) { alert("خطأ في التحديث"); }
};

// Save WhatsApp Template
document.getElementById('whatsapp-template-form').onsubmit = async (e) => {
    e.preventDefault();
    const templateEl = document.getElementById('setting-wa-template');
    const template = templateEl ? templateEl.value : '';
    try {
        await db.collection('settings').doc('site').set({ waTemplate: template }, { merge: true });
        alert("تم حفظ قالب الرسالة بنجاح");
    } catch (e) { alert("خطأ في الحفظ"); }
};

// Save WhatsApp Numbers & Transfer Numbers
document.getElementById('whatsapp-numbers-form').onsubmit = async (e) => {
    e.preventDefault();
    const wa1El = document.getElementById('setting-wa-1');
    const wa2El = document.getElementById('setting-wa-2');
    const vodafoneEl = document.getElementById('setting-transfer-vodafone');
    const orangeEl = document.getElementById('setting-transfer-orange');
    const instapayEl = document.getElementById('setting-transfer-instapay');

    const vodafoneNameEl = document.getElementById('setting-transfer-vodafone-name');
    const orangeNameEl = document.getElementById('setting-transfer-orange-name');
    const instapayNameEl = document.getElementById('setting-transfer-instapay-name');
    const instapayLinkEl = document.getElementById('setting-transfer-instapay-link');

    const wa1 = wa1El ? wa1El.value : '';
    const wa2 = wa2El ? wa2El.value : '';
    const vodafone = vodafoneEl ? vodafoneEl.value : '';
    const vodafoneName = vodafoneNameEl ? vodafoneNameEl.value : '';
    const orange = orangeEl ? orangeEl.value : '';
    const orangeName = orangeNameEl ? orangeNameEl.value : '';
    const instapay = instapayEl ? instapayEl.value : '';
    const instapayName = instapayNameEl ? instapayNameEl.value : '';
    const instapayLink = instapayLinkEl ? instapayLinkEl.value : '';

    try {
        await db.collection('settings').doc('site').set({
            whatsapp: wa1,
            whatsapp2: wa2,
            transferVodafone: vodafone,
            transferVodafoneName: vodafoneName,
            transferOrange: orange,
            transferOrangeName: orangeName,
            transferInstapay: instapay,
            transferInstapayName: instapayName,
            transferInstapayLink: instapayLink
        }, { merge: true });
        alert("✅ تم حفظ الأرقام بنجاح!");
    } catch (e) { alert("خطأ في الحفظ"); }
};

// Announcement Bar Logic
async function loadAnnouncements() {
    const doc = await db.collection('settings').doc('announcement').get();
    const badge = document.getElementById('announcement-status-tag');
    const btn = document.getElementById('btn-toggle-announcement');
    const inputAr = document.getElementById('announcement-text-ar');
    const inputEn = document.getElementById('announcement-text-en');
    const prevAr = document.getElementById('preview-ar');
    const prevEn = document.getElementById('preview-en');

    if (doc.exists) {
        const a = doc.data();
        const txtAr = a.textAr || a.text || '';
        const txtEn = a.textEn || '';

        if (inputAr) {
            inputAr.value = txtAr;
            inputAr.oninput = () => { if (prevAr) prevAr.innerText = inputAr.value || '- لا يوجد نص -'; };
        }
        if (inputEn) {
            inputEn.value = txtEn;
            inputEn.oninput = () => { if (prevEn) prevEn.innerText = inputEn.value || '- No text -'; };
        }

        if (prevAr) prevAr.innerText = txtAr || '- لا يوجد نص -';
        if (prevEn) prevEn.innerText = txtEn || '- No text -';

        if (a.enabled) {
            if (badge) {
                badge.innerText = "التنبيه يعمل الآن";
                badge.className = "status-badge badge-success";
            }
            if (btn) {
                btn.innerHTML = '<i class="fas fa-power-off"></i> إيقاف التنبيه الآن';
                btn.style.background = 'var(--danger)';
                btn.dataset.enabled = "true";
            }
        } else {
            if (badge) {
                badge.innerText = "التنبيه متوقف";
                badge.className = "status-badge badge-danger";
            }
            if (btn) {
                btn.innerHTML = '<i class="fas fa-bolt"></i> تفعيل التنبيه الآن';
                btn.style.background = 'var(--success)';
                btn.dataset.enabled = "false";
            }
        }
    }
}

document.getElementById('announcement-form').onsubmit = async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const originalHtml = btn ? btn.innerHTML : '';

    const textArEl = document.getElementById('announcement-text-ar');
    const textEnEl = document.getElementById('announcement-text-en');

    const textAr = textArEl ? textArEl.value : '';
    const textEn = textEnEl ? textEnEl.value : '';

    if (btn) {
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الحفظ...';
        btn.disabled = true;
    }

    try {
        await db.collection('settings').doc('announcement').set({
            textAr,
            textEn,
            text: textAr || textEn // Ensure fallback for old versions
        }, { merge: true });
        alert("✅ تم تحديث نص التنبيه وإظهاره للزوار بنجاح!");
    } catch (e) {
        alert("❌ خطأ في الحفظ، حاول مرة أخرى");
    } finally {
        if (btn) {
            btn.innerHTML = originalHtml;
            btn.disabled = false;
        }
    }
};

document.getElementById('btn-toggle-announcement').onclick = async () => {
    const btn = document.getElementById('btn-toggle-announcement');
    const isEnabled = btn ? btn.dataset.enabled === "true" : false;
    try {
        await db.collection('settings').doc('announcement').set({ enabled: !isEnabled }, { merge: true });
        loadAnnouncements();
    } catch (e) { alert("خطأ"); }
};

// CMS Management
let bannerFileToUpload = null;
let logoFileToUpload = null;

// ── Compress image using Canvas → returns Base64 string ──
function compressImageToBase64(file, maxWidth = 1280, quality = 0.75) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (ev) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let w = img.width;
                let h = img.height;
                // Scale down if too wide
                if (w > maxWidth) {
                    h = Math.round((h * maxWidth) / w);
                    w = maxWidth;
                }
                canvas.width = w;
                canvas.height = h;
                canvas.getContext('2d').drawImage(img, 0, 0, w, h);
                resolve(canvas.toDataURL('image/jpeg', quality));
            };
            img.onerror = reject;
            img.src = ev.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

async function loadCMS() {
    const doc = await db.collection('settings').doc('cms').get();
    if (doc.exists) {
        const c = doc.data();

        // --- LOGO ---
        const logoUrl = c.logoUrl || '';
        const logoUrlEl = document.getElementById('cms-logo-url');
        if (logoUrlEl) logoUrlEl.value = logoUrl;
        if (logoUrl) {
            const logoPreviewImg = document.getElementById('logo-preview-img');
            const logoPreviewContainer = document.getElementById('logo-preview-container');
            if (logoPreviewImg) logoPreviewImg.src = logoUrl;
            if (logoPreviewContainer) logoPreviewContainer.style.display = 'block';
        }

        // --- BANNERS (Multi) ---
        const container = document.getElementById('banners-manager-container');
        if (container) {
            container.innerHTML = '';
            // Migrate old bannerUrl if it's the only one
            let banners = c.banners || [];
            if (banners.length === 0 && (c.bannerUrl || c.bannerTitle)) {
                banners.push({
                    desktopUrl: c.bannerUrl || '',
                    mobileUrl: c.bannerUrl || '', // fallback
                    title: c.bannerTitle || '',
                    subtitle: c.promoText || ''
                });
            }
            
            banners.forEach(b => addBannerRow(b));
            if (banners.length === 0) addBannerRow(); // Add one empty row by default
        }

        const promoEl = document.getElementById('cms-promo-text');
        if (promoEl) promoEl.value = c.promoText || 'أحدث صيحات الموضة والملابس الرجالي والشبابي';
        const footerEl = document.getElementById('cms-footer-text');
        if (footerEl) footerEl.value = c.footerText || '© 2026 icloth Store. جميع الحقوق محفوظة.';
    }
}

window.addBannerRow = (data = { desktopUrl: '', mobileUrl: '', title: '', subtitle: '' }) => {
    const container = document.getElementById('banners-manager-container');
    if (!container) return;
    const row = document.createElement('div');
    row.className = 'banner-row-item';
    row.style = 'background: rgba(255,255,255,0.03); padding: 20px; border-radius: 15px; border: 1px solid var(--border); position: relative; margin-bottom: 10px;';
    
    row.innerHTML = `
        <button type="button" onclick="this.closest('.banner-row-item').remove()" style="position: absolute; top: 10px; left: 10px; background: rgba(244, 67, 54, 0.1); border: 1px solid rgba(244, 67, 54, 0.2); color: var(--danger); cursor: pointer; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; z-index: 10;"><i class="fas fa-trash"></i></button>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            <!-- Desktop Image -->
            <div class="form-group">
                <label style="font-size: 0.8rem; margin-bottom: 5px;"><i class="fas fa-desktop"></i> صورة الكمبيوتر / التابلت</label>
                <div class="banner-upload-box" onclick="this.querySelector('input').click()" style="border: 2px dashed var(--border); border-radius: 10px; padding: 10px; text-align: center; cursor: pointer; min-height: 100px; display: flex; flex-direction: column; justify-content: center; background: rgba(0,0,0,0.2);">
                    <img class="desktop-preview" src="${data.desktopUrl || ''}" style="width: 100%; max-height: 80px; object-fit: cover; display: ${data.desktopUrl ? 'block' : 'none'}; border-radius: 5px; margin-bottom: 5px;">
                    <span style="font-size: 0.75rem; opacity: 0.6;" class="upload-hint">${data.desktopUrl ? 'تغيير صورة اللاب توب' : 'رفع صورة (PC)'}</span>
                    <input type="file" hidden accept="image/*" onchange="uploadBannerPart(this, 'desktop')">
                    <input type="hidden" class="desktop-url" value="${data.desktopUrl || ''}">
                </div>
            </div>
            <!-- Mobile Image -->
            <div class="form-group">
                <label style="font-size: 0.8rem; margin-bottom: 5px;"><i class="fas fa-mobile-alt"></i> صورة الموبايل</label>
                <div class="banner-upload-box" onclick="this.querySelector('input').click()" style="border: 2px dashed var(--border); border-radius: 10px; padding: 10px; text-align: center; cursor: pointer; min-height: 100px; display: flex; flex-direction: column; justify-content: center; background: rgba(0,0,0,0.2);">
                    <img class="mobile-preview" src="${data.mobileUrl || ''}" style="width: 40px; height: 60px; object-fit: cover; display: ${data.mobileUrl ? 'block' : 'none'}; border-radius: 3px; margin: 0 auto 5px;">
                    <span style="font-size: 0.75rem; opacity: 0.6;" class="upload-hint">${data.mobileUrl ? 'تغيير صورة الموبايل' : 'رفع صورة (Phone)'}</span>
                    <input type="file" hidden accept="image/*" onchange="uploadBannerPart(this, 'mobile')">
                    <input type="hidden" class="mobile-url" value="${data.mobileUrl || ''}">
                </div>
            </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 15px;">
            <div class="form-group">
                <label style="font-size: 0.8rem;">العنوان (Title)</label>
                <input type="text" class="banner-title" value="${data.title || ''}" placeholder="icloth FASHION" style="font-size: 0.85rem; padding: 8px;">
            </div>
            <div class="form-group">
                <label style="font-size: 0.8rem;">النص الفرعي (Subtitle)</label>
                <input type="text" class="banner-subtitle" value="${data.subtitle || ''}" placeholder="أحدث صيحات الموضة" style="font-size: 0.85rem; padding: 8px;">
            </div>
        </div>
    `;
    container.appendChild(row);
};

window.uploadBannerPart = async (input, type) => {
    const file = input.files[0];
    if (!file) return;
    
    const row = input.closest('.banner-row-item');
    const preview = row.querySelector(`.${type}-preview`);
    const urlInput = row.querySelector(`.${type}-url`);
    const statusHint = input.parentElement.querySelector('.upload-hint');
    const originalHint = statusHint.innerText;

    statusHint.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري التحويل...';
    try {
        // Use higher resolution for desktop, smaller for mobile
        const base64 = await compressImageToBase64(file, type === 'desktop' ? 1440 : 800, 0.7);
        urlInput.value = base64;
        preview.src = base64;
        preview.style.display = 'block';
        statusHint.innerHTML = '✅ تم التجهيز';
    } catch (e) {
        alert("خطأ في معالجة الجزء المختار");
        statusHint.innerHTML = '❌ فشل المعالجة';
    }
};

// ── Real-time listener for CMS settings in Admin Panel ──
db.collection('settings').doc('cms').onSnapshot(doc => {
    if (doc.exists) {
        const data = doc.data();
        if (data.logoUrl) {
            // Update admin panel logos
            document.querySelectorAll('.sidebar-header img, .login-box img').forEach(img => {
                img.src = data.logoUrl;
            });
            // Update favicon for admin too
            const favicon = document.querySelector('link[rel="icon"]');
            if (favicon) favicon.href = data.logoUrl;
        }
    }
});

// Show local preview when user picks a file
document.getElementById('cms-logo-file')?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    logoFileToUpload = file;
    const reader = new FileReader();
    reader.onload = (ev) => {
        const previewImg = document.getElementById('logo-preview-img');
        const container = document.getElementById('logo-preview-container');
        if (previewImg) previewImg.src = ev.target.result;
        if (container) container.style.display = 'block';
    };
    reader.readAsDataURL(file);
});

window.clearLogoImage = () => {
    logoFileToUpload = null;
    const urlInput = document.getElementById('cms-logo-url');
    if (urlInput) urlInput.value = '';
    const container = document.getElementById('logo-preview-container');
    if (container) container.style.display = 'none';
    const fileInput = document.getElementById('cms-logo-file');
    if (fileInput) fileInput.value = '';
};

// Basic clear logic is no longer needed in this format, row deletion handles it.

document.getElementById('cms-form').onsubmit = async (e) => {
    e.preventDefault();
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalHtml = submitBtn.innerHTML;
    submitBtn.disabled = true;

    try {
        let logoUrl = document.getElementById('cms-logo-url').value;

        // ── Process Logo Image ──
        if (logoFileToUpload) {
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري معالجة اللوجو...';
            logoUrl = await compressImageToBase64(logoFileToUpload, 800, 0.8);
            document.getElementById('cms-logo-url').value = logoUrl;
            logoFileToUpload = null;
        }

        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري حفظ السلايدر...';

        // ── Collect Banners ──
        const bannerRows = document.querySelectorAll('.banner-row-item');
        const banners = [];
        bannerRows.forEach(row => {
            const dUrl = row.querySelector('.desktop-url').value;
            const mUrl = row.querySelector('.mobile-url').value;
            const title = row.querySelector('.banner-title').value;
            const subtitle = row.querySelector('.banner-subtitle').value;
            if (dUrl || mUrl) {
                banners.push({
                    desktopUrl: dUrl,
                    mobileUrl: mUrl || dUrl, // fallback to desktop if mobile is missing
                    title: title,
                    subtitle: subtitle
                });
            }
        });

        const promoEl = document.getElementById('cms-promo-text');
        const footerEl = document.getElementById('cms-footer-text');

        const data = {
            logoUrl,
            banners,
            // Keep fields for backward compatibility if needed by older app versions
            bannerUrl: banners.length > 0 ? banners[0].desktopUrl : '',
            bannerTitle: banners.length > 0 ? banners[0].title : 'icloth FASHION',
            promoText: promoEl ? promoEl.value : '',
            footerText: footerEl ? footerEl.value : '',
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        await db.collection('settings').doc('cms').set(data, { merge: true });
        alert('✅ تم حفظ اللوجو والسلايدر بنجاح! سيتم تحديث الموقع للزوار.');

    } catch (err) {
        console.error(err);
        alert('❌ خطأ في الحفظ: ' + err.message);
    } finally {
        submitBtn.innerHTML = originalHtml;
        submitBtn.disabled = false;
    }
}

// Update Nav to call these loaders
const originalShowSection = showSection;
showSection = (id) => {
    originalShowSection(id);
    if (id === 'users') renderUsers();
    if (id === 'coupons') loadCoupons();
    if (id === 'settings') loadSettings();
    if (id === 'shipping') loadShippingRates();
    if (id === 'cms') loadCMS();
    if (id === 'categories') loadCategories();
    if (id === 'inventory') renderInventory();
    if (id === 'analytics') initAnalytics();
    if (id === 'announcements') loadAnnouncements();

    // Fix: Close sidebar on mobile after clicking
    if (window.innerWidth <= 992) {
        document.querySelector('.sidebar').classList.remove('active');
    }
};

// --- Shipping Management ---
let shippingRates = {};
async function loadShippingRates() {
    try {
        const doc = await db.collection('settings').doc('shipping').get();
        if (doc.exists) shippingRates = doc.data().rates || {};
        renderShippingRates();
    } catch (e) { console.error("Error loading shipping:", e); }
}

function renderShippingRates() {
    const container = document.getElementById('shipping-rates-grid');
    if (!container) return;
    container.innerHTML = governorates.map(gov => `
        <div class="form-group" style="background: rgba(255,255,255,0.03); padding: 15px; border-radius: 12px; border: 1px solid var(--border);">
            <label style="font-size: 0.9rem; margin-bottom: 8px; display: block;">${gov}</label>
            <div style="display: flex; align-items: center; gap: 8px;">
                <input type="number" class="shipping-input" data-gov="${gov}" value="${shippingRates[gov] || 0}" style="padding: 10px; border-radius: 8px; width: 90px; background: rgba(0,0,0,0.2); color: #fff; border: 1px solid var(--border);">
                <span>ج.م</span>
            </div>
        </div>
    `).join('');
}

window.saveShippingRates = async () => {
    const inputs = document.querySelectorAll('.shipping-input');
    const newRates = {};
    inputs.forEach(input => { newRates[input.dataset.gov] = Number(input.value); });
    try {
        await db.collection('settings').doc('shipping').set({ rates: newRates }, { merge: true });
        shippingRates = newRates;
        alert("✅ تم حفظ مصاريف الشحن بنجاح!");
    } catch (e) { alert("❌ خطأ في حفظ البيانات"); }
};

// --- Inventory Management ---
function renderInventory(data = products) {
    const list = document.getElementById('inventory-list');
    if (!list) return;
    list.innerHTML = data.map(p => {
        const stockStatus = p.stock <= 5 ? '<span style="color:var(--danger)">منخفض جداً</span>' : (p.stock <= 15 ? '<span style="color:var(--warning)">متوسط</span>' : '<span style="color:var(--success)">متوفر</span>');
        return `
            <tr>
                <td>
                    <div style="display:flex; align-items:center; gap:10px;">
                        <img src="${p.image}" class="product-img">
                        <span>${p.name}</span>
                    </div>
                </td>
                <td style="font-weight:bold; font-size:1.1rem;">${p.stock || 0}</td>
                <td>
                    <div style="display:flex; gap:5px;">
                        <input type="number" id="quick-stock-${p.id}" value="${p.stock || 0}" style="width:70px; padding:5px;">
                        <button onclick="updateQuickStock('${p.id}')" class="btn-primary" style="padding:5px 10px;"><i class="fas fa-save"></i></button>
                    </div>
                </td>
                <td>${stockStatus}</td>
            </tr>
        `;
    }).join('');
}

window.updateQuickStock = async (id) => {
    const newVal = Number(document.getElementById(`quick-stock-${id}`).value);
    try {
        await db.collection('products').doc(id).update({ stock: newVal });
        loadProducts(); // Reload to update state
        alert("تم تحديث المخزون");
    } catch (e) { alert("خطأ في التحديث"); }
};

document.getElementById('inventory-search')?.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    const filtered = products.filter(p => p.name.toLowerCase().includes(q));
    renderInventory(filtered);
});

// --- Analytics Logic ---
let salesChart = null;
let categoryChart = null;

function initAnalytics() {
    if (!orders.length) return;

    // 1. Sales Growth Chart (Last 7 days)
    const salesData = {};
    orders.forEach(o => {
        if (!o.createdAt) return;
        const date = o.createdAt.toDate().toLocaleDateString('en-US');
        salesData[date] = (salesData[date] || 0) + (Number(o.total) || 0);
    });

    const labels = Object.keys(salesData).slice(-7);
    const values = labels.map(l => salesData[l]);

    const ctx = document.getElementById('salesChart').getContext('2d');
    if (salesChart) salesChart.destroy();
    salesChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'المبيعات اليومية',
                data: values,
                borderColor: '#e20613',
                tension: 0.4,
                fill: true,
                backgroundColor: 'rgba(226, 6, 19, 0.1)'
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });

    // 2. Category Distribution
    const catCounts = {};
    products.forEach(p => {
        catCounts[p.category] = (catCounts[p.category] || 0) + 1;
    });

    const ctx2 = document.getElementById('categoryChart').getContext('2d');
    if (categoryChart) categoryChart.destroy();
    categoryChart = new Chart(ctx2, {
        type: 'doughnut',
        data: {
            labels: Object.keys(catCounts).map(id => categories.find(c => c.id === id)?.name || id),
            datasets: [{
                data: Object.values(catCounts),
                backgroundColor: ['#e20613', '#2196F3', '#4CAF50', '#FF9800', '#9C27B0']
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });

    // 3. Extra Stats
    const avgOrder = orders.length ? orders.reduce((s, o) => s + (Number(o.total) || 0), 0) / orders.length : 0;
    const maxSales = Math.max(...Object.values(salesData), 0);

    document.getElementById('stat-avg-order').innerText = `${Math.round(avgOrder)} ج.م`;
    document.getElementById('stat-max-sales').innerText = `${maxSales.toLocaleString()} ج.م`;
}
// --- Dynamic Categories Logic ---
let categories = [];
async function loadCategories() {
    db.collection('categories').onSnapshot(snapshot => {
        categories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log("📂 Categories Loaded:", categories.length);
        renderCategories();
        updateCatDropdowns();
        renderProducts(); // Important: Re-render products to show category names
    });
}

function renderCategories() {
    const list = document.getElementById('categories-tree-list');
    if (!list) return;

    list.innerHTML = '';
    const roots = categories.filter(c => !c.parentId);
    
    roots.forEach(root => {
        renderCategoryBranch(root, 0, list);
    });
}

function renderCategoryBranch(cat, level, container) {
    const children = categories.filter(c => c.parentId === cat.id);
    const productCount = products.filter(p => p.category === cat.id || p.subCategory === cat.id).length;
    
    const row = document.createElement('tr');
    const indent = level * 30;
    const isParent = children.length > 0;
    
    row.innerHTML = `
        <td style="padding-right: ${indent + 15}px;">
            <div style="display:flex; align-items:center; gap:10px;">
                ${isParent ? '<i class="fas fa-chevron-down" style="font-size:0.7rem; opacity:0.5;"></i>' : '<i class="far fa-circle" style="font-size:0.5rem; opacity:0.3;"></i>'}
                <span style="font-weight: ${level === 0 ? '900' : '600'}; font-size: ${level === 0 ? '1rem' : '0.9rem'};">
                    ${cat.name}
                </span>
            </div>
        </td>
        <td style="text-align:center;">
            <span class="status-badge" style="background: ${level === 0 ? 'rgba(212,175,55,0.1)' : 'rgba(255,255,255,0.05)'}; color: ${level === 0 ? 'var(--primary)' : '#fff'};">
                ${level === 0 ? 'رئيسي' : `فرعي (${level})`}
            </span>
        </td>
        <td style="text-align:center; opacity:0.7;">${productCount} منتج</td>
        <td>
            <div style="display:flex; gap:15px; justify-content:center;">
                <button onclick="editCategory('${cat.id}')" style="color:var(--secondary); background:none; border:none; cursor:pointer; font-size:1.1rem;"><i class="fas fa-edit"></i></button>
                <button onclick="deleteCategory('${cat.id}')" style="color:var(--danger); background:none; border:none; cursor:pointer; font-size:1.1rem;"><i class="fas fa-trash"></i></button>
            </div>
        </td>
    `;
    container.appendChild(row);
    
    children.forEach(child => {
        renderCategoryBranch(child, level + 1, container);
    });
}

window.openCategoryModal = (id = null) => {
    const modal = document.getElementById('category-modal');
    const form = document.getElementById('category-form');
    const title = document.getElementById('cat-modal-title');
    const idInput = document.getElementById('cat-id');
    const parentSelect = document.getElementById('cat-parent');

    // Populate parent dropdown hierarchically
    parentSelect.innerHTML = '<option value="">-- بدون أب (قسم رئيسي) --</option>';
    const roots = categories.filter(c => !c.parentId);
    
    const addOptions = (cat, level, currentId) => {
        if (cat.id === currentId) return;
        const indent = level > 0 ? "\u00A0\u00A0".repeat(level) + "↳ " : "";
        const option = document.createElement('option');
        option.value = cat.id;
        option.innerText = indent + cat.name;
        parentSelect.appendChild(option);
        
        const children = categories.filter(c => c.parentId === cat.id);
        children.forEach(child => addOptions(child, level + 1, currentId));
    };

    roots.forEach(root => addOptions(root, 0, id));

    if (id) {
        const cat = categories.find(c => c.id === id);
        idInput.value = cat.id;
        document.getElementById('cat-name').value = cat.name;
        parentSelect.value = cat.parentId || "";
        title.innerText = "تعديل القسم";
    } else {
        form.reset();
        idInput.value = "";
        title.innerText = "إضافة قسم جديد";
    }
    modal.style.display = 'flex';
};

window.editCategory = (id) => openCategoryModal(id);

window.closeCategoryModal = () => document.getElementById('category-modal').style.display = 'none';

document.getElementById('category-form').onsubmit = async (e) => {
    e.preventDefault();
    const id = document.getElementById('cat-id').value;
    const data = {
        name: document.getElementById('cat-name').value,
        parentId: document.getElementById('cat-parent').value || null
    };
    try {
        if (id) {
            await db.collection('categories').doc(id).update(data);
        } else {
            await db.collection('categories').add(data);
        }
        closeCategoryModal();
        // loadCategories is automatically called by onSnapshot
    } catch (e) { alert("خطأ في الحفظ"); }
};

window.deleteCategory = async (id) => {
    if (confirm("حذف هذا القسم؟")) {
        await db.collection('categories').doc(id).delete();
        loadCategories();
    }
};

function updateCatDropdowns() {
    const pCatSelect = document.getElementById('p-category');
    if (!pCatSelect) return;
    
    pCatSelect.innerHTML = '<option value="" disabled selected>اختر القسم (رئيسي أو فرعي)...</option>';
    
    // Build tree
    const roots = categories.filter(c => !c.parentId);
    
    const addOptions = (cat, level) => {
        // Use non-breaking spaces for proper indentation in RTL/LTR mix
        const indent = level > 0 ? "\u00A0\u00A0".repeat(level) + "↳ " : "";
        const option = document.createElement('option');
        option.value = cat.id;
        option.innerText = indent + cat.name;
        pCatSelect.appendChild(option);
        
        const children = categories.filter(c => c.parentId === cat.id);
        children.forEach(child => addOptions(child, level + 1));
    };

    roots.forEach(root => addOptions(root, 0));
}

// Sub-products dropdown is no longer needed since p-category handles the whole tree
window.updateSubCatsDropdown = () => {};

// Note: Deduplicated and moved to line 128

window.toggleSidebar = function () {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.classList.toggle('active');
    }
};

document.addEventListener('click', (e) => {
    const sidebar = document.querySelector('.sidebar');
    const menuToggle = document.querySelector('.menu-toggle');
    if (window.innerWidth <= 992 && sidebar && sidebar.classList.contains('active')) {
        if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
            sidebar.classList.remove('active');
        }
    }

    // Close color pickers when clicking outside
    if (!e.target.closest('.color-picker-grid') && !e.target.closest('[onclick="toggleColorPicker(this)"]')) {
        document.querySelectorAll('.color-picker-grid').forEach(p => p.style.display = 'none');
    }
});

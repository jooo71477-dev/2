// 🚀 iCloth ADMIN ENGINE - COMPREHENSIVE VERSION
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

// --- APP CONFIGURATION ---
const ADMIN_EMAIL = "jooo71477@gmail.com";
const ADMIN_EMAILS = ["jooo714777@gmail.com", "jooo71477@gmail.com", "products@icloth-fashion-store.com"];

// 🚚 BOSTA PROXY (Cloudflare Worker)
const BOSTA_PROXY_URL = "https://bosta-proxy.jooo71477.workers.dev";

const governorates = [
    "القاهرة", "الجيزة", "الإسكندرية", "الدقهلية", "البحر الأحمر", "البحيرة", "الفيوم", "الغربية", "الإسماعيلية", "المنوفية", "المنيا", "القليوبية", "الوادي الجديد", "السويس", "الشرقية", "دمياط", "بورسعيد", "جنوب سيناء", "كفر الشيخ", "مطروح", "الأقصر", "قنا", "شمال سيناء", "سوهاج", "بني سويف", "أسيوط", "أسوان"
];
// Common Colors are now handled by ColorSystem class in colors_system.js



// State
let products = [];
let orders = [];
let users = [];
let currentAdmin = null;

// Auth System

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
        
        // Initial Land: Load data for the section we are in
        const currentHash = window.location.hash.replace('#', '') || 'overview';
        showSection(currentHash);
    } catch (err) {
        console.error("❌ Dashboard Init Error:", err);
    }
}

let productsListener = null;
let ordersListener = null;

async function loadProducts() {
    if (productsListener) return;
    productsListener = db.collection('products').onSnapshot(snapshot => {
        products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderProducts();
        updateStats();
    });
}

async function loadOrders() {
    if (ordersListener) return;
    ordersListener = db.collection('orders').orderBy('createdAt', 'desc').onSnapshot(snapshot => {
        orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderOrders();
        updateStats();
    });
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
    
    // Sort by sortOrder (asc), items without sortOrder go to the end
    data.sort((a, b) => {
        const orderA = a.sortOrder !== undefined ? a.sortOrder : 999999;
        const orderB = b.sortOrder !== undefined ? b.sortOrder : 999999;
        return orderA - orderB;
    });

    list.innerHTML = data.map(p => {
        // Log individual product price to console for debugging
        if (p.oldPrice) console.log(`🔍 Product [${p.name}] has oldPrice: ${p.oldPrice}`);

        // استخدام thumbnail صغير للعرض في الجدول بدل الصورة الكاملة
        const displayImg = p.colorVariants?.[0]?.thumbnail
            || p.thumbnail
            || (p.image && p.image.length < 50000 ? p.image : '')
            || '';
        return `
        <tr data-id="${p.id}">
            <td class="drag-handle" style="cursor: move; text-align: center; width: 40px; color: var(--primary); font-size: 1.1rem; border-right: 1px solid rgba(255,255,255,0.05);"><i class="fas fa-bars"></i></td>
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

    // --- Initialize Drag and Drop ---
    if (window.Sortable && list) {
        new Sortable(list, {
            handle: '.drag-handle',
            animation: 150,
            onEnd: async function() {
                console.log("🔄 Order changed, syncing with DB...");
                await syncProductOrder();
            }
        });
    }
}

async function syncProductOrder() {
    const rows = document.querySelectorAll('#products-list tr');
    const batch = db.batch();
    
    // Show some feedback (alert or small toast could be here)
    console.log("📦 Syncing new sort order to Firestore...");
    try {
        rows.forEach((row, index) => {
            const id = row.getAttribute('data-id');
            if (id) {
                const ref = db.collection('products').doc(id);
                batch.update(ref, { sortOrder: index });
                
                // Update local state too
                const pIdx = products.findIndex(prod => prod.id === id);
                if (pIdx !== -1) products[pIdx].sortOrder = index;
            }
        });
        await batch.commit();
        console.log("✅ Order updated in Firestore");
    } catch (err) {
        console.error("❌ Failed to sync order:", err);
        alert("فشل تحديث الترتيب في قاعدة البيانات");
    }
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
        if (document.getElementById('p-badge-ar')) document.getElementById('p-badge-ar').value = p.badge_ar || '';

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
                v.thumbnail || '',
                v.inventory || {}
            );
            vContainer.appendChild(div);
            updateVariantPreviews(div);
            // Trigger inventory grid generation
            const sizesInput = div.querySelector('.v-sizes');
            if (sizesInput) updateInventoryInputs(sizesInput);
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
        if (document.getElementById('p-badge-ar')) document.getElementById('p-badge-ar').value = "";
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
        
        // Collect per-size inventory
        const inventory = {};
        item.querySelectorAll('.size-stock-input').forEach(input => {
            const size = input.getAttribute('data-size');
            inventory[size] = Number(input.value) || 0;
        });

        variants.push({
            name: item.querySelector('.v-name').value,
            images: images,
            thumbnail: thumbnail,
            sizes: item.querySelector('.v-sizes').value.split(',').map(s => s.trim()).filter(s => s !== ""),
            stock: Number(item.querySelector('.v-stock').value) || 0,
            inventory: inventory
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
        badge_ar: document.getElementById('p-badge-ar') ? document.getElementById('p-badge-ar').value : '',
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
            // Set initial sortOrder for new products to be at the end
            const maxOrder = products.reduce((max, p) => Math.max(max, p.sortOrder || 0), 0);
            data.sortOrder = maxOrder + 1;
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
    if (input) {
        input.value = value;
        updateInventoryInputs(input);
    }
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
    let picker = parent.querySelector('.color-picker-grid');
    
    if (!picker) {
        // Create the picker dynamically if it doesn't exist
        picker = document.createElement('div');
        picker.className = 'color-picker-grid';
        picker.style.cssText = `
            display: none; 
            flex-wrap: wrap; 
            gap: 10px; 
            background: #111; 
            padding: 20px; 
            border: 1px solid var(--primary); 
            border-radius: 12px;
            margin-top: 10px;
            max-height: 400px;
            overflow-y: auto;
            box-shadow: 0 10px 40px rgba(0,0,0,0.5);
            width: 100%;
            z-index: 100;
        `;
        
        // Add search input inside picker
        const searchUI = `
            <div style="width: 100%; margin-bottom: 20px;">
                <input type="text" class="color-search-input" placeholder="Search 400+ colors..." 
                       style="width: 100%; padding: 12px; border-radius: 8px; background: #000; border: 1px solid #333; color: #fff; font-family: 'Cairo';"
                       oninput="window.filterAdminColors(this)">
            </div>
            <div class="swatches-container" style="display: flex; flex-wrap: wrap; gap: 12px; justify-content: center;">
                ${ColorSystem.registry.map(c => `
                    <div class="color-swatch-item-admin" 
                         data-name="${c.nameAr}" 
                         data-en="${c.nameEn}" 
                         onclick="window.setQuickColor(this, '${c.nameAr}')"
                         style="width: 75px; display: flex; flex-direction: column; align-items: center; gap: 5px; cursor: pointer; transition: 0.2s; padding: 5px; border-radius: 8px;">
                        
                        <div style="width: 45px; height: 45px; background: ${c.hex}; border-radius: 8px; border: 2px solid rgba(255,255,255,0.1); transition: 0.2s;"></div>
                        
                        <span style="font-size: 0.65rem; color: #ccc; text-align: center; font-family: 'Cairo'; line-height: 1.2; word-break: break-all; width: 100%;">
                            ${c.nameAr}
                        </span>
                    </div>
                `).join('')}
            </div>
        `;
        picker.innerHTML = searchUI;
        parent.appendChild(picker);
    }

    const isVisible = picker.style.display === 'flex' || picker.style.display === 'block';
    document.querySelectorAll('.color-picker-grid').forEach(p => p.style.display = 'none');
    picker.style.display = isVisible ? 'none' : 'block';
    
    if (!isVisible) {
        const input = picker.querySelector('.color-search-input');
        if (input) { input.value = ''; input.focus(); }
    }
};

window.filterAdminColors = (input) => {
    const query = input.value.toLowerCase().trim();
    const picker = input.closest('.color-picker-grid');
    const swatches = picker.querySelectorAll('.color-swatch-item-admin');
    
    swatches.forEach(s => {
        const name = s.getAttribute('data-name').toLowerCase();
        const en = s.getAttribute('data-en').toLowerCase();
        if (name.includes(query) || en.includes(query) || query === '') {
            s.style.display = 'flex';
        } else {
            s.style.display = 'none';
        }
    });
};


function buildVariantHTML(name, images, sizes, stock, thumbnail) {
    const sortedReg = [...ColorSystem.registry].sort((a,b) => a.hue - b.hue);
    
    const colorOptionsUI = sortedReg.map(c => `
        <div class="color-swatch-item-admin" 
             onclick="setQuickColor(this, '${c.nameAr}')" 
             title="${c.nameAr} / ${c.nameEn}" 
             data-name="${c.nameAr}" 
             data-en="${c.nameEn}"
             style="width:32px; height:32px; background:${c.hex}; border-radius:8px; cursor:pointer; border:2px solid rgba(255,255,255,0.1); transition:0.2s; position:relative;">
        </div>
    `).join('');

    const colorDatalist = `
        <datalist id="color-suggestions">
            ${ColorSystem.registry.map(c => `<option value="${c.nameAr}"><option value="${c.nameEn}">`).join('')}
        </datalist>
    `;

    return `
        <div class="form-grid">
            <div class="form-group" style="position:relative;">
                <label>اسم اللون (مثلاً: أسود)</label>
                <div style="display:flex; gap:8px;">
                    <input type="text" class="v-name" value="${name}" placeholder="..." required list="color-suggestions">
                    ${colorDatalist}
                    <button type="button" class="btn-mini" onclick="toggleColorPicker(this)" style="padding:0 12px; height:42px; display:flex; align-items:center; justify-content:center; background:rgba(212,175,55,0.1); border-color:var(--primary); color:var(--primary);">
                        <i class="fas fa-palette"></i>
                    </button>
                </div>
                <!-- Color Picker Popover Enhanced -->
                <div class="color-picker-grid" style="display:none; position:absolute; top:calc(100% + 5px); right:0; z-index:1000; background:#1a1a1a; border:1px solid var(--border); border-radius:16px; padding:15px; flex-direction:column; gap:12px; box-shadow:0 15px 40px rgba(0,0,0,0.9); width:280px;">
                    <div style="display:flex; flex-direction:column; gap:8px;">
                        <div style="font-size: 0.8rem; font-weight:bold; color: var(--primary);">اختر لون اللون:</div>
                        <input type="text" class="color-search-input" placeholder="بحث عن لون..." oninput="window.filterAdminColors(this)" style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:8px; padding:8px 12px; font-size:0.8rem; color:#fff; width:100%;">
                    </div>
                    <div class="swatches-container" style="display:grid; grid-template-columns: repeat(6, 1fr); gap:8px; max-height:200px; overflow-y:auto; padding-right:5px; scrollbar-width: thin; scrollbar-color: var(--primary) transparent;">
                        ${colorOptionsUI}
                    </div>
                    <div style="font-size: 0.7rem; color: var(--text-dim); opacity:0.6; text-align:center; border-top:1px solid rgba(255,255,255,0.05); padding-top:8px;">
                        يوجد ${ColorSystem.registry.length} لون متاح
                    </div>
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
            <div class="form-group" style="grid-column: span 2;">
                <label>إدارة المخزون لكل مقاس (اختياري: اكتب الكمية بجانب كل مقاس)</label>
                <div class="v-inventory-grid" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); gap:10px; margin-top:8px;">
                    <!-- Auto-populated via JS -->
                </div>
                <input type="hidden" class="v-inventory-data" value='${typeof inventory === "object" ? JSON.stringify(inventory) : (inventory || "{}")}'>
                <div style="margin-top:10px;">
                    <label style="font-size:0.8rem; opacity:0.8;">الكمية الإجمالية (يتم تحديثها تلقائياً)</label>
                    <input type="number" class="v-stock" value="${stock}" readonly style="background:rgba(255,255,255,0.05); color:var(--primary); font-weight:bold;">
                </div>
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
window.uploadProductImage = uploadProductImage;
window.uploadSizeChart = uploadSizeChart;

async function uploadCategoryImage(input) {
    const file = input.files[0];
    if (!file) return;

    const parentBtn = input.parentElement;
    const originalHTML = parentBtn.innerHTML;
    const preview = document.getElementById('cat-image-preview');
    const hiddenInput = document.getElementById('cat-image');

    parentBtn.style.pointerEvents = 'none';
    parentBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

    try {
        const imageUrl = await uploadToCloudinary(file);
        if (hiddenInput) hiddenInput.value = imageUrl;
        if (preview) {
            preview.src = imageUrl;
            preview.style.display = 'block';
        }
        console.log("✅ Category image uploaded!");
    } catch (e) {
        console.warn("⚠️ Cloudinary failed, falling back to local compression...", e);
        const compressedBase64 = await compressImage(file, 600, 0.6);
        if (hiddenInput) hiddenInput.value = compressedBase64;
        if (preview) {
            preview.src = compressedBase64;
            preview.style.display = 'block';
        }
    } finally {
        parentBtn.style.pointerEvents = 'auto';
        parentBtn.innerHTML = originalHTML;
    }
}
window.uploadCategoryImage = uploadCategoryImage;

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
        const orderRef = db.collection('orders').doc(id);
        const orderDoc = await orderRef.get();
        if (!orderDoc.exists) return;
        const orderData = orderDoc.data();

        // 🛑 Decrease stock only if status changes to "shipped" AND not already updated
        if ((status === 'shipping' || status === 'تم الشحن') && !orderData.stockUpdated) {
            await decreaseInventoryStock(orderData.items);
            await orderRef.update({ status, stockUpdated: true });
        } else {
            await orderRef.update({ status });
        }

        if (typeof loadOrders === 'function') loadOrders();
        alert("تم تحديث حالة الطلب");
    } catch (err) {
        console.error("Update Status Error:", err);
        alert("خطأ في التحديث");
    }
};

async function decreaseInventoryStock(items) {
    if (!items || !items.length) return;
    console.log("🚚 Starting stock decrement for items:", items);
    for (const item of items) {
        try {
            const productRef = db.collection('products').doc(item.id);
            const pDoc = await productRef.get();
            if (pDoc.exists) {
                const pData = pDoc.data();
                let colorVariants = pData.colorVariants || [];
                
                // Robust matching for Color
                const vIdx = colorVariants.findIndex(v => {
                    const vName = String(v.name || "").toLowerCase().trim();
                    const vNameAr = String(v.name_ar || "").toLowerCase().trim();
                    const targetColor = String(item.color || "").toLowerCase().trim();
                    return vName === targetColor || vNameAr === targetColor;
                });

                if (vIdx !== -1) {
                    let variant = colorVariants[vIdx];
                    if (!variant.sizeStock) variant.sizeStock = {};
                    
                    const targetSize = String(item.size || "").trim();
                    const currentStock = Number(variant.sizeStock[targetSize]) || 0;
                    const decrementQty = Number(item.quantity || 1);
                    
                    variant.sizeStock[targetSize] = Math.max(0, currentStock - decrementQty);
                    
                    // Recalculate variant total stock
                    variant.stock = Object.values(variant.sizeStock).reduce((a, b) => a + (Number(b) || 0), 0);
                    colorVariants[vIdx] = variant;
                    
                    const newTotalStock = colorVariants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0);
                    await productRef.update({ colorVariants, stock: newTotalStock });
                    console.log(`✅ [STOCK SUCCESS] Decreased ${item.name} (${item.color}/${item.size}): ${currentStock} -> ${variant.sizeStock[targetSize]}`);
                } else {
                    console.warn(`⚠️ [STOCK WARN] Color variant NOT FOUND for "${item.color}" in product ${item.id}`);
                }
            } else {
                console.error(`❌ [STOCK ERROR] Product NOT FOUND: ${item.id}`);
            }
        } catch (e) {
            console.error("❌ [STOCK EXCEPTION]:", e);
        }
    }
}
window.decreaseInventoryStock = decreaseInventoryStock;

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
                    ${o.trackingNumber ? `
                        <button onclick="window.open('https://bosta.co/tracking-requests/${o.trackingNumber}', '_blank')" style="color:#4CAF50; background:none; border:none; cursor:pointer; font-size:1.1rem;" title="تتبع الشحنة">
                            <i class="fas fa-truck"></i>
                        </button>
                    ` : `
                        <button id="bosta-btn-tab-${o.id}" onclick="shipToBosta('${o.id}')" style="color:#e20613; background:none; border:none; cursor:pointer; font-size:1.1rem;" title="ارسل لبوسطة">
                            <i class="fas fa-shipping-fast"></i>
                        </button>
                    `}
                    <button onclick="openOrderDetails('${o.id}')" style="color:#d4af37; background:none; border:none; cursor:pointer; font-size:1.1rem;" title="عرض التفاصيل">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button onclick="deleteOrder('${o.id}')" style="color:#f44336; background:none; border:none; cursor:pointer; font-size:1.1rem;" title="حذف">
                        <i class="fas fa-trash-alt"></i>
                    </button>
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
                <h3 class="details-val" style="font-size: 1.1rem;">${o.paymentMethod === 'cod' ? '💵 عند الاستلام (شحن مدفوع)' : '📲 تحويل بنكي (مدفوع بالكامل)'}</h3>
            </div>
        </div>

        <!-- Breakdown of Payment Status -->
        <div class="details-card" style="background: rgba(212,175,55, 0.05); border: 1px dashed var(--primary); padding: 15px; border-radius: 12px; margin-top: -10px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px; font-size: 0.9rem;">
                <span opacity: 0.7;>إجمالي الطلب:</span>
                <span>${o.total} ج.م</span>
            </div>
            ${o.paymentMethod === 'cod' ? `
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px; font-size: 0.9rem; color: #4CAF50;">
                    <span>عربون جدية (مدفوع):</span>
                    <span>-100 ج.م</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-weight: bold; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 5px; color: gold; font-size: 1.1rem; margin-top: 5px;">
                    <span>المطلوب تحصيله (COD):</span>
                    <span>${Math.max(0, (o.total || 0) - 100)} ج.م</span>
                </div>
            ` : `
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px; font-size: 0.9rem; color: #4CAF50;">
                    <span>تم الدفع بالكامل سلفاً:</span>
                    <span>-${o.total} ج.م</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-weight: bold; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 5px; color: #888; font-size: 1.1rem; margin-top: 5px;">
                    <span>المطلوب تحصيله عند الاستلام:</span>
                    <span>0 ج.م</span>
                </div>
            `}
        </div>

        </div>

        <!-- 🚚 Bosta Shipping Control -->
        <div class="details-card">
            <div class="details-label">🚚 شحن بوسطة Bosta:</div>
            <div id="bosta-details-container-${o.id}">
                ${o.trackingNumber ? `
                    <div style="background: rgba(76,175,80,0.1); border: 1px solid #4CAF50; padding: 12px; border-radius: 12px; text-align: center;">
                        <p style="color:#4CAF50; font-weight:bold; margin-bottom:5px;">✅ تم الشحن بوسطة</p>
                        <p style="font-family:monospace; font-size:1rem; letter-spacing:1px; margin-bottom:10px;">${o.trackingNumber}</p>
                        <a href="https://bosta.co/tracking-requests/${o.trackingNumber}" target="_blank" style="display:inline-block; padding:8px 20px; background:#2196F3; color:#fff; text-decoration:none; border-radius:8px; font-size:0.9rem;">📦 تتبع الشحنة</a>
                    </div>
                ` : `
                    <button id="bosta-btn-det-${o.id}" onclick="shipToBosta('${o.id}')" style="width:100%; padding: 15px; background: linear-gradient(135deg, #e20613, #ff4444); border: none; color: #fff; font-weight: 900; font-size: 1.1rem; border-radius: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; transition: all 0.3s; box-shadow: 0 4px 15px rgba(226, 6, 19, 0.3);">
                        <i class="fas fa-shipping-fast"></i> ارسل لشركة الشحن Bosta
                    </button>
                `}
            </div>
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

// 🚚 BOSTA SHIPPING LOGIC (VIA CLOUDFLARE PROXY)
async function shipToBosta(orderId) {
    const btnTab = document.getElementById(`bosta-btn-tab-${orderId}`);
    const btnDet = document.getElementById(`bosta-btn-det-${orderId}`);
    
    const setBtnLoading = (loading) => {
        const text = loading ? '<i class="fas fa-spinner fa-spin"></i> جاري...' : '<i class="fas fa-shipping-fast"></i> ارسل لبوسطة';
        if (btnTab) { btnTab.disabled = loading; btnTab.innerHTML = text; }
        if (btnDet) { btnDet.disabled = loading; btnDet.innerHTML = text; }
    };

    if (!confirm("هل تريد إرسال هذا الطلب لشركة بوسطة فعلاً؟")) return;

    setBtnLoading(true);

    try {
        const doc = await db.collection('orders').doc(orderId).get();
        if (!doc.exists) throw new Error("الطلب غير موجود");
        const order = doc.data();

        const nameParts = (order.customerName || "عميل").split(" ");
        const payload = {
            type: 10,
            specs: { 
                packageDetails: { 
                    itemsCount: (order.items || []).reduce((s, i) => s + (i.quantity || 1), 0), 
                    description: (order.items || []).map(i => i.name).join(", ") 
                } 
            },
            notes: order.notes || "",
            cod: order.paymentMethod === 'cod' ? (Math.max(0, (order.total || 0) - 100)) : 0,
            dropOffAddress: {
                city: mapToBostaCity(order.gov),
                firstLine: order.address || "غير محدد",
                district: order.district || "",
                buildingNumber: "1"
            },
            receiver: {
                firstName: nameParts[0] || "عميل",
                lastName: nameParts.slice(1).join(" ") || "icloth",
                phone: order.phone
            }
        };

        const response = await fetch(BOSTA_PROXY_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || result.error || "فشل الاتصال بوسطة");
        }

        const trackingNumber = result.trackingNumber || (result.data ? result.data.trackingNumber : null);
        
        if (!trackingNumber) {
            throw new Error("لم يتم استلام رقم تتبع من بوسطة");
        }

        await db.collection('orders').doc(orderId).update({
            trackingNumber: trackingNumber,
            status: "shipping",
            shippedAt: firebase.firestore.FieldValue.serverTimestamp(),
            stockUpdated: true 
        });

        // 🛑 Trigger stock decrement
        await decreaseInventoryStock(order.items);

        alert(`✅ تم إنشاء الشحنة بنجاح!\nرقم التتبع: ${trackingNumber}`);
        
        if (typeof loadOrders === 'function') loadOrders();

    } catch (err) {
        console.error("Bosta Error:", err);
        alert(`❌ خطأ في الشحن:\n${err.message}`);
        setBtnLoading(false);
    }
}

function mapToBostaCity(city) {
    const map = {
        'القاهرة': 'Cairo', 'الجيزة': 'Giza', 'الإسكندرية': 'Alexandria',
        'الدقهلية': 'Dakahlia', 'البحر الأحمر': 'Red Sea', 'البحيرة': 'Beheira',
        'الفيوم': 'Faiyum', 'الغربية': 'Gharbia', 'الإسماعيلية': 'Ismailia',
        'المنوفية': 'Monufia', 'المنيا': 'Minya', 'القليوبية': 'Qalyubia',
        'الوادي الجديد': 'New Valley', 'السويس': 'Suez', 'الشرقية': 'Sharqia',
        'دمياط': 'Damietta', 'بورسعيد': 'Port Said', 'جنوب سيناء': 'South Sinai',
        'كفر الشيخ': 'Kafr El Sheikh', 'مطروح': 'Matrouh', 'الأقصر': 'Luxor',
        'قنا': 'Qena', 'شمال سيناء': 'North Sinai', 'سوهاج': 'Sohag',
        'Beni Suef': 'بني سويف', 'Beni-Suef': 'بني سويف', 'بني سويف': 'Beni Suef', 
        'أسيوط': 'Asyut', 'أسوان': 'Aswan'
    };
    return map[city] || city;
}

window.deleteAllOrders = async () => {
    if (!confirm("🚨 تحذير: سيتم حذف كافة الطلبات نهائياً! هل أنت متأكد؟")) return;
    const items = await db.collection('orders').get();
    const batch = db.batch();
    items.forEach(doc => batch.delete(doc.ref));
    await batch.commit();
    alert("تم مسح كافة الطلبات بنجاح");
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
        const settingTransferWallet = document.getElementById('setting-transfer-wallet');
        if (settingTransferWallet) settingTransferWallet.value = s.transferWallet || s.transferVodafone || '';
        const settingTransferWalletName = document.getElementById('setting-transfer-wallet-name');
        if (settingTransferWalletName) settingTransferWalletName.value = s.transferWalletName || s.transferVodafoneName || '';

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
    const walletEl = document.getElementById('setting-transfer-wallet');
    const instapayEl = document.getElementById('setting-transfer-instapay');

    const walletNameEl = document.getElementById('setting-transfer-wallet-name');
    const instapayNameEl = document.getElementById('setting-transfer-instapay-name');
    const instapayLinkEl = document.getElementById('setting-transfer-instapay-link');

    const wa1 = wa1El ? wa1El.value : '';
    const wa2 = wa2El ? wa2El.value : '';
    const wallet = walletEl ? walletEl.value : '';
    const walletName = walletNameEl ? walletNameEl.value : '';
    const instapay = instapayEl ? instapayEl.value : '';
    const instapayName = instapayNameEl ? instapayNameEl.value : '';
    const instapayLink = instapayLinkEl ? instapayLinkEl.value : '';

    try {
        await db.collection('settings').doc('site').set({
            whatsapp: wa1,
            whatsapp2: wa2,
            transferWallet: wallet,
            transferWalletName: walletName,
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
        if (footerEl) footerEl.value = c.footerText || '© 2026 iCloth Store. جميع الحقوق محفوظة.';
        const shippingEl = document.getElementById('cms-shipping-policy');
        if (shippingEl) shippingEl.value = c.shippingPolicy || '';
        const returnsEl = document.getElementById('cms-returns-policy');
        if (returnsEl) returnsEl.value = c.returnsPolicy || '';
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
            <div class="form-group">
                <label>صورة الكمبيوتر</label>
                <input type="hidden" class="banner-desktop-url desktop-url" value="${data.desktopUrl}">
                <div style="display:flex; align-items:center; gap:10px;">
                    <label class="btn-primary" style="cursor:pointer; padding:8px; font-size:0.8rem; flex:1; text-align:center;">
                        <i class="fas fa-upload"></i> رفع صورة للموبايل و الكمبيوتر
                        <input type="file" hidden accept="image/*" onchange="uploadBannerPart(this, 'desktop')">
                    </label>
                    <img class="desktop-preview" src="${data.desktopUrl}" style="width:40px; height:40px; object-fit:cover; border-radius:5px; display:${data.desktopUrl ? 'block' : 'none'};">
                </div>
                <div class="upload-hint" style="font-size:0.75rem; opacity:0.6; margin-top:5px;"></div>
            </div>
            <div class="form-group">
                <label>صورة الموبايل (أختياري لو عاوز صورة مختلفة)</label>
                <input type="hidden" class="banner-mobile-url mobile-url" value="${data.mobileUrl}">
                <div style="display:flex; align-items:center; gap:10px;">
                    <label class="btn-primary" style="cursor:pointer; padding:8px; font-size:0.8rem; flex:1; text-align:center;">
                        <i class="fas fa-upload"></i> رفع صورة للموبايل فقط
                        <input type="file" hidden accept="image/*" onchange="uploadBannerPart(this, 'mobile')">
                    </label>
                    <img class="mobile-preview" src="${data.mobileUrl}" style="width:40px; height:40px; object-fit:cover; border-radius:5px; display:${data.mobileUrl ? 'block' : 'none'};">
                </div>
                <div class="upload-hint" style="font-size:0.75rem; opacity:0.6; margin-top:5px;"></div>
            </div>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 10px;">
            <div class="form-group">
                <label>العنوان الرئيسي</label>
                <input type="text" class="banner-title" value="${data.title}" placeholder="...">
            </div>
            <div class="form-group">
                <label>العنوان الفرعي</label>
                <input type="text" class="banner-subtitle" value="${data.subtitle}" placeholder="...">
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
    const statusHint = input.parentElement.parentElement.parentElement.querySelector('.upload-hint');
    const originalHint = statusHint.innerText;

    statusHint.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الرفع...';
    try {
        const url = await uploadToCloudinary(file);
        urlInput.value = url;
        preview.src = url;
        preview.style.display = 'block';
        statusHint.innerHTML = '✅ تم التجهيز';
    } catch (e) {
        statusHint.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري التحويل للحفظ محلياً... المرجو الانتظار';
        try {
            const base64 = await compressImageToBase64(file, type === 'desktop' ? 1440 : 800, 0.7);
            urlInput.value = base64;
            preview.src = base64;
            preview.style.display = 'block';
            statusHint.innerHTML = '✅ تم التجهيز (بتقنية الضغط الداخلي)';
        } catch (err) {
            alert("خطأ في معالجة الجزء المختار");
            statusHint.innerHTML = '❌ فشل المعالجة';
        }
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
            bannerTitle: banners.length > 0 ? banners[0].title : 'iCloth FASHION',
            promoText: promoEl ? promoEl.value : '',
            footerText: footerEl ? footerEl.value : '',
            shippingPolicy: document.getElementById('cms-shipping-policy')?.value || '',
            returnsPolicy: document.getElementById('cms-returns-policy')?.value || '',
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
    console.log("📂 Admin Section Change:", id);
    originalShowSection(id);
    
    // Trigger specific loaders
    if (id === 'overview') {
        updateStats();
        renderRecentOrders();
        renderTopSelling();
    }
    if (id === 'users') {
        if (users.length === 0) loadUsers().then(() => renderUsers());
        else renderUsers();
    }
    if (id === 'coupons') loadCoupons();
    if (id === 'settings') loadSettings();
    if (id === 'shipping') loadShippingRates();
    if (id === 'cms') loadCMS();
    if (id === 'categories') loadCategories();
    if (id === 'inventory') renderInventory();
    if (id === 'analytics') initAnalytics();
    if (id === 'announcements') loadAnnouncements();

    // Fix: Close sidebar on mobile after clicking
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    if (window.innerWidth <= 992) {
        if (sidebar) sidebar.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
    }
    
    // Sync Navigation Links (Sidebar & Mobile Tabs)
    document.querySelectorAll('.nav-links a, .mob-nav-item').forEach(l => {
        if (l.getAttribute('href') === `#${id}`) {
            l.classList.add('active');
        } else {
            l.classList.remove('active');
        }
    });
};

// Global Link for HTML Navigation
window.onSectionChange = (id) => showSection(id);

// Initial Load Handler: If we land on a specific hash, trigger its loader
window.addEventListener('DOMContentLoaded', () => {
    const startHash = window.location.hash.replace('#', '') || 'overview';
    // Small delay to ensure firebase/init is ready
    setTimeout(() => {
        if (currentAdmin) showSection(startHash);
    }, 1000);
});


// --- Inventory Management ---
function renderInventory(data = products) {
    const list = document.getElementById('inventory-list');
    if (!list) return;

    list.innerHTML = data.map(p => {
        let stockHtml = '';
        if (p.colorVariants && p.colorVariants.length > 0) {
            stockHtml = `<div style="display:flex; flex-direction:column; gap:10px;">`;
            p.colorVariants.forEach((v, vIndex) => {
                if (v.sizes) {
                    // Split the sizes if it's a string from legacy schema, or Array
                    const sizeArray = Array.isArray(v.sizes) ? v.sizes : v.sizes.split(',').map(s => s.trim()).filter(Boolean);
                    if (sizeArray.length > 0) {
                        stockHtml += `<div style="background:rgba(255,255,255,0.05); padding:8px; border-radius:8px;">
                            <strong style="color:var(--primary); font-size:0.85rem;">${v.name || 'بدون لون'}</strong>
                            <div style="display:flex; flex-wrap:wrap; gap:8px; margin-top:5px;">`;
                        sizeArray.forEach(size => {
                            const qty = v.inventory && v.inventory[size] !== undefined ? v.inventory[size] : 0;
                            stockHtml += `
                                <div style="display:flex; flex-direction:column; align-items:center; background:#000; border-radius:5px; padding:3px 5px; border:1px solid rgba(255,255,255,0.1);">
                                    <span style="font-size:0.7rem; color:#888;">${size}</span>
                                    <input type="number" id="quick-stock-${p.id}-${vIndex}-${size}" value="${qty}" style="width:40px; padding:2px; font-size:0.8rem; text-align:center; background:transparent; border:none; color:#fff; border-bottom:1px solid var(--primary);">
                                </div>
                            `;
                        });
                        stockHtml += `</div></div>`;
                    }
                }
            });
            stockHtml += `</div>`;
            if (stockHtml === `<div style="display:flex; flex-direction:column; gap:10px;"></div>`) {
                 stockHtml = `<span style="opacity:0.5;">لا توجد مقاسات</span>`;
            }
        } else {
            stockHtml = `<span style="opacity:0.5;">لا توجد الوان / مقاسات محددة</span>`;
        }

        const stockStatus = p.stock <= 5 ? '<span style="color:var(--danger)">منخفض جداً</span>' : (p.stock <= 15 ? '<span style="color:var(--warning)">متوسط</span>' : '<span style="color:var(--success)">متوفر</span>');
        return `
            <tr>
                <td>
                    <div style="display:flex; align-items:center; gap:10px;">
                        <img src="${p.image || p.thumbnail}" class="product-img" onerror="this.style.display='none'">
                        <span>${p.name}</span>
                    </div>
                </td>
                <td>${stockHtml}</td>
                <td>
                    <button onclick="saveQuickStockBreakdown('${p.id}')" class="btn-primary" style="padding:8px 15px; font-size:0.85rem;"><i class="fas fa-save"></i> حفظ المقاسات</button>
                    <div style="font-size:0.8rem; margin-top:5px; opacity:0.7;">إجمالي الكمية: ${p.stock || 0}</div>
                </td>
                <td>${stockStatus}</td>
            </tr>
        `;
    }).join('');
}

window.saveQuickStockBreakdown = async (id) => {
    const p = products.find(x => x.id === id);
    if (!p || !p.colorVariants) {
        alert("لا يوجد تفاصيل مخزون لهذا المنتج");
        return;
    }
    
    let totalStock = 0;
    const newVariants = p.colorVariants.map((v, vIndex) => {
        if (!v.sizes) return v;
        const newInv = { ...(v.inventory || {}) };
        const sizeArray = Array.isArray(v.sizes) ? v.sizes : v.sizes.split(',').map(s => s.trim()).filter(Boolean);
        sizeArray.forEach(size => {
            const input = document.getElementById(`quick-stock-${id}-${vIndex}-${size}`);
            if (input) {
                const val = parseInt(input.value) || 0;
                newInv[size] = val;
                totalStock += val;
            } else {
                 if (newInv[size]) totalStock += parseInt(newInv[size]);
            }
        });
        return { ...v, inventory: newInv, stock: Object.values(newInv).reduce((a,b)=>a+parseInt(b),0) };
    });

    try {
        await db.collection('products').doc(id).update({
            colorVariants: newVariants,
            stock: totalStock
        });
        loadProducts(); // automatically reloads the UI via snapshot usually, but fallback
        alert("تم تحديث وحفظ المخزون لكل المقاسات بنجاح");
    } catch (e) {
        alert("خطأ في الحفظ");
    }
};

window.updateQuickStock = async (id) => {
    // Kept for backward compatibility if any button uses it
    const el = document.getElementById(`quick-stock-${id}`);
    if(!el) return;
    const newVal = Number(el.value);
    try {
        await db.collection('products').doc(id).update({ stock: newVal });
        loadProducts(); 
        alert("تم تحديث المخزون");
    } catch (e) { alert("خطأ في التحديث"); }
};

document.getElementById('inventory-search')?.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    const filtered = products.filter(p => p.name.toLowerCase().includes(q));
    renderInventory(filtered);
});

// --- Hyper-Professional Analytics Logic ---
let salesChart = null;
let categoryChart = null;

function initAnalytics() {
    if (!orders.length) return;

    // 1. Core Financial Metrics
    const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    const totalOrders = orders.length;
    
    // Count unique customers (by email or phone)
    const uniqueUsers = new Set(orders.map(o => o.email || o.phone)).size;
    const avgOrder = totalOrders ? totalRevenue / totalOrders : 0;

    // Update Metric Cards
    document.getElementById('stat-total-revenue').innerText = `${totalRevenue.toLocaleString()} ج.م`;
    document.getElementById('stat-total-orders').innerText = totalOrders.toLocaleString();
    document.getElementById('stat-total-users').innerText = uniqueUsers.toLocaleString();
    document.getElementById('stat-avg-order').innerText = `${Math.round(avgOrder).toLocaleString()} ج.م`;

    // 2. Sales Timeline (Last 30 Days)
    const salesTimeline = {};
    const last30Days = [];
    for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dayStr = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
        last30Days.push(dayStr);
        salesTimeline[dayStr] = 0;
    }

    orders.forEach(o => {
        if (!o.createdAt) return;
        const d = o.createdAt.toDate();
        const dayStr = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
        if (salesTimeline.hasOwnProperty(dayStr)) {
            salesTimeline[dayStr] += (Number(o.total) || 0);
        }
    });

    const ctx = document.getElementById('salesChart').getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(212, 175, 55, 0.4)');
    gradient.addColorStop(1, 'rgba(212, 175, 55, 0)');

    if (salesChart) salesChart.destroy();
    salesChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: last30Days,
            datasets: [{
                label: 'المبيعات اليومية',
                data: last30Days.map(d => salesTimeline[d]),
                borderColor: '#d4af37',
                borderWidth: 4,
                pointBackgroundColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 7,
                tension: 0.4,
                fill: true,
                backgroundColor: gradient
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { grid: { color: 'rgba(255,255,255,0.05)' }, border: { display: false } },
                x: { grid: { display: false }, border: { display: false } }
            }
        }
    });

    // 3. Category Intelligence (Based on Inventory & Orders)
    const catOrders = {};
    orders.forEach(o => {
        (o.items || []).forEach(item => {
            const cat = item.category || 'غير مصنف';
            catOrders[cat] = (catOrders[cat] || 0) + (item.quantity || 1);
        });
    });

    const ctx2 = document.getElementById('categoryChart').getContext('2d');
    if (categoryChart) categoryChart.destroy();
    categoryChart = new Chart(ctx2, {
        type: 'doughnut',
        data: {
            labels: Object.keys(catOrders),
            datasets: [{
                data: Object.values(catOrders),
                backgroundColor: ['#d4af37', '#00d2ff', '#ff007a', '#4caf50', '#9c27b0', '#ffffff'],
                borderWidth: 0,
                hoverOffset: 20
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { color: '#fff', padding: 20, font: { family: 'Cairo' } } }
            },
            cutout: '70%'
        }
    });

    // 4. Top Selling Products
    const productStats = {};
    orders.forEach(o => {
        (o.items || []).forEach(item => {
            if (!productStats[item.id]) {
                productStats[item.id] = { name: item.name, count: 0, revenue: 0 };
            }
            productStats[item.id].count += (item.quantity || 1);
            productStats[item.id].revenue += (item.price * (item.quantity || 1));
        });
    });

    const topProducts = Object.values(productStats).sort((a,b) => b.count - a.count).slice(0, 5);
    const topListEl = document.getElementById('top-products-list');
    if (topListEl) {
        topListEl.innerHTML = topProducts.map(p => `
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.02);">
                <td style="padding: 15px; font-weight: 700;">${p.name}</td>
                <td style="padding: 15px; color: var(--primary); font-weight: 900;">${p.count}</td>
                <td style="padding: 15px; opacity: 0.6;">${p.revenue.toLocaleString()} ج.م</td>
            </tr>
        `).join('');
    }

    // 5. Geographic Distribution
    const geoStats = {};
    orders.forEach(o => {
        const gov = o.governorate || 'غير معروف';
        geoStats[gov] = (geoStats[gov] || 0) + 1;
    });

    const geoListEl = document.getElementById('geo-distribution-list');
    if (geoListEl) {
        const sortedGeo = Object.entries(geoStats).sort((a,b) => b[1] - a[1]).slice(0, 6);
        geoListEl.innerHTML = sortedGeo.map(([gov, count]) => {
            const percentage = Math.round((count / totalOrders) * 100);
            return `
                <div style="margin-bottom: 20px;">
                    <div style="display: flex; justify-content: space-between; font-size: 0.9rem; margin-bottom: 8px;">
                        <span><i class="fas fa-location-dot" style="margin-left: 10px; color: var(--primary);"></i> ${gov}</span>
                        <span style="font-weight: 900;">${count} طلباً (${percentage}%)</span>
                    </div>
                    <div style="width: 100%; height: 6px; background: rgba(255,255,255,0.05); border-radius: 10px; overflow: hidden;">
                        <div style="width: ${percentage}%; height: 100%; background: var(--primary); border-radius: 10px; box-shadow: 0 0 10px var(--gold-glow);"></div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // 6. Operation Pulse (Status Monitor)
    let delivered = 0, pending = 0, cancelled = 0;
    orders.forEach(o => {
        const s = (o.status || '').toLowerCase();
        if (s === 'delivered' || s === 'completed' || s === 'تم التوصيل') delivered++;
        else if (s === 'cancelled' || s === 'canceled' || s === 'ملغي') cancelled++;
        else pending++;
    });
    document.getElementById('stat-delivered-count').innerText = delivered;
    document.getElementById('stat-pending-count').innerText = pending;
    document.getElementById('stat-cancelled-count').innerText = cancelled;

    // 7. Brand Loyalty Pulse (Repeat Customers)
    const userOrderCounts = {};
    orders.forEach(o => {
        const key = (o.email || o.phone || 'anon').toLowerCase();
        userOrderCounts[key] = (userOrderCounts[key] || 0) + 1;
    });
    const totalUnique = Object.keys(userOrderCounts).length;
    const repeatUsers = Object.values(userOrderCounts).filter(c => c > 1).length;
    const repeatRate = totalUnique ? Math.round((repeatUsers / totalUnique) * 100) : 0;
    document.getElementById('stat-repeat-rate').innerText = `${repeatRate}%`;

    // 8. Basket Analysis
    let totalItemsInAllOrders = 0;
    orders.forEach(o => {
        (o.items || []).forEach(i => totalItemsInAllOrders += (i.quantity || 1));
    });
    const basketAvg = totalOrders ? (totalItemsInAllOrders / totalOrders).toFixed(1) : '0.0';
    document.getElementById('stat-basket-avg').innerText = basketAvg;

    // 9. Payment Intelligence
    const paymentStats = {};
    orders.forEach(o => {
        const p = o.paymentMethod || 'كاش';
        paymentStats[p] = (paymentStats[p] || 0) + 1;
    });
    
    // Find favorite
    const favoritePayment = Object.entries(paymentStats).sort((a,b) => b[1] - a[1])[0]?.[0] || '-';
    document.getElementById('stat-fav-payment').innerText = favoritePayment;

    // New Payment Chart
    const ctx3 = document.getElementById('paymentChart').getContext('2d');
    if (window.paymentChartObj) window.paymentChartObj.destroy();
    window.paymentChartObj = new Chart(ctx3, {
        type: 'pie',
        data: {
            labels: Object.keys(paymentStats),
            datasets: [{
                data: Object.values(paymentStats),
                backgroundColor: ['#00d2ff', '#d4af37', '#ff007a', '#4caf50'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'right', labels: { color: '#fff', font: { family: 'Cairo' } } }
            }
        }
    });
}

// --- Excel Export Engine ---
window.exportOrdersToExcel = function() {
    if (!orders || orders.length === 0) {
        alert("لا توجد طلبات لتصديرها!");
        return;
    }

    try {
        const EXCEL_LIMIT = 30000; // Lowered for extra safety with Arabic/Multi-byte chars
        const safeStr = (val) => {
            if (val === null || val === undefined) return '---';
            let s = String(val);
            if (s.startsWith('data:image')) return "[صورة Base64 - طويلة جداً للإكسل]";
            if (s.length > EXCEL_LIMIT) return s.substring(0, EXCEL_LIMIT) + "... [تم تقليص النص لطوله الزائد]";
            return s;
        };

        const data = orders.map(o => {
            // Formatting Items summary with all details
            const itemsSummary = (o.items || []).map(i => 
                `${i.name} - ${i.color || '---'} - ${i.size || '---'} (كود: ${i.code || '---'}) [${i.quantity || 1} x ${i.price || 0} ج.م]`
            ).join("\n");

            const orderDate = o.createdAt ? o.createdAt.toDate() : null;
            
            return {
                "رقم الطلب": safeStr(o.id),
                "تاريخ الطلب": orderDate ? orderDate.toLocaleDateString('ar-EG') : '---',
                "وقت الطلب": orderDate ? orderDate.toLocaleTimeString('ar-EG') : '---',
                "اسم العميل": safeStr(o.customerName),
                "رقم الهاتف الأساسي": safeStr(o.phone),
                "رقم الهاتف الاحتياطي": safeStr(o.phone2),
                "المحافظة": safeStr(o.gov || o.governorate),
                "المنطقة/المركز": safeStr(o.district),
                "العنوان التفصيلي": safeStr(o.address),
                "رقم المبنى/الشقة": safeStr(o.buildingNumber),
                "تفاصيل المنتجات": safeStr(itemsSummary),
                "إجمالي عدد القطع": (o.items || []).reduce((sum, i) => sum + (i.quantity || 1), 0),
                "إجمالي المبلغ (ج.م)": Number(o.total) || 0,
                "تكلفة الشحن (ج.م)": o.shippingCost || 0,
                "طريقة الدفع": o.paymentMethod === 'cod' ? 'عند الاستلام (Cash)' : 'تحويل مسبق (Prepaid)',
                "حالة الطلب الحالية": getStatusLabel(o.status),
                "رقم تتبع بوسطة (Tracking)": safeStr(o.trackingNumber),
                "ملاحظات العميل": safeStr(o.notes)
            };
        });

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "تفاصيل الطلبات");

        const colWidths = [
            { wch: 15 }, { wch: 12 }, { wch: 10 }, { wch: 20 }, { wch: 15 }, 
            { wch: 15 }, { wch: 12 }, { wch: 15 }, { wch: 40 }, { wch: 15 }, 
            { wch: 60 }, { wch: 10 }, { wch: 12 }, { wch: 10 }, { wch: 20 }, 
            { wch: 15 }, { wch: 20 }, { wch: 30 }
        ];
        worksheet['!cols'] = colWidths;

        if(!worksheet['!views']) worksheet['!views'] = [];
        worksheet['!views'].push({ RTL: true });

        const fileName = `iCloth_Orders_Export_${new Date().toISOString().split('T')[0]}.xlsx`;
        XLSX.writeFile(workbook, fileName);
    } catch (err) {
        console.error("Critical Export Error:", err);
        alert("🚨 خطأ تقني في الإكسل: " + err.message + "\nيرجى محاولة رفع التعديلات مرة أخرى باستخدام firebase deploy");
    }
};

window.exportAnalyticsToExcel = function() {
    if (!orders || orders.length === 0) {
        alert("لا توجد بيانات كافية للتحليل!");
        return;
    }

    try {
        const EXCEL_LIMIT = 30000;
        const safeStr = (val) => {
            if (val === null || val === undefined) return '---';
            let s = String(val);
            if (s.length > EXCEL_LIMIT) return s.substring(0, EXCEL_LIMIT) + "...";
            return s;
        };

        const workbook = XLSX.utils.book_new();

        // --- 1. KPI Dashboard Sheet ---
        const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
        const totalOrders = orders.length;
        const userOrderCounts = {};
        let totalItemsInAllOrders = 0;
        
        orders.forEach(o => {
            const key = (o.email || o.phone || 'anon').toLowerCase();
            userOrderCounts[key] = (userOrderCounts[key] || 0) + 1;
            (o.items || []).forEach(i => totalItemsInAllOrders += (i.quantity || 1));
        });

        const totalUnique = Object.keys(userOrderCounts).length;
        const repeatUsers = Object.values(userOrderCounts).filter(c => c > 1).length;
        const repeatRate = totalUnique ? ((repeatUsers / totalUnique) * 100).toFixed(1) : 0;
        const avgOrder = totalOrders ? (totalRevenue / totalOrders).toFixed(0) : 0;
        const basketAvg = totalOrders ? (totalItemsInAllOrders / totalOrders).toFixed(1) : 0;

        const kpiData = [
            ["المؤشر الاستراتيجي", "القيمة الإجمالية", "الوصف"],
            ["إجمالي المبيعات", `${totalRevenue.toLocaleString()} ج.م`, "صافي قيمة جميع الطلبات"],
            ["إجمالي عدد الطلبات", totalOrders, "إجمالي الطلبات المستلمة"],
            ["قاعدة العملاء الفريدين", totalUnique, "عدد العملاء المسجلين بهواتف مختلفة"],
            ["معدل تكرار الشراء", `${repeatRate}%`, "نسبة العملاء الذين اشتروا أكثر من مرة"],
            ["متوسط قيمة السلة (AOV)", `${avgOrder} ج.م`, "متوسط ما ينفقه العميل لكل طلب"],
            ["متوسط عدد القطع للطلب", basketAvg, "متوسط عدد المنتجات في السلة الواحدة"],
            ["تاريخ استخراج التقرير", new Date().toLocaleString('ar-EG'), "وقت استخراج هذه البيانات"]
        ];
        XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(kpiData), "المؤشرات العامة");

        // --- 2. Daily Sales Performance ---
        const salesTimeline = {};
        for (let i = 29; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dayStr = d.toLocaleDateString('ar-EG');
            salesTimeline[dayStr] = { rev: 0, count: 0 };
        }
        orders.forEach(o => {
            if (!o.createdAt) return;
            const dayStr = o.createdAt.toDate().toLocaleDateString('ar-EG');
            if (salesTimeline[dayStr]) {
                salesTimeline[dayStr].rev += (Number(o.total) || 0);
                salesTimeline[dayStr].count += 1;
            }
        });
        const salesData = [["التاريخ", "المبيعات (ج.م)", "عدد الطلبات (الزخم)"]].concat(
            Object.entries(salesTimeline).map(([date, data]) => [date, data.rev, data.count])
        );
        XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(salesData), "الأداء اليومي (30 يوم)");

        // --- 3. Product & Inventory Intelligence ---
        const productStats = {};
        orders.forEach(o => {
            (o.items || []).forEach(item => {
                if (!productStats[item.id]) {
                    const masterProd = products.find(p => p.id === item.id) || {};
                    productStats[item.id] = { name: item.name, count: 0, revenue: 0, currentStock: masterProd.stock || 0 };
                }
                productStats[item.id].count += (item.quantity || 1);
                productStats[item.id].revenue += (item.price * (item.quantity || 1));
            });
        });
        const topProductsData = [["اسم المنتج", "عدد القطع المباحة", "إجمالي الإيرادات", "المخزون الحالي", "حالة الطلب"]].concat(
            Object.values(productStats).sort((a,b) => b.revenue - a.revenue).map(p => [
                safeStr(p.name), p.count, p.revenue, p.currentStock, (p.currentStock <= 5 ? 'عجز (تحت الـ 5)' : 'متوفر')
            ])
        );
        XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(topProductsData), "تحليل المنتجات");

        // --- 4. Category Dominance ---
        const catStats = {};
        orders.forEach(o => {
            (o.items || []).forEach(item => {
                const catId = item.category || 'غير مصنف';
                const catName = categories.find(c => c.id === catId)?.name || catId;
                if (!catStats[catName]) catStats[catName] = { count: 0, rev: 0 };
                catStats[catName].count += (item.quantity || 1);
                catStats[catName].rev += (item.price * (item.quantity || 1));
            });
        });
        const catData = [["التصنيف / الفئة", "عدد القطع المباعة", "الإيرادات الإجمالية"]].concat(
            Object.entries(catStats).sort((a,b) => b[1].rev - a[1].rev).map(([name, d]) => [safeStr(name), d.count, d.rev])
        );
        XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(catData), "أداء الأقسام");

        // --- 5. Customer Loyalty (Top 30 VIPs) ---
        const customerStats = {};
        orders.forEach(o => {
            const phone = o.phone || 'بدون هاتف';
            if (!customerStats[phone]) customerStats[phone] = { name: o.customerName || '---', count: 0, rev: 0, gov: o.gov || '---' };
            customerStats[phone].count += 1;
            customerStats[phone].rev += (Number(o.total) || 0);
        });
        const vipData = [["اسم العميل", "رقم الهاتف", "المحافظة", "عدد الطلبات", "إجمالي المشتريات (ج.م)"]].concat(
            Object.entries(customerStats).sort((a,b) => b[1].rev - a[1].rev).slice(0, 30).map(([phone, d]) => [safeStr(d.name), safeStr(phone), safeStr(d.gov), d.count, d.rev])
        );
        XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(vipData), "كبار العملاء (VIP)");

        // --- 6. Geographic & Logistics Split ---
        const geoStats = {};
        const payStats = {};
        orders.forEach(o => {
            const gov = o.gov || o.governorate || 'غير معروف';
            geoStats[gov] = (geoStats[gov] || 0) + 1;
            const pay = o.paymentMethod === 'cod' ? 'الدفع عند الاستلام' : 'تحويل مسبق';
            payStats[pay] = (payStats[pay] || 0) + 1;
        });

        const geoTable = Object.entries(geoStats).sort((a,b) => b[1] - a[1]);
        const lastSheetData = [["المحافظة", "الطلبات", "", "طريقة الدفع", "العدد"]].concat(
            geoTable.map(([g, c], i) => {
                const payEntry = Object.entries(payStats)[i] || ["", ""];
                return [safeStr(g), c, "", safeStr(payEntry[0]), payEntry[1]];
            })
        );
        XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(lastSheetData), "الجغرافيا والشحن");

        const fileName = `Professional_Analytics_Report_${new Date().toISOString().split('T')[0]}.xlsx`;
        XLSX.writeFile(workbook, fileName);
    } catch (err) {
        console.error("Advanced Analytics Export Error:", err);
        alert("🚨 خطأ في استخراج التحليلات: " + err.message);
    }
};
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
        document.getElementById('cat-name').value = cat.name || "";
        document.getElementById('cat-name-ar').value = cat.name_ar || "";
        document.getElementById('cat-parent').value = cat.parentId || "";
        
        const imgInput = document.getElementById('cat-image');
        const imgPreview = document.getElementById('cat-image-preview');
        if (imgInput && imgPreview) {
            const imgUrl = cat.image || "";
            imgInput.value = imgUrl;
            imgPreview.src = imgUrl;
            imgPreview.style.display = imgUrl ? 'block' : 'none';
        }
        
        title.innerText = "تعديل القسم";
    } else {
        form.reset();
        idInput.value = "";
        const imgPreview = document.getElementById('cat-image-preview');
        if (imgPreview) {
            imgPreview.src = "";
            imgPreview.style.display = 'none';
        }
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
        name_ar: document.getElementById('cat-name-ar').value,
        parentId: document.getElementById('cat-parent').value || null,
        image: document.getElementById('cat-image').value || ""
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

// --- Shipping Rates Management ---
let shippingRates = {};

async function loadShippingRates() {
    console.log("🚚 Loading Shipping Rates...");
    const doc = await db.collection('settings').doc('shipping').get();
    if (doc.exists) {
        shippingRates = doc.data().rates || {};
    } else {
        governorates.forEach(g => shippingRates[g] = 50);
    }
    renderShippingRates();
}


// --- Detailed Inventory Helpers ---
window.updateInventoryInputs = (input) => {
    const variantItem = input.closest('.variant-item');
    const grid = variantItem.querySelector('.v-inventory-grid');
    const hiddenData = variantItem.querySelector('.v-inventory-data');
    if (!grid) return;

    const sizes = input.value.split(',').map(s => s.trim()).filter(s => s !== "");
    let existingData = {};
    try { existingData = JSON.parse(hiddenData.value || "{}"); } catch(e) {}

    grid.innerHTML = sizes.map(s => `
        <div style="background:rgba(255,255,255,0.02); padding:8px; border-radius:8px; border:1px solid rgba(255,255,255,0.05); text-align:center;">
            <div style="font-size:0.7rem; margin-bottom:5px; color:var(--primary); font-weight:bold;">${s}</div>
            <input type="number" class="size-stock-input" data-size="${s}" 
                   value="${existingData[s] !== undefined ? existingData[s] : 0}" 
                   oninput="updateVariantStock(this)"
                   style="width:100%; padding:5px; font-size:0.8rem; text-align:center; background:#000; border:1px solid #333; color:#fff; border-radius:4px;">
        </div>
    `).join('');

    updateVariantStock(variantItem);
};

window.updateVariantStock = (elOrItem) => {
    const variantItem = elOrItem.classList?.contains('variant-item') ? elOrItem : elOrItem.closest('.variant-item');
    const stockInput = variantItem.querySelector('.v-stock');
    const hiddenData = variantItem.querySelector('.v-inventory-data');
    
    let total = 0;
    const inventory = {};
    variantItem.querySelectorAll('.size-stock-input').forEach(input => {
        const val = Number(input.value) || 0;
        const size = input.getAttribute('data-size');
        inventory[size] = val;
        total += val;
    });

    if (stockInput) stockInput.value = total;
    if (hiddenData) hiddenData.value = JSON.stringify(inventory);
};

function renderShippingRates() {
    const grid = document.getElementById('shipping-rates-grid');
    if (!grid) return;

    grid.innerHTML = governorates.map(gov => `
        <div class="form-group" style="background: rgba(255,255,255,0.03); padding: 15px; border-radius: 12px; border: 1px solid var(--border);">
            <label style="color: var(--primary); font-weight: bold; margin-bottom: 8px;">${gov}</label>
            <div style="display: flex; align-items: center; gap: 10px;">
                <input type="number" id="ship-rate-${gov.replace(/\s+/g, '-')}" value="${shippingRates[gov] !== undefined ? shippingRates[gov] : 50}" style="flex: 1;" min="0">
                <span style="color: var(--text-dim); font-size: 0.8rem;">ج.م</span>
            </div>
        </div>
    `).join('');
}

window.saveShippingRates = async () => {
    const btn = document.querySelector('#shipping .btn-primary');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الحفظ...';
    btn.disabled = true;

    const newRates = {};
    governorates.forEach(gov => {
        const input = document.getElementById(`ship-rate-${gov.replace(/\s+/g, '-')}`);
        if (input) {
            newRates[gov] = Number(input.value) || 0;
        }
    });

    try {
        await db.collection('settings').doc('shipping').set({
            rates: newRates,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

        alert('✅ تم حفظ أسعار الشحن بنجاح!');
        shippingRates = newRates;
        
        // Also update standard window layout 
    } catch (err) {
        console.error(err);
        alert('❌ خطأ في الحفظ: ' + err.message);
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
};

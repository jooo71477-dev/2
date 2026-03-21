// 🚀 DIESEL ADMIN ENGINE - HYBRID VERSION (Firebase + Local Fallback)
const firebaseConfig = {
    apiKey: "AIzaSyByPZP1qo0sQN26xTwzpT0vnw_BTguXvSI",
    authDomain: "ic12-e6ad7.firebaseapp.com",
    projectId: "ic12-e6ad7",
    storageBucket: "ic12-e6ad7.firebasestorage.app",
    messagingSenderId: "849964207533",
    appId: "1:849964207533:web:8a6669e5c453ca08ba2524",
    measurementId: "G-H7S7W0CB7Q"
};

let db = null;
let productsCol = null;
let isFirebaseReady = false;
let adminRole = localStorage.getItem('adminRole') || 'none';

// Initialize Firebase
if (firebaseConfig.apiKey !== "YOUR_API_KEY") {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    productsCol = db.collection('products');
    isFirebaseReady = true;

    // SECURITY: If we came from the home page button, force a logout to ask for credentials again
    if (sessionStorage.getItem('force_admin_login') === 'true') {
        sessionStorage.removeItem('force_admin_login');
        firebase.auth().signOut();
        localStorage.removeItem('adminRole');
        adminRole = 'none';
    }

    firebase.auth().onAuthStateChanged(user => {
        const loginOverlay = document.getElementById('login-overlay');
        const adminContent = document.getElementById('admin-main-content');

        if (user) {
            loginOverlay.style.display = 'none';
            adminContent.style.display = 'block';
            applyRoleRestrictions();

            if (adminRole === 'products') { showTab('products'); loadProducts(); }
            else if (adminRole === 'orders') { showTab('orders'); loadOrders(); }
            else if (adminRole === 'all') { showTab('products'); loadProducts(); }
        } else {
            loginOverlay.style.display = 'flex';
            adminContent.style.display = 'none';
        }
    });
}

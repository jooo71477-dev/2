// 🔥 iCloth - Firebase Initialization & Auth
const firebaseConfig = {
    apiKey: "AIzaSyByPZP1qo0sQN26xTwzpT0vnw_BTguXvSI",
    authDomain: "ic12-e6ad7.firebaseapp.com",
    projectId: "ic12-e6ad7",
    storageBucket: "ic12-e6ad7.firebasestorage.app",
    messagingSenderId: "849964207533",
    appId: "1:849964207533:web:8a6669e5c453ca08ba2524",
    measurementId: "G-H7S7W0CB7Q"
};

function initFirebase() {
    if (typeof firebase === 'undefined') return;
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
        console.log("🔥 Firebase initialized (Lazy Load)!");
    }
    db = firebase.firestore();
    
    // Auth Listener
    firebase.auth().onAuthStateChanged(user => {
        currentUser = user;
        if (window.updateAuthUI) updateAuthUI();
        if (user) {
            console.log("👤 User Logged In:", user.email);
            
            const ordersModal = document.getElementById('my-orders-modal');
            if (ordersModal && ordersModal.classList.contains('active')) {
                if (window.openMyOrdersModal) openMyOrdersModal();
            }

            if (sessionStorage.getItem('pendingCheckout') === 'true') {
                sessionStorage.removeItem('pendingCheckout');
                setTimeout(() => {
                    if (cart.length > 0) {
                        if (window.closeCartSidebar) closeCartSidebar();
                        const checkoutModal = document.getElementById('checkout-modal');
                        if (checkoutModal) checkoutModal.classList.add('active');
                        if (window.updateCheckoutTotal) updateCheckoutTotal();
                    }
                }, 500);
            }
        }
    });

    if (window.loadDynamicCategories) loadDynamicCategories();
    if (window.attachRealTimeListeners) attachRealTimeListeners();
}

window.addEventListener('load', () => {
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
            initFirebase();
        }, { timeout: 2000 });
    } else {
        setTimeout(initFirebase, 1000);
    }
});

async function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
        const result = await firebase.auth().signInWithPopup(provider);
        return result.user;
    } catch (error) {
        console.error("Login failed:", error);
        return null;
    }
}

async function signOutUser() {
    try {
        await firebase.auth().signOut();
        location.reload();
    } catch (error) {
        console.error("Logout failed:", error);
    }
}

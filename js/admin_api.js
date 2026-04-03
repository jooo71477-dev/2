// 🔐 iCloth Admin - API & Auth Initialization
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
let auth = null;

function initAdminFirebase() {
    if (typeof firebase === 'undefined') return;
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    db = firebase.firestore();
    auth = firebase.auth();
    
    auth.onAuthStateChanged(user => {
        if (!user) {
            window.location.href = 'login.html'; // Adjust as needed
        } else {
            console.log("Admin Logged In:", user.email);
            if (window.initDashboard) initDashboard();
        }
    });
}

const CLOUDINARY_UPLOAD_PRESET = "icloth_admin"; 
const CLOUDINARY_CLOUD_NAME = "dxjkkv8js";

async function uploadToCloudinary(file) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    
    try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
            method: "POST",
            body: formData
        });
        const data = await res.json();
        return data.secure_url;
    } catch (e) {
        console.error("Cloudinary Upload Error:", e);
        return null;
    }
}

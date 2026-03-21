// 🛠️ Force Disable Maintenance Mode Script
const firebaseConfig = {
    apiKey: "AIzaSyByPZP1qo0sQN26xTwzpT0vnw_BTguXvSI",
    authDomain: "ic12-e6ad7.firebaseapp.com",
    projectId: "ic12-e6ad7",
    storageBucket: "ic12-e6ad7.firebasestorage.app",
    messagingSenderId: "849964207533",
    appId: "1:849964207533:web:8a6669e5c453ca08ba2524",
    measurementId: "G-H7S7W0CB7Q"
};

// Initialize Firebase (Compat version)
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

async function openWebsite() {
    try {
        await db.collection('settings').doc('site').set({
            maintenanceMode: false,
            status: "online"
        }, { merge: true });
        console.log("✅ تم فتح الموقع بنجاح! جرب الدخول الآن.");
        alert("تم فتح الموقع بنجاح! ✅");
    } catch (error) {
        console.error("❌ فشل فتح الموقع:", error);
        alert("فشل فتح الموقع. قد تحتاج لتسجيل الدخول أولاً أو تعديل الـ Rules في Firebase.");
    }
}

openWebsite();

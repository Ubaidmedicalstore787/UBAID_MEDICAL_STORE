// ============================================================
// UBAID MEDICAL STORE V2
// FIREBASE AUTHENTICATION - FINAL FIXED VERSION
// ============================================================

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";


// ============================================================
// FIREBASE CONFIG
// ============================================================

const firebaseConfig = {
    apiKey: "AIzaSyBH-N7OqyPlrXDnZK9367IL2PtggdFap3s",
    authDomain: "ubaid-medical-store-web.firebaseapp.com",
    projectId: "ubaid-medical-store-web",
    storageBucket: "ubaid-medical-store-web.firebasestorage.app",
    messagingSenderId: "507479098165",
    appId: "1:507479098165:web:336a54f9773cf93f48c27c",
    measurementId: "G-9VLSHK9PNT"
};


// ============================================================
// INITIALIZE FIREBASE
// ============================================================

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


// ============================================================
// LOGIN
// ============================================================

window.ubaidLogin = async function (email, password) {

    if (!email || !password) {
        throw new Error("Email aur password required hai.");
    }

    const result = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
    );

    return result.user;
};


// ============================================================
// SIGNUP
// ============================================================

window.ubaidSignup = async function (
    email,
    password,
    name
) {

    if (!email || !password) {
        throw new Error("Email aur password required hai.");
    }

    const result = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
    );

    // User display name save karein
    if (name && name.trim()) {

        await updateProfile(
            result.user,
            {
                displayName: name.trim()
            }
        );

        // Fresh user object ke saath event/UI update ke liye
        await result.user.reload();
    }

    return auth.currentUser;
};


// ============================================================
// LOGOUT
// ============================================================

window.ubaidLogout = async function () {

    await signOut(auth);

    return true;
};


// ============================================================
// FORGOT PASSWORD
// ============================================================

window.ubaidResetPassword = async function (email) {

    if (!email) {
        throw new Error("Email enter karo.");
    }

    await sendPasswordResetEmail(
        auth,
        email.trim()
    );

    return true;
};


// ============================================================
// AUTH STATE
// ============================================================
//
// Important:
// Firebase auth state ko global variable me bhi rakha gaya hai.
// Isse script.js initial auth state miss nahi karega.
//

window.ubaidCurrentUser = null;
window.ubaidAuthReady = false;


// ============================================================
// AUTH STATE LISTENER
// ============================================================

onAuthStateChanged(
    auth,
    (user) => {

        window.ubaidCurrentUser = user || null;
        window.ubaidAuthReady = true;

        // Existing custom event
        window.dispatchEvent(
            new CustomEvent(
                "ubaidAuthStateChanged",
                {
                    detail: user || null
                }
            )
        );

        // Extra ready event
        window.dispatchEvent(
            new CustomEvent(
                "ubaidAuthReady",
                {
                    detail: user || null
                }
            )
        );

        console.log(
            user
                ? "✅ Firebase user logged in:",
                  user.email
                : "ℹ️ No Firebase user logged in"
        );
    }
);


// ============================================================
// GET CURRENT USER
// ============================================================

window.ubaidGetCurrentUser = function () {
    return auth.currentUser;
};


// ============================================================
// EXPORT
// ============================================================

export {
    app,
    auth
};


console.log(
    "✅ Ubaid Medical Store Firebase Authentication Ready"
);

// ============================================================
// UBAID MEDICAL STORE - FIREBASE
// Authentication: Login / Signup / Logout / Forgot Password
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

window.ubaidLogin = async function(email, password) {

    const result = await signInWithEmailAndPassword(
        auth,
        email,
        password
    );

    return result.user;
};


// ============================================================
// SIGNUP
// ============================================================

window.ubaidSignup = async function(
    email,
    password,
    name
) {

    const result =
        await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );


    // Save user's name in Firebase profile
    if (name) {

        await updateProfile(
            result.user,
            {
                displayName: name
            }
        );

    }


    return result.user;
};


// ============================================================
// LOGOUT
// ============================================================

window.ubaidLogout = async function() {

    await signOut(auth);

    return true;
};


// ============================================================
// FORGOT PASSWORD
// ============================================================

window.ubaidResetPassword = async function(email) {

    await sendPasswordResetEmail(
        auth,
        email
    );

    return true;
};


// ============================================================
// AUTH STATE
// ============================================================

onAuthStateChanged(
    auth,
    (user) => {

        window.dispatchEvent(
            new CustomEvent(
                "ubaidAuthStateChanged",
                {
                    detail: user
                }
            )
        );

    }
);


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

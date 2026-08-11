// ============================================================
// UBAID MEDICAL STORE
// FIREBASE AUTHENTICATION
// Login / Signup / Logout / Forgot Password
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

    try {

        const result =
            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

        return result.user;

    } catch (error) {

        console.error(
            "Firebase Login Error:",
            error
        );

        throw error;

    }

};


// ============================================================
// SIGNUP
// ============================================================

window.ubaidSignup = async function(
    email,
    password,
    name
) {

    try {

        const result =
            await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );


        if (name) {

            await updateProfile(
                result.user,
                {
                    displayName: name
                }
            );

        }


        return result.user;

    } catch (error) {

        console.error(
            "Firebase Signup Error:",
            error
        );

        throw error;

    }

};


// ============================================================
// LOGOUT
// ============================================================

window.ubaidLogout = async function() {

    try {

        await signOut(auth);

        return true;

    } catch (error) {

        console.error(
            "Firebase Logout Error:",
            error
        );

        throw error;

    }

};


// ============================================================
// FORGOT PASSWORD
// ============================================================

window.ubaidResetPassword = async function(
    email
) {

    try {

        await sendPasswordResetEmail(
            auth,
            email
        );

        return true;

    } catch (error) {

        console.error(
            "Firebase Password Reset Error:",
            error
        );

        throw error;

    }

};


// ============================================================
// AUTH STATE
// ============================================================

onAuthStateChanged(
    auth,
    user => {

        window.dispatchEvent(
            new CustomEvent(
                "ubaidAuthStateChanged",
                {
                    detail: user
                }
            )
        );


        if (user) {

            console.log(
                "👤 Logged in:",
                user.email
            );

        } else {

            console.log(
                "👤 No user logged in"
            );

        }

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

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
    getAuth
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBH-N7OqyPlrXDnZK9367IL2PtggdFap3s",
    authDomain: "ubaid-medical-store-web.firebaseapp.com",
    projectId: "ubaid-medical-store-web",
    storageBucket: "ubaid-medical-store-web.firebasestorage.app",
    messagingSenderId: "507479098165",
    appId: "1:507479098165:web:336a54f9773cf93f48c27c",
    measurementId: "G-9VLSHK9PNT"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export { app, auth };

import { 
    auth, 
    db, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    sendPasswordResetEmail, 
    signOut, 
    onAuthStateChanged,
    collection,
    addDoc,
    onSnapshot,
    query,
    orderBy 
} from './firebase.js';

// DOM Elements
const authModal = document.getElementById('authModal');
const accountBtn = document.getElementById('accountBtn');
const closeAuth = document.getElementById('closeAuth');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const showSignup = document.getElementById('showSignup');
const showLogin = document.getElementById('showLogin');
const logoutBtn = document.getElementById('logoutBtn');
const userProfileGroup = document.getElementById('userProfileGroup');
const userDisplayName = document.getElementById('userDisplayName');
const forgotPassBtn = document.getElementById('forgotPassBtn');
const commentForm = document.getElementById('commentForm');
const commentsList = document.getElementById('commentsList');
const themeToggle = document.getElementById('themeToggle');

// 1. AUTH MODAL TOGGLE
if (accountBtn) accountBtn.addEventListener('click', () => authModal.classList.add('active'));
if (closeAuth) closeAuth.addEventListener('click', () => authModal.classList.remove('active'));
if (showSignup) showSignup.addEventListener('click', () => {
    loginForm.hidden = true;
    signupForm.hidden = false;
});
if (showLogin) showLogin.addEventListener('click', () => {
    signupForm.hidden = true;
    loginForm.hidden = false;
});

// 2. AUTH OBSERVER (LOGIN / LOGOUT STATE)
onAuthStateChanged(auth, (user) => {
    if (user) {
        if (accountBtn) accountBtn.style.display = 'none';
        if (userProfileGroup) userProfileGroup.style.display = 'flex';
        if (userDisplayName) userDisplayName.textContent = user.displayName || user.email.split('@')[0];
    } else {
        if (accountBtn) accountBtn.style.display = 'grid';
        if (userProfileGroup) userProfileGroup.style.display = 'none';
    }
});

// 3. LOGIN
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        try {
            await signInWithEmailAndPassword(auth, email, password);
            alert("Login Successful!");
            authModal.classList.remove('active');
            loginForm.reset();
        } catch (error) {
            alert("Login Failed: " + error.message);
        }
    });
}

// 4. SIGNUP
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            alert("Account created successfully!");
            authModal.classList.remove('active');
            signupForm.reset();
        } catch (error) {
            alert("Signup Failed: " + error.message);
        }
    });
}

// 5. LOGOUT
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        try {
            await signOut(auth);
            alert("Logged out successfully!");
        } catch (error) {
            alert("Logout Error: " + error.message);
        }
    });
}

// 6. FORGOT PASSWORD
if (forgotPassBtn) {
    forgotPassBtn.addEventListener('click', async () => {
        const email = prompt("Enter your registered email address:");
        if (!email) return;
        try {
            await sendPasswordResetEmail(auth, email);
            alert("Password reset email sent! Check your inbox.");
        } catch (error) {
            alert("Error: " + error.message);
        }
    });
}

// 7. COMMENTS / REVIEWS
if (commentForm) {
    commentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('commentName').value;
        const text = document.getElementById('commentText').value;
        try {
            await addDoc(collection(db, "comments"), {
                name: name,
                text: text,
                createdAt: new Date()
            });
            commentForm.reset();
            alert("Review submitted successfully!");
        } catch (error) {
            alert("Error posting comment: " + error.message);
        }
    });
}

// Realtime Load Comments
if (commentsList) {
    const q = query(collection(db, "comments"), orderBy("createdAt", "desc"));
    onSnapshot(q, (snapshot) => {
        commentsList.innerHTML = "";
        snapshot.forEach((doc) => {
            const data = doc.data();
            const card = document.createElement('div');
            card.className = 'comment-card';
            card.innerHTML = `<strong><i class="fa-solid fa-user"></i> ${data.name}</strong><p>${data.text}</p>`;
            commentsList.appendChild(card);
        });
    });
}

// 8. DARK MODE TOGGLE
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });
}

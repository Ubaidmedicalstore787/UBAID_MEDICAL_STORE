/* =========================================================
   UBAID MEDICAL STORE
   COMPLETE script.js
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    "use strict";

    /* =====================================================
       HELPERS
       ===================================================== */

    const $ = (id) => document.getElementById(id);

    const safeJSON = (key, fallback) => {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : fallback;
        } catch {
            return fallback;
        }
    };

    const escapeHTML = (value) => {
        const div = document.createElement("div");
        div.textContent = String(value ?? "");
        return div.innerHTML;
    };

    const money = (value) => `₹${Number(value).toFixed(0)}`;


    /* =====================================================
       ELEMENTS
       ===================================================== */

    const themeToggle = $("themeToggle");

    const accountBtn = $("accountBtn");
    const userProfileGroup = $("userProfileGroup");
    const userDisplayName = $("userDisplayName");
    const logoutBtn = $("logoutBtn");

    const authModal = $("authModal");
    const closeAuth = $("closeAuth");

    const loginForm = $("loginForm");
    const signupForm = $("signupForm");

    const showSignup = $("showSignup");
    const showLogin = $("showLogin");

    const authTitle = $("authTitle");
    const authSubtitle = $("authSubtitle");
    const authMessage = $("authMessage");

    const loginEmail = $("loginEmail");
    const loginPassword = $("loginPassword");

    const signupName = $("signupName");
    const signupEmail = $("signupEmail");
    const signupPassword = $("signupPassword");

    const productsGrid = $("productsGrid");
    const emptyProducts = $("emptyProducts");
    const resultCount = $("resultCount");
    const categoryFilter = $("categoryFilter");

    const medicineSearch = $("medicineSearch");
    const mobileMedicineSearch = $("mobileMedicineSearch");
    const mainMedicineSearch = $("mainMedicineSearch");

    const searchBtn = $("searchBtn");
    const mobileSearchBtn = $("mobileSearchBtn");
    const mainSearchBtn = $("mainSearchBtn");

    const cartBtn = $("cartBtn");
    const cartSidebar = $("cartSidebar");
    const closeCart = $("closeCart");
    const cartItems = $("cartItems");
    const cartCount = $("cartCount");
    const cartItemsText = $("cartItemsText");
    const cartTotal = $("cartTotal");
    const cartFooter = $("cartFooter");
    const emptyCart = $("emptyCart");
    const continueShopping = $("continueShopping");
    const whatsappOrderBtn = $("whatsappOrderBtn");

    const overlay = $("overlay");

    const toast = $("toast");
    const toastMessage = $("toastMessage");

    const commentForm = $("commentForm");
    const commentName = $("commentName");
    const commentText = $("commentText");
    const commentsList = $("commentsList");

    const mobileMenuBtn = $("mobileMenuBtn");
    const navLinks = $("navLinks");

    const currentYear = $("currentYear");


    /* =====================================================
       YEAR
       ===================================================== */

    if (currentYear) {
        currentYear.textContent =
            new Date().getFullYear();
    }


    /* =====================================================
       MEDICINES
       ===================================================== */

    const medicines = [

        {
            id: 1,
            name: "Paracetamol 500mg",
            category: "fever",
            price: 25,
            icon: "fa-tablets",
            description: "Fever and pain relief"
        },

        {
            id: 2,
            name: "Paracetamol 650mg",
            category: "fever",
            price: 35,
            icon: "fa-pills",
            description: "Fever and body pain relief"
        },

        {
            id: 3,
            name: "Cough Syrup",
            category: "cold",
            price: 90,
            icon: "fa-prescription-bottle-medical",
            description: "Cold, cough and throat care"
        },

        {
            id: 4,
            name: "Vitamin C Tablets",
            category: "vitamins",
            price: 120,
            icon: "fa-capsules",
            description: "Daily vitamin support"
        },

        {
            id: 5,
            name: "Multivitamin Tablets",
            category: "vitamins",
            price: 180,
            icon: "fa-capsules",
            description: "Daily nutritional support"
        },

        {
            id: 6,
            name: "Antiseptic Liquid",
            category: "firstaid",
            price: 75,
            icon: "fa-bottle-droplet",
            description: "First aid and wound cleaning"
        },

        {
            id: 7,
            name: "Cotton Roll",
            category: "firstaid",
            price: 45,
            icon: "fa-kit-medical",
            description: "Soft medical cotton"
        },

        {
            id: 8,
            name: "Digital Thermometer",
            category: "firstaid",
            price: 150,
            icon: "fa-temperature-half",
            description: "Digital temperature checking"
        },

        {
            id: 9,
            name: "Hand Sanitizer",
            category: "personal-care",
            price: 60,
            icon: "fa-pump-soap",
            description: "Everyday hand hygiene"
        },

        {
            id: 10,
            name: "Face Mask",
            category: "personal-care",
            price: 10,
            icon: "fa-head-side-mask",
            description: "Protective face mask"
        }

    ];


    /* =====================================================
       TOAST
       ===================================================== */

    function showToast(message) {

        if (!toast || !toastMessage) {
            alert(message);
            return;
        }

        toastMessage.textContent = message;

        toast.classList.add("show");

        clearTimeout(showToast.timer);

        showToast.timer = setTimeout(() => {
            toast.classList.remove("show");
        }, 2500);
    }


    /* =====================================================
       CART
       ===================================================== */

    let cart = safeJSON(
        "ubaidMedicalCart",
        []
    );


    function saveCart() {

        localStorage.setItem(
            "ubaidMedicalCart",
            JSON.stringify(cart)
        );

    }


    function addToCart(id) {

        const product =
            medicines.find(
                item => item.id === Number(id)
            );

        if (!product) return;

        const existing =
            cart.find(
                item => item.id === product.id
            );

        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }

        saveCart();
        renderCart();

        showToast(
            `${product.name} cart mein add ho gayi.`
        );
    }


    function removeFromCart(id) {

        cart =
            cart.filter(
                item => item.id !== Number(id)
            );

        saveCart();
        renderCart();

    }


    function changeQuantity(id, amount) {

        const item =
            cart.find(
                product => product.id === Number(id)
            );

        if (!item) return;

        item.quantity += amount;

        if (item.quantity <= 0) {
            removeFromCart(id);
            return;
        }

        saveCart();
        renderCart();

    }


    function renderCart() {

        if (!cartItems) return;

        cartItems.innerHTML = "";

        let totalItems = 0;
        let total = 0;


        cart.forEach(item => {

            totalItems += item.quantity;
            total +=
                item.price * item.quantity;


            const element =
                document.createElement("div");

            element.className =
                "cart-item";


            element.innerHTML = `

                <div class="cart-item-icon">
                    <i class="fa-solid ${escapeHTML(item.icon)}"></i>
                </div>

                <div class="cart-item-info">

                    <h4>
                        ${escapeHTML(item.name)}
                    </h4>

                    <strong>
                        ${money(item.price)}
                    </strong>

                    <div class="quantity-controls">

                        <button
                            type="button"
                            class="quantity-btn"
                            data-action="minus"
                            data-id="${item.id}"
                        >
                            −
                        </button>

                        <span>
                            ${item.quantity}
                        </span>

                        <button
                            type="button"
                            class="quantity-btn"
                            data-action="plus"
                            data-id="${item.id}"
                        >
                            +
                        </button>

                    </div>

                </div>

                <button
                    type="button"
                    class="remove-cart-item"
                    data-id="${item.id}"
                    aria-label="Remove"
                >
                    <i class="fa-solid fa-trash"></i>
                </button>

            `;

            cartItems.appendChild(element);

        });


        if (cartCount) {
            cartCount.textContent =
                totalItems;
        }

        if (cartItemsText) {
            cartItemsText.textContent =
                `${totalItems} item${totalItems === 1 ? "" : "s"}`;
        }

        if (cartTotal) {
            cartTotal.textContent =
                money(total);
        }


        if (cart.length === 0) {

            if (emptyCart) {
                emptyCart.style.display = "flex";
            }

            if (cartFooter) {
                cartFooter.style.display = "none";
            }

        } else {

            if (emptyCart) {
                emptyCart.style.display = "none";
            }

            if (cartFooter) {
                cartFooter.style.display = "block";
            }

        }

    }


    if (productsGrid) {

        productsGrid.addEventListener(
            "click",
            event => {

                const button =
                    event.target.closest(
                        ".add-cart-btn"
                    );

                if (!button) return;

                addToCart(
                    button.dataset.id
                );

            }
        );

    }


    if (cartItems) {

        cartItems.addEventListener(
            "click",
            event => {

                const quantityButton =
                    event.target.closest(
                        ".quantity-btn"
                    );

                const removeButton =
                    event.target.closest(
                        ".remove-cart-item"
                    );


                if (quantityButton) {

                    changeQuantity(
                        quantityButton.dataset.id,
                        quantityButton.dataset.action === "plus"
                            ? 1
                            : -1
                    );

                    return;
                }


                if (removeButton) {

                    removeFromCart(
                        removeButton.dataset.id
                    );

                }

            }
        );

    }


    function openCart() {

        cartSidebar?.classList.add("active");
        overlay?.classList.add("active");

        document.body.classList.add(
            "no-scroll"
        );

    }


    function closeCartSidebar() {

        cartSidebar?.classList.remove("active");
        overlay?.classList.remove("active");

        document.body.classList.remove(
            "no-scroll"
        );

    }


    cartBtn?.addEventListener(
        "click",
        openCart
    );

    closeCart?.addEventListener(
        "click",
        closeCartSidebar
    );

    overlay?.addEventListener(
        "click",
        closeCartSidebar
    );

    continueShopping?.addEventListener(
        "click",
        closeCartSidebar
    );


    /* =====================================================
       WHATSAPP ORDER
       ===================================================== */

    whatsappOrderBtn?.addEventListener(
        "click",
        () => {

            if (!cart.length) {

                showToast(
                    "Cart abhi empty hai."
                );

                return;
            }


            let message =
                "🩺 Ubaid Medical Store Order\n\n";


            cart.forEach(
                (item, index) => {

                    message +=
                        `${index + 1}. ${item.name} x ${item.quantity} = ${money(item.price * item.quantity)}\n`;

                }
            );


            const total =
                cart.reduce(
                    (sum, item) =>
                        sum +
                        item.price *
                        item.quantity,
                    0
                );


            message +=
                `\nTotal: ${money(total)}`;

            message +=
                "\n\n📍 Thamarwa, Gopamau, Hardoi";

            message +=
                "\n\nPlease confirm my order.";


            const number =
                "918009174690";


            const url =
                `https://wa.me/${number}?text=${encodeURIComponent(message)}`;


            window.open(
                url,
                "_blank",
                "noopener"
            );

        }
    );


    /* =====================================================
       PRODUCTS
       ===================================================== */

    function renderProducts(list) {

        if (!productsGrid) return;

        productsGrid.innerHTML = "";


        if (!list.length) {

            if (emptyProducts) {
                emptyProducts.hidden = false;
            }

            if (resultCount) {
                resultCount.textContent =
                    "0 medicines found";
            }

            return;
        }


        if (emptyProducts) {
            emptyProducts.hidden = true;
        }


        if (resultCount) {
            resultCount.textContent =
                `Showing ${list.length} medicine${list.length === 1 ? "" : "s"}`;
        }


        list.forEach(product => {

            const card =
                document.createElement("article");


            card.className =
                "product-card";


            card.innerHTML = `

                <div class="product-image">
                    <i class="fa-solid ${escapeHTML(product.icon)}"></i>
                </div>

                <div class="product-content">

                    <span class="product-category">
                        ${escapeHTML(product.category)}
                    </span>

                    <h3>
                        ${escapeHTML(product.name)}
                    </h3>

                    <p>
                        ${escapeHTML(product.description)}
                    </p>

                    <div class="product-bottom">

                        <strong>
                            ${money(product.price)}
                        </strong>

                        <button
                            type="button"
                            class="add-cart-btn"
                            data-id="${product.id}"
                        >
                            <i class="fa-solid fa-cart-plus"></i>
                            Add
                        </button>

                    </div>

                </div>
            `;


            productsGrid.appendChild(card);

        });

    }


    function filterProducts(searchValue = "") {

        const query =
            searchValue.trim().toLowerCase();

        const category =
            categoryFilter?.value || "all";


        const filtered =
            medicines.filter(product => {

                const matchesSearch =
                    !query ||
                    product.name
                        .toLowerCase()
                        .includes(query) ||
                    product.description
                        .toLowerCase()
                        .includes(query);


                const matchesCategory =
                    category === "all" ||
                    product.category === category;


                return (
                    matchesSearch &&
                    matchesCategory
                );

            });


        renderProducts(filtered);

    }


    function doSearch(input) {

        const value =
            input?.value || "";

        filterProducts(value);

        if (value.trim()) {

            $("medicines")?.scrollIntoView({
                behavior: "smooth"
            });

        }

    }


    searchBtn?.addEventListener(
        "click",
        () => doSearch(medicineSearch)
    );

    mobileSearchBtn?.addEventListener(
        "click",
        () => doSearch(mobileMedicineSearch)
    );

    mainSearchBtn?.addEventListener(
        "click",
        () => doSearch(mainMedicineSearch)
    );


    [
        medicineSearch,
        mobileMedicineSearch,
        mainMedicineSearch
    ].forEach(input => {

        input?.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter"
                ) {

                    event.preventDefault();

                    doSearch(input);

                }

            }
        );

    });


    categoryFilter?.addEventListener(
        "change",
        () => {

            filterProducts(
                medicineSearch?.value || ""
            );

        }
    );


    document
        .querySelectorAll(
            ".category-card"
        )
        .forEach(card => {

            card.addEventListener(
                "click",
                () => {

                    const category =
                        card.dataset.category;

                    if (categoryFilter) {
                        categoryFilter.value =
                            category;
                    }

                    filterProducts("");

                    $("medicines")?.scrollIntoView({
                        behavior: "smooth"
                    });

                }
            );

        });


    /* =====================================================
       DARK MODE
       ===================================================== */

    const savedTheme =
        localStorage.getItem(
            "ubaidMedicalTheme"
        );


    if (savedTheme === "dark") {
        document.body.classList.add(
            "dark-mode"
        );
    }


    function updateThemeIcon() {

        const icon =
            themeToggle?.querySelector("i");

        if (!icon) return;


        if (
            document.body.classList.contains(
                "dark-mode"
            )
        ) {

            icon.className =
                "fa-solid fa-sun";

        } else {

            icon.className =
                "fa-solid fa-moon";

        }

    }


    updateThemeIcon();


    themeToggle?.addEventListener(
        "click",
        () => {

            document.body.classList.toggle(
                "dark-mode"
            );


            const mode =
                document.body.classList.contains(
                    "dark-mode"
                )
                    ? "dark"
                    : "light";


            localStorage.setItem(
                "ubaidMedicalTheme",
                mode
            );


            updateThemeIcon();

        }
    );


    /* =====================================================
       MOBILE MENU
       ===================================================== */

    mobileMenuBtn?.addEventListener(
        "click",
        () => {

            navLinks?.classList.toggle(
                "active"
            );

        }
    );


    navLinks
        ?.querySelectorAll("a")
        .forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    navLinks.classList.remove(
                        "active"
                    );

                }
            );

        });


    /* =====================================================
       AUTH MODAL
       ===================================================== */

    function openAuth() {

        if (!authModal) return;

        authModal.classList.add(
            "active"
        );

        authModal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add(
            "no-scroll"
        );

        showLogin();

    }


    function closeAuthModal() {

        if (!authModal) return;

        authModal.classList.remove(
            "active"
        );

        authModal.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.classList.remove(
            "no-scroll"
        );

        clearAuthMessage();

    }


    function clearAuthMessage() {

        if (!authMessage) return;

        authMessage.textContent = "";

        authMessage.className =
            "auth-message";

    }


    function authError(message) {

        if (!authMessage) return;

        authMessage.textContent =
            message;

        authMessage.className =
            "auth-message error";

    }


    function authSuccess(message) {

        if (!authMessage) return;

        authMessage.textContent =
            message;

        authMessage.className =
            "auth-message success";

    }


    function showLogin() {

        if (loginForm) {
            loginForm.hidden = false;
        }

        if (signupForm) {
            signupForm.hidden = true;
        }

        if (authTitle) {
            authTitle.textContent =
                "Welcome Back";
        }

        if (authSubtitle) {
            authSubtitle.textContent =
                "Login to your Ubaid Medical Store account.";
        }

        clearAuthMessage();

    }


    function showSignupForm() {

        if (loginForm) {
            loginForm.hidden = true;
        }

        if (signupForm) {
            signupForm.hidden = false;
        }

        if (authTitle) {
            authTitle.textContent =
                "Create Account";
        }

        if (authSubtitle) {
            authSubtitle.textContent =
                "Create your Ubaid Medical Store account.";
        }

        clearAuthMessage();

    }


    accountBtn?.addEventListener(
        "click",
        openAuth
    );


    closeAuth?.addEventListener(
        "click",
        closeAuthModal
    );


    authModal?.addEventListener(
        "click",
        event => {

            if (
                event.target === authModal
            ) {
                closeAuthModal();
            }

        }
    );


    showSignup?.addEventListener(
        "click",
        showSignupForm
    );


    showLogin?.addEventListener(
        "click",
        showLogin
    );


    /* =====================================================
       FORGOT PASSWORD BUTTON
       ===================================================== */

    function addForgotPasswordButton() {

        if (!loginPassword) return;

        if (
            $("forgotPasswordBtn")
        ) {
            return;
        }


        const button =
            document.createElement(
                "button"
            );


        button.type = "button";

        button.id =
            "forgotPasswordBtn";

        button.className =
            "forgot-password-btn";

        button.textContent =
            "Forgot Password?";


        loginPassword.parentElement
            ?.appendChild(button);


        button.addEventListener(
            "click",
            async () => {

                const email =
                    loginEmail?.value.trim();


                if (!email) {

                    authError(
                        "Pehle apna email enter karein."
                    );

                    loginEmail?.focus();

                    return;

                }


                if (
                    typeof window
                        .ubaidResetPassword !==
                    "function"
                ) {

                    authError(
                        "Firebase password reset connect nahi hai."
                    );

                    return;

                }


                try {

                    await window
                        .ubaidResetPassword(
                            email
                        );


                    authSuccess(
                        "Password reset link email par bhej diya gaya hai."
                    );


                    showToast(
                        "Reset email bhej diya gaya."
                    );


                } catch (error) {

                    console.error(
                        error
                    );

                    authError(
                        getFirebaseError(
                            error
                        )
                    );

                }

            }
        );

    }


    addForgotPasswordButton();


    /* =====================================================
       FIREBASE ERROR
       ===================================================== */

    function getFirebaseError(error) {

        const code =
            error?.code || "";


        const errors = {

            "auth/invalid-credential":
                "Email ya password galat hai.",

            "auth/invalid-email":
                "Valid email enter karein.",

            "auth/user-not-found":
                "Is email se account nahi mila.",

            "auth/wrong-password":
                "Password galat hai.",

            "auth/email-already-in-use":
                "Is email se account pehle se bana hua hai.",

            "auth/weak-password":
                "Password kam se kam 6 characters ka rakhein.",

            "auth/too-many-requests":
                "Bahut attempts ho gaye. Thodi der baad try karein.",

            "auth/network-request-failed":
                "Internet connection check karein."

        };


        return (
            errors[code] ||
            "Authentication mein problem aa gayi."
        );

    }


    /* =====================================================
       LOGIN
       ===================================================== */

    loginForm?.addEventListener(
        "submit",
        async event => {

            event.preventDefault();

            clearAuthMessage();


            const email =
                loginEmail?.value.trim();

            const password =
                loginPassword?.value;


            if (!email || !password) {

                authError(
                    "Email aur password dono enter karein."
                );

                return;

            }


            if (
                typeof window
                    .ubaidLogin !==
                "function"
            ) {

                authError(
                    "Firebase login function nahi mil raha. firebase.js check karein."
                );

                return;

            }


            try {

                authSuccess(
                    "Login ho raha hai..."
                );


                const user =
                    await window
                        .ubaidLogin(
                            email,
                            password
                        );


                updateUserUI(user);

                loginForm.reset();

                closeAuthModal();

                showToast(
                    "Login successful ❤️"
                );


            } catch (error) {

                console.error(
                    "Login:",
                    error
                );

                authError(
                    getFirebaseError(
                        error
                    )
                );

            }

        }
    );


    /* =====================================================
       SIGNUP
       ===================================================== */

    signupForm?.addEventListener(
        "submit",
        async event => {

            event.preventDefault();

            clearAuthMessage();


            const name =
                signupName?.value.trim();

            const email =
                signupEmail?.value.trim();

            const password =
                signupPassword?.value;


            if (
                !name ||
                !email ||
                !password
            ) {

                authError(
                    "Sabhi details fill karein."
                );

                return;

            }


            if (password.length < 6) {

                authError(
                    "Password kam se kam 6 characters ka hona chahiye."
                );

                return;

            }


            if (
                typeof window
                    .ubaidSignup !==
                "function"
            ) {

                authError(
                    "Firebase signup function nahi mil raha."
                );

                return;

            }


            try {

                authSuccess(
                    "Account create ho raha hai..."
                );


                const user =
                    await window
                        .ubaidSignup(
                            email,
                            password,
                            name
                        );


                updateUserUI(user);

                signupForm.reset();

                closeAuthModal();

                showToast(
                    "Account successfully create ho gaya ❤️"
                );


            } catch (error) {

                console.error(
                    "Signup:",
                    error
                );

                authError(
                    getFirebaseError(
                        error
                    )
                );

            }

        }
    );


    /* =====================================================
       USER UI
       ===================================================== */

    function updateUserUI(user) {

        if (user) {

            accountBtn &&
                (accountBtn.style.display =
                    "none");


            userProfileGroup &&
                (userProfileGroup.style.display =
                    "flex");


            const name =
                user.displayName ||
                user.email?.split("@")[0] ||
                "User";


            if (userDisplayName) {

                userDisplayName.textContent =
                    name;

            }


        } else {

            accountBtn &&
                (accountBtn.style.display =
                    "");


            userProfileGroup &&
                (userProfileGroup.style.display =
                    "none");


            if (userDisplayName) {

                userDisplayName.textContent =
                    "User";

            }

        }

    }


    /* =====================================================
       FIREBASE AUTH STATE
       ===================================================== */

    window.addEventListener(
        "ubaidAuthStateChanged",
        event => {

            updateUserUI(
                event.detail || null
            );

        }
    );


    /* =====================================================
       LOGOUT
       ===================================================== */

    logoutBtn?.addEventListener(
        "click",
        async event => {

            event.stopPropagation();


            if (
                typeof window
                    .ubaidLogout !==
                "function"
            ) {

                updateUserUI(null);

                showToast(
                    "Logout ho gaya."
                );

                return;

            }


            try {

                await window
                    .ubaidLogout();


                updateUserUI(null);


                showToast(
                    "Logout successful."
                );


            } catch (error) {

                console.error(
                    "Logout:",
                    error
                );

                showToast(
                    "Logout nahi ho paya."
                );

            }

        }
    );


    /* =====================================================
       COMMENTS
       ===================================================== */

    let comments =
        safeJSON(
            "ubaidMedicalComments",
            []
        );


    function saveComments() {

        localStorage.setItem(
            "ubaidMedicalComments",
            JSON.stringify(comments)
        );

    }


    function renderComments() {

        if (!commentsList) return;

        commentsList.innerHTML = "";


        if (!comments.length) {

            commentsList.innerHTML = `

                <div class="no-comments">

                    <i class="fa-regular fa-comment-dots"></i>

                    <h3>
                        Abhi koi review nahi hai
                    </h3>

                    <p>
                        Sabse pehla review aap likh sakte hain ❤️
                    </p>

                </div>

            `;

            return;

        }


        comments
            .slice()
            .reverse()
            .forEach(comment => {

                const card =
                    document.createElement(
                        "article"
                    );


                card.className =
                    "comment-card";


                const initial =
                    String(
                        comment.name || "U"
                    )
                        .charAt(0)
                        .toUpperCase();


                card.innerHTML = `

                    <div class="comment-avatar">
                        ${escapeHTML(initial)}
                    </div>

                    <div class="comment-content">

                        <div class="comment-top">

                            <strong>
                                ${escapeHTML(comment.name)}
                            </strong>

                            <span>
                                ${escapeHTML(comment.date)}
                            </span>

                        </div>

                        <p>
                            ${escapeHTML(comment.text)}
                        </p>

                    </div>

                `;


                commentsList.appendChild(
                    card
                );

            });

    }


    commentForm?.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const name =
                commentName?.value.trim();

            const text =
                commentText?.value.trim();


            if (!name || !text) {

                showToast(
                    "Name aur review dono likhein."
                );

                return;

            }


            comments.push({

                name,

                text,

                date:
                    new Date()
                        .toLocaleDateString(
                            "en-IN",
                            {
                                day: "2-digit",
                                month: "short",
                                year: "numeric"
                            }
                        )

            });


            saveComments();

            renderComments();

            commentForm.reset();


            showToast(
                "Review add ho gaya ❤️"
            );

        }
    );


    /* =====================================================
       ESCAPE KEY
       ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape"
            ) {

                closeCartSidebar();
                closeAuthModal();

            }

        }
    );


    /* =====================================================
       INITIALIZE
       ===================================================== */

    renderProducts(medicines);

    renderCart();

    renderComments();

    console.log(
        "✅ Ubaid Medical Store script.js loaded successfully."
    );

});

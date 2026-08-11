// ============================================================
// UBAID MEDICAL STORE V2
// MAIN JAVASCRIPT - FINAL FIXED VERSION
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

    // ========================================================
    // HELPERS
    // ========================================================

    const $ = (selector) => document.querySelector(selector);
    const $$ = (selector) => document.querySelectorAll(selector);

    const get = (id) => document.getElementById(id);

    function showToast(message, icon = "fa-circle-check") {

        const toast = get("toast");

        if (!toast) {
            console.log(message);
            return;
        }

        const iconElement = toast.querySelector("i");
        const textElement = toast.querySelector("span");

        if (iconElement) {
            iconElement.className = `fa-solid ${icon}`;
        }

        if (textElement) {
            textElement.textContent = message;
        } else {
            toast.textContent = message;
        }

        toast.classList.add("show");

        clearTimeout(window.ubaidToastTimer);

        window.ubaidToastTimer = setTimeout(() => {
            toast.classList.remove("show");
        }, 3000);
    }


    function getInitials(name = "User") {

        const words = name
            .trim()
            .split(/\s+/)
            .filter(Boolean);

        if (!words.length) return "U";

        if (words.length === 1) {
            return words[0].substring(0, 2).toUpperCase();
        }

        return (
            words[0][0] +
            words[words.length - 1][0]
        ).toUpperCase();
    }


    function escapeHTML(value = "") {

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    // ========================================================
    // DARK MODE
    // ========================================================

    const themeButtons = [
        get("themeToggle"),
        get("darkModeToggle"),
        get("darkModeBtn")
    ].filter(Boolean);

    function applyTheme() {

        const savedTheme =
            localStorage.getItem("ubaid-theme");

        const dark =
            savedTheme === "dark";

        document.body.classList.toggle(
            "dark-mode",
            dark
        );

        themeButtons.forEach((button) => {

            const icon = button.querySelector("i");

            if (icon) {
                icon.className = dark
                    ? "fa-solid fa-sun"
                    : "fa-solid fa-moon";
            }
        });
    }

    themeButtons.forEach((button) => {

        button.addEventListener("click", () => {

            const dark =
                !document.body.classList.contains("dark-mode");

            document.body.classList.toggle(
                "dark-mode",
                dark
            );

            localStorage.setItem(
                "ubaid-theme",
                dark ? "dark" : "light"
            );
        });
    });

    applyTheme();


    // ========================================================
    // MOBILE NAVIGATION
    // ========================================================

    const mobileMenuBtn =
        get("mobileMenuBtn") ||
        $(".mobile-menu-btn");

    const nav =
        get("nav") ||
        $(".nav");

    const overlay =
        get("overlay") ||
        $(".overlay");

    function closeMobileMenu() {

        if (nav) {
            nav.classList.remove("open");
            nav.classList.remove("active");
        }

        if (overlay) {
            overlay.classList.remove("active");
        }

        document.body.classList.remove("no-scroll");
    }


    function openMobileMenu() {

        if (nav) {
            nav.classList.add("open");
        }

        if (overlay) {
            overlay.classList.add("active");
        }

        document.body.classList.add("no-scroll");
    }


    if (mobileMenuBtn) {

        mobileMenuBtn.addEventListener("click", () => {

            if (
                nav &&
                (
                    nav.classList.contains("open") ||
                    nav.classList.contains("active")
                )
            ) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });
    }


    if (overlay) {

        overlay.addEventListener(
            "click",
            closeMobileMenu
        );
    }


    $$(".nav-links a").forEach((link) => {

        link.addEventListener("click", () => {
            closeMobileMenu();
        });
    });


    // ========================================================
    // SEARCH
    // ========================================================

    const searchInputs = [
        get("searchInput"),
        get("mobileSearchInput"),
        get("mainSearchInput")
    ].filter(Boolean);

    const productSearch =
        get("productSearch") ||
        get("medicineSearch");


    function performSearch(value) {

        const query =
            String(value || "")
                .trim()
                .toLowerCase();

        if (productSearch) {
            productSearch.value = query;
            productSearch.dispatchEvent(
                new Event("input", {
                    bubbles: true
                })
            );
        }

        const medicinesSection =
            document.querySelector(
                "#medicines"
            ) ||
            document.querySelector(
                ".medicines-section"
            );

        if (query && medicinesSection) {

            medicinesSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    }


    searchInputs.forEach((input) => {

        input.addEventListener("keydown", (event) => {

            if (event.key === "Enter") {
                performSearch(input.value);
            }
        });
    });


    $$(".search-main-btn, .header-search button, .mobile-search-box button")
        .forEach((button) => {

            button.addEventListener("click", () => {

                const parent =
                    button.closest(
                        ".search-box, .header-search, .mobile-search-box"
                    );

                const input =
                    parent?.querySelector("input");

                performSearch(
                    input?.value || ""
                );
            });
        });


    // ========================================================
    // PRODUCTS
    // ========================================================

    const productsGrid =
        get("productsGrid") ||
        $(".products-grid");

    const productCards =
        productsGrid
            ? Array.from(
                productsGrid.querySelectorAll(
                    ".product-card"
                )
            )
            : [];


    function filterProducts(query = "") {

        const search =
            query
                .trim()
                .toLowerCase();

        let visible = 0;

        productCards.forEach((card) => {

            const text =
                card.textContent.toLowerCase();

            const match =
                !search ||
                text.includes(search);

            card.style.display =
                match ? "" : "block";

            if (!match) {
                card.style.display = "none";
            } else {
                visible++;
            }
        });


        const result =
            document.querySelector(
                ".medicine-result"
            );

        if (result) {

            const number =
                result.querySelector(
                    "strong, span"
                );

            if (number) {
                number.textContent =
                    visible;
            }
        }


        const empty =
            get("emptyProducts") ||
            $(".empty-products");

        if (empty) {
            empty.style.display =
                visible === 0
                    ? "block"
                    : "none";
        }
    }


    if (productSearch) {

        productSearch.addEventListener(
            "input",
            () => {
                filterProducts(
                    productSearch.value
                );
            }
        );
    }


    // ========================================================
    // CATEGORY FILTER
    // ========================================================

    $$(".category-card").forEach((card) => {

        card.addEventListener("click", () => {

            const category =
                (
                    card.dataset.category ||
                    card.querySelector("h3")?.textContent ||
                    ""
                )
                .toLowerCase();

            if (productSearch) {
                productSearch.value =
                    category;
            }

            filterProducts(category);

            const section =
                document.querySelector(
                    "#medicines"
                ) ||
                document.querySelector(
                    ".medicines-section"
                );

            if (section) {

                section.scrollIntoView({
                    behavior: "smooth"
                });
            }
        });
    });


    // ========================================================
    // CART
    // ========================================================

    const CART_KEY =
        "ubaid-medical-cart";

    let cart = [];

    try {

        cart =
            JSON.parse(
                localStorage.getItem(
                    CART_KEY
                )
            ) || [];

        if (!Array.isArray(cart)) {
            cart = [];
        }

    } catch {

        cart = [];
    }


    const cartSidebar =
        get("cartSidebar") ||
        $(".cart-sidebar");

    const cartButton =
        get("cartButton") ||
        $(".cart-button");

    const cartItems =
        get("cartItems") ||
        $(".cart-items");

    const cartCount =
        get("cartCount");

    const cartTotal =
        get("cartTotal") ||
        document.querySelector(
            ".cart-total-row strong"
        );


    function saveCart() {

        localStorage.setItem(
            CART_KEY,
            JSON.stringify(cart)
        );
    }


    function getCartCount() {

        return cart.reduce(
            (total, item) =>
                total + Number(item.quantity || 0),
            0
        );
    }


    function getCartTotal() {

        return cart.reduce(
            (total, item) =>
                total +
                (
                    Number(item.price || 0) *
                    Number(item.quantity || 0)
                ),
            0
        );
    }


    function updateCartCount() {

        if (cartCount) {

            cartCount.textContent =
                getCartCount();
        }
    }


    function renderCart() {

        updateCartCount();

        if (!cartItems) return;


        if (!cart.length) {

            cartItems.innerHTML = `
                <div class="empty-cart">
                    <div class="empty-cart-icon">
                        <i class="fa-solid fa-cart-shopping"></i>
                    </div>

                    <h3>Your cart is empty</h3>

                    <p>
                        Add medicines to your cart
                        to continue.
                    </p>
                </div>
            `;

        } else {

            cartItems.innerHTML =
                cart.map((item, index) => {

                    const price =
                        Number(item.price || 0);

                    const quantity =
                        Number(item.quantity || 1);

                    const subtotal =
                        price * quantity;

                    return `
                        <div class="cart-item">

                            <div class="cart-item-image cart-item-icon">
                                <i class="fa-solid fa-pills"></i>
                            </div>

                            <div>

                                <h4>
                                    ${escapeHTML(item.name)}
                                </h4>

                                <p>
                                    ₹${price.toFixed(2)}
                                </p>

                                <div class="cart-qty quantity-controls">

                                    <button
                                        type="button"
                                        data-cart-action="decrease"
                                        data-index="${index}"
                                    >
                                        <i class="fa-solid fa-minus"></i>
                                    </button>

                                    <span>
                                        ${quantity}
                                    </span>

                                    <button
                                        type="button"
                                        data-cart-action="increase"
                                        data-index="${index}"
                                    >
                                        <i class="fa-solid fa-plus"></i>
                                    </button>

                                </div>

                            </div>

                            <div class="cart-item-price">
                                ₹${subtotal.toFixed(2)}
                            </div>

                        </div>
                    `;
                }).join("");
        }


        if (cartTotal) {

            cartTotal.textContent =
                `₹${getCartTotal().toFixed(2)}`;
        }


        saveCart();
    }


    function addToCart(product) {

        const existing =
            cart.find(
                item =>
                    String(item.id) ===
                    String(product.id)
            );


        if (existing) {

            existing.quantity =
                Number(existing.quantity || 0) + 1;

        } else {

            cart.push({
                id: product.id,
                name: product.name,
                price: Number(product.price || 0),
                quantity: 1
            });
        }


        renderCart();

        showToast(
            `${product.name} cart mein add ho gayi.`
        );
    }


    // Existing add-cart buttons
    $$(".add-cart-btn").forEach((button) => {

        button.addEventListener("click", () => {

            const card =
                button.closest(".product-card");

            if (!card) return;

            const name =
                card.dataset.name ||
                card.querySelector("h3")?.textContent ||
                "Medicine";

            const priceText =
                card.dataset.price ||
                card.querySelector(
                    ".product-price strong"
                )?.textContent ||
                card.querySelector(
                    ".product-bottom strong"
                )?.textContent ||
                "0";


            const price =
                Number(
                    String(priceText)
                        .replace(/[₹,\s]/g, "")
                        .replace(/[^\d.]/g, "")
                ) || 0;


            const id =
                card.dataset.id ||
                name.toLowerCase().replace(
                    /\s+/g,
                    "-"
                );


            addToCart({
                id,
                name,
                price
            });
        });
    });


    if (cartItems) {

        cartItems.addEventListener(
            "click",
            (event) => {

                const button =
                    event.target.closest(
                        "[data-cart-action]"
                    );

                if (!button) return;

                const index =
                    Number(button.dataset.index);

                const action =
                    button.dataset.cartAction;

                if (!cart[index]) return;


                if (action === "increase") {

                    cart[index].quantity++;

                } else if (
                    action === "decrease"
                ) {

                    cart[index].quantity--;

                    if (
                        cart[index].quantity <= 0
                    ) {
                        cart.splice(index, 1);
                    }
                }

                renderCart();
            }
        );
    }


    function openCart() {

        if (cartSidebar) {
            cartSidebar.classList.add("active");
        }

        if (overlay) {
            overlay.classList.add("active");
        }

        document.body.classList.add("no-scroll");
    }


    function closeCart() {

        if (cartSidebar) {
            cartSidebar.classList.remove("active");
        }

        if (overlay) {
            overlay.classList.remove("active");
        }

        document.body.classList.remove("no-scroll");
    }


    if (cartButton) {
        cartButton.addEventListener(
            "click",
            openCart
        );
    }


    $$(".cart-close, .close-cart-btn").forEach(
        (button) => {

            button.addEventListener(
                "click",
                closeCart
            );
        }
    );


    renderCart();


    // ========================================================
    // WHATSAPP ORDER
    // ========================================================

    $$(".whatsapp-order-btn, .whatsapp-banner-btn")
        .forEach((button) => {

            button.addEventListener(
                "click",
                () => {

                    if (!cart.length) {

                        showToast(
                            "Pehle cart mein medicine add karo.",
                            "fa-cart-shopping"
                        );

                        return;
                    }


                    const lines =
                        cart.map(
                            item =>
                                `• ${item.name} x${item.quantity} - ₹${(
                                    item.price *
                                    item.quantity
                                ).toFixed(2)}`
                        );


                    const message =
                        `Hello Ubaid Medical Store,%0A%0A` +
                        `Mujhe ye medicines order karni hain:%0A%0A` +
                        `${lines.join("%0A")}%0A%0A` +
                        `Total: ₹${getCartTotal().toFixed(2)}`;


                    const phone =
                        "919999999999";


                    window.open(
                        `https://wa.me/${phone}?text=${message}`,
                        "_blank"
                    );
                }
            );
        });


    // ========================================================
    // AUTH ELEMENTS
    // ========================================================

    const authModal =
        get("authModal") ||
        $(".auth-modal");

    const profileModal =
        get("profileModal") ||
        $(".profile-modal");

    const loginForm =
        get("loginForm");

    const signupForm =
        get("signupForm");

    const forgotForm =
        get("forgotPasswordForm");


    const accountBtn =
        get("accountBtn") ||
        $(".account-btn");


    const profileBtn =
        get("profileBtn") ||
        $(".profile-btn");


    const profileGroup =
        get("userProfileGroup") ||
        $(".user-profile-group");


    const profileDropdown =
        get("profileDropdown") ||
        $(".profile-dropdown");


    // ========================================================
    // AUTH MODAL HELPERS
    // ========================================================

    function openAuthModal(mode = "login") {

        if (!authModal) return;

        authModal.classList.add("active");

        document.body.classList.add(
            "no-scroll"
        );

        switchAuthMode(mode);
    }


    function closeAuthModal() {

        if (!authModal) return;

        authModal.classList.remove("active");

        document.body.classList.remove(
            "no-scroll"
        );
    }


    function switchAuthMode(mode) {

        const loginBox =
            get("loginBox") ||
            get("loginSection");

        const signupBox =
            get("signupBox") ||
            get("signupSection");

        const forgotBox =
            get("forgotBox") ||
            get("forgotSection");


        if (loginBox) {
            loginBox.style.display =
                mode === "login"
                    ? ""
                    : "none";
        }

        if (signupBox) {
            signupBox.style.display =
                mode === "signup"
                    ? ""
                    : "none";
        }

        if (forgotBox) {
            forgotBox.style.display =
                mode === "forgot"
                    ? ""
                    : "none";
        }
    }


    if (accountBtn) {

        accountBtn.addEventListener(
            "click",
            () => openAuthModal("login")
        );
    }


    $$(".auth-close, .close-auth").forEach(
        (button) => {

            button.addEventListener(
                "click",
                closeAuthModal
            );
        }
    );


    if (authModal) {

        authModal.addEventListener(
            "click",
            (event) => {

                if (
                    event.target === authModal
                ) {
                    closeAuthModal();
                }
            }
        );
    }


    // Login/signup/forgot switches
    $$("[data-auth-mode]").forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    switchAuthMode(
                        button.dataset.authMode
                    );
                }
            );
        }
    );


    // ========================================================
    // PASSWORD TOGGLE
    // ========================================================

    $$(".password-toggle").forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    const input =
                        button.parentElement
                            ?.querySelector(
                                "input"
                            );

                    if (!input) return;

                    const isPassword =
                        input.type === "password";

                    input.type =
                        isPassword
                            ? "text"
                            : "password";


                    const icon =
                        button.querySelector("i");

                    if (icon) {

                        icon.className =
                            isPassword
                                ? "fa-solid fa-eye-slash"
                                : "fa-solid fa-eye";
                    }
                }
            );
        }
    );


    // ========================================================
    // AUTH MESSAGE
    // ========================================================

    function authMessage(
        message,
        type = "error"
    ) {

        const boxes =
            $$(".auth-message");

        boxes.forEach((box) => {

            box.textContent = message;

            box.className =
                `auth-message show ${type}`;
        });
    }


    function clearAuthMessage() {

        $$(".auth-message").forEach(
            (box) => {

                box.classList.remove(
                    "show",
                    "error",
                    "success"
                );

                box.textContent = "";
            }
        );
    }


    function firebaseError(error) {

        const code =
            error?.code || "";

        const messages = {

            "auth/invalid-credential":
                "Email ya password galat hai.",

            "auth/invalid-login-credentials":
                "Email ya password galat hai.",

            "auth/user-not-found":
                "Is email se account nahi mila.",

            "auth/wrong-password":
                "Password galat hai.",

            "auth/email-already-in-use":
                "Is email se account pehle se bana hua hai.",

            "auth/weak-password":
                "Password kam se kam 6 characters ka hona chahiye.",

            "auth/invalid-email":
                "Valid email address enter karo.",

            "auth/too-many-requests":
                "Bahut zyada attempts ho gaye. Thodi der baad try karo.",

            "auth/network-request-failed":
                "Internet connection check karo.",

            "auth/user-disabled":
                "Ye account disable hai."
        };


        return (
            messages[code] ||
            error?.message ||
            "Authentication mein problem aa gayi."
        );
    }


    // ========================================================
    // LOGIN
    // ========================================================

    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            async (event) => {

                event.preventDefault();

                clearAuthMessage();


                const email =
                    loginForm.querySelector(
                        'input[type="email"]'
                    )?.value.trim();


                const password =
                    loginForm.querySelector(
                        'input[type="password"]'
                    )?.value;


                const submit =
                    loginForm.querySelector(
                        'button[type="submit"]'
                    );


                try {

                    if (!window.ubaidLogin) {
                        throw new Error(
                            "Firebase load nahi hua."
                        );
                    }


                    if (submit) {
                        submit.disabled = true;
                        submit.dataset.oldText =
                            submit.innerHTML;
                        submit.innerHTML =
                            "Logging in...";
                    }


                    await window.ubaidLogin(
                        email,
                        password
                    );


                    authMessage(
                        "Login successful!",
                        "success"
                    );


                    showToast(
                        "Login successful!"
                    );


                    setTimeout(
                        closeAuthModal,
                        600
                    );

                } catch (error) {

                    authMessage(
                        firebaseError(error),
                        "error"
                    );

                } finally {

                    if (submit) {

                        submit.disabled = false;

                        submit.innerHTML =
                            submit.dataset.oldText ||
                            "Login";
                    }
                }
            }
        );
    }


    // ========================================================
    // SIGNUP
    // ========================================================

    if (signupForm) {

        signupForm.addEventListener(
            "submit",
            async (event) => {

                event.preventDefault();

                clearAuthMessage();


                const inputs =
                    signupForm.querySelectorAll(
                        "input"
                    );


                const name =
                    signupForm.querySelector(
                        'input[name="name"]'
                    )?.value.trim() ||
                    inputs[0]?.value.trim();


                const email =
                    signupForm.querySelector(
                        'input[type="email"]'
                    )?.value.trim();


                const password =
                    signupForm.querySelector(
                        'input[type="password"]'
                    )?.value;


                const submit =
                    signupForm.querySelector(
                        'button[type="submit"]'
                    );


                try {

                    if (!window.ubaidSignup) {
                        throw new Error(
                            "Firebase load nahi hua."
                        );
                    }


                    if (submit) {

                        submit.disabled = true;

                        submit.dataset.oldText =
                            submit.innerHTML;

                        submit.innerHTML =
                            "Creating account...";
                    }


                    await window.ubaidSignup(
                        email,
                        password,
                        name
                    );


                    authMessage(
                        "Account successfully create ho gaya!",
                        "success"
                    );


                    showToast(
                        "Account created successfully!"
                    );


                    setTimeout(
                        closeAuthModal,
                        800
                    );

                } catch (error) {

                    authMessage(
                        firebaseError(error),
                        "error"
                    );

                } finally {

                    if (submit) {

                        submit.disabled = false;

                        submit.innerHTML =
                            submit.dataset.oldText ||
                            "Create Account";
                    }
                }
            }
        );
    }


    // ========================================================
    // FORGOT PASSWORD
    // ========================================================

    if (forgotForm) {

        forgotForm.addEventListener(
            "submit",
            async (event) => {

                event.preventDefault();

                clearAuthMessage();


                const email =
                    forgotForm.querySelector(
                        'input[type="email"]'
                    )?.value.trim();


                try {

                    await window.ubaidResetPassword(
                        email
                    );


                    authMessage(
                        "Password reset email bhej diya gaya hai.",
                        "success"
                    );


                    showToast(
                        "Password reset email sent."
                    );

                } catch (error) {

                    authMessage(
                        firebaseError(error),
                        "error"
                    );
                }
            }
        );
    }


    // ========================================================
    // PROFILE
    // ========================================================

    function updateUserUI(user) {

        const loggedIn =
            !!user;


        // Account button
        if (accountBtn) {

            accountBtn.style.display =
                loggedIn
                    ? "none"
                    : "";
        }


        // Profile group
        if (profileGroup) {

            profileGroup.style.display =
                loggedIn
                    ? ""
                    : "none";
        }


        if (!loggedIn) return;


        const name =
            user.displayName ||
            user.email?.split("@")[0] ||
            "User";


        const initials =
            getInitials(name);


        $$(".user-name").forEach(
            (element) => {

                element.textContent =
                    name;
            }
        );


        $$(".user-avatar, .profile-avatar-large, .profile-modal-avatar")
            .forEach(
                (element) => {

                    element.textContent =
                        initials;
                }
            );


        $$(".profile-email, [data-user-email]")
            .forEach(
                (element) => {

                    element.textContent =
                        user.email || "";
                }
            );


        $$(".profile-user-name, [data-user-name]")
            .forEach(
                (element) => {

                    element.textContent =
                        name;
                }
            );
    }


    if (profileBtn) {

        profileBtn.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();

                if (!profileGroup) return;

                profileGroup.classList.toggle(
                    "open"
                );
            }
        );
    }


    document.addEventListener(
        "click",
        (event) => {

            if (
                profileGroup &&
                !profileGroup.contains(event.target)
            ) {
                profileGroup.classList.remove(
                    "open"
                );
            }
        }
    );


    function openProfileModal() {

        if (!profileModal) return;

        profileModal.classList.add("active");

        document.body.classList.add(
            "no-scroll"
        );
    }


    function closeProfileModal() {

        if (!profileModal) return;

        profileModal.classList.remove(
            "active"
        );

        document.body.classList.remove(
            "no-scroll"
        );
    }


    $$(".profile-view-btn, [data-profile-open]")
        .forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    () => {

                        if (profileGroup) {
                            profileGroup.classList.remove(
                                "open"
                            );
                        }

                        openProfileModal();
                    }
                );
            }
        );


    $$(".profile-modal-close, .close-profile")
        .forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    closeProfileModal
                );
            }
        );


    if (profileModal) {

        profileModal.addEventListener(
            "click",
            (event) => {

                if (
                    event.target === profileModal
                ) {
                    closeProfileModal();
                }
            }
        );
    }


    // ========================================================
    // LOGOUT
    // ========================================================

    $$(".logout-menu-btn, .logout-large-btn, #logoutBtn")
        .forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    async () => {

                        try {

                            if (
                                window.ubaidLogout
                            ) {

                                await window.ubaidLogout();
                            }


                            if (profileGroup) {
                                profileGroup.classList.remove(
                                    "open"
                                );
                            }


                            closeProfileModal();

                            showToast(
                                "Logout successful."
                            );

                        } catch (error) {

                            showToast(
                                firebaseError(error),
                                "fa-circle-exclamation"
                            );
                        }
                    }
                );
            }
        );


    // ========================================================
    // FIREBASE AUTH STATE
    // ========================================================

    function handleAuthState(user) {

        updateUserUI(user);

        if (user) {

            console.log(
                "✅ User authenticated:",
                user.email
            );

        } else {

            console.log(
                "ℹ️ User is logged out"
            );
        }
    }


    // Listen for Firebase event
    window.addEventListener(
        "ubaidAuthStateChanged",
        (event) => {

            handleAuthState(
                event.detail || null
            );
        }
    );


    // IMPORTANT:
    // firebase.js may have already completed
    // auth state before this script listener existed.
    if (
        window.ubaidAuthReady === true
    ) {

        handleAuthState(
            window.ubaidCurrentUser || null
        );
    }


    // ========================================================
    // REVIEWS
    // ========================================================

    const REVIEW_KEY =
        "ubaid-medical-reviews";


    let reviews = [];

    try {

        reviews =
            JSON.parse(
                localStorage.getItem(
                    REVIEW_KEY
                )
            ) || [];

        if (!Array.isArray(reviews)) {
            reviews = [];
        }

    } catch {

        reviews = [];
    }


    const reviewForm =
        get("reviewForm");


    const commentsList =
        get("commentsList") ||
        $(".comments-list");


    const ratingButtons =
        $$(".rating-input button");


    let selectedRating = 0;


    ratingButtons.forEach(
        (button, index) => {

            button.addEventListener(
                "click",
                () => {

                    selectedRating =
                        Number(
                            button.dataset.rating ||
                            index + 1
                        );


                    ratingButtons.forEach(
                        (star, starIndex) => {

                            star.classList.toggle(
                                "active",
                                starIndex <
                                selectedRating
                            );
                        }
                    );
                }
            );
        }
    );


    function renderReviews() {

        if (!commentsList) return;


        if (!reviews.length) {

            commentsList.innerHTML = `
                <div class="review-placeholder">
                    <i class="fa-regular fa-comments"></i>

                    <h3>No reviews yet</h3>

                    <p>
                        Be the first to review Ubaid Medical Store.
                    </p>
                </div>
            `;

            return;
        }


        commentsList.innerHTML =
            reviews.map(
                (review) => {

                    const stars =
                        "★".repeat(
                            Number(review.rating || 0)
                        ) +
                        "☆".repeat(
                            5 -
                            Number(review.rating || 0)
                        );


                    return `
                        <div class="review-item">

                            <div class="review-item-head">

                                <div class="review-user">

                                    <div class="review-user-avatar">
                                        ${escapeHTML(
                                            getInitials(
                                                review.name
                                            )
                                        )}
                                    </div>

                                    <div>
                                        <strong>
                                            ${escapeHTML(
                                                review.name
                                            )}
                                        </strong>

                                        <small>
                                            ${escapeHTML(
                                                review.date || ""
                                            )}
                                        </small>
                                    </div>

                                </div>

                                <div class="stars">
                                    ${stars}
                                </div>

                            </div>

                            <p class="review-text">
                                ${escapeHTML(
                                    review.text
                                )}
                            </p>

                        </div>
                    `;
                }
            ).join("");
    }


    if (reviewForm) {

        reviewForm.addEventListener(
            "submit",
            (event) => {

                event.preventDefault();


                const user =
                    window.ubaidCurrentUser;


                if (!user) {

                    showToast(
                        "Review dene ke liye pehle login karo.",
                        "fa-lock"
                    );

                    openAuthModal("login");

                    return;
                }


                if (!selectedRating) {

                    showToast(
                        "Rating select karo.",
                        "fa-star"
                    );

                    return;
                }


                const name =
                    user.displayName ||
                    user.email?.split("@")[0] ||
                    "User";


                const textarea =
                    reviewForm.querySelector(
                        "textarea"
                    );


                const text =
                    textarea?.value.trim();


                if (!text) {

                    showToast(
                        "Review likho.",
                        "fa-comment"
                    );

                    return;
                }


                reviews.unshift({

                    name,

                    email:
                        user.email || "",

                    rating:
                        selectedRating,

                    text,

                    date:
                        new Date().toLocaleDateString(
                            "en-IN"
                        )
                });


                localStorage.setItem(
                    REVIEW_KEY,
                    JSON.stringify(reviews)
                );


                reviewForm.reset();

                selectedRating = 0;

                ratingButtons.forEach(
                    (star) => {
                        star.classList.remove(
                            "active"
                        );
                    }
                );


                renderReviews();


                showToast(
                    "Review successfully add ho gaya!"
                );
            }
        );
    }


    renderReviews();


    // ========================================================
    // SELECT / SORT PRODUCTS
    // ========================================================

    const sortSelect =
        document.querySelector(
            ".medicine-filter select"
        );


    if (
        sortSelect &&
        productsGrid
    ) {

        sortSelect.addEventListener(
            "change",
            () => {

                const cards =
                    Array.from(
                        productsGrid.querySelectorAll(
                            ".product-card"
                        )
                    );


                const value =
                    sortSelect.value;


                cards.sort(
                    (a, b) => {

                        const priceA =
                            Number(
                                (
                                    a.dataset.price ||
                                    a.querySelector(
                                        ".product-price strong"
                                    )?.textContent ||
                                    "0"
                                )
                                .replace(
                                    /[^\d.]/g,
                                    ""
                                )
                            ) || 0;


                        const priceB =
                            Number(
                                (
                                    b.dataset.price ||
                                    b.querySelector(
                                        ".product-price strong"
                                    )?.textContent ||
                                    "0"
                                )
                                .replace(
                                    /[^\d.]/g,
                                    ""
                                )
                            ) || 0;


                        if (
                            value === "low" ||
                            value === "price-low"
                        ) {
                            return priceA - priceB;
                        }


                        if (
                            value === "high" ||
                            value === "price-high"
                        ) {
                            return priceB - priceA;
                        }


                        return 0;
                    }
                );


                cards.forEach(
                    (card) =>
                        productsGrid.appendChild(
                            card
                        )
                );
            }
        );
    }


    // ========================================================
    // ACTIVE NAVIGATION
    // ========================================================

    const sections =
        Array.from(
            document.querySelectorAll(
                "section[id]"
            )
        );


    const navAnchors =
        Array.from(
            document.querySelectorAll(
                ".nav-links a[href^='#']"
            )
        );


    function updateActiveNav() {

        const scrollPosition =
            window.scrollY + 130;


        let currentId = "";


        sections.forEach(
            (section) => {

                if (
                    scrollPosition >=
                    section.offsetTop
                ) {
                    currentId =
                        section.id;
                }
            }
        );


        navAnchors.forEach(
            (link) => {

                const target =
                    link.getAttribute("href")
                        ?.replace("#", "");


                link.classList.toggle(
                    "active",
                    target === currentId
                );
            }
        );
    }


    window.addEventListener(
        "scroll",
        updateActiveNav,
        {
            passive: true
        }
    );


    updateActiveNav();


    // ========================================================
    // GLOBAL ESCAPE KEY
    // ========================================================

    document.addEventListener(
        "keydown",
        (event) => {

            if (event.key !== "Escape") {
                return;
            }

            closeMobileMenu();
            closeCart();
            closeAuthModal();
            closeProfileModal();

            if (profileGroup) {
                profileGroup.classList.remove(
                    "open"
                );
            }
        }
    );


    // ========================================================
    // FINAL INIT
    // ========================================================

    console.log(
        "✅ Ubaid Medical Store V2 JavaScript Ready"
    );

});

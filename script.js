/* =========================================================
   UBAID MEDICAL STORE
   script.js — PART 1
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
       ===================================================== */

    const $ = (id) => document.getElementById(id);

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

    const medicineSearch = $("medicineSearch");
    const mobileMedicineSearch = $("mobileMedicineSearch");
    const mainMedicineSearch = $("mainMedicineSearch");

    const searchBtn = $("searchBtn");
    const mobileSearchBtn = $("mobileSearchBtn");
    const mainSearchBtn = $("mainSearchBtn");

    const productsGrid = $("productsGrid");
    const emptyProducts = $("emptyProducts");
    const resultCount = $("resultCount");
    const categoryFilter = $("categoryFilter");

    const cartBtn = $("cartBtn");
    const cartSidebar = $("cartSidebar");
    const closeCart = $("closeCart");
    const overlay = $("overlay");

    const cartItems = $("cartItems");
    const cartCount = $("cartCount");
    const cartItemsText = $("cartItemsText");
    const cartTotal = $("cartTotal");
    const cartFooter = $("cartFooter");
    const emptyCart = $("emptyCart");

    const continueShopping = $("continueShopping");
    const whatsappOrderBtn = $("whatsappOrderBtn");

    const toast = $("toast");
    const toastMessage = $("toastMessage");

    const commentForm = $("commentForm");
    const commentsList = $("commentsList");

    const mobileMenuBtn = $("mobileMenuBtn");
    const navLinks = $("navLinks");

    const currentYear = $("currentYear");


    /* =====================================================
       YEAR
       ===================================================== */

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }


    /* =====================================================
       MEDICINE DATA
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
            description: "For cough and throat care"
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
            name: "Hand Sanitizer",
            category: "personal-care",
            price: 60,
            icon: "fa-pump-soap",
            description: "Everyday hand hygiene"
        },

        {
            id: 9,
            name: "Face Mask",
            category: "personal-care",
            price: 10,
            icon: "fa-head-side-mask",
            description: "Protective face mask"
        },

        {
            id: 10,
            name: "Digital Thermometer",
            category: "firstaid",
            price: 150,
            icon: "fa-temperature-half",
            description: "Digital temperature checking"
        }

    ];


    /* =====================================================
       CART
       ===================================================== */

    let cart = [];

    try {
        cart = JSON.parse(localStorage.getItem("ubaidCart")) || [];
    } catch (error) {
        cart = [];
    }


    function saveCart() {
        localStorage.setItem("ubaidCart", JSON.stringify(cart));
    }


    function showToast(message) {

        if (!toast || !toastMessage) return;

        toastMessage.textContent = message;

        toast.classList.add("show");

        setTimeout(() => {
            toast.classList.remove("show");
        }, 2500);
    }


    function formatPrice(price) {
        return `₹${Number(price).toFixed(0)}`;
    }


    /* =====================================================
       RENDER PRODUCTS
       ===================================================== */

    function renderProducts(list = medicines) {

        if (!productsGrid) return;

        productsGrid.innerHTML = "";

        if (!list.length) {

            if (emptyProducts) {
                emptyProducts.hidden = false;
            }

            if (resultCount) {
                resultCount.textContent = "0 medicines found";
            }

            return;
        }

        if (emptyProducts) {
            emptyProducts.hidden = true;
        }

        if (resultCount) {
            resultCount.textContent =
                `Showing ${list.length} medicine${list.length > 1 ? "s" : ""}`;
        }


        list.forEach(product => {

            const card = document.createElement("article");

            card.className = "product-card";

            card.innerHTML = `

                <div class="product-image">

                    <i class="fa-solid ${product.icon}"></i>

                </div>

                <div class="product-content">

                    <span class="product-category">
                        ${product.category}
                    </span>

                    <h3>
                        ${product.name}
                    </h3>

                    <p>
                        ${product.description}
                    </p>

                    <div class="product-bottom">

                        <strong>
                            ${formatPrice(product.price)}
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


    /* =====================================================
       ADD TO CART
       ===================================================== */

    function addToCart(productId) {

        const product = medicines.find(
            item => item.id === Number(productId)
        );

        if (!product) return;

        const existing = cart.find(
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

        showToast(`${product.name} cart mein add ho gayi ❤️`);

    }


    /* =====================================================
       REMOVE FROM CART
       ===================================================== */

    function removeFromCart(productId) {

        cart = cart.filter(
            item => item.id !== Number(productId)
        );

        saveCart();

        renderCart();

    }


    /* =====================================================
       CHANGE QUANTITY
       ===================================================== */

    function changeQuantity(productId, change) {

        const item = cart.find(
            product => product.id === Number(productId)
        );

        if (!item) return;

        item.quantity += change;

        if (item.quantity <= 0) {

            removeFromCart(productId);

            return;
        }

        saveCart();

        renderCart();

    }


    /* =====================================================
       RENDER CART
       ===================================================== */

    function renderCart() {

        if (!cartItems) return;

        cartItems.innerHTML = "";

        let totalItems = 0;
        let totalPrice = 0;


        cart.forEach(item => {

            totalItems += item.quantity;

            totalPrice += item.price * item.quantity;


            const cartItem = document.createElement("div");

            cartItem.className = "cart-item";

            cartItem.innerHTML = `

                <div class="cart-item-icon">

                    <i class="fa-solid ${item.icon}"></i>

                </div>

                <div class="cart-item-info">

                    <h4>
                        ${item.name}
                    </h4>

                    <strong>
                        ${formatPrice(item.price)}
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
                    aria-label="Remove item"
                >
                    <i class="fa-solid fa-trash"></i>
                </button>

            `;

            cartItems.appendChild(cartItem);

        });


        if (cartCount) {
            cartCount.textContent = totalItems;
        }

        if (cartItemsText) {
            cartItemsText.textContent =
                `${totalItems} item${totalItems !== 1 ? "s" : ""}`;
        }

        if (cartTotal) {
            cartTotal.textContent = formatPrice(totalPrice);
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


    /* =====================================================
       PRODUCT BUTTON CLICK
       ===================================================== */

    if (productsGrid) {

        productsGrid.addEventListener("click", (event) => {

            const button =
                event.target.closest(".add-cart-btn");

            if (!button) return;

            addToCart(button.dataset.id);

        });

    }


    /* =====================================================
       CART BUTTON CLICK
       ===================================================== */

    if (cartItems) {

        cartItems.addEventListener("click", (event) => {

            const quantityButton =
                event.target.closest(".quantity-btn");

            const removeButton =
                event.target.closest(".remove-cart-item");


            if (quantityButton) {

                const id = quantityButton.dataset.id;

                const action = quantityButton.dataset.action;

                changeQuantity(
                    id,
                    action === "plus" ? 1 : -1
                );

                return;
            }


            if (removeButton) {

                removeFromCart(
                    removeButton.dataset.id
                );

            }

        });

    }


    /* =====================================================
       OPEN CART
       ===================================================== */

    function openCart() {

        if (cartSidebar) {
            cartSidebar.classList.add("active");
        }

        if (overlay) {
            overlay.classList.add("active");
        }

        document.body.classList.add("no-scroll");

    }


    /* =====================================================
       CLOSE CART
       ===================================================== */

    function closeCartSidebar() {

        if (cartSidebar) {
            cartSidebar.classList.remove("active");
        }

        if (overlay) {
            overlay.classList.remove("active");
        }

        document.body.classList.remove("no-scroll");

    }


    if (cartBtn) {
        cartBtn.addEventListener("click", openCart);
    }

    if (closeCart) {
        closeCart.addEventListener("click", closeCartSidebar);
    }

    if (overlay) {
        overlay.addEventListener("click", closeCartSidebar);
    }

    if (continueShopping) {

        continueShopping.addEventListener(
            "click",
            closeCartSidebar
        );

    }


    /* =====================================================
       WHATSAPP ORDER
       ===================================================== */

    if (whatsappOrderBtn) {

        whatsappOrderBtn.addEventListener("click", () => {

            if (!cart.length) {

                showToast("Pehle cart mein product add karein.");

                return;
            }


            let message =
                "🩺 *Ubaid Medical Store - Order*%0A%0A";


            cart.forEach((item, index) => {

                message +=
                    `${index + 1}. ${item.name} x ${item.quantity} - ${formatPrice(item.price * item.quantity)}%0A`;

            });


            const total =
                cart.reduce(
                    (sum, item) =>
                        sum + item.price * item.quantity,
                    0
                );


            message +=
                `%0A💰 *Total: ${formatPrice(total)}*`;

            message +=
                `%0A%0A📍 Thamarwa, Gopamau, Hardoi`;

            message +=
                `%0A%0APlease confirm my order.`;


            const whatsappNumber = "918009174690";

            const url =
                `https://wa.me/${whatsappNumber}?text=${message}`;


            window.open(url, "_blank");

        });

    }


    /* =====================================================
       SEARCH
       ===================================================== */

    function searchMedicines(value) {

        const query =
            String(value || "").trim().toLowerCase();


        const selectedCategory =
            categoryFilter?.value || "all";


        const filtered = medicines.filter(product => {

            const matchesSearch =
                !query ||
                product.name.toLowerCase().includes(query) ||
                product.description.toLowerCase().includes(query);


            const matchesCategory =
                selectedCategory === "all" ||
                product.category === selectedCategory;


            return matchesSearch && matchesCategory;

        });


        renderProducts(filtered);


        const medicinesSection =
            document.getElementById("medicines");

        if (medicinesSection && query) {

            medicinesSection.scrollIntoView({
                behavior: "smooth"
            });

        }

    }


    if (searchBtn) {

        searchBtn.addEventListener("click", () => {

            searchMedicines(
                medicineSearch?.value
            );

        });

    }


    if (mobileSearchBtn) {

        mobileSearchBtn.addEventListener("click", () => {

            searchMedicines(
                mobileMedicineSearch?.value
            );

        });

    }


    if (mainSearchBtn) {

        mainSearchBtn.addEventListener("click", () => {

            searchMedicines(
                mainMedicineSearch?.value
            );

        });

    }


    /* ENTER KEY SEARCH */

    [
        medicineSearch,
        mobileMedicineSearch,
        mainMedicineSearch
    ].forEach(input => {

        if (!input) return;

        input.addEventListener("keydown", event => {

            if (event.key === "Enter") {

                event.preventDefault();

                searchMedicines(input.value);

            }

        });

    });


    /* =====================================================
       CATEGORY FILTER
       ===================================================== */

    if (categoryFilter) {

        categoryFilter.addEventListener("change", () => {

            searchMedicines(
                medicineSearch?.value || ""
            );

        });

    }


    /* =====================================================
       CATEGORY CARDS
       ===================================================== */

    document.querySelectorAll(".category-card")
        .forEach(card => {

            card.addEventListener("click", () => {

                const category =
                    card.dataset.category;

                if (categoryFilter) {
                    categoryFilter.value = category;
                }

                searchMedicines("");

            });

        });


    /* =====================================================
       DARK MODE
       ===================================================== */

    function updateThemeIcon() {

        if (!themeToggle) return;

        const icon =
            themeToggle.querySelector("i");

        if (!icon) return;

        if (document.body.classList.contains("dark-mode")) {

            icon.className =
                "fa-solid fa-sun";

            themeToggle.title =
                "Light Mode";

        } else {

            icon.className =
                "fa-solid fa-moon";

            themeToggle.title =
                "Dark Mode";

        }

    }


    const savedTheme =
        localStorage.getItem("ubaidTheme");


    if (savedTheme === "dark") {

        document.body.classList.add("dark-mode");

    }


    updateThemeIcon();


    if (themeToggle) {

        themeToggle.addEventListener("click", () => {

            document.body.classList.toggle("dark-mode");

            const theme =
                document.body.classList.contains("dark-mode")
                    ? "dark"
                    : "light";

            localStorage.setItem(
                "ubaidTheme",
                theme
            );

            updateThemeIcon();

        });

    }


    /* =====================================================
       MOBILE MENU
       ===================================================== */

    if (mobileMenuBtn) {

        mobileMenuBtn.addEventListener("click", () => {

            if (navLinks) {
                navLinks.classList.toggle("active");
            }

        });

    }


    if (navLinks) {

        navLinks.querySelectorAll("a")
            .forEach(link => {

                link.addEventListener("click", () => {

                    navLinks.classList.remove("active");

                });

            });

    }


    /* =====================================================
       INITIAL LOAD
       ===================================================== */

    renderProducts();

    renderCart();

});/* =========================================================
   UBAID MEDICAL STORE
   script.js — PART 2
   AUTH + PROFILE + COMMENTS
   ========================================================= */


/* =========================================================
   AUTH MODAL
   ========================================================= */

function openAuthModal() {

    if (!authModal) return;

    authModal.classList.add("active");
    authModal.setAttribute("aria-hidden", "false");

    document.body.classList.add("no-scroll");

    showLoginForm();

}


function closeAuthModal() {

    if (!authModal) return;

    authModal.classList.remove("active");
    authModal.setAttribute("aria-hidden", "true");

    document.body.classList.remove("no-scroll");

    clearAuthMessage();

}


if (accountBtn) {

    accountBtn.addEventListener("click", () => {

        /*
         * Firebase login hone ke baad account button
         * normally hide ho jayega.
         * Isliye yahan login modal open hoga.
         */

        openAuthModal();

    });

}


if (closeAuth) {

    closeAuth.addEventListener(
        "click",
        closeAuthModal
    );

}


if (authModal) {

    authModal.addEventListener("click", (event) => {

        if (event.target === authModal) {

            closeAuthModal();

        }

    });

}


/* =========================================================
   LOGIN / SIGNUP FORM SWITCH
   ========================================================= */

function clearAuthMessage() {

    if (!authMessage) return;

    authMessage.textContent = "";

    authMessage.className = "auth-message";

}


function showAuthMessage(message, type = "error") {

    if (!authMessage) return;

    authMessage.textContent = message;

    authMessage.className =
        `auth-message ${type}`;

}


function showLoginForm() {

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


if (showSignup) {

    showSignup.addEventListener(
        "click",
        showSignupForm
    );

}


if (showLogin) {

    showLogin.addEventListener(
        "click",
        showLoginForm
    );

}


/* =========================================================
   FIREBASE AUTH STATE
   =========================================================
   
   Firebase configuration/auth listener is handled safely
   through the custom event below.

   firebase.js / Firebase code can dispatch:

   window.dispatchEvent(
       new CustomEvent("ubaidAuthStateChanged", {
           detail: user
       })
   );

   ========================================================= */

function updateUserUI(user) {

    if (user) {

        /*
         * USER LOGGED IN
         */

        if (accountBtn) {
            accountBtn.style.display = "none";
        }

        if (userProfileGroup) {
            userProfileGroup.style.display = "flex";
        }


        let displayName =
            user.displayName ||
            user.email?.split("@")[0] ||
            "User";


        if (userDisplayName) {
            userDisplayName.textContent =
                displayName;
        }


        closeAuthModal();


    } else {

        /*
         * USER LOGGED OUT
         */

        if (accountBtn) {
            accountBtn.style.display = "";
        }

        if (userProfileGroup) {
            userProfileGroup.style.display = "none";
        }

        if (userDisplayName) {
            userDisplayName.textContent =
                "User";
        }

    }

}


/* Firebase se user state receive karna */

window.addEventListener(
    "ubaidAuthStateChanged",
    (event) => {

        const user =
            event.detail || null;

        updateUserUI(user);

    }
);


/* =========================================================
   LOGOUT
   ========================================================= */

if (logoutBtn) {

    logoutBtn.addEventListener("click", async () => {

        try {

            /*
             * firebase.js agar logout function
             * expose karta hai to use call karega.
             */

            if (
                typeof window.ubaidLogout ===
                "function"
            ) {

                await window.ubaidLogout();

            } else {

                /*
                 * UI fallback
                 */

                updateUserUI(null);

                localStorage.removeItem(
                    "ubaidUser"
                );

            }

            showToast(
                "Aap successfully logout ho gaye."
            );

        } catch (error) {

            console.error(
                "Logout Error:",
                error
            );

            showToast(
                "Logout nahi ho paya."
            );

        }

    });

}


/* =========================================================
   LOGIN FORM
   ========================================================= */

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            clearAuthMessage();


            const email =
                $("loginEmail")?.value.trim();

            const password =
                $("loginPassword")?.value;


            if (!email || !password) {

                showAuthMessage(
                    "Email aur password enter karein."
                );

                return;

            }


            try {

                /*
                 * Firebase login function
                 */

                if (
                    typeof window.ubaidLogin !==
                    "function"
                ) {

                    showAuthMessage(
                        "Firebase authentication connect nahi hai."
                    );

                    console.error(
                        "ubaidLogin function not found."
                    );

                    return;

                }


                showAuthMessage(
                    "Login ho raha hai...",
                    "info"
                );


                const user =
                    await window.ubaidLogin(
                        email,
                        password
                    );


                if (user) {

                    updateUserUI(user);

                    showToast(
                        "Login successful ❤️"
                    );

                    loginForm.reset();

                }

            } catch (error) {

                console.error(
                    "Login Error:",
                    error
                );


                let message =
                    "Login nahi ho paya.";


                if (
                    error.code ===
                    "auth/invalid-credential"
                ) {

                    message =
                        "Email ya password galat hai.";

                }

                else if (
                    error.code ===
                    "auth/user-not-found"
                ) {

                    message =
                        "Is email se account nahi mila.";

                }

                else if (
                    error.code ===
                    "auth/wrong-password"
                ) {

                    message =
                        "Password galat hai.";

                }

                else if (
                    error.code ===
                    "auth/invalid-email"
                ) {

                    message =
                        "Valid email enter karein.";

                }


                showAuthMessage(message);

            }

        }
    );

}


/* =========================================================
   SIGNUP FORM
   ========================================================= */

if (signupForm) {

    signupForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            clearAuthMessage();


            const name =
                $("signupName")?.value.trim();

            const email =
                $("signupEmail")?.value.trim();

            const password =
                $("signupPassword")?.value;


            if (!name || !email || !password) {

                showAuthMessage(
                    "Sabhi details fill karein."
                );

                return;

            }


            if (password.length < 6) {

                showAuthMessage(
                    "Password kam se kam 6 characters ka hona chahiye."
                );

                return;

            }


            try {

                if (
                    typeof window.ubaidSignup !==
                    "function"
                ) {

                    showAuthMessage(
                        "Firebase authentication connect nahi hai."
                    );

                    console.error(
                        "ubaidSignup function not found."
                    );

                    return;

                }


                showAuthMessage(
                    "Account create ho raha hai...",
                    "info"
                );


                const user =
                    await window.ubaidSignup(
                        email,
                        password,
                        name
                    );


                if (user) {

                    updateUserUI(user);

                    showToast(
                        "Account successfully create ho gaya ❤️"
                    );

                    signupForm.reset();

                }

            } catch (error) {

                console.error(
                    "Signup Error:",
                    error
                );


                let message =
                    "Account create nahi ho paya.";


                if (
                    error.code ===
                    "auth/email-already-in-use"
                ) {

                    message =
                        "Is email se account pehle se bana hua hai.";

                }

                else if (
                    error.code ===
                    "auth/invalid-email"
                ) {

                    message =
                        "Valid email enter karein.";

                }

                else if (
                    error.code ===
                    "auth/weak-password"
                ) {

                    message =
                        "Password thoda strong rakhein.";

                }


                showAuthMessage(message);

            }

        }
    );

}


/* =========================================================
   FORGOT PASSWORD
   ========================================================= */

function createForgotPasswordButton() {

    if (!loginForm) return;

    if (
        document.getElementById(
            "forgotPasswordBtn"
        )
    ) {
        return;
    }


    const button =
        document.createElement("button");


    button.type = "button";

    button.id =
        "forgotPasswordBtn";

    button.className =
        "forgot-password-btn";

    button.innerHTML =
        `<i class="fa-solid fa-key"></i> Forgot Password?`;


    const passwordInput =
        $("loginPassword");


    if (
        passwordInput &&
        passwordInput.parentElement
    ) {

        passwordInput.parentElement
            .appendChild(button);

    }


    button.addEventListener(
        "click",
        async () => {

            const email =
                $("loginEmail")?.value.trim();


            if (!email) {

                showAuthMessage(
                    "Password reset ke liye pehle email enter karein."
                );

                $("loginEmail")?.focus();

                return;

            }


            try {

                if (
                    typeof window.ubaidResetPassword !==
                    "function"
                ) {

                    showAuthMessage(
                        "Password reset Firebase se connect nahi hai."
                    );

                    return;

                }


                await window.ubaidResetPassword(
                    email
                );


                showAuthMessage(
                    "Password reset link aapke email par bhej diya gaya hai.",
                    "success"
                );


                showToast(
                    "Reset email send ho gaya 📧"
                );


            } catch (error) {

                console.error(
                    "Password Reset Error:",
                    error
                );


                showAuthMessage(
                    "Password reset email nahi bheja ja saka."
                );

            }

        }
    );

}


createForgotPasswordButton();


/* =========================================================
   PROFILE CLICK
   ========================================================= */

if (userProfileGroup) {

    userProfileGroup.addEventListener(
        "click",
        (event) => {

            /*
             * Logout button ko ignore karo
             */

            if (
                event.target.closest(
                    "#logoutBtn"
                )
            ) {
                return;
            }


            showToast(
                "Profile account active hai."
            );

        }
    );

}


/* =========================================================
   COMMENTS / REVIEWS
   ========================================================= */

let comments = [];

try {

    comments =
        JSON.parse(
            localStorage.getItem(
                "ubaidComments"
            )
        ) || [];

} catch (error) {

    comments = [];

}


/* =========================================================
   SAVE COMMENTS
   ========================================================= */

function saveComments() {

    localStorage.setItem(
        "ubaidComments",
        JSON.stringify(comments)
    );

}


/* =========================================================
   RENDER COMMENTS
   ========================================================= */

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

            const article =
                document.createElement("article");


            article.className =
                "comment-card";


            const initial =
                comment.name
                    ? comment.name
                        .charAt(0)
                        .toUpperCase()
                    : "U";


            article.innerHTML = `

                <div class="comment-avatar">
                    ${initial}
                </div>

                <div class="comment-content">

                    <div class="comment-top">

                        <strong>
                            ${escapeHTML(comment.name)}
                        </strong>

                        <span>
                            ${comment.date}
                        </span>

                    </div>

                    <p>
                        ${escapeHTML(comment.text)}
                    </p>

                </div>

            `;


            commentsList.appendChild(article);

        });

}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent =
        String(text || "");

    return div.innerHTML;

}


/* =========================================================
   COMMENT FORM
   ========================================================= */

if (commentForm) {

    commentForm.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();


            const name =
                $("commentName")?.value.trim();

            const text =
                $("commentText")?.value.trim();


            if (!name || !text) {

                showToast(
                    "Name aur review dono likhein."
                );

                return;

            }


            const newComment = {

                name: name,

                text: text,

                date:
                    new Date().toLocaleDateString(
                        "en-IN",
                        {
                            day: "2-digit",
                            month: "short",
                            year: "numeric"
                        }
                    )

            };


            comments.push(
                newComment
            );


            saveComments();

            renderComments();

            commentForm.reset();


            showToast(
                "Aapka review add ho gaya ❤️"
            );

        }
    );

}


renderComments();


/* =========================================================
   CLOSE AUTH WITH ESCAPE
   ========================================================= */

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Escape"
        ) {

            closeCartSidebar();

            closeAuthModal();

        }

    }
);


/* =========================================================
   FINISH
   ========================================================= */

console.log(
    "Ubaid Medical Store script loaded successfully."
);/* =========================================================
   UBAID MEDICAL STORE
   firebase.js
   Firebase Authentication
   ========================================================= */

import { initializeApp } from
    "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    updateProfile
} from
    "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


/* =========================================================
   FIREBASE CONFIG
   ========================================================= */

const firebaseConfig = {

    apiKey:
        "AIzaSyBH-N7OqyPlrXDnZK9367IL2PtggdFap3s",

    authDomain:
        "ubaid-medical-store-web.firebaseapp.com",

    projectId:
        "ubaid-medical-store-web",

    storageBucket:
        "ubaid-medical-store-web.firebasestorage.app",

    messagingSenderId:
        "507479098165",

    appId:
        "1:507479098165:web:336a54f9773cf93f48c27c",

    measurementId:
        "G-9VLSHK9PNT"
};


/* =========================================================
   INITIALIZE FIREBASE
   ========================================================= */

const app =
    initializeApp(firebaseConfig);

const auth =
    getAuth(app);


/* =========================================================
   LOGIN
   ========================================================= */

window.ubaidLogin =
    async function (email, password) {

        const result =
            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

        return result.user;
    };


/* =========================================================
   SIGNUP
   ========================================================= */

window.ubaidSignup =
    async function (
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


        /*
         * User ka naam Firebase profile
         * mein save karna
         */

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


/* =========================================================
   LOGOUT
   ========================================================= */

window.ubaidLogout =
    async function () {

        await signOut(auth);

        return true;

    };


/* =========================================================
   FORGOT PASSWORD
   ========================================================= */

window.ubaidResetPassword =
    async function (email) {

        await sendPasswordResetEmail(
            auth,
            email
        );

        return true;

    };


/* =========================================================
   AUTH STATE
   ========================================================= */

onAuthStateChanged(
    auth,
    (user) => {

        /*
         * script.js ko user ki information
         * bhejna
         */

        window.dispatchEvent(
            new CustomEvent(
                "ubaidAuthStateChanged",
                {
                    detail: user || null
                }
            )
        );


        if (user) {

            console.log(
                "Logged in:",
                user.email
            );

        } else {

            console.log(
                "No user logged in."
            );

        }

    }
);


/* =========================================================
   FIREBASE READY
   ========================================================= */

console.log(
    "Firebase Authentication connected successfully."
);

/* =========================================================
   UBAID MEDICAL STORE
   COMPLETE JAVASCRIPT
   Cart + Search + Dark Mode + Mobile Menu
   WhatsApp + Firebase Authentication
   ========================================================= */

"use strict";

/* =========================================================
   FIREBASE
   ========================================================= */

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

import { auth } from "./firebase.js";


/* =========================================================
   MEDICINE DATA
   ========================================================= */

const medicines = [
    {
        id: 1,
        name: "Paracetamol 500mg",
        category: "fever",
        description: "For fever and mild to moderate pain",
        price: 25,
        icon: "fa-tablets"
    },
    {
        id: 2,
        name: "Paracetamol 650mg",
        category: "fever",
        description: "Pain and fever relief tablets",
        price: 35,
        icon: "fa-pills"
    },
    {
        id: 3,
        name: "Ibuprofen 400mg",
        category: "fever",
        description: "Pain and inflammation relief",
        price: 45,
        icon: "fa-tablets"
    },
    {
        id: 4,
        name: "Cough Syrup",
        category: "cold",
        description: "Relief from cough and throat irritation",
        price: 85,
        icon: "fa-prescription-bottle-medical"
    },
    {
        id: 5,
        name: "Cold Relief Tablets",
        category: "cold",
        description: "Helps relieve common cold symptoms",
        price: 60,
        icon: "fa-pills"
    },
    {
        id: 6,
        name: "Vitamin C Tablets",
        category: "vitamins",
        description: "Daily vitamin C supplement",
        price: 120,
        icon: "fa-capsules"
    },
    {
        id: 7,
        name: "Multivitamin Tablets",
        category: "vitamins",
        description: "Daily vitamins and minerals",
        price: 180,
        icon: "fa-capsules"
    },
    {
        id: 8,
        name: "ORS Sachet",
        category: "vitamins",
        description: "Helps restore fluids and electrolytes",
        price: 25,
        icon: "fa-droplet"
    },
    {
        id: 9,
        name: "Antiseptic Liquid",
        category: "firstaid",
        description: "For cleaning minor cuts and wounds",
        price: 95,
        icon: "fa-bottle-droplet"
    },
    {
        id: 10,
        name: "Adhesive Bandage",
        category: "firstaid",
        description: "Useful for minor cuts and wounds",
        price: 30,
        icon: "fa-bandage"
    },
    {
        id: 11,
        name: "Cotton Roll",
        category: "firstaid",
        description: "Soft cotton for first aid use",
        price: 45,
        icon: "fa-box"
    },
    {
        id: 12,
        name: "Digital Thermometer",
        category: "personal-care",
        description: "Easy-to-use digital thermometer",
        price: 199,
        icon: "fa-temperature-half"
    }
];


/* =========================================================
   VARIABLES
   ========================================================= */

let cart = [];
let currentSearch = "";
let currentCategory = "all";


/* =========================================================
   DOM ELEMENTS
   ========================================================= */

const productsGrid =
    document.getElementById("productsGrid");

const emptyProducts =
    document.getElementById("emptyProducts");

const resultCount =
    document.getElementById("resultCount");

const categoryFilter =
    document.getElementById("categoryFilter");

const cartBtn =
    document.getElementById("cartBtn");

const cartSidebar =
    document.getElementById("cartSidebar");

const closeCart =
    document.getElementById("closeCart");

const overlay =
    document.getElementById("overlay");

const cartItems =
    document.getElementById("cartItems");

const emptyCart =
    document.getElementById("emptyCart");

const cartFooter =
    document.getElementById("cartFooter");

const cartCount =
    document.getElementById("cartCount");

const cartTotal =
    document.getElementById("cartTotal");

const cartItemsText =
    document.getElementById("cartItemsText");

const continueShopping =
    document.getElementById("continueShopping");

const whatsappOrderBtn =
    document.getElementById("whatsappOrderBtn");

const themeToggle =
    document.getElementById("themeToggle");

const accountBtn =
    document.getElementById("accountBtn");

const authModal =
    document.getElementById("authModal");

const closeAuth =
    document.getElementById("closeAuth");

const loginForm =
    document.getElementById("loginForm");

const signupForm =
    document.getElementById("signupForm");

const showSignup =
    document.getElementById("showSignup");

const showLogin =
    document.getElementById("showLogin");

const authTitle =
    document.getElementById("authTitle");

const authSubtitle =
    document.getElementById("authSubtitle");

const authMessage =
    document.getElementById("authMessage");

const mobileMenuBtn =
    document.getElementById("mobileMenuBtn");

const navLinks =
    document.getElementById("navLinks");

const toast =
    document.getElementById("toast");

const toastMessage =
    document.getElementById("toastMessage");

const medicineSearch =
    document.getElementById("medicineSearch");

const searchBtn =
    document.getElementById("searchBtn");

const mobileMedicineSearch =
    document.getElementById("mobileMedicineSearch");

const mobileSearchBtn =
    document.getElementById("mobileSearchBtn");

const mainMedicineSearch =
    document.getElementById("mainMedicineSearch");

const mainSearchBtn =
    document.getElementById("mainSearchBtn");

const currentYear =
    document.getElementById("currentYear");


/* =========================================================
   LOCAL STORAGE - CART
   ========================================================= */

function loadCart() {

    try {

        const saved =
            localStorage.getItem(
                "ubaidMedicalCart"
            );

        if (saved) {
            cart = JSON.parse(saved);
        }

    } catch (error) {

        console.error(
            "Cart loading error:",
            error
        );

        cart = [];

    }
}


function saveCart() {

    localStorage.setItem(
        "ubaidMedicalCart",
        JSON.stringify(cart)
    );

}


/* =========================================================
   PRICE
   ========================================================= */

function formatPrice(price) {

    return "₹" +
        Number(price).toLocaleString("en-IN");

}


/* =========================================================
   TOAST
   ========================================================= */

function showToast(message) {

    if (!toast || !toastMessage) {
        return;
    }

    toastMessage.textContent = message;

    toast.classList.add("show");

    clearTimeout(
        window.ubaidToastTimer
    );

    window.ubaidToastTimer =
        setTimeout(() => {

            toast.classList.remove("show");

        }, 2500);

}


/* =========================================================
   CATEGORY NAME
   ========================================================= */

function getCategoryName(category) {

    const names = {

        fever: "Fever & Pain",

        cold: "Cold & Cough",

        vitamins: "Vitamins",

        firstaid: "First Aid",

        "personal-care": "Personal Care"

    };

    return names[category] || category;

}


/* =========================================================
   RENDER PRODUCTS
   ========================================================= */

function renderProducts() {

    if (!productsGrid) {
        return;
    }

    const search =
        currentSearch.trim().toLowerCase();


    const filtered =
        medicines.filter(product => {

            const matchesSearch =
                product.name
                    .toLowerCase()
                    .includes(search) ||

                product.description
                    .toLowerCase()
                    .includes(search);


            const matchesCategory =
                currentCategory === "all" ||
                product.category === currentCategory;


            return (
                matchesSearch &&
                matchesCategory
            );

        });


    productsGrid.innerHTML = "";


    if (resultCount) {

        resultCount.textContent =
            `Showing ${filtered.length} medicine${filtered.length !== 1 ? "s" : ""}`;

    }


    if (filtered.length === 0) {

        if (emptyProducts) {
            emptyProducts.hidden = false;
        }

        return;
    }


    if (emptyProducts) {
        emptyProducts.hidden = true;
    }


    filtered.forEach(product => {

        const card =
            document.createElement("article");

        card.className =
            "product-card";


        card.innerHTML = `

            <div class="product-image">
                <i class="fa-solid ${product.icon}"></i>
            </div>

            <span class="product-category">
                ${getCategoryName(product.category)}
            </span>

            <h3>
                ${product.name}
            </h3>

            <p class="product-description">
                ${product.description}
            </p>

            <div class="product-bottom">

                <span class="product-price">
                    ${formatPrice(product.price)}
                </span>

                <button
                    type="button"
                    class="add-cart-btn"
                    data-product-id="${product.id}">

                    <i class="fa-solid fa-cart-plus"></i>

                </button>

            </div>
        `;


        productsGrid.appendChild(card);

    });

}


/* =========================================================
   ADD TO CART
   ========================================================= */

function addToCart(productId) {

    const product =
        medicines.find(
            item => item.id === productId
        );


    if (!product) {
        return;
    }


    const existing =
        cart.find(
            item => item.id === productId
        );


    if (existing) {

        existing.quantity += 1;

    } else {

        cart.push({

            id: product.id,

            name: product.name,

            price: product.price,

            icon: product.icon,

            quantity: 1

        });

    }


    saveCart();

    updateCart();

    showToast(
        product.name +
        " added to cart"
    );

}


/* =========================================================
   REMOVE FROM CART
   ========================================================= */

function removeFromCart(productId) {

    cart =
        cart.filter(
            item => item.id !== productId
        );


    saveCart();

    updateCart();

}


/* =========================================================
   QUANTITY
   ========================================================= */

function changeQuantity(
    productId,
    amount
) {

    const item =
        cart.find(
            product => product.id === productId
        );


    if (!item) {
        return;
    }


    item.quantity += amount;


    if (item.quantity <= 0) {

        removeFromCart(productId);

        return;
    }


    saveCart();

    updateCart();

}


/* =========================================================
   UPDATE CART
   ========================================================= */

function updateCart() {

    if (!cartItems) {
        return;
    }


    cartItems.innerHTML = "";


    let totalItems = 0;
    let totalPrice = 0;


    cart.forEach(item => {

        totalItems +=
            item.quantity;


        totalPrice +=
            item.price *
            item.quantity;


        const element =
            document.createElement("div");


        element.className =
            "cart-item";


        element.innerHTML = `

            <div class="cart-item-image">
                <i class="fa-solid ${item.icon}"></i>
            </div>

            <div>

                <h4>
                    ${item.name}
                </h4>

                <div class="cart-item-price">
                    ${formatPrice(item.price)}
                </div>

                <div class="cart-quantity">

                    <button
                        type="button"
                        data-action="decrease"
                        data-id="${item.id}">
                        −
                    </button>

                    <span>
                        ${item.quantity}
                    </span>

                    <button
                        type="button"
                        data-action="increase"
                        data-id="${item.id}">
                        +
                    </button>

                </div>

            </div>

            <button
                type="button"
                class="remove-item"
                data-action="remove"
                data-id="${item.id}">

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
            `${totalItems} item${totalItems !== 1 ? "s" : ""}`;

    }


    if (cartTotal) {

        cartTotal.textContent =
            formatPrice(totalPrice);

    }


    const isEmpty =
        cart.length === 0;


    if (emptyCart) {

        emptyCart.style.display =
            isEmpty ? "block" : "none";

    }


    if (cartFooter) {

        cartFooter.style.display =
            isEmpty ? "none" : "block";

    }

}


/* =========================================================
   CART EVENTS
   ========================================================= */

if (productsGrid) {

    productsGrid.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    ".add-cart-btn"
                );


            if (!button) {
                return;
            }


            const id =
                Number(
                    button.dataset.productId
                );


            addToCart(id);

        }
    );

}


if (cartItems) {

    cartItems.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "button"
                );


            if (!button) {
                return;
            }


            const id =
                Number(
                    button.dataset.id
                );


            const action =
                button.dataset.action;


            if (action === "increase") {

                changeQuantity(id, 1);

            }


            if (action === "decrease") {

                changeQuantity(id, -1);

            }


            if (action === "remove") {

                removeFromCart(id);

                showToast(
                    "Item removed"
                );

            }

        }
    );

}


/* =========================================================
   OPEN / CLOSE CART
   ========================================================= */

function openCart() {

    if (!cartSidebar) {
        return;
    }


    cartSidebar.classList.add(
        "active"
    );


    if (overlay) {

        overlay.classList.add(
            "active"
        );

    }


    document.body.classList.add(
        "no-scroll"
    );

}


function closeCartSidebar() {

    if (cartSidebar) {

        cartSidebar.classList.remove(
            "active"
        );

    }


    if (overlay) {

        overlay.classList.remove(
            "active"
        );

    }


    document.body.classList.remove(
        "no-scroll"
    );

}


if (cartBtn) {

    cartBtn.addEventListener(
        "click",
        openCart
    );

}


if (closeCart) {

    closeCart.addEventListener(
        "click",
        closeCartSidebar
    );

}


if (overlay) {

    overlay.addEventListener(
        "click",
        closeCartSidebar
    );

}


if (continueShopping) {

    continueShopping.addEventListener(
        "click",
        closeCartSidebar
    );

}


/* =========================================================
   SEARCH
   ========================================================= */

function performSearch(value) {

    currentSearch =
        value.trim();


    renderProducts();


    const section =
        document.getElementById(
            "medicines"
        );


    if (section) {

        section.scrollIntoView({
            behavior: "smooth"
        });

    }

}


if (searchBtn) {

    searchBtn.addEventListener(
        "click",
        () => {

            performSearch(
                medicineSearch
                    ? medicineSearch.value
                    : ""
            );

        }
    );

}


if (medicineSearch) {

    medicineSearch.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {

                performSearch(
                    medicineSearch.value
                );

            }

        }
    );

}


if (mobileSearchBtn) {

    mobileSearchBtn.addEventListener(
        "click",
        () => {

            performSearch(
                mobileMedicineSearch
                    ? mobileMedicineSearch.value
                    : ""
            );

        }
    );

}


if (mobileMedicineSearch) {

    mobileMedicineSearch.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {

                performSearch(
                    mobileMedicineSearch.value
                );

            }

        }
    );

}


if (mainSearchBtn) {

    mainSearchBtn.addEventListener(
        "click",
        () => {

            performSearch(
                mainMedicineSearch
                    ? mainMedicineSearch.value
                    : ""
            );

        }
    );

}


if (mainMedicineSearch) {

    mainMedicineSearch.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {

                performSearch(
                    mainMedicineSearch.value
                );

            }

        }
    );

}


/* =========================================================
   CATEGORY FILTER
   ========================================================= */

if (categoryFilter) {

    categoryFilter.addEventListener(
        "change",
        event => {

            currentCategory =
                event.target.value;

            renderProducts();

        }
    );

}


/* =========================================================
   CATEGORY CARDS
   ========================================================= */

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


                if (!category) {
                    return;
                }


                currentCategory =
                    category;


                if (categoryFilter) {

                    categoryFilter.value =
                        category;

                }


                renderProducts();


                const section =
                    document.getElementById(
                        "medicines"
                    );


                if (section) {

                    section.scrollIntoView({
                        behavior: "smooth"
                    });

                }

            }
        );

    });


/* =========================================================
   SEARCH BUTTONS
   ========================================================= */

document
    .querySelectorAll(
        "[data-search]"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const value =
                    button.dataset.search;


                currentSearch =
                    value;


                if (medicineSearch) {
                    medicineSearch.value =
                        value;
                }


                if (mobileMedicineSearch) {
                    mobileMedicineSearch.value =
                        value;
                }


                if (mainMedicineSearch) {
                    mainMedicineSearch.value =
                        value;
                }


                renderProducts();

            }
        );

    });


/* =========================================================
   DARK MODE
   ========================================================= */

function updateThemeIcon() {

    if (!themeToggle) {
        return;
    }


    const icon =
        themeToggle.querySelector(
            "i"
        );


    if (!icon) {
        return;
    }


    const dark =
        document.body.classList.contains(
            "dark-mode"
        );


    if (dark) {

        icon.className =
            "fa-solid fa-sun";

    } else {

        icon.className =
            "fa-solid fa-moon";

    }

}


const savedTheme =
    localStorage.getItem(
        "ubaidMedicalTheme"
    );


if (savedTheme === "dark") {

    document.body.classList.add(
        "dark-mode"
    );

}


updateThemeIcon();


if (themeToggle) {

    themeToggle.addEventListener(
        "click",
        () => {

            document.body.classList.toggle(
                "dark-mode"
            );


            const dark =
                document.body.classList.contains(
                    "dark-mode"
                );


            localStorage.setItem(
                "ubaidMedicalTheme",
                dark
                    ? "dark"
                    : "light"
            );


            updateThemeIcon();

        }
    );

}


/* =========================================================
   MOBILE MENU
   ========================================================= */

if (mobileMenuBtn) {

    mobileMenuBtn.addEventListener(
        "click",
        () => {

            if (navLinks) {

                navLinks.classList.toggle(
                    "active"
                );

            }

        }
    );

}


document
    .querySelectorAll(
        ".nav-links a"
    )
    .forEach(link => {

        link.addEventListener(
            "click",
            () => {

                if (navLinks) {

                    navLinks.classList.remove(
                        "active"
                    );

                }

            }
        );

    });


/* =========================================================
   AUTH MODAL
   ========================================================= */

function openAuthModal() {

    if (!authModal) {
        return;
    }


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

}


function closeAuthModal() {

    if (!authModal) {
        return;
    }


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

}


if (accountBtn) {

    accountBtn.addEventListener(
        "click",
        openAuthModal
    );

}


if (closeAuth) {

    closeAuth.addEventListener(
        "click",
        closeAuthModal
    );

}


if (authModal) {

    authModal.addEventListener(
        "click",
        event => {

            if (
                event.target === authModal
            ) {

                closeAuthModal();

            }

        }
    );

}


/* =========================================================
   AUTH TABS
   ========================================================= */

if (showSignup) {

    showSignup.addEventListener(
        "click",
        event => {

            event.preventDefault();


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
    );

}


if (showLogin) {

    showLogin.addEventListener(
        "click",
        event => {

            event.preventDefault();


            if (signupForm) {
                signupForm.hidden = true;
            }


            if (loginForm) {
                loginForm.hidden = false;
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
    );

}


/* =========================================================
   AUTH MESSAGE
   ========================================================= */

function clearAuthMessage() {

    if (!authMessage) {
        return;
    }


    authMessage.textContent = "";

    authMessage.className =
        "auth-message";

}


function showAuthMessage(
    message,
    type = "error"
) {

    if (!authMessage) {
        return;
    }


    authMessage.textContent =
        message;


    authMessage.className =
        `auth-message ${type}`;

}


/* =========================================================
   FIREBASE SIGNUP
   ========================================================= */

if (signupForm) {

    signupForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const nameElement =
                document.getElementById(
                    "signupName"
                );


            const emailElement =
                document.getElementById(
                    "signupEmail"
                );


            const passwordElement =
                document.getElementById(
                    "signupPassword"
                );


            const name =
                nameElement
                    ? nameElement.value.trim()
                    : "";


            const email =
                emailElement
                    ? emailElement.value.trim()
                    : "";


            const password =
                passwordElement
                    ? passwordElement.value
                    : "";


            if (
                !name ||
                !email ||
                !password
            ) {

                showAuthMessage(
                    "Please fill all fields."
                );

                return;

            }


            if (password.length < 6) {

                showAuthMessage(
                    "Password must be at least 6 characters."
                );

                return;

            }


            try {

                const result =
                    await createUserWithEmailAndPassword(
                        auth,
                        email,
                        password
                    );


                await updateProfile(
                    result.user,
                    {
                        displayName: name
                    }
                );


                showAuthMessage(
                    "Account created successfully!",
                    "success"
                );


                showToast(
                    "Account created successfully!"
                );


                signupForm.reset();


                setTimeout(
                    closeAuthModal,
                    1200
                );


            } catch (error) {

                console.error(
                    "Signup error:",
                    error
                );


                let message =
                    "Signup failed. Please try again.";


                switch (error.code) {

                    case "auth/email-already-in-use":
                        message =
                            "This email is already registered.";
                        break;


                    case "auth/invalid-email":
                        message =
                            "Please enter a valid email address.";
                        break;


                    case "auth/weak-password":
                        message =
                            "Password must be at least 6 characters.";
                        break;


                    case "auth/network-request-failed":
                        message =
                            "Internet connection problem.";
                        break;

                }


                showAuthMessage(
                    message
                );

            }

        }
    );

}


/* =========================================================
   FIREBASE LOGIN
   ========================================================= */

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const emailElement =
                document.getElementById(
                    "loginEmail"
                );


            const passwordElement =
                document.getElementById(
                    "loginPassword"
                );


            const email =
                emailElement
                    ? emailElement.value.trim()
                    : "";


            const password =
                passwordElement
                    ? passwordElement.value
                    : "";


            if (!email || !password) {

                showAuthMessage(
                    "Please enter email and password."
                );

                return;

            }


            try {

                await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );


                showAuthMessage(
                    "Login successful!",
                    "success"
                );


                showToast(
                    "Welcome back!"
                );


                loginForm.reset();


                setTimeout(
                    closeAuthModal,
                    1000
                );


            } catch (error) {

                console.error(
                    "Login error:",
                    error
                );


                let message =
                    "Login failed. Please try again.";


                switch (error.code) {

                    case "auth/invalid-credential":
                        message =
                            "Email or password is incorrect.";
                        break;


                    case "auth/user-not-found":
                        message =
                            "No account found with this email.";
                        break;


                    case "auth/wrong-password":
                        message =
                            "Incorrect password.";
                        break;


                    case "auth/invalid-email":
                        message =
                            "Please enter a valid email address.";
                        break;


                    case "auth/too-many-requests":
                        message =
                            "Too many attempts. Please try again later.";
                        break;


                    case "auth/network-request-failed":
                        message =
                            "Internet connection problem.";
                        break;

                }


                showAuthMessage(
                    message
                );

            }

        }
    );

}


/* =========================================================
   FIREBASE LOGIN STATUS
   ========================================================= */

onAuthStateChanged(
    auth,
    user => {

        if (user) {

            console.log(
                "Logged in:",
                user.email
            );


            if (accountBtn) {

                accountBtn.title =
                    `Logged in as ${user.displayName || user.email}`;

            }

        } else {

            console.log(
                "User is logged out."
            );

        }

    }
);


/* =========================================================
   LOGOUT
   ========================================================= */

function logoutUser() {

    signOut(auth)
        .then(() => {

            showToast(
                "Logged out successfully"
            );

        })
        .catch(error => {

            console.error(
                "Logout error:",
                error
            );

        });

}


/* =========================================================
   PASSWORD VISIBILITY
   ========================================================= */

document
    .querySelectorAll(
        ".password-toggle"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const target =
                    button.dataset.target;


                const input =
                    document.getElementById(
                        target
                    );


                if (!input) {
                    return;
                }


                const icon =
                    button.querySelector(
                        "i"
                    );


                if (
                    input.type === "password"
                ) {

                    input.type = "text";


                    if (icon) {

                        icon.className =
                            "fa-solid fa-eye-slash";

                    }

                } else {

                    input.type = "password";


                    if (icon) {

                        icon.className =
                            "fa-solid fa-eye";

                    }

                }

            }
        );

    });


/* =========================================================
   WHATSAPP ORDER
   ========================================================= */

/*
   IMPORTANT:
   Replace the number below with
   your actual WhatsApp number.

   India format:
   91 + 10 digit number

   Example:
   919876543210

   Do NOT use + or spaces.
*/

const whatsappNumber =
    "919044286963";


function orderOnWhatsApp() {

    if (cart.length === 0) {

        showToast(
            "Your cart is empty."
        );

        return;

    }


    let message =
        "Hello Ubaid Medical Store!%0A%0A";

    message +=
        "*My Order:*%0A%0A";


    let total = 0;


    cart.forEach(item => {

        const itemTotal =
            item.price *
            item.quantity;


        total += itemTotal;


        message +=
            `• ${item.name} x ${item.quantity} = ${formatPrice(itemTotal)}%0A`;

    });


    message +=
        `%0A*Total: ${formatPrice(total)}*%0A%0A`;

    message +=
        "Please confirm my order. Thank you!";


    const url =
        `https://wa.me/${whatsappNumber}?text=${message}`;


    window.open(
        url,
        "_blank"
    );

}


if (whatsappOrderBtn) {

    whatsappOrderBtn.addEventListener(
        "click",
        orderOnWhatsApp
    );

}


/* =========================================================
   YEAR
   ========================================================= */

if (currentYear) {

    currentYear.textContent =
        new Date().getFullYear();

}


/* =========================================================
   ESC KEY
   ========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {

            closeCartSidebar();

            closeAuthModal();

        }

    }
);


/* =========================================================
   INITIALIZE
   ========================================================= */

loadCart();

updateCart();

renderProducts();


console.log(
    "Ubaid Medical Store is ready."
);

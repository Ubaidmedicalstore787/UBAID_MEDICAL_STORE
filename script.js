/* =========================================================
   UBAID MEDICAL STORE V2
   MAIN SCRIPT
   LOGIN / COMMENTS TEMPORARILY DISABLED
   ========================================================= */

"use strict";

/* =========================================================
   GLOBAL DATA
   ========================================================= */

let cart = [];

let selectedRating = 5;


/* =========================================================
   DOM READY
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initTheme();
    initMobileMenu();
    initSearch();
    initCart();
    initRating();
    initNavigation();
    initScrollEffects();
    initButtons();

    updateCartCount();
    renderCart();

    console.log("✅ Ubaid Medical Store V2 JS Ready");

});


/* =========================================================
   THEME
   ========================================================= */

function initTheme() {

    const savedTheme =
        localStorage.getItem("ubaidTheme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
    }

}


function toggleTheme() {

    document.body.classList.toggle("dark-mode");

    const isDark =
        document.body.classList.contains("dark-mode");

    localStorage.setItem(
        "ubaidTheme",
        isDark ? "dark" : "light"
    );

    showToast(
        isDark
            ? "Dark mode enabled"
            : "Light mode enabled"
    );

}

window.toggleTheme = toggleTheme;


/* =========================================================
   MOBILE MENU
   ========================================================= */

function initMobileMenu() {

    const menuBtn =
        document.querySelector(".mobile-menu-btn");

    const nav =
        document.querySelector(".nav");

    const overlay =
        document.querySelector(".overlay");

    if (!menuBtn || !nav) return;


    menuBtn.addEventListener("click", () => {

        nav.classList.toggle("open");

        if (overlay) {
            overlay.classList.toggle(
                "active",
                nav.classList.contains("open")
            );
        }

        document.body.classList.toggle(
            "no-scroll",
            nav.classList.contains("open")
        );

    });


    document
        .querySelectorAll(".nav-links a")
        .forEach(link => {

            link.addEventListener("click", () => {

                nav.classList.remove("open");

                if (overlay) {
                    overlay.classList.remove("active");
                }

                document.body.classList.remove(
                    "no-scroll"
                );

            });

        });

}


/* =========================================================
   SEARCH
   ========================================================= */

function initSearch() {

    const searchInputs =
        document.querySelectorAll(
            "#searchInput, #mobileSearchInput, #mainSearchInput"
        );


    searchInputs.forEach(input => {

        input.addEventListener(
            "input",
            () => {

                const value =
                    input.value
                        .trim()
                        .toLowerCase();

                filterProducts(value);

            }
        );


        input.addEventListener(
            "keydown",
            event => {

                if (event.key === "Enter") {

                    event.preventDefault();

                    const value =
                        input.value
                            .trim()
                            .toLowerCase();

                    filterProducts(value);

                }

            }
        );

    });


    document
        .querySelectorAll(
            ".header-search button, .mobile-search-box button, .search-main-btn"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    const parent =
                        button.closest(
                            ".header-search, .mobile-search-box, .search-box"
                        );

                    const input =
                        parent?.querySelector("input");

                    if (!input) return;

                    filterProducts(
                        input.value
                            .trim()
                            .toLowerCase()
                    );

                }
            );

        });

}


function filterProducts(searchTerm) {

    const products =
        document.querySelectorAll(
            ".product-card"
        );

    let visibleCount = 0;


    products.forEach(product => {

        const text =
            product.innerText
                .toLowerCase();

        const match =
            !searchTerm ||
            text.includes(searchTerm);

        product.style.display =
            match ? "" : "none";

        if (match) {
            visibleCount++;
        }

    });


    const result =
        document.querySelector(
            ".medicine-result"
        );

    if (result) {

        result.innerHTML =
            `<i class="fa-solid fa-pills"></i>
             <span>${visibleCount} products found</span>`;

    }

}


/* =========================================================
   NAVIGATION
   ========================================================= */

function initNavigation() {

    document
        .querySelectorAll(".nav-links a")
        .forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            ".nav-links a"
                        )
                        .forEach(item =>
                            item.classList.remove(
                                "active"
                            )
                        );

                    link.classList.add("active");

                }
            );

        });

}


/* =========================================================
   SCROLL EFFECTS
   ========================================================= */

function initScrollEffects() {

    const sections =
        document.querySelectorAll(
            "section[id]"
        );

    const navLinks =
        document.querySelectorAll(
            ".nav-links a"
        );


    if (!sections.length) return;


    window.addEventListener(
        "scroll",
        () => {

            let current = "";

            sections.forEach(section => {

                const sectionTop =
                    section.offsetTop - 130;

                if (
                    window.scrollY >=
                    sectionTop
                ) {

                    current =
                        section.getAttribute("id");

                }

            });


            navLinks.forEach(link => {

                link.classList.remove("active");

                const href =
                    link.getAttribute("href");

                if (
                    href === `#${current}`
                ) {
                    link.classList.add(
                        "active"
                    );
                }

            });

        }
    );

}


/* =========================================================
   CART
   ========================================================= */

function initCart() {

    document
        .querySelectorAll(".add-cart-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const card =
                        button.closest(
                            ".product-card"
                        );

                    if (!card) return;


                    const name =
                        card.querySelector(
                            "h3"
                        )?.textContent
                        ?.trim() ||
                        "Medicine";


                    const priceText =
                        card.querySelector(
                            ".product-price strong"
                        )?.textContent ||
                        "₹0";


                    const price =
                        parseFloat(
                            priceText
                                .replace(
                                    /[^0-9.]/g,
                                    ""
                                )
                        ) || 0;


                    addToCart(
                        name,
                        price
                    );

                }
            );

        });


    const cartButton =
        document.querySelector(
            ".cart-button"
        );

    if (cartButton) {

        cartButton.addEventListener(
            "click",
            openCart
        );

    }


    const closeCartBtn =
        document.querySelector(
            ".cart-sidebar .close-btn"
        );

    if (closeCartBtn) {

        closeCartBtn.addEventListener(
            "click",
            closeCart
        );

    }


    const overlay =
        document.querySelector(
            ".overlay"
        );

    if (overlay) {

        overlay.addEventListener(
            "click",
            () => {

                closeCart();
                closeMobileMenu();

            }
        );

    }

}


/* =========================================================
   ADD TO CART
   ========================================================= */

function addToCart(name, price) {

    const existing =
        cart.find(
            item => item.name === name
        );


    if (existing) {

        existing.quantity++;

    } else {

        cart.push({
            name,
            price,
            quantity: 1
        });

    }


    saveCart();

    updateCartCount();

    renderCart();

    showToast(
        `${name} cart me add ho gaya`
    );

}


/* =========================================================
   CART QUANTITY
   ========================================================= */

function changeCartQuantity(
    index,
    change
) {

    if (!cart[index]) return;


    cart[index].quantity += change;


    if (cart[index].quantity <= 0) {

        cart.splice(index, 1);

    }


    saveCart();

    updateCartCount();

    renderCart();

}

window.changeCartQuantity =
    changeCartQuantity;


/* =========================================================
   SAVE CART
   ========================================================= */

function saveCart() {

    localStorage.setItem(
        "ubaidCart",
        JSON.stringify(cart)
    );

}


/* =========================================================
   LOAD CART
   ========================================================= */

function loadCart() {

    try {

        const saved =
            localStorage.getItem(
                "ubaidCart"
            );

        cart =
            saved
                ? JSON.parse(saved)
                : [];

    } catch {

        cart = [];

    }

}

loadCart();


/* =========================================================
   CART COUNT
   ========================================================= */

function updateCartCount() {

    const count =
        cart.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );


    const cartCount =
        document.querySelector(
            "#cartCount"
        );


    if (cartCount) {

        cartCount.textContent =
            count;

    }

}


/* =========================================================
   RENDER CART
   ========================================================= */

function renderCart() {

    const container =
        document.querySelector(
            ".cart-items"
        );

    const empty =
        document.querySelector(
            ".empty-cart"
        );

    const footer =
        document.querySelector(
            ".cart-footer"
        );


    if (!container) return;


    if (!cart.length) {

        container.innerHTML = "";

        if (empty) {
            empty.style.display = "flex";
        }

        if (footer) {
            footer.style.display = "none";
        }

        return;

    }


    if (empty) {
        empty.style.display = "none";
    }

    if (footer) {
        footer.style.display = "block";
    }


    container.innerHTML =
        cart.map(
            (item, index) => `

            <div class="cart-item">

                <div class="cart-item-image">
                    <i class="fa-solid fa-pills"></i>
                </div>

                <div>

                    <h4>${escapeHTML(item.name)}</h4>

                    <p>
                        ₹${item.price.toFixed(2)}
                    </p>

                    <div class="cart-qty">

                        <button
                            type="button"
                            onclick="changeCartQuantity(${index}, -1)"
                        >
                            −
                        </button>

                        <span>
                            ${item.quantity}
                        </span>

                        <button
                            type="button"
                            onclick="changeCartQuantity(${index}, 1)"
                        >
                            +
                        </button>

                    </div>

                </div>

                <div class="cart-item-price">
                    ₹${(
                        item.price *
                        item.quantity
                    ).toFixed(2)}
                </div>

            </div>

        `
        ).join("");


    updateCartTotal();

}


/* =========================================================
   CART TOTAL
   ========================================================= */

function updateCartTotal() {

    const total =
        cart.reduce(
            (sum, item) =>
                sum +
                item.price *
                item.quantity,
            0
        );


    const totalElement =
        document.querySelector(
            ".cart-total-row strong"
        );


    if (totalElement) {

        totalElement.textContent =
            `₹${total.toFixed(2)}`;

    }


    const itemCount =
        cart.reduce(
            (sum, item) =>
                sum + item.quantity,
            0
        );


    const summary =
        document.querySelector(
            ".cart-summary span:last-child"
        );


    if (summary) {

        summary.textContent =
            `${itemCount} item${itemCount !== 1 ? "s" : ""}`;

    }

}


/* =========================================================
   OPEN CART
   ========================================================= */

function openCart() {

    const sidebar =
        document.querySelector(
            ".cart-sidebar"
        );

    const overlay =
        document.querySelector(
            ".overlay"
        );


    if (sidebar) {
        sidebar.classList.add("active");
    }

    if (overlay) {
        overlay.classList.add("active");
    }

    document.body.classList.add(
        "no-scroll"
    );

}

window.openCart = openCart;


/* =========================================================
   CLOSE CART
   ========================================================= */

function closeCart() {

    const sidebar =
        document.querySelector(
            ".cart-sidebar"
        );

    const overlay =
        document.querySelector(
            ".overlay"
        );


    if (sidebar) {
        sidebar.classList.remove(
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

window.closeCart = closeCart;


/* =========================================================
   MOBILE MENU CLOSE
   ========================================================= */

function closeMobileMenu() {

    const nav =
        document.querySelector(
            ".nav"
        );

    if (nav) {
        nav.classList.remove("open");
    }

}


/* =========================================================
   RATING
   ========================================================= */

function initRating() {

    const ratingButtons =
        document.querySelectorAll(
            ".rating-input button"
        );


    ratingButtons.forEach(
        (button, index) => {

            button.addEventListener(
                "click",
                () => {

                    selectedRating =
                        index + 1;

                    ratingButtons.forEach(
                        (btn, i) => {

                            btn.classList.toggle(
                                "active",
                                i <
                                selectedRating
                            );

                        }
                    );

                }
            );

        }
    );

}


/* =========================================================
   BUTTONS
   ========================================================= */

function initButtons() {

    document
        .querySelectorAll(
            "[data-theme-toggle]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                toggleTheme
            );

        });


    document
        .querySelectorAll(
            ".empty-cart .btn"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                closeCart
            );

        });


    const whatsappButtons =
        document.querySelectorAll(
            ".whatsapp-order-btn"
        );


    whatsappButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                sendWhatsAppOrder
            );

        }
    );

}


/* =========================================================
   WHATSAPP ORDER
   ========================================================= */

function sendWhatsAppOrder() {

    if (!cart.length) {

        showToast(
            "Cart abhi empty hai"
        );

        return;

    }


    let message =
        "🩺 *UBAID MEDICAL STORE*%0A%0A";

    message +=
        "📦 *Order Details:*%0A";


    cart.forEach(item => {

        message +=
            `• ${encodeURIComponent(item.name)} × ${item.quantity} = ₹${(
                item.price *
                item.quantity
            ).toFixed(2)}%0A`;

    });


    const total =
        cart.reduce(
            (sum, item) =>
                sum +
                item.price *
                item.quantity,
            0
        );


    message +=
        `%0A💰 *Total: ₹${total.toFixed(2)}*%0A%0A`;

    message +=
        "Please confirm my order.";


    /*
       Yahan apna Ubaid Medical Store WhatsApp number
       baad me add kar dena.
    */

    const phone =
        "91XXXXXXXXXX";


    if (
        phone.includes("X")
    ) {

        showToast(
            "WhatsApp number abhi set nahi hai"
        );

        return;

    }


    window.open(
        `https://wa.me/${phone}?text=${message}`,
        "_blank"
    );

}


/* =========================================================
   TOAST
   ========================================================= */

let toastTimer;


function showToast(message) {

    const toast =
        document.querySelector(
            ".toast"
        );


    if (!toast) return;


    const text =
        toast.querySelector(
            "span"
        );


    if (text) {
        text.textContent =
            message;
    } else {
        toast.textContent =
            message;
    }


    toast.classList.add("show");


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            2500
        );

}

window.showToast = showToast;


/* =========================================================
   HTML ESCAPE
   ========================================================= */

function escapeHTML(value) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   GLOBAL KEYBOARD
   ========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {

            closeCart();
            closeMobileMenu();

        }

    }
);


/* =========================================================
   FINAL
   ========================================================= */

console.log(
    "🩺 UBAID MEDICAL STORE V2"
);

console.log(
    "✅ Main JavaScript Loaded"
);

console.log(
    "ℹ️ Login & Comments temporarily disabled"
);

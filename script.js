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
);/* =========================================================
   UBAID MEDICAL STORE V2
   MAIN SCRIPT - PART 2
   ========================================================= */


/* =========================================================
   PRODUCT FILTER
   ========================================================= */

function initProductFilter() {

    const select =
        document.querySelector(
            ".medicine-filter select"
        );

    if (!select) return;


    select.addEventListener(
        "change",
        () => {

            const value =
                select.value
                    .trim()
                    .toLowerCase();

            const products =
                document.querySelectorAll(
                    ".product-card"
                );

            let count = 0;


            products.forEach(product => {

                const category =
                    product.querySelector(
                        ".product-category"
                    )?.textContent
                    ?.trim()
                    .toLowerCase() || "";


                const name =
                    product.querySelector(
                        "h3"
                    )?.textContent
                    ?.trim()
                    .toLowerCase() || "";


                const match =
                    value === "all" ||
                    value === "" ||
                    category.includes(value) ||
                    name.includes(value);


                product.style.display =
                    match ? "" : "none";


                if (match) {
                    count++;
                }

            });


            updateMedicineResult(count);

        }
    );

}


/* =========================================================
   MEDICINE RESULT
   ========================================================= */

function updateMedicineResult(count) {

    const result =
        document.querySelector(
            ".medicine-result"
        );


    if (!result) return;


    result.innerHTML = `
        <i class="fa-solid fa-pills"></i>
        <span>${count} products found</span>
    `;

}


/* =========================================================
   PRODUCT SORT
   ========================================================= */

function initProductSort() {

    const select =
        document.querySelector(
            ".medicine-filter select"
        );

    if (!select) return;


    /*
       Agar HTML me future me
       sort options add kiye jayein
       to ye function handle karega.
    */

}


/* =========================================================
   CATEGORY CLICK
   ========================================================= */

function initCategoryCards() {

    const categories =
        document.querySelectorAll(
            ".category-card"
        );


    categories.forEach(card => {

        card.addEventListener(
            "click",
            () => {

                const title =
                    card.querySelector(
                        "h3"
                    )?.textContent
                    ?.trim();


                if (!title) return;


                const searchInput =
                    document.querySelector(
                        "#mainSearchInput"
                    );


                if (searchInput) {

                    searchInput.value =
                        title;

                }


                filterProducts(
                    title.toLowerCase()
                );


                const medicineSection =
                    document.querySelector(
                        "#medicines"
                    );


                if (medicineSection) {

                    medicineSection.scrollIntoView({
                        behavior: "smooth"
                    });

                }

            }
        );

    });

}


/* =========================================================
   PROFILE DROPDOWN
   ========================================================= */

function initProfileDropdown() {

    const profileGroup =
        document.querySelector(
            ".user-profile-group"
        );


    const profileButton =
        document.querySelector(
            ".profile-btn"
        );


    if (!profileGroup || !profileButton) {
        return;
    }


    profileButton.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            profileGroup.classList.toggle(
                "open"
            );

        }
    );


    document.addEventListener(
        "click",
        event => {

            if (
                !profileGroup.contains(
                    event.target
                )
            ) {

                profileGroup.classList.remove(
                    "open"
                );

            }

        }
    );

}


/* =========================================================
   AUTH BUTTONS - TEMPORARILY OFF
   ========================================================= */

function initAuthButtons() {

    /*
       LOGIN / SIGNUP / FIREBASE
       ABHI DISABLED HAIN.

       Kal jab login system karenge
       tab yahan Firebase connect karenge.
    */


    const accountButtons =
        document.querySelectorAll(
            ".account-btn"
        );


    accountButtons.forEach(button => {

        button.addEventListener(
            "click",
            event => {

                event.preventDefault();

                showToast(
                    "Login system baad me activate hoga"
                );

            }
        );

    });

}


/* =========================================================
   REVIEW FORM - TEMPORARILY OFF
   ========================================================= */

function initReviewForm() {

    const form =
        document.querySelector(
            ".review-form-card form"
        );


    if (!form) return;


    form.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            showToast(
                "Reviews system baad me activate hoga"
            );

        }
    );

}


/* =========================================================
   PROFILE MODAL
   ========================================================= */

function initProfileModal() {

    const modal =
        document.querySelector(
            ".profile-modal"
        );


    if (!modal) return;


    const closeButton =
        modal.querySelector(
            ".close-btn"
        );


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            () => {

                modal.classList.remove(
                    "active"
                );

            }
        );

    }


    modal.addEventListener(
        "click",
        event => {

            if (
                event.target === modal
            ) {

                modal.classList.remove(
                    "active"
                );

            }

        }
    );

}


/* =========================================================
   SMOOTH BUTTON LINKS
   ========================================================= */

function initSmoothLinks() {

    document
        .querySelectorAll(
            'a[href^="#"]'
        )
        .forEach(link => {

            link.addEventListener(
                "click",
                event => {

                    const id =
                        link.getAttribute(
                            "href"
                        );


                    if (
                        !id ||
                        id === "#"
                    ) {
                        return;
                    }


                    const target =
                        document.querySelector(
                            id
                        );


                    if (!target) return;


                    event.preventDefault();


                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }
            );

        });

}


/* =========================================================
   NEWSLETTER / EMAIL FORMS
   ========================================================= */

function initForms() {

    document
        .querySelectorAll(
            "form"
        )
        .forEach(form => {

            if (
                form.classList.contains(
                    "review-form"
                )
            ) {
                return;
            }


            form.addEventListener(
                "submit",
                event => {

                    const action =
                        form.getAttribute(
                            "action"
                        );


                    if (
                        !action ||
                        action === "#"
                    ) {

                        event.preventDefault();

                        showToast(
                            "Form submitted successfully"
                        );

                    }

                }
            );

        });

}


/* =========================================================
   PHONE / CONTACT
   ========================================================= */

function initContactButtons() {

    document
        .querySelectorAll(
            '[href^="tel:"]'
        )
        .forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    console.log(
                        "📞 Contact button clicked"
                    );

                }
            );

        });

}


/* =========================================================
   WHATSAPP LINKS
   ========================================================= */

function initWhatsAppLinks() {

    document
        .querySelectorAll(
            '[href*="wa.me"]'
        )
        .forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    console.log(
                        "💬 WhatsApp button clicked"
                    );

                }
            );

        });

}


/* =========================================================
   BACK TO TOP
   ========================================================= */

function initBackToTop() {

    const button =
        document.querySelector(
            ".back-to-top"
        );


    if (!button) return;


    window.addEventListener(
        "scroll",
        () => {

            if (
                window.scrollY > 500
            ) {

                button.classList.add(
                    "show"
                );

            } else {

                button.classList.remove(
                    "show"
                );

            }

        }
    );


    button.addEventListener(
        "click",
        () => {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );

}


/* =========================================================
   LAZY IMAGE SUPPORT
   ========================================================= */

function initImages() {

    document
        .querySelectorAll(
            "img"
        )
        .forEach(img => {

            if (
                !img.hasAttribute(
                    "loading"
                )
            ) {

                img.setAttribute(
                    "loading",
                    "lazy"
                );

            }

        });

}


/* =========================================================
   ONLINE / OFFLINE STATUS
   ========================================================= */

function initNetworkStatus() {

    window.addEventListener(
        "online",
        () => {

            showToast(
                "Internet connection restored"
            );

        }
    );


    window.addEventListener(
        "offline",
        () => {

            showToast(
                "Internet connection lost"
            );

        }
    );

}


/* =========================================================
   LOCAL STORAGE SAFETY
   ========================================================= */

function clearOldData() {

    /*
       Purane unnecessary data ko
       abhi automatically delete nahi karenge.

       User ka cart safe rahega.
    */

}


/* =========================================================
   INITIALIZE PART 2
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initProductFilter();
        initProductSort();

        initCategoryCards();

        initProfileDropdown();

        initAuthButtons();

        initReviewForm();

        initProfileModal();

        initSmoothLinks();

        initForms();

        initContactButtons();

        initWhatsAppLinks();

        initBackToTop();

        initImages();

        initNetworkStatus();

        clearOldData();


        console.log(
            "✅ Ubaid Medical Store JS Part 2 Loaded"
        );

    }
);


/* =========================================================
   FINAL STATUS
   ========================================================= */

window.UbaidMedicalStore = {

    cart: cart,

    addToCart: addToCart,

    openCart: openCart,

    closeCart: closeCart,

    showToast: showToast,

    toggleTheme: toggleTheme

};


console.log(
    "🩺 UBAID MEDICAL STORE V2 READY"
);

console.log(
    "🚫 Firebase Login/Signup: Temporarily OFF"
);

console.log(
    "🚫 Comments/Reviews backend: Temporarily OFF"
);

console.log(
    "✅ Cart/Search/Theme/Mobile Menu: ON"
);

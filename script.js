/* =========================================================
   UBAID MEDICAL STORE V2
   MAIN JAVASCRIPT
   PART 1 — PRODUCTS + SEARCH + CART
   ========================================================= */

"use strict";

/* =========================================================
   PRODUCT DATA
   ========================================================= */

const medicines = [
    {
        id: 1,
        name: "Paracetamol 500mg",
        category: "Pain Relief",
        price: 25,
        icon: "fa-solid fa-pills"
    },
    {
        id: 2,
        name: "Azithromycin 500mg",
        category: "Antibiotic",
        price: 65,
        icon: "fa-solid fa-capsules"
    },
    {
        id: 3,
        name: "Pantoprazole 40mg",
        category: "Gastric Care",
        price: 45,
        icon: "fa-solid fa-tablets"
    },
    {
        id: 4,
        name: "Cetirizine 10mg",
        category: "Allergy Care",
        price: 30,
        icon: "fa-solid fa-pills"
    },
    {
        id: 5,
        name: "ORS Sachet",
        category: "Hydration",
        price: 20,
        icon: "fa-solid fa-droplet"
    },
    {
        id: 6,
        name: "Vitamin C Tablets",
        category: "Vitamins",
        price: 90,
        icon: "fa-solid fa-lemon"
    },
    {
        id: 7,
        name: "Calcium Tablets",
        category: "Supplements",
        price: 120,
        icon: "fa-solid fa-capsules"
    },
    {
        id: 8,
        name: "Antiseptic Cream",
        category: "First Aid",
        price: 55,
        icon: "fa-solid fa-prescription-bottle"
    },
    {
        id: 9,
        name: "Cough Syrup",
        category: "Cough & Cold",
        price: 85,
        icon: "fa-solid fa-bottle-droplet"
    },
    {
        id: 10,
        name: "Multivitamin Tablets",
        category: "Vitamins",
        price: 150,
        icon: "fa-solid fa-tablets"
    },
    {
        id: 11,
        name: "Ibuprofen 400mg",
        category: "Pain Relief",
        price: 40,
        icon: "fa-solid fa-pills"
    },
    {
        id: 12,
        name: "Antacid Tablets",
        category: "Gastric Care",
        price: 35,
        icon: "fa-solid fa-capsules"
    }
];


/* =========================================================
   GLOBAL STATE
   ========================================================= */

let cart = [];

let currentProducts = [...medicines];

let currentSort = "default";


/* =========================================================
   DOM HELPERS
   ========================================================= */

function $(selector) {
    return document.querySelector(selector);
}

function $$(selector) {
    return document.querySelectorAll(selector);
}


/* =========================================================
   FORMAT PRICE
   ========================================================= */

function formatPrice(price) {
    return `₹${Number(price).toFixed(0)}`;
}


/* =========================================================
   RENDER PRODUCTS
   ========================================================= */

function renderProducts(products = medicines) {

    const grid = $(".products-grid");

    if (!grid) {
        console.warn("Products grid not found.");
        return;
    }

    currentProducts = [...products];

    if (!products.length) {

        grid.innerHTML = `
            <div class="empty-products" style="grid-column:1/-1;">
                <div class="empty-products-icon">
                    <i class="fa-solid fa-magnifying-glass"></i>
                </div>

                <h3>No medicines found</h3>

                <p>
                    Try another medicine name or category.
                </p>

                <button
                    type="button"
                    class="btn btn-primary"
                    onclick="clearMedicineSearch()"
                >
                    Show All Medicines
                </button>
            </div>
        `;

        updateMedicineResult(0);

        return;
    }


    grid.innerHTML = products.map(product => {

        return `
            <article
                class="product-card"
                data-product-id="${product.id}"
            >

                <div class="product-image">
                    <i class="${product.icon || "fa-solid fa-pills"}"></i>
                </div>

                <div class="product-info">

                    <h3>${escapeHTML(product.name)}</h3>

                    <span class="product-category">
                        ${escapeHTML(product.category)}
                    </span>

                    <div class="product-price">

                        <strong>
                            ${formatPrice(product.price)}
                        </strong>

                        <button
                            type="button"
                            class="add-cart-btn"
                            data-add-cart="${product.id}"
                        >
                            <i class="fa-solid fa-cart-plus"></i>
                            Add
                        </button>

                    </div>

                </div>

            </article>
        `;

    }).join("");


    updateMedicineResult(products.length);

    attachProductButtons();
}


/* =========================================================
   PRODUCT BUTTONS
   ========================================================= */

function attachProductButtons() {

    $$("[data-add-cart]").forEach(button => {

        button.addEventListener("click", function () {

            const id = Number(this.dataset.addCart);

            addToCart(id);

        });

    });

}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* =========================================================
   MEDICINE RESULT COUNT
   ========================================================= */

function updateMedicineResult(count) {

    const result = $(".medicine-result");

    if (!result) {
        return;
    }

    result.innerHTML = `
        <i class="fa-solid fa-capsules"></i>
        <span>${count} medicine${count === 1 ? "" : "s"} available</span>
    `;
}


/* =========================================================
   SEARCH MEDICINES
   ========================================================= */

function searchMedicines(value) {

    const query = String(value || "")
        .trim()
        .toLowerCase();

    if (!query) {

        applySort([...medicines]);

        return;
    }

    const filtered = medicines.filter(product => {

        return (
            product.name.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query)
        );

    });

    applySort(filtered);
}


/* =========================================================
   CLEAR SEARCH
   ========================================================= */

window.clearMedicineSearch = function () {

    const inputs = [
        $(".search-content input"),
        $(".mobile-search-box input"),
        $(".header-search input")
    ];

    inputs.forEach(input => {

        if (input) {
            input.value = "";
        }

    });

    applySort([...medicines]);
};


/* =========================================================
   SORT PRODUCTS
   ========================================================= */

function applySort(products) {

    const sorted = [...products];

    if (currentSort === "price-low") {

        sorted.sort((a, b) => a.price - b.price);

    } else if (currentSort === "price-high") {

        sorted.sort((a, b) => b.price - a.price);

    } else if (currentSort === "name") {

        sorted.sort((a, b) =>
            a.name.localeCompare(b.name)
        );

    }

    renderProducts(sorted);
}


/* =========================================================
   SORT SELECT
   ========================================================= */

function setupSort() {

    const select = $(".medicine-filter select");

    if (!select) {
        return;
    }

    select.addEventListener("change", function () {

        currentSort = this.value || "default";

        applySort([...currentProducts]);

    });

}


/* =========================================================
   SEARCH INPUTS
   ========================================================= */

function setupSearch() {

    const desktopSearch = $(".search-content input");

    const mobileSearch = $(".mobile-search-box input");

    const headerSearch = $(".header-search input");


    if (desktopSearch) {

        desktopSearch.addEventListener(
            "input",
            () => searchMedicines(desktopSearch.value)
        );

    }


    if (mobileSearch) {

        mobileSearch.addEventListener(
            "input",
            () => searchMedicines(mobileSearch.value)
        );

    }


    if (headerSearch) {

        headerSearch.addEventListener(
            "input",
            () => searchMedicines(headerSearch.value)
        );

    }


    $$(".search-main-btn").forEach(button => {

        button.addEventListener("click", function () {

            const input = $(".search-content input");

            if (input) {
                searchMedicines(input.value);
            }

        });

    });


    $$(".mobile-search-box button").forEach(button => {

        button.addEventListener("click", function () {

            const input = $(".mobile-search-box input");

            if (input) {
                searchMedicines(input.value);
            }

        });

    });

}


/* =========================================================
   CART
   ========================================================= */

function addToCart(productId) {

    const product = medicines.find(
        item => item.id === productId
    );

    if (!product) {
        return;
    }


    const existing = cart.find(
        item => item.id === productId
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

    updateCartCount();

    showToast(
        `${product.name} added to cart`
    );

}


/* =========================================================
   REMOVE FROM CART
   ========================================================= */

function removeFromCart(productId) {

    cart = cart.filter(
        item => item.id !== productId
    );

    saveCart();

    renderCart();

    updateCartCount();

}


/* =========================================================
   CHANGE QUANTITY
   ========================================================= */

function changeCartQuantity(productId, amount) {

    const item = cart.find(
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

    renderCart();

    updateCartCount();

}


/* =========================================================
   CART TOTAL
   ========================================================= */

function getCartTotal() {

    return cart.reduce(
        (total, item) =>
            total + (item.price * item.quantity),
        0
    );

}


/* =========================================================
   CART COUNT
   ========================================================= */

function getCartCount() {

    return cart.reduce(
        (total, item) =>
            total + item.quantity,
        0
    );

}


function updateCartCount() {

    const countElement = $("#cartCount");

    if (!countElement) {
        return;
    }

    const count = getCartCount();

    countElement.textContent = count;

    countElement.style.display =
        count > 0 ? "grid" : "none";

}


/* =========================================================
   RENDER CART
   ========================================================= */

function renderCart() {

    const itemsContainer = $(".cart-items");

    if (!itemsContainer) {
        return;
    }


    if (!cart.length) {

        itemsContainer.innerHTML = `
            <div class="empty-cart">

                <div class="empty-cart-icon">
                    <i class="fa-solid fa-cart-shopping"></i>
                </div>

                <h3>Your cart is empty</h3>

                <p>
                    Add medicines to your cart to continue.
                </p>

                <button
                    type="button"
                    class="btn btn-primary"
                    id="emptyCartContinueBtn"
                >
                    Browse Medicines
                </button>

            </div>
        `;

        updateCartTotals();

        return;
    }


    itemsContainer.innerHTML = cart.map(item => {

        return `
            <div class="cart-item">

                <div class="cart-item-image">
                    <i class="${item.icon || "fa-solid fa-pills"}"></i>
                </div>

                <div>

                    <h4>
                        ${escapeHTML(item.name)}
                    </h4>

                    <p>
                        ${formatPrice(item.price)} each
                    </p>

                    <div class="cart-qty">

                        <button
                            type="button"
                            aria-label="Decrease quantity"
                            data-cart-minus="${item.id}"
                        >
                            <i class="fa-solid fa-minus"></i>
                        </button>

                        <span>
                            ${item.quantity}
                        </span>

                        <button
                            type="button"
                            aria-label="Increase quantity"
                            data-cart-plus="${item.id}"
                        >
                            <i class="fa-solid fa-plus"></i>
                        </button>

                    </div>

                </div>

                <div class="cart-item-price">

                    ${formatPrice(
                        item.price * item.quantity
                    )}

                    <button
                        type="button"
                        title="Remove"
                        data-cart-remove="${item.id}"
                        style="
                            display:block;
                            margin-top:7px;
                            background:none;
                            color:var(--danger);
                            font-size:11px;
                        "
                    >
                        Remove
                    </button>

                </div>

            </div>
        `;

    }).join("");


    $$("[data-cart-minus]").forEach(button => {

        button.addEventListener("click", () => {

            changeCartQuantity(
                Number(button.dataset.cartMinus),
                -1
            );

        });

    });


    $$("[data-cart-plus]").forEach(button => {

        button.addEventListener("click", () => {

            changeCartQuantity(
                Number(button.dataset.cartPlus),
                1
            );

        });

    });


    $$("[data-cart-remove]").forEach(button => {

        button.addEventListener("click", () => {

            removeFromCart(
                Number(button.dataset.cartRemove)
            );

        });

    });


    updateCartTotals();

}


/* =========================================================
   CART TOTAL DISPLAY
   ========================================================= */

function updateCartTotals() {

    const total = getCartTotal();

    const totalElement = $(".cart-total-row strong");

    if (totalElement) {
        totalElement.textContent =
            formatPrice(total);
    }


    const summary = $(".cart-summary");

    if (summary) {

        summary.innerHTML = `
            <span>Items</span>
            <strong>${getCartCount()}</strong>
        `;

    }

}


/* =========================================================
   LOCAL STORAGE
   ========================================================= */

function saveCart() {

    try {

        localStorage.setItem(
            "ubaidMedicalCart",
            JSON.stringify(cart)
        );

    } catch (error) {

        console.warn(
            "Cart could not be saved:",
            error
        );

    }

}


function loadCart() {

    try {

        const saved =
            localStorage.getItem(
                "ubaidMedicalCart"
            );

        if (saved) {

            const parsed = JSON.parse(saved);

            if (Array.isArray(parsed)) {
                cart = parsed;
            }

        }

    } catch (error) {

        cart = [];

        console.warn(
            "Cart could not be loaded:",
            error
        );

    }

}


/* =========================================================
   CART OPEN / CLOSE
   ========================================================= */

function openCart() {

    const sidebar = $(".cart-sidebar");

    const overlay = $(".overlay");

    if (sidebar) {
        sidebar.classList.add("active");
    }

    if (overlay) {
        overlay.classList.add("active");
    }

    document.body.classList.add("no-scroll");

}


function closeCart() {

    const sidebar = $(".cart-sidebar");

    const overlay = $(".overlay");

    if (sidebar) {
        sidebar.classList.remove("active");
    }

    if (overlay) {
        overlay.classList.remove("active");
    }

    document.body.classList.remove("no-scroll");

}


/* =========================================================
   CART EVENTS
   ========================================================= */

function setupCart() {

    const cartButton = $(".cart-button");

    if (cartButton) {

        cartButton.addEventListener(
            "click",
            openCart
        );

    }


    const closeButton =
        $(".cart-sidebar .close-btn");

    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeCart
        );

    }


    const overlay = $(".overlay");

    if (overlay) {

        overlay.addEventListener(
            "click",
            closeCart
        );

    }

}


/* =========================================================
   TOAST
   ========================================================= */

let toastTimer = null;

function showToast(message) {

    const toast = $(".toast");

    if (!toast) {
        return;
    }

    toast.innerHTML = `
        <i class="fa-solid fa-circle-check"></i>
        <span>${escapeHTML(message)}</span>
    `;

    toast.classList.add("show");


    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);

}


/* =========================================================
   INITIALIZE PART 1
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadCart();

        renderProducts();

        renderCart();

        updateCartCount();

        setupSearch();

        setupSort();

        setupCart();

        console.log(
            "✅ Ubaid Medical Store JS Part 1 Ready"
        );

    }
);


/* =========================================================
   GLOBAL EXPORTS
   ========================================================= */

window.ubaidMedicines = medicines;

window.ubaidCart = cart;

window.addToCart = addToCart;

window.removeFromCart = removeFromCart;

window.changeCartQuantity = changeCartQuantity;

window.openCart = openCart;

window.closeCart = closeCart;

window.searchMedicines = searchMedicines;

window.renderProducts = renderProducts;/* =========================================================
   UBAID MEDICAL STORE V2
   MAIN SCRIPT - PART 2
   CART + PRODUCT SYSTEM
   ========================================================= */


/* =========================================================
   PRODUCT DATA
   ========================================================= */

const ubaidProducts = [

    {
        id: 1,
        name: "Paracetamol 500mg",
        category: "Pain Relief",
        price: 30,
        icon: "fa-solid fa-tablets"
    },

    {
        id: 2,
        name: "Azithromycin 500mg",
        category: "Antibiotic",
        price: 85,
        icon: "fa-solid fa-capsules"
    },

    {
        id: 3,
        name: "Vitamin C Tablets",
        category: "Vitamins",
        price: 120,
        icon: "fa-solid fa-pills"
    },

    {
        id: 4,
        name: "ORS Powder",
        category: "General Healthcare",
        price: 25,
        icon: "fa-solid fa-prescription-bottle"
    },

    {
        id: 5,
        name: "Cough Syrup",
        category: "Cold & Cough",
        price: 95,
        icon: "fa-solid fa-bottle-droplet"
    },

    {
        id: 6,
        name: "Antiseptic Liquid",
        category: "First Aid",
        price: 75,
        icon: "fa-solid fa-flask"
    },

    {
        id: 7,
        name: "Multivitamin Tablets",
        category: "Vitamins",
        price: 180,
        icon: "fa-solid fa-tablets"
    },

    {
        id: 8,
        name: "Pain Relief Gel",
        category: "Pain Relief",
        price: 110,
        icon: "fa-solid fa-hand-dots"
    },

    {
        id: 9,
        name: "Digital Thermometer",
        category: "Healthcare Devices",
        price: 199,
        icon: "fa-solid fa-temperature-half"
    },

    {
        id: 10,
        name: "Hand Sanitizer",
        category: "Personal Care",
        price: 65,
        icon: "fa-solid fa-pump-soap"
    },

    {
        id: 11,
        name: "Bandage Pack",
        category: "First Aid",
        price: 45,
        icon: "fa-solid fa-bandage"
    },

    {
        id: 12,
        name: "Calcium Tablets",
        category: "Vitamins",
        price: 150,
        icon: "fa-solid fa-pills"
    }

];


/* =========================================================
   PRODUCT GRID
   ========================================================= */

function ubaidRenderProducts(products = ubaidProducts) {

    const grid =
        document.querySelector("#productsGrid");

    if (!grid) return;

    if (!products.length) {

        grid.innerHTML = `
            <div class="empty-products"
                 style="grid-column:1/-1;">

                <div class="empty-products-icon">
                    <i class="fa-solid fa-magnifying-glass"></i>
                </div>

                <h3>No products found</h3>

                <p>
                    Try searching with another medicine name.
                </p>

                <button
                    class="btn btn-primary"
                    onclick="ubaidClearSearch()">
                    Show All Products
                </button>

            </div>
        `;

        return;
    }


    grid.innerHTML = products.map(product => {

        return `

            <article
                class="product-card"
                data-product-id="${product.id}">

                <div class="product-image">

                    <i class="${product.icon}"></i>

                </div>


                <div class="product-info">

                    <h3>
                        ${product.name}
                    </h3>

                    <span class="product-category">
                        ${product.category}
                    </span>


                    <div class="product-price">

                        <strong>
                            ₹${Number(product.price)
                                .toLocaleString("en-IN")}
                        </strong>

                        <button
                            class="add-cart-btn"
                            onclick="ubaidAddToCart(${product.id})">

                            <i class="fa-solid fa-cart-plus"></i>

                            Add

                        </button>

                    </div>

                </div>

            </article>

        `;

    }).join("");

}


/* =========================================================
   ADD TO CART
   ========================================================= */

window.ubaidAddToCart = function(productId) {

    const product =
        ubaidProducts.find(
            item => item.id === Number(productId)
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

            id: product.id,
            name: product.name,
            category: product.category,
            price: product.price,
            icon: product.icon,
            quantity: 1

        });

    }


    saveCart();

    updateCartCount();

    ubaidRenderCart();

    showToast(
        `${product.name} cart me add ho gayi.`,
        "fa-solid fa-cart-plus"
    );

};


/* =========================================================
   REMOVE FROM CART
   ========================================================= */

window.ubaidRemoveFromCart = function(productId) {

    cart =
        cart.filter(
            item => item.id !== Number(productId)
        );


    saveCart();

    updateCartCount();

    ubaidRenderCart();

    showToast(
        "Product cart se remove ho gayi.",
        "fa-solid fa-trash"
    );

};


/* =========================================================
   CHANGE CART QUANTITY
   ========================================================= */

window.ubaidChangeCartQty = function(
    productId,
    change
) {

    const item =
        cart.find(
            product => product.id === Number(productId)
        );

    if (!item) return;


    item.quantity += Number(change);


    if (item.quantity <= 0) {

        cart =
            cart.filter(
                product =>
                    product.id !== Number(productId)
            );

    }


    saveCart();

    updateCartCount();

    ubaidRenderCart();

};


/* =========================================================
   RENDER CART
   ========================================================= */

window.ubaidRenderCart = function() {

    const container =
        document.querySelector("#cartItems");

    if (!container) return;


    if (!cart.length) {

        container.innerHTML = `

            <div class="empty-cart">

                <div class="empty-cart-icon">
                    <i class="fa-solid fa-cart-shopping"></i>
                </div>

                <h3>Your cart is empty</h3>

                <p>
                    Add medicines to your cart to continue.
                </p>

                <button
                    class="btn btn-primary"
                    onclick="ubaidCloseCart()">

                    Continue Shopping

                </button>

            </div>

        `;

        ubaidUpdateCartSummary();

        return;

    }


    container.innerHTML = cart.map(item => {

        return `

            <div class="cart-item">

                <div class="cart-item-image">

                    <i class="${item.icon}"></i>

                </div>


                <div>

                    <h4>
                        ${item.name}
                    </h4>

                    <p>
                        ${item.category}
                    </p>


                    <div class="cart-qty">

                        <button
                            onclick="ubaidChangeCartQty(
                                ${item.id},
                                -1
                            )">

                            <i class="fa-solid fa-minus"></i>

                        </button>


                        <span>
                            ${item.quantity}
                        </span>


                        <button
                            onclick="ubaidChangeCartQty(
                                ${item.id},
                                1
                            )">

                            <i class="fa-solid fa-plus"></i>

                        </button>


                        <button
                            onclick="ubaidRemoveFromCart(
                                ${item.id}
                            )"
                            title="Remove">

                            <i class="fa-solid fa-trash"></i>

                        </button>

                    </div>

                </div>


                <div class="cart-item-price">

                    ₹${(
                        Number(item.price) *
                        Number(item.quantity)
                    ).toLocaleString("en-IN")}

                </div>

            </div>

        `;

    }).join("");


    ubaidUpdateCartSummary();

};


/* =========================================================
   CART SUMMARY
   ========================================================= */

function ubaidUpdateCartSummary() {

    const subtotal =
        cart.reduce(
            (total, item) =>
                total +
                Number(item.price) *
                Number(item.quantity),
            0
        );


    const quantity =
        cart.reduce(
            (total, item) =>
                total +
                Number(item.quantity),
            0
        );


    const subtotalElement =
        document.querySelector("#cartSubtotal");

    const totalElement =
        document.querySelector("#cartTotal");

    const countElement =
        document.querySelector("#cartItemsCount");


    if (subtotalElement) {

        subtotalElement.textContent =
            "₹" +
            subtotal.toLocaleString("en-IN");

    }


    if (totalElement) {

        totalElement.textContent =
            "₹" +
            subtotal.toLocaleString("en-IN");

    }


    if (countElement) {

        countElement.textContent =
            `${quantity} item${quantity === 1 ? "" : "s"}`;

    }

}


/* =========================================================
   SEARCH
   ========================================================= */

function ubaidSearchProducts(value) {

    const query =
        String(value || "")
            .trim()
            .toLowerCase();


    if (!query) {

        currentProducts =
            [...ubaidProducts];

    } else {

        currentProducts =
            ubaidProducts.filter(product =>

                product.name
                    .toLowerCase()
                    .includes(query)

                ||

                product.category
                    .toLowerCase()
                    .includes(query)

            );

    }


    ubaidRenderProducts(
        currentProducts
    );

}


/* =========================================================
   SEARCH INPUTS
   ========================================================= */

const headerSearchInput =
    document.querySelector(
        "#headerSearchInput"
    );

const mobileSearchInput =
    document.querySelector(
        "#mobileSearchInput"
    );

const mainSearchInput =
    document.querySelector(
        "#mainSearchInput"
    );


if (headerSearchInput) {

    headerSearchInput.addEventListener(
        "input",
        event => {

            ubaidSearchProducts(
                event.target.value
            );

        }
    );

}


if (mobileSearchInput) {

    mobileSearchInput.addEventListener(
        "input",
        event => {

            ubaidSearchProducts(
                event.target.value
            );

        }
    );

}


if (mainSearchInput) {

    mainSearchInput.addEventListener(
        "input",
        event => {

            ubaidSearchProducts(
                event.target.value
            );

        }
    );

}


/* =========================================================
   CLEAR SEARCH
   ========================================================= */

window.ubaidClearSearch = function() {

    if (headerSearchInput) {
        headerSearchInput.value = "";
    }

    if (mobileSearchInput) {
        mobileSearchInput.value = "";
    }

    if (mainSearchInput) {
        mainSearchInput.value = "";
    }


    currentProducts =
        [...ubaidProducts];


    ubaidRenderProducts(
        currentProducts
    );

};


/* =========================================================
   CATEGORY FILTER
   ========================================================= */

window.ubaidFilterCategory = function(category) {

    if (!category || category === "all") {

        ubaidRenderProducts(
            ubaidProducts
        );

        return;
    }


    const filtered =
        ubaidProducts.filter(
            product =>
                product.category === category
        );


    ubaidRenderProducts(
        filtered
    );

};


/* =========================================================
   SORT PRODUCTS
   ========================================================= */

const medicineSort =
    document.querySelector(
        "#medicineSort"
    );


if (medicineSort) {

    medicineSort.addEventListener(
        "change",
        event => {

            const value =
                event.target.value;


            const products =
                [
                    ...(
                        currentProducts.length
                            ? currentProducts
                            : ubaidProducts
                    )
                ];


            if (value === "low") {

                products.sort(
                    (a,b) =>
                        a.price - b.price
                );

            }


            if (value === "high") {

                products.sort(
                    (a,b) =>
                        b.price - a.price
                );

            }


            if (value === "name") {

                products.sort(
                    (a,b) =>
                        a.name.localeCompare(
                            b.name
                        )
                );

            }


            ubaidRenderProducts(
                products
            );

        }
    );

}


/* =========================================================
   INITIAL PRODUCTS + CART
   ========================================================= */

currentProducts =
    [...ubaidProducts];


ubaidRenderProducts(
    currentProducts
);


ubaidRenderCart();


console.log(
    "✅ Ubaid Medical Store Script Part 2 Loaded"
);/* =========================================================
   UBAID MEDICAL STORE V2
   MAIN SCRIPT - PART 3
   AUTH + PROFILE + REVIEWS + WHATSAPP + FINAL EVENTS
   ========================================================= */


/* =========================================================
   AUTH ELEMENTS
   ========================================================= */

const authModal =
    document.querySelector("#authModal");

const profileModal =
    document.querySelector("#profileModal");

const authClose =
    document.querySelector("#authClose");

const profileClose =
    document.querySelector("#profileClose");

const accountBtn =
    document.querySelector("#accountBtn");

const profileBtn =
    document.querySelector("#profileBtn");


/* =========================================================
   AUTH TABS
   ========================================================= */

const loginForm =
    document.querySelector("#loginForm");

const signupForm =
    document.querySelector("#signupForm");

const forgotForm =
    document.querySelector("#forgotForm");

const showSignupBtn =
    document.querySelector("#showSignup");

const showLoginBtn =
    document.querySelector("#showLogin");

const forgotPasswordBtn =
    document.querySelector("#forgotPassword");

const backToLoginBtn =
    document.querySelector("#backToLogin");


function ubaidShowAuthForm(type) {

    if (loginForm)
        loginForm.style.display =
            type === "login"
                ? "block"
                : "none";


    if (signupForm)
        signupForm.style.display =
            type === "signup"
                ? "block"
                : "none";


    if (forgotForm)
        forgotForm.style.display =
            type === "forgot"
                ? "block"
                : "none";

}


/* =========================================================
   OPEN LOGIN
   ========================================================= */

window.ubaidOpenLogin = function() {

    if (!authModal) return;

    ubaidShowAuthForm("login");

    authModal.classList.add("active");

    document.body.classList.add("no-scroll");

};


/* =========================================================
   CLOSE LOGIN
   ========================================================= */

function ubaidCloseAuth() {

    if (!authModal) return;

    authModal.classList.remove("active");

    if (!profileModal?.classList.contains("active")) {
        document.body.classList.remove("no-scroll");
    }

}


if (authClose) {

    authClose.addEventListener(
        "click",
        ubaidCloseAuth
    );

}


/* =========================================================
   ACCOUNT BUTTON
   ========================================================= */

if (accountBtn) {

    accountBtn.addEventListener(
        "click",
        () => {

            ubaidOpenLogin();

        }
    );

}


/* =========================================================
   SWITCH LOGIN / SIGNUP
   ========================================================= */

if (showSignupBtn) {

    showSignupBtn.addEventListener(
        "click",
        () => {

            ubaidShowAuthForm(
                "signup"
            );

        }
    );

}


if (showLoginBtn) {

    showLoginBtn.addEventListener(
        "click",
        () => {

            ubaidShowAuthForm(
                "login"
            );

        }
    );

}


/* =========================================================
   FORGOT PASSWORD SCREEN
   ========================================================= */

if (forgotPasswordBtn) {

    forgotPasswordBtn.addEventListener(
        "click",
        () => {

            ubaidShowAuthForm(
                "forgot"
            );

        }
    );

}


if (backToLoginBtn) {

    backToLoginBtn.addEventListener(
        "click",
        () => {

            ubaidShowAuthForm(
                "login"
            );

        }
    );

}


/* =========================================================
   PASSWORD TOGGLE
   ========================================================= */

document
    .querySelectorAll(".password-toggle")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const targetId =
                    button.dataset.target;

                const input =
                    document.getElementById(
                        targetId
                    );

                if (!input) return;


                const icon =
                    button.querySelector("i");


                if (input.type === "password") {

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
   AUTH MESSAGE
   ========================================================= */

function ubaidAuthMessage(
    message,
    type = "error"
) {

    const boxes =
        document.querySelectorAll(
            ".auth-message"
        );


    boxes.forEach(box => {

        box.textContent = message;

        box.className =
            `auth-message show ${type}`;

    });

}


/* =========================================================
   LOGIN
   ========================================================= */

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const email =
                loginForm.querySelector(
                    'input[type="email"]'
                )?.value.trim();


            const password =
                loginForm.querySelector(
                    'input[type="password"]'
                )?.value;


            if (!email || !password) {

                ubaidAuthMessage(
                    "Email aur password dono enter karein."
                );

                return;

            }


            const button =
                loginForm.querySelector(
                    'button[type="submit"]'
                );


            try {

                if (button) {
                    button.disabled = true;
                    button.textContent =
                        "Logging in...";
                }


                if (
                    typeof window.ubaidLogin !==
                    "function"
                ) {

                    throw new Error(
                        "Firebase authentication file load nahi hui."
                    );

                }


                await window.ubaidLogin(
                    email,
                    password
                );


                ubaidAuthMessage(
                    "Login successful!",
                    "success"
                );


                showToast(
                    "Welcome back!",
                    "fa-solid fa-circle-check"
                );


                setTimeout(
                    ubaidCloseAuth,
                    700
                );


                loginForm.reset();


            } catch (error) {

                console.error(
                    "Login Error:",
                    error
                );


                ubaidAuthMessage(
                    ubaidFirebaseError(
                        error.code
                    )
                );


            } finally {

                if (button) {

                    button.disabled = false;

                    button.textContent =
                        "Login";

                }

            }

        }
    );

}


/* =========================================================
   SIGNUP
   ========================================================= */

if (signupForm) {

    signupForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const inputs =
                signupForm.querySelectorAll(
                    "input"
                );


            const name =
                inputs[0]?.value.trim();


            const email =
                signupForm.querySelector(
                    'input[type="email"]'
                )?.value.trim();


            const password =
                signupForm.querySelector(
                    'input[type="password"]'
                )?.value;


            if (!name || !email || !password) {

                ubaidAuthMessage(
                    "Saari details fill karein."
                );

                return;

            }


            if (password.length < 6) {

                ubaidAuthMessage(
                    "Password kam se kam 6 characters ka hona chahiye."
                );

                return;

            }


            const button =
                signupForm.querySelector(
                    'button[type="submit"]'
                );


            try {

                if (button) {

                    button.disabled = true;

                    button.textContent =
                        "Creating account...";

                }


                if (
                    typeof window.ubaidSignup !==
                    "function"
                ) {

                    throw new Error(
                        "Firebase authentication file load nahi hui."
                    );

                }


                await window.ubaidSignup(
                    email,
                    password,
                    name
                );


                ubaidAuthMessage(
                    "Account successfully create ho gaya!",
                    "success"
                );


                showToast(
                    "Account created successfully.",
                    "fa-solid fa-user-check"
                );


                setTimeout(
                    ubaidCloseAuth,
                    800
                );


                signupForm.reset();


            } catch (error) {

                console.error(
                    "Signup Error:",
                    error
                );


                ubaidAuthMessage(
                    ubaidFirebaseError(
                        error.code
                    )
                );


            } finally {

                if (button) {

                    button.disabled = false;

                    button.textContent =
                        "Create Account";

                }

            }

        }
    );

}


/* =========================================================
   FORGOT PASSWORD
   ========================================================= */

if (forgotForm) {

    forgotForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const email =
                forgotForm.querySelector(
                    'input[type="email"]'
                )?.value.trim();


            if (!email) {

                ubaidAuthMessage(
                    "Email address enter karein."
                );

                return;

            }


            const button =
                forgotForm.querySelector(
                    'button[type="submit"]'
                );


            try {

                if (button) {

                    button.disabled = true;

                    button.textContent =
                        "Sending...";

                }


                if (
                    typeof window.ubaidResetPassword !==
                    "function"
                ) {

                    throw new Error(
                        "Firebase authentication file load nahi hui."
                    );

                }


                await window.ubaidResetPassword(
                    email
                );


                ubaidAuthMessage(
                    "Password reset email bhej di gayi hai.",
                    "success"
                );


                showToast(
                    "Password reset email sent.",
                    "fa-solid fa-envelope"
                );


            } catch (error) {

                console.error(
                    "Reset Password Error:",
                    error
                );


                ubaidAuthMessage(
                    ubaidFirebaseError(
                        error.code
                    )
                );


            } finally {

                if (button) {

                    button.disabled = false;

                    button.textContent =
                        "Send Reset Link";

                }

            }

        }
    );

}


/* =========================================================
   FIREBASE ERROR TRANSLATION
   ========================================================= */

function ubaidFirebaseError(code) {

    const errors = {

        "auth/invalid-email":
            "Email address sahi nahi hai.",

        "auth/user-not-found":
            "Is email se koi account nahi mila.",

        "auth/wrong-password":
            "Password galat hai.",

        "auth/invalid-credential":
            "Email ya password galat hai.",

        "auth/email-already-in-use":
            "Ye email pehle se registered hai.",

        "auth/weak-password":
            "Password thoda strong rakhein.",

        "auth/too-many-requests":
            "Bahut zyada attempts ho gaye. Thodi der baad try karein.",

        "auth/network-request-failed":
            "Internet connection check karein.",

        "auth/user-disabled":
            "Ye account disabled hai."

    };


    return (
        errors[code] ||
        "Something went wrong. Please try again."
    );

}


/* =========================================================
   AUTH STATE
   ========================================================= */

window.addEventListener(
    "ubaidAuthStateChanged",
    event => {

        const user =
            event.detail;


        const account =
            document.querySelector(
                "#accountBtn"
            );


        const profile =
            document.querySelector(
                "#profileBtn"
            );


        if (user) {

            if (account) {
                account.style.display =
                    "none";
            }


            if (profile) {

                profile.style.display =
                    "flex";

            }


            ubaidUpdateProfileUI(
                user
            );

        } else {

            if (account) {
                account.style.display =
                    "inline-flex";
            }


            if (profile) {
                profile.style.display =
                    "none";
            }

        }

    }
);


/* =========================================================
   UPDATE PROFILE UI
   ========================================================= */

function ubaidUpdateProfileUI(user) {

    const name =
        user.displayName ||
        user.email?.split("@")[0] ||
        "User";


    const firstLetter =
        name
            .charAt(0)
            .toUpperCase();


    document
        .querySelectorAll(".user-name")
        .forEach(element => {

            element.textContent =
                name;

        });


    document
        .querySelectorAll(
            ".user-avatar, .profile-avatar-large, .profile-modal-avatar, .review-user-avatar"
        )
        .forEach(element => {

            element.textContent =
                firstLetter;

        });


    const profileName =
        document.querySelector(
            "#profileName"
        );


    const profileEmail =
        document.querySelector(
            "#profileEmail"
        );


    if (profileName) {
        profileName.textContent =
            name;
    }


    if (profileEmail) {
        profileEmail.textContent =
            user.email || "";
    }


    const profileDate =
        document.querySelector(
            "#profileCreated"
        );


    if (
        profileDate &&
        user.metadata?.creationTime
    ) {

        profileDate.textContent =
            new Date(
                user.metadata.creationTime
            ).toLocaleDateString(
                "en-IN"
            );

    }

}


/* =========================================================
   PROFILE DROPDOWN
   ========================================================= */

const profileGroup =
    document.querySelector(
        ".user-profile-group"
    );


if (profileBtn) {

    profileBtn.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            if (profileGroup) {

                profileGroup.classList.toggle(
                    "open"
                );

            }

        }
    );

}


document.addEventListener(
    "click",
    () => {

        if (profileGroup) {

            profileGroup.classList.remove(
                "open"
            );

        }

    }
);


/* =========================================================
   PROFILE MODAL
   ========================================================= */

window.ubaidOpenProfile = function() {

    if (profileModal) {

        profileModal.classList.add(
            "active"
        );

        document.body.classList.add(
            "no-scroll"
        );

    }

};


if (profileClose) {

    profileClose.addEventListener(
        "click",
        () => {

            profileModal?.classList.remove(
                "active"
            );

            document.body.classList.remove(
                "no-scroll"
            );

        }
    );

}


/* =========================================================
   PROFILE MENU BUTTON
   ========================================================= */

const viewProfileBtn =
    document.querySelector(
        "#viewProfileBtn"
    );


if (viewProfileBtn) {

    viewProfileBtn.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            profileGroup?.classList.remove(
                "open"
            );

            ubaidOpenProfile();

        }
    );

}


/* =========================================================
   LOGOUT
   ========================================================= */

document
    .querySelectorAll(
        ".logout-menu-btn, .logout-large-btn"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            async () => {

                try {

                    if (
                        typeof window.ubaidLogout !==
                        "function"
                    ) {

                        throw new Error(
                            "Firebase logout function unavailable."
                        );

                    }


                    await window.ubaidLogout();


                    profileGroup?.classList.remove(
                        "open"
                    );


                    profileModal?.classList.remove(
                        "active"
                    );


                    document.body.classList.remove(
                        "no-scroll"
                    );


                    showToast(
                        "Logout successful.",
                        "fa-solid fa-right-from-bracket"
                    );


                } catch (error) {

                    console.error(
                        "Logout Error:",
                        error
                    );


                    showToast(
                        "Logout nahi ho paya.",
                        "fa-solid fa-triangle-exclamation"
                    );

                }

            }
        );

    });


/* =========================================================
   REVIEW RATING
   ========================================================= */

const ratingInput =
    document.querySelector(
        "#ratingInput"
    );


if (ratingInput) {

    ratingInput
        .querySelectorAll("button")
        .forEach((button, index) => {

            button.addEventListener(
                "click",
                () => {

                    selectedRating =
                        Number(
                            button.dataset.rating ||
                            index + 1
                        );


                    ratingInput
                        .querySelectorAll("button")
                        .forEach(
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

        });

}


/* =========================================================
   REVIEWS STORAGE
   ========================================================= */

let ubaidReviews =
    JSON.parse(
        localStorage.getItem(
            "ubaidReviews"
        )
    ) || [];


function saveReviews() {

    localStorage.setItem(
        "ubaidReviews",
        JSON.stringify(
            ubaidReviews
        )
    );

}


/* =========================================================
   RENDER REVIEWS
   ========================================================= */

function ubaidRenderReviews() {

    const list =
        document.querySelector(
            "#commentsList"
        );


    if (!list) return;


    if (!ubaidReviews.length) {

        list.innerHTML = `

            <div class="review-placeholder">

                <i class="fa-regular fa-comments"></i>

                <h3>No reviews yet</h3>

                <p>
                    Be the first to share your experience.
                </p>

            </div>

        `;

        return;

    }


    list.innerHTML =
        ubaidReviews
            .slice()
            .reverse()
            .map(review => {

                const stars =
                    "★".repeat(
                        review.rating
                    ) +
                    "☆".repeat(
                        5 - review.rating
                    );


                return `

                    <div class="review-item">

                        <div class="review-item-head">

                            <div class="review-user">

                                <div class="review-user-avatar">
                                    ${(
                                        review.name ||
                                        "U"
                                    ).charAt(0).toUpperCase()}
                                </div>

                                <div>

                                    <strong>
                                        ${review.name}
                                    </strong>

                                    <small>
                                        ${review.date}
                                    </small>

                                </div>

                            </div>

                            <div class="stars">
                                ${stars}
                            </div>

                        </div>

                        <p class="review-text">
                            ${review.text}
                        </p>

                    </div>

                `;

            })
            .join("");

}


/* =========================================================
   REVIEW FORM
   ========================================================= */

const reviewForm =
    document.querySelector(
        "#reviewForm"
    );


if (reviewForm) {

    reviewForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const name =
                reviewForm.querySelector(
                    '[name="name"], #reviewName'
                )?.value.trim();


            const text =
                reviewForm.querySelector(
                    '[name="review"], [name="message"], #reviewText'
                )?.value.trim();


            if (!name || !text) {

                showToast(
                    "Name aur review dono enter karein.",
                    "fa-solid fa-triangle-exclamation"
                );

                return;

            }


            ubaidReviews.push({

                name: name,

                text: text,

                rating:
                    selectedRating,

                date:
                    new Date()
                        .toLocaleDateString(
                            "en-IN"
                        )

            });


            saveReviews();

            ubaidRenderReviews();

            reviewForm.reset();


            selectedRating = 5;


            if (ratingInput) {

                ratingInput
                    .querySelectorAll("button")
                    .forEach(
                        (star, index) => {

                            star.classList.toggle(
                                "active",
                                index < 5
                            );

                        }
                    );

            }


            showToast(
                "Review successfully submit ho gaya.",
                "fa-solid fa-star"
            );

        }
    );

}


/* =========================================================
   WHATSAPP ORDER
   ========================================================= */

window.ubaidWhatsAppOrder = function() {

    if (!cart.length) {

        showToast(
            "Pehle cart me product add karein.",
            "fa-solid fa-cart-shopping"
        );

        return;

    }


    let message =
        "🏥 *UBAID MEDICAL STORE*%0A%0A";


    message +=
        "🛒 *Order Details:*%0A%0A";


    cart.forEach(item => {

        message +=
            `• ${item.name} x ${item.quantity} = ₹${
                Number(item.price) *
                Number(item.quantity)
            }%0A`;

    });


    message +=
        `%0A💰 *Total: ₹${getCartTotal()}*`;


    const phone =
        "91XXXXXXXXXX";


    const url =
        `https://wa.me/${phone}?text=${message}`;


    window.open(
        url,
        "_blank"
    );

};


/* =========================================================
   WHATSAPP BUTTONS
   ========================================================= */

document
    .querySelectorAll(
        ".whatsapp-order-btn, .whatsapp-btn, .whatsapp-banner-btn"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            event => {

                if (
                    button.classList.contains(
                        "whatsapp-order-btn"
                    )
                ) {

                    event.preventDefault();

                    ubaidWhatsAppOrder();

                }

            }
        );

    });


/* =========================================================
   MAIN SEARCH BUTTON
   ========================================================= */

const searchMainBtn =
    document.querySelector(
        "#searchMainBtn"
    );


if (searchMainBtn) {

    searchMainBtn.addEventListener(
        "click",
        () => {

            ubaidSearchProducts(
                mainSearchInput?.value
            );


            document
                .querySelector(
                    "#medicines"
                )
                ?.scrollIntoView({
                    behavior: "smooth"
                });

        }
    );

}


/* =========================================================
   ESCAPE KEY
   ========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (event.key !== "Escape") {
            return;
        }


        closeCart();

        closeMobileNav();


        authModal?.classList.remove(
            "active"
        );


        profileModal?.classList.remove(
            "active"
        );


        document.body.classList.remove(
            "no-scroll"
        );

    }
);


/* =========================================================
   FINAL INITIALIZATION
   ========================================================= */

ubaidRenderProducts(
    ubaidProducts
);

ubaidRenderCart();

ubaidRenderReviews();


console.log(
    "✅ Ubaid Medical Store Script Part 3 Loaded"
);

console.log(
    "🚀 Ubaid Medical Store V2 JavaScript Ready"
);

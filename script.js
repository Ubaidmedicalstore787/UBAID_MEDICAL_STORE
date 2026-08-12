/* =========================================================
   UBAID MEDICAL STORE V2
   MAIN SCRIPT - GUARANTEED FIX FOR PROVIDED HTML
   ========================================================= */

"use strict";

let cart = [];
let toastTimer = null;
const WHATSAPP_NUMBER = "918009174690";

/* Default Price Map (Kyunki HTML me price text nahi numbers chahiye) */
const DEFAULT_PRICES = {
    "Paracetamol": 20,
    "Amoxicillin": 85,
    "Azithromycin": 120,
    "Pantoprazole": 60,
    "Ondansetron": 45,
    "Diclofenac": 35,
    "Levocetirizine": 30,
    "Cefixime": 110,
    "Metronidazole": 40,
    "Ibuprofen": 25,
    "Ofloxacin": 75,
    "Ciprofloxacin": 80,
    "Cetirizine": 20,
    "Omeprazole": 50,
    "Telmisartan": 65,
    "Metformin": 40,
    "Atorvastatin": 90,
    "Antibiotic": 95,
    "Combination": 40,
    "Antacid": 130,
    "Cough Syrup": 115,
    "Multivitamin": 140,
    "Iron Supplement": 160,
    "Lactulose": 180,
    "Suspension": 125,
    "Zinc": 60,
    "Calcium": 110,
    "IV Infusion": 150,
    "Ondansetron Injection": 40,
    "Antiallergic": 30,
    "Dexamethasone": 35,
    "Gentamicin": 45,
    "Iron Sucrose": 250,
    "Vitamin B12": 55,
    "Hydrocortisone": 70
};

/* =========================================================
   DOM READY INITIALIZATION
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    loadCart();
    initTheme();
    initMobileMenu();
    initSearch();
    initCart();
    initNavigation();
    initButtons();
    initProductFilter();
    initCategoryCards();
    initSmoothLinks();
    initBackToTop();

    updateCartCount();
    renderCart();

    console.log("✅ Ubaid Medical Store JS Ready");
});

/* =========================================================
   1. THEME TOGGLE SYSTEM (#darkModeBtn)
   ========================================================= */

function initTheme() {
    const savedTheme = localStorage.getItem("ubaidTheme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
    }
}

function toggleTheme() {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");
    localStorage.setItem("ubaidTheme", isDark ? "dark" : "light");
    showToast(isDark ? "Dark mode enabled" : "Light mode enabled");
}

window.toggleTheme = toggleTheme;

/* =========================================================
   2. MOBILE MENU NAVIGATION (#mobileMenuBtn)
   ========================================================= */

function initMobileMenu() {
    const menuBtn = document.getElementById("mobileMenuBtn");
    const nav = document.getElementById("mainNav");
    const overlay = document.getElementById("overlay");

    if (menuBtn && nav) {
        menuBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            nav.classList.toggle("open");
            if (overlay) {
                overlay.classList.toggle("active", nav.classList.contains("open"));
            }
            document.body.classList.toggle("no-scroll", nav.classList.contains("open"));
        });
    }

    document.querySelectorAll(".nav-links a").forEach(link => {
        link.addEventListener("click", () => {
            closeMobileMenu();
        });
    });
}

function closeMobileMenu() {
    const nav = document.getElementById("mainNav");
    const overlay = document.getElementById("overlay");

    if (nav) nav.classList.remove("open");
    if (overlay && !document.querySelector(".cart-sidebar.active")) {
        overlay.classList.remove("active");
    }
    document.body.classList.remove("no-scroll");
}

/* =========================================================
   3. MEDICINE PRICE & CART MANAGEMENT
   ========================================================= */

function initCart() {
    // Add to Cart Buttons
    document.querySelectorAll(".add-cart-btn").forEach(button => {
        button.addEventListener("click", (e) => {
            e.preventDefault();
            const card = button.closest(".product-card");
            if (!card) return;

            // Extract medicine title or data attribute
            const name = button.getAttribute("data-medicine") || 
                         card.querySelector("h3")?.textContent?.trim() || 
                         "Medicine";

            // Extract Price key from <strong> tag inside .product-price
            const keyText = card.querySelector(".product-price strong")?.textContent?.trim() || "";
            const price = DEFAULT_PRICES[keyText] || 50; // Fallback price if not found

            addToCart(name, price);
        });
    });

    // Cart Sidebar Controls
    const cartButton = document.getElementById("cartBtn");
    if (cartButton) {
        cartButton.addEventListener("click", openCart);
    }

    const closeCartBtn = document.getElementById("closeCartBtn");
    if (closeCartBtn) {
        closeCartBtn.addEventListener("click", closeCart);
    }

    const continueShoppingBtn = document.getElementById("continueShoppingBtn");
    if (continueShoppingBtn) {
        continueShoppingBtn.addEventListener("click", closeCart);
    }

    const overlay = document.getElementById("overlay");
    if (overlay) {
        overlay.addEventListener("click", () => {
            closeCart();
            closeMobileMenu();
        });
    }
}

function addToCart(name, price) {
    const existing = cart.find(item => item.name === name);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ name: name, price: price, quantity: 1 });
    }

    saveCart();
    updateCartCount();
    renderCart();
    showToast(`${name.split('(')[0]} cart me add ho gaya`);
}

function changeCartQuantity(index, change) {
    if (!cart[index]) return;
    cart[index].quantity += change;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    saveCart();
    updateCartCount();
    renderCart();
}
window.changeCartQuantity = changeCartQuantity;

function saveCart() {
    localStorage.setItem("ubaidCart", JSON.stringify(cart));
}

function loadCart() {
    try {
        const saved = localStorage.getItem("ubaidCart");
        cart = saved ? JSON.parse(saved) : [];
    } catch (e) {
        cart = [];
    }
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountEl = document.getElementById("cartCount");
    if (cartCountEl) cartCountEl.textContent = count;
}

function renderCart() {
    const container = document.getElementById("cartItems");
    const footer = document.querySelector(".cart-footer");
    const itemCountEl = document.getElementById("cartItemsCount");

    if (!container) return;

    if (!cart.length) {
        container.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon"><i class="fa-solid fa-cart-shopping"></i></div>
                <h3>Your Cart is Empty</h3>
                <p>Add medicines to create your enquiry.</p>
                <button class="btn btn-primary" onclick="closeCart()" type="button">Continue Shopping</button>
            </div>
        `;
        if (footer) footer.style.display = "none";
        if (itemCountEl) itemCountEl.textContent = "0 items";
        return;
    }

    if (footer) footer.style.display = "block";

    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (itemCountEl) itemCountEl.textContent = `${totalQty} item${totalQty > 1 ? 's' : ''}`;

    container.innerHTML = cart.map((item, index) => `
        <div class="cart-item" style="display:flex; justify-content:space-between; align-items:center; padding: 12px 0; border-bottom: 1px solid #eee;">
            <div style="flex:1;">
                <h4 style="margin:0; font-size:14px;">${escapeHTML(item.name)}</h4>
                <p style="margin:4px 0 0 0; color:#666; font-size:13px;">₹${item.price.toFixed(2)}</p>
                <div class="cart-qty" style="display:flex; gap:10px; align-items:center; margin-top:6px;">
                    <button type="button" style="width:24px; height:24px; cursor:pointer;" onclick="changeCartQuantity(${index}, -1)">−</button>
                    <span>${item.quantity}</span>
                    <button type="button" style="width:24px; height:24px; cursor:pointer;" onclick="changeCartQuantity(${index}, 1)">+</button>
                </div>
            </div>
            <div class="cart-item-price" style="font-weight:bold; font-size:14px; margin-left:10px;">
                ₹${(item.price * item.quantity).toFixed(2)}
            </div>
        </div>
    `).join("");

    updateCartTotal();
}

function updateCartTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);

    const cartTotalItems = document.getElementById("cartTotalItems");
    if (cartTotalItems) cartTotalItems.textContent = totalQty;

    const totalElement = document.querySelector(".cart-total-row strong");
    if (totalElement) totalElement.textContent = `₹${total.toFixed(2)}`;
}

function openCart() {
    const sidebar = document.getElementById("cartSidebar");
    const overlay = document.getElementById("overlay");

    if (sidebar) sidebar.classList.add("active");
    if (overlay) overlay.classList.add("active");
    document.body.classList.add("no-scroll");
}
window.openCart = openCart;

function closeCart() {
    const sidebar = document.getElementById("cartSidebar");
    const overlay = document.getElementById("overlay");

    if (sidebar) sidebar.classList.remove("active");
    if (overlay && !document.getElementById("mainNav")?.classList.contains("open")) {
        overlay.classList.remove("active");
    }
    document.body.classList.remove("no-scroll");
}
window.closeCart = closeCart;

/* =========================================================
   4. WHATSAPP ORDER PROCESSOR
   ========================================================= */

function sendWhatsAppOrder() {
    if (!cart.length) {
        showToast("Cart abhi empty hai");
        return;
    }

    let message = "🩺 *UBAID MEDICAL STORE*%0A%0A";
    message += "📦 *Order / Enquiry Details:*%0A";

    cart.forEach(item => {
        message += `• ${encodeURIComponent(item.name)} × ${item.quantity} = ₹${(item.price * item.quantity).toFixed(2)}%0A`;
    });

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    message += `%0A💰 *Total Estimated Amount: ₹${total.toFixed(2)}*%0A%0A`;
    message += "Please confirm availability and order details.";

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
}

/* =========================================================
   5. BUTTON CLICK BINDINGS
   ========================================================= */

function initButtons() {
    const darkBtn = document.getElementById("darkModeBtn");
    if (darkBtn) {
        darkBtn.addEventListener("click", toggleTheme);
    }

    const whatsappBtn = document.getElementById("whatsappOrderBtn");
    if (whatsappBtn) {
        whatsappBtn.addEventListener("click", sendWhatsAppOrder);
    }
}

/* =========================================================
   6. SEARCH & CATEGORY FILTERS
   ========================================================= */

function initSearch() {
    const inputs = [
        document.getElementById("headerSearchInput"),
        document.getElementById("mobileSearchInput"),
        document.getElementById("mainSearchInput")
    ];

    inputs.forEach(input => {
        if (!input) return;
        input.addEventListener("input", () => {
            filterProducts(input.value.trim().toLowerCase());
        });
    });

    const forms = [
        document.getElementById("headerSearch"),
        document.getElementById("mobileSearch"),
        document.getElementById("mainSearch")
    ];

    forms.forEach(form => {
        if (!form) return;
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const input = form.querySelector("input");
            if (input) filterProducts(input.value.trim().toLowerCase());
        });
    });

    const clearBtn = document.getElementById("clearSearchBtn");
    if (clearBtn) {
        clearBtn.addEventListener("click", () => {
            inputs.forEach(i => { if (i) i.value = ""; });
            filterProducts("");
        });
    }
}

function filterProducts(searchTerm) {
    const products = document.querySelectorAll(".product-card");
    const emptyState = document.getElementById("emptyProducts");
    let visibleCount = 0;

    products.forEach(product => {
        const text = (product.getAttribute("data-name") || "") + " " + product.innerText;
        const match = !searchTerm || text.toLowerCase().includes(searchTerm);
        product.style.display = match ? "" : "none";
        if (match) visibleCount++;
    });

    if (emptyState) {
        emptyState.style.display = (visibleCount === 0) ? "block" : "none";
    }

    updateMedicineResult(visibleCount);
}

function updateMedicineResult(count) {
    const result = document.getElementById("medicineResult");
    if (result) {
        result.textContent = `Showing ${count} medicines`;
    }
}

function initProductFilter() {
    const select = document.getElementById("medicineFilter");
    if (!select) return;

    select.addEventListener("change", () => {
        const value = select.value.toLowerCase();
        const products = document.querySelectorAll(".product-card");
        let visibleCount = 0;

        products.forEach(product => {
            const category = product.getAttribute("data-category") || "";
            const match = (value === "all" || category === value);

            product.style.display = match ? "" : "none";
            if (match) visibleCount++;
        });

        updateMedicineResult(visibleCount);
    });
}

function initCategoryCards() {
    document.querySelectorAll(".category-card[data-category]").forEach(card => {
        card.addEventListener("click", () => {
            const cat = card.getAttribute("data-category");
            const select = document.getElementById("medicineFilter");
            if (select) {
                select.value = cat;
                select.dispatchEvent(new Event("change"));
            }

            const section = document.getElementById("medicines");
            if (section) section.scrollIntoView({ behavior: "smooth" });
        });
    });
}

/* =========================================================
   7. NAVIGATION & UI HELPERS
   ========================================================= */

function initNavigation() {
    document.querySelectorAll(".nav-links a").forEach(link => {
        link.addEventListener("click", () => {
            document.querySelectorAll(".nav-links a").forEach(item => item.classList.remove("active"));
            link.classList.add("active");
        });
    });
}

function initSmoothLinks() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener("click", (e) => {
            const id = link.getAttribute("href");
            if (!id || id === "#") return;

            const target = document.querySelector(id);
            if (!target) return;

            e.preventDefault();
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    });
}

function initBackToTop() {
    const button = document.querySelector(".back-to-top");
    if (!button) return;

    window.addEventListener("scroll", () => {
        button.classList.toggle("show", window.scrollY > 500);
    });

    button.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

function showToast(message) {
    const toast = document.getElementById("toast");
    const toastMsg = document.getElementById("toastMessage");

    if (!toast) return;

    if (toastMsg) {
        toastMsg.textContent = message;
    } else {
        toast.textContent = message;
    }

    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

function escapeHTML(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        closeCart();
        closeMobileMenu();
    }
});

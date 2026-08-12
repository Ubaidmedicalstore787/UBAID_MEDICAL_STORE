/* =========================================================
   UBAID MEDICAL STORE V2
   MAIN SCRIPT - FINAL GUARANTEED FIX
   ========================================================= */

"use strict";

let cart = [];
let selectedRating = 5;
let toastTimer = null;
const WHATSAPP_NUMBER = "918009174690";

/* =========================================================
   DOM READY INITIALIZATION
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    loadCart();
    initTheme();
    initMobileMenu();
    initSearch();
    initCart();
    initRating();
    initNavigation();
    initScrollEffects();
    initButtons();
    initProductFilter();
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

    updateCartCount();
    renderCart();

    console.log("✅ Ubaid Medical Store V2 JS Fully Loaded & Working");
});

/* =========================================================
   1. THEME TOGGLE (HAR TARAH KE BUTTON SE KAAM KAREGA)
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
   2. MOBILE MENU & OVERLAY FIX
   ========================================================= */

function initMobileMenu() {
    const menuBtn = document.querySelector(".mobile-menu-btn, .menu-toggle, #menuBtn");
    const nav = document.querySelector(".nav, .nav-links, .navbar");
    const overlay = document.querySelector(".overlay");

    if (menuBtn && nav) {
        menuBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            nav.classList.toggle("open");
            nav.classList.toggle("active");

            if (overlay) {
                overlay.classList.toggle("active", nav.classList.contains("open") || nav.classList.contains("active"));
            }
            document.body.classList.toggle("no-scroll");
        });
    }

    document.querySelectorAll(".nav-links a, .nav a").forEach(link => {
        link.addEventListener("click", () => {
            closeMobileMenu();
        });
    });
}

function closeMobileMenu() {
    const nav = document.querySelector(".nav, .nav-links, .navbar");
    const overlay = document.querySelector(".overlay");

    if (nav) {
        nav.classList.remove("open");
        nav.classList.remove("active");
    }
    if (overlay && !document.querySelector(".cart-sidebar.active")) {
        overlay.classList.remove("active");
    }
    document.body.classList.remove("no-scroll");
}

/* =========================================================
   3. MEDICINE PRICE & CART FIX
   ========================================================= */

function initCart() {
    // Dynamic Add To Cart listener
    document.addEventListener("click", (e) => {
        const btn = e.target.closest(".add-cart-btn, .add-to-cart, [data-add-cart]");
        if (btn) {
            const card = btn.closest(".product-card, .medicine-card, .card");
            if (!card) return;

            const name = card.querySelector("h3, .product-title, .title")?.textContent?.trim() || "Medicine";

            // Deep Price Finder (₹ ya Rs. sab handle kar leta hai)
            let priceText = "0";
            const priceEl = card.querySelector(".product-price strong, .price strong, .product-price, .price, [data-price]");
            if (priceEl) {
                priceText = priceEl.textContent;
            } else {
                priceText = card.innerText;
            }

            const matchedPrices = priceText.match(/₹?\s*(\d+(\.\d+)?)/);
            const price = matchedPrices ? parseFloat(matchedPrices[1]) : 0;

            addToCart(name, price);
        }
    });

    const cartButton = document.querySelector(".cart-button, #cartBtn, .cart-icon");
    if (cartButton) {
        cartButton.addEventListener("click", openCart);
    }

    const closeCartBtn = document.querySelector(".cart-sidebar .close-btn, .close-cart");
    if (closeCartBtn) {
        closeCartBtn.addEventListener("click", closeCart);
    }

    const overlay = document.querySelector(".overlay");
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
    showToast(`${name} cart me add ho gaya`);
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
    const cartCounts = document.querySelectorAll("#cartCount, .cart-count, .cart-badge");
    cartCounts.forEach(el => {
        el.textContent = count;
    });
}

function renderCart() {
    const container = document.querySelector(".cart-items");
    const empty = document.querySelector(".empty-cart");
    const footer = document.querySelector(".cart-footer");

    if (!container) return;

    if (!cart.length) {
        container.innerHTML = "";
        if (empty) empty.style.display = "flex";
        if (footer) footer.style.display = "none";
        return;
    }

    if (empty) empty.style.display = "none";
    if (footer) footer.style.display = "block";

    container.innerHTML = cart.map((item, index) => `
        <div class="cart-item" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
            <div>
                <h4 style="margin:0;">${escapeHTML(item.name)}</h4>
                <p style="margin:2px 0;">₹${item.price.toFixed(2)}</p>
                <div class="cart-qty" style="display:flex; gap:8px; align-items:center;">
                    <button type="button" onclick="changeCartQuantity(${index}, -1)">−</button>
                    <span>${item.quantity}</span>
                    <button type="button" onclick="changeCartQuantity(${index}, 1)">+</button>
                </div>
            </div>
            <div class="cart-item-price" style="font-weight:bold;">
                ₹${(item.price * item.quantity).toFixed(2)}
            </div>
        </div>
    `).join("");

    updateCartTotal();
}

function updateCartTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalElement = document.querySelector(".cart-total-row strong, .cart-total, #cartTotal");

    if (totalElement) {
        totalElement.textContent = `₹${total.toFixed(2)}`;
    }

    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const summary = document.querySelector(".cart-summary span:last-child");

    if (summary) {
        summary.textContent = `${itemCount} item${itemCount !== 1 ? "s" : ""}`;
    }
}

function openCart() {
    const sidebar = document.querySelector(".cart-sidebar, .cart-drawer");
    const overlay = document.querySelector(".overlay");

    if (sidebar) sidebar.classList.add("active");
    if (overlay) overlay.classList.add("active");
    document.body.classList.add("no-scroll");
}
window.openCart = openCart;

function closeCart() {
    const sidebar = document.querySelector(".cart-sidebar, .cart-drawer");
    const overlay = document.querySelector(".overlay");

    if (sidebar) sidebar.classList.remove("active");
    if (overlay && !document.querySelector(".nav.open")) {
        overlay.classList.remove("active");
    }
    document.body.classList.remove("no-scroll");
}
window.closeCart = closeCart;

/* =========================================================
   4. WHATSAPP ORDER WITH NUMBER 8009174690
   ========================================================= */

function sendWhatsAppOrder() {
    if (!cart.length) {
        showToast("Cart abhi empty hai");
        return;
    }

    let message = "🩺 *UBAID MEDICAL STORE*%0A%0A";
    message += "📦 *Order Details:*%0A";

    cart.forEach(item => {
        message += `• ${encodeURIComponent(item.name)} × ${item.quantity} = ₹${(item.price * item.quantity).toFixed(2)}%0A`;
    });

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    message += `%0A💰 *Total: ₹${total.toFixed(2)}*%0A%0A`;
    message += "Please confirm my order.";

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
}

/* =========================================================
   5. BUTTON CLICK BINDINGS (ALL THEME/WHATSAPP BUTTONS)
   ========================================================= */

function initButtons() {
    // Theme toggle bind for any element
    document.addEventListener("click", (e) => {
        if (e.target.closest("#themeToggle, .theme-btn, .theme-toggle, [data-theme-toggle]")) {
            toggleTheme();
        }

        if (e.target.closest(".whatsapp-order-btn, .checkout-whatsapp, #whatsappOrder")) {
            sendWhatsAppOrder();
        }
    });
}

/* =========================================================
   6. SEARCH & FILTERS
   ========================================================= */

function initSearch() {
    const searchInputs = document.querySelectorAll("#searchInput, #mobileSearchInput, #mainSearchInput, .search-input");

    searchInputs.forEach(input => {
        input.addEventListener("input", () => {
            filterProducts(input.value.trim().toLowerCase());
        });
    });
}

function filterProducts(searchTerm) {
    const products = document.querySelectorAll(".product-card, .medicine-card");
    let visibleCount = 0;

    products.forEach(product => {
        const text = product.innerText.toLowerCase();
        const match = !searchTerm || text.includes(searchTerm);
        product.style.display = match ? "" : "none";
        if (match) visibleCount++;
    });

    updateMedicineResult(visibleCount);
}

function updateMedicineResult(count) {
    const result = document.querySelector(".medicine-result");
    if (result) {
        result.innerHTML = `<i class="fa-solid fa-pills"></i> <span>${count} products found</span>`;
    }
}

function initProductFilter() {
    const select = document.querySelector(".medicine-filter select");
    if (!select) return;

    select.addEventListener("change", () => {
        const value = select.value.trim().toLowerCase();
        const products = document.querySelectorAll(".product-card, .medicine-card");
        let count = 0;

        products.forEach(product => {
            const category = product.querySelector(".product-category")?.textContent?.trim().toLowerCase() || "";
            const name = product.querySelector("h3")?.textContent?.trim().toLowerCase() || "";
            const match = value === "all" || value === "" || category.includes(value) || name.includes(value);

            product.style.display = match ? "" : "none";
            if (match) count++;
        });

        updateMedicineResult(count);
    });
}

function initCategoryCards() {
    document.querySelectorAll(".category-card").forEach(card => {
        card.addEventListener("click", () => {
            const title = card.querySelector("h3")?.textContent?.trim();
            if (!title) return;

            filterProducts(title.toLowerCase());
            const medicineSection = document.querySelector("#medicines");
            if (medicineSection) {
                medicineSection.scrollIntoView({ behavior: "smooth" });
            }
        });
    });
}

/* =========================================================
   7. NAVIGATION & SCROLL TRACKING
   ========================================================= */

function initNavigation() {
    document.querySelectorAll(".nav-links a").forEach(link => {
        link.addEventListener("click", () => {
            document.querySelectorAll(".nav-links a").forEach(item => item.classList.remove("active"));
            link.classList.add("active");
        });
    });
}

function initScrollEffects() {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-links a");

    if (!sections.length) return;

    window.addEventListener("scroll", () => {
        let current = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 130;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${current}`) {
                link.classList.add("active");
            }
        });
    });
}

/* =========================================================
   8. EXTRA UI HELPERS
   ========================================================= */

function initRating() {
    const ratingButtons = document.querySelectorAll(".rating-input button");
    ratingButtons.forEach((button, index) => {
        button.addEventListener("click", () => {
            selectedRating = index + 1;
            ratingButtons.forEach((btn, i) => {
                btn.classList.toggle("active", i < selectedRating);
            });
        });
    });
}

function initProfileDropdown() {
    const profileGroup = document.querySelector(".user-profile-group");
    const profileButton = document.querySelector(".profile-btn");
    if (!profileGroup || !profileButton) return;

    profileButton.addEventListener("click", (e) => {
        e.stopPropagation();
        profileGroup.classList.toggle("open");
    });

    document.addEventListener("click", (e) => {
        if (!profileGroup.contains(e.target)) {
            profileGroup.classList.remove("open");
        }
    });
}

function initAuthButtons() {
    document.querySelectorAll(".account-btn").forEach(button => {
        button.addEventListener("click", (e) => {
            e.preventDefault();
            showToast("Login system baad me activate hoga");
        });
    });
}

function initReviewForm() {
    const form = document.querySelector(".review-form-card form");
    if (!form) return;
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        showToast("Reviews system baad me activate hoga");
    });
}

function initProfileModal() {
    const modal = document.querySelector(".profile-modal");
    if (!modal) return;

    const closeButton = modal.querySelector(".close-btn");
    if (closeButton) {
        closeButton.addEventListener("click", () => modal.classList.remove("active"));
    }
    modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.classList.remove("active");
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

function initForms() {
    document.querySelectorAll("form").forEach(form => {
        if (form.classList.contains("review-form")) return;
        form.addEventListener("submit", (e) => {
            const action = form.getAttribute("action");
            if (!action || action === "#") {
                e.preventDefault();
                showToast("Form submitted successfully");
            }
        });
    });
}

function initContactButtons() {}
function initWhatsAppLinks() {}

function initBackToTop() {
    const button = document.querySelector(".back-to-top");
    if (!button) return;

    window.addEventListener("scroll", () => {
        if (window.scrollY > 500) {
            button.classList.add("show");
        } else {
            button.classList.remove("show");
        }
    });

    button.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

function initImages() {
    document.querySelectorAll("img").forEach(img => {
        if (!img.hasAttribute("loading")) {
            img.setAttribute("loading", "lazy");
        }
    });
}

function initNetworkStatus() {
    window.addEventListener("online", () => showToast("Internet connection restored"));
    window.addEventListener("offline", () => showToast("Internet connection lost"));
}

function showToast(message) {
    const toast = document.querySelector(".toast");
    if (!toast) return;

    const text = toast.querySelector("span");
    if (text) {
        text.textContent = message;
    } else {
        toast.textContent = message;
    }

    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}
window.showToast = showToast;

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

/* =========================================================
   GLOBAL OBJECT EXPORT
   ========================================================= */

window.UbaidMedicalStore = {
    cart,
    addToCart,
    openCart,
    closeCart,
    showToast,
    toggleTheme
};

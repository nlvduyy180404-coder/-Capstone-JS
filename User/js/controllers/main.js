import Product from '../models/Product.js';
import CartItem from '../models/CartItem.js';
import Cart from '../models/Cart.js';

// Global state
let productList = [];
let gioHang = new Cart();

// DOM Elements
const productContainer = document.getElementById('product-container');
const filterSelect = document.getElementById('filter-select');
const cartModal = document.getElementById('cart-modal');
const cartOverlay = document.getElementById('cart-overlay');
const cartToggleBtn = document.getElementById('cart-toggle-btn');
const closeCartBtn = document.getElementById('close-cart-btn');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartCountBadge = document.getElementById('cart-count-badge');
const cartTotalEl = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');

// Initialize
const init = async () => {
    loadCartFromLocal();
    await fetchProducts();
    renderProducts(productList);
    renderCart();
};

// Fetch API
const fetchProducts = async () => {
    try {
        const response = await axios({
            url: 'https://6a1a8feebc2f944754925dd6.mockapi.io/Products',
            method: 'GET'
        });
        productList = response.data.map(item => new Product(
            item.id,
            item.name,
            item.price,
            item.screen,
            item.backCamera,
            item.frontCamera,
            item.img,
            item.desc,
            item.type
        ));
    } catch (error) {
        console.error('Error fetching products:', error);
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Failed to load products. Please check your connection.',
        });
    }
};

// Render Products
const renderProducts = (products) => {
    if (!productContainer) return;
    
    let html = '';
    
    products.forEach((product, index) => {
        // Dynamic fallback image based on type
        const isSamsung = product.type.toLowerCase().includes('samsung');
        const fallbackImage = isSamsung 
            ? 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=600&auto=format&fit=crop' // Samsung-like Android phone
            : 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600&auto=format&fit=crop'; // iPhone
            
        const delay = (index % 4) * 100; // Staggered animation
        html += `
            <div class="product-card flex flex-col group" data-aos="fade-up" data-aos-delay="${delay}">
                <div class="product-img-wrapper h-56 flex justify-center items-center">
                    <img src="${product.img}" onerror="this.onerror=null;this.src='${fallbackImage}';" alt="${product.name}" class="product-img h-full w-full object-contain drop-shadow-md">
                </div>
                <div class="p-5 flex-grow flex flex-col justify-between bg-white">
                    <div>
                        <div class="mb-3 flex justify-between items-start">
                            <h3 class="text-lg font-bold text-gray-800 line-clamp-1" title="${product.name}">${product.name}</h3>
                            <span class="bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">${product.type}</span>
                        </div>
                        <p class="text-gray-500 text-sm mb-4 line-clamp-2">${product.desc}</p>
                        <div class="text-xs text-gray-500 space-y-2 mb-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
                            <p class="flex items-center"><i class="fa-solid fa-mobile-screen w-5 text-indigo-400"></i><span class="truncate">${product.screen}</span></p>
                            <p class="flex items-center"><i class="fa-solid fa-camera w-5 text-indigo-400"></i><span class="truncate">${product.backCamera}</span></p>
                            <p class="flex items-center"><i class="fa-solid fa-camera-rotate w-5 text-indigo-400"></i><span class="truncate">${product.frontCamera}</span></p>
                        </div>
                    </div>
                    <div class="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                        <span class="text-2xl font-black text-gray-900 tracking-tight">$${Number(product.price).toLocaleString()}</span>
                        <button onclick="window.addToCart('${product.id}')" class="text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transform transition hover:-translate-y-0.5 focus:ring-4 focus:ring-blue-300 font-medium rounded-xl text-sm px-5 py-2.5 focus:outline-none flex items-center gap-2">
                            Add <i class="fa-solid fa-cart-plus"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    productContainer.innerHTML = html;
};

// Filter logic (Select dropdown)
if (filterSelect) {
    filterSelect.addEventListener('change', (e) => {
        const type = e.target.value;
        if (type === 'all') {
            renderProducts(productList);
        } else {
            const filteredList = productList.filter(item => item.type.toLowerCase() === type.toLowerCase());
            renderProducts(filteredList);
        }
    });
}

// Cart UI toggle
const toggleCart = () => {
    cartModal.classList.toggle('open');
    cartOverlay.classList.toggle('open');
    document.body.classList.toggle('cart-open');
};

if (cartToggleBtn) cartToggleBtn.addEventListener('click', toggleCart);
if (closeCartBtn) closeCartBtn.addEventListener('click', toggleCart);
if (cartOverlay) cartOverlay.addEventListener('click', toggleCart);

// Global addToCart
window.addToCart = (productId) => {
    // Find product in list
    const product = productList.find(p => p.id === productId);
    if (!product) return;

    const cartItem = new CartItem(product, 1);
    gioHang.themGH(cartItem);
    
    saveCartToLocal();
    renderCart();
    
    // Toast notification
    Swal.fire({
        toast: true,
        position: 'bottom-end',
        icon: 'success',
        title: 'Added to cart',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true
    });
};

// Update Quantity
window.updateQuantity = (productId, change) => {
    gioHang.capNhatSoLuong(productId, change);
    saveCartToLocal();
    renderCart();
};

// Remove Item
window.removeItem = (productId) => {
    gioHang.xoaGH(productId);
    saveCartToLocal();
    renderCart();
};

// Render Cart
const renderCart = () => {
    if (!cartItemsContainer) return;
    
    let html = '';
    let totalItems = 0;
    let totalPrice = 0;
    
    gioHang.mangGioHang.forEach(item => {
        const itemTotal = item.product.price * item.quantity;
        totalItems += item.quantity;
        totalPrice += itemTotal;
        
        // Dynamic fallback image based on type
        const isSamsung = item.product.type.toLowerCase().includes('samsung');
        const fallbackImage = isSamsung 
            ? 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=600&auto=format&fit=crop' 
            : 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600&auto=format&fit=crop';
            
        html += `
            <tr class="bg-white border-b hover:bg-gray-50 transition-colors">
                <td class="px-2 py-3">
                    <div class="flex items-center gap-3">
                        <div class="bg-gray-50 rounded-lg p-1 w-12 h-12 flex-shrink-0 flex items-center justify-center border border-gray-100">
                            <img src="${item.product.img}" onerror="this.onerror=null;this.src='${fallbackImage}';" alt="${item.product.name}" class="max-h-full max-w-full object-contain">
                        </div>
                        <div>
                            <h4 class="text-xs font-bold text-gray-800 line-clamp-2" title="${item.product.name}">${item.product.name}</h4>
                            <p class="text-xs font-semibold text-indigo-600 mt-1">$${Number(item.product.price).toLocaleString()}</p>
                        </div>
                    </div>
                </td>
                <td class="px-2 py-3 text-center">
                    <div class="inline-flex items-center bg-gray-100 rounded-lg p-0.5 border border-gray-200">
                        <button onclick="window.updateQuantity('${item.product.id}', -1)" class="w-6 h-6 flex items-center justify-center text-gray-700 hover:bg-white hover:shadow-sm rounded focus:outline-none transition-all">-</button>
                        <span class="w-6 text-center text-xs font-bold text-gray-800">${item.quantity}</span>
                        <button onclick="window.updateQuantity('${item.product.id}', 1)" class="w-6 h-6 flex items-center justify-center text-gray-700 hover:bg-white hover:shadow-sm rounded focus:outline-none transition-all">+</button>
                    </div>
                </td>
                <td class="px-2 py-3 text-right">
                    <button onclick="window.removeItem('${item.product.id}')" class="text-gray-400 hover:text-red-500 focus:outline-none transition-colors p-1">
                        <i class="fa-solid fa-trash-can text-sm"></i>
                    </button>
                </td>
            </tr>
        `;
    });
    
    if (gioHang.mangGioHang.length === 0) {
        html = `
            <tr>
                <td colspan="3" class="px-4 py-10">
                    <div class="flex flex-col items-center justify-center text-gray-400 text-center">
                        <div class="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                            <i class="fa-solid fa-cart-shopping text-2xl text-gray-300"></i>
                        </div>
                        <h3 class="text-sm font-bold text-gray-700 mb-1">Your cart is empty</h3>
                        <p class="text-xs text-gray-500">Add some products to see them here.</p>
                    </div>
                </td>
            </tr>
        `;
    }
    
    cartItemsContainer.innerHTML = html;
    
    if (cartCountBadge) {
        cartCountBadge.innerText = totalItems;
        // Pulse animation when updated
        cartCountBadge.classList.remove('animate-ping');
        void cartCountBadge.offsetWidth; // trigger reflow
        if(totalItems > 0) cartCountBadge.classList.add('animate-pulse');
    }
    
    if (cartTotalEl) cartTotalEl.innerText = `$${Number(totalPrice).toLocaleString()}`;
};

// Checkout
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        if (gioHang.mangGioHang.length === 0) {
            Swal.fire({
                icon: 'info',
                title: 'Cart is empty',
                text: 'Please add some products before checking out.',
            });
            return;
        }
        
        // Process checkout
        Swal.fire({
            icon: 'success',
            title: 'Payment Successful!',
            text: 'Thank you for your purchase. Your order is being processed.',
            confirmButtonColor: '#4f46e5'
        }).then(() => {
            // Clear cart
            gioHang.mangGioHang = [];
            saveCartToLocal();
            renderCart();
            toggleCart();
        });
    });
}

// Local Storage Helpers
const saveCartToLocal = () => {
    localStorage.setItem('shoppingCart', JSON.stringify(gioHang.mangGioHang));
};

const loadCartFromLocal = () => {
    const savedCart = localStorage.getItem('shoppingCart');
    if (savedCart) {
        try {
            const parsed = JSON.parse(savedCart);
            gioHang.mangGioHang = parsed.map(item => {
                const p = new Product(item.product.id, item.product.name, item.product.price, item.product.screen, item.product.backCamera, item.product.frontCamera, item.product.img, item.product.desc, item.product.type);
                return new CartItem(p, item.quantity);
            });
        } catch (e) {
            console.error('Error parsing cart from localStorage', e);
            gioHang.mangGioHang = [];
        }
    }
};

// Run app
init();

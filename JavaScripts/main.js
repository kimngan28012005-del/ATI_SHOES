/**
 * ShoeMart AI - Main JavaScript Application
 * Handles page initialization, navigation, and core functionality
 */

// Global application state
const App = {
    currentPage: 'home',
    isLoading: false,
    cart: JSON.parse(localStorage.getItem('shoemart_cart')) || [],
    products: [],
    categories: [],
    brands: []
};

// DOM Elements
const DOM = {
    loadingOverlay: null,
    cartCount: null,
    searchInput: null,
    featuredProducts: null,
    categoriesSection: null,
    chatFloatBtn: null,
    startChatBtn: null
};

// Utility functions
const Utils = {
    formatPrice: (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    },

    formatNumber: (num) => {
        return new Intl.NumberFormat('vi-VN').format(num);
    },

    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    showLoading: () => {
        if (DOM.loadingOverlay) {
            DOM.loadingOverlay.classList.add('show');
        }
        App.isLoading = true;
    },

    hideLoading: () => {
        if (DOM.loadingOverlay) {
            DOM.loadingOverlay.classList.remove('show');
        }
        App.isLoading = false;
    },

    showToast: (message, type = 'success') => {
        // Create toast element if it doesn't exist
        let toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toastContainer';
            toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
            toastContainer.style.zIndex = '9999';
            document.body.appendChild(toastContainer);
        }

        const toastId = 'toast_' + Date.now();
        const bgClass = type === 'success' ? 'bg-success' : 
                       type === 'error' ? 'bg-danger' : 
                       type === 'warning' ? 'bg-warning' : 'bg-info';

        const toastHTML = `
            <div id="${toastId}" class="toast ${bgClass} text-white" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header ${bgClass} text-white border-0">
                    <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'} me-2"></i>
                    <strong class="me-auto">ShoeMart AI</strong>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
                </div>
                <div class="toast-body">
                    ${message}
                </div>
            </div>
        `;

        toastContainer.insertAdjacentHTML('beforeend', toastHTML);
        
        const toastElement = document.getElementById(toastId);
        const toast = new bootstrap.Toast(toastElement, {
            autohide: true,
            delay: 3000
        });
        
        toast.show();
        
        // Remove toast element after it's hidden
        toastElement.addEventListener('hidden.bs.toast', () => {
            toastElement.remove();
        });
    },

    getURLParams: () => {
        const params = new URLSearchParams(window.location.search);
        const result = {};
        for (const [key, value] of params) {
            result[key] = value;
        }
        return result;
    },

    updateURL: (params) => {
        const url = new URL(window.location);
        Object.keys(params).forEach(key => {
            if (params[key]) {
                url.searchParams.set(key, params[key]);
            } else {
                url.searchParams.delete(key);
            }
        });
        window.history.pushState({}, '', url);
    }
};

// Data loading functions
const DataLoader = {
    async loadProducts() {
        try {
            Utils.showLoading();
            
            // In production, this would be an API call
            // For demo purposes, we'll load from local JSON file
            const response = await fetch('products.json');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            App.products = data.products || [];
            App.categories = data.categories || [];
            App.brands = data.brands || [];
            
            console.log('Products loaded:', App.products.length);
            console.log('Categories loaded:', App.categories.length);
            console.log('Brands loaded:', App.brands.length);
            
            return data;
        } catch (error) {
            console.error('Error loading products:', error);
            Utils.showToast('Lỗi khi tải dữ liệu sản phẩm', 'error');
            return { products: [], categories: [], brands: [] };
        } finally {
            Utils.hideLoading();
        }
    },

    getProductById(id) {
        return App.products.find(product => product.id == id);
    },

    getProductsByCategory(category) {
        if (!category) return App.products;
        return App.products.filter(product => product.category === category);
    },

    getProductsByBrand(brand) {
        if (!brand) return App.products;
        return App.products.filter(product => product.brand.toLowerCase() === brand.toLowerCase());
    },

    getFeaturedProducts(limit = 4) {
        // Return products with high ratings and discount
        return App.products
            .filter(product => product.rating >= 4.0 || product.discount > 0)
            .slice(0, limit);
    },

    searchProducts(query) {
        if (!query) return App.products;
        
        const searchTerm = query.toLowerCase();
        return App.products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.brand.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
        );
    }
};

// UI Rendering functions
const UI = {
    renderProductCard(product, container = null) {
        const discountBadge = product.discount > 0 ? 
            `<div class="product-badge sale">-${product.discount}%</div>` : '';
        
        const originalPriceHTML = product.discount > 0 ? 
            `<span class="price-original">${Utils.formatPrice(product.originalPrice)}</span>` : '';
        
        const discountHTML = product.discount > 0 ? 
            `<span class="price-discount">-${product.discount}%</span>` : '';

        const ratingStars = '★'.repeat(Math.floor(product.rating)) + 
                           (product.rating % 1 >= 0.5 ? '☆' : '') + 
                           '☆'.repeat(5 - Math.ceil(product.rating));

        const cardHTML = `
            <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
                <div class="product-card fade-in">
                    <div class="product-image">
                        ${discountBadge}
                        <button class="product-wishlist" data-product-id="${product.id}">
                            <i class="far fa-heart"></i>
                        </button>
                        <img src="${product.images[0]}" alt="${product.name}" 
                             onerror="this.src='https://via.placeholder.com/250x250?text=No+Image'"
                             loading="lazy">
                    </div>
                    <div class="product-info">
                        <div class="product-brand">${product.brand}</div>
                        <h5><a href="product-detail.html?id=${product.id}" class="product-title">${product.name}</a></h5>
                        <div class="product-price">
                            <span class="price-current">${Utils.formatPrice(product.price)}</span>
                            ${originalPriceHTML}
                            ${discountHTML}
                        </div>
                        <div class="product-rating">
                            <span class="rating-stars">${ratingStars}</span>
                            <span class="rating-count">(${product.reviewCount || 0})</span>
                        </div>
                        <div class="product-actions">
                            <button class="btn-add-cart" data-product-id="${product.id}">
                                <i class="fas fa-cart-plus me-2"></i>Thêm vào giỏ
                            </button>
                            <button class="btn-quick-view" data-product-id="${product.id}">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        if (container) {
            container.insertAdjacentHTML('beforeend', cardHTML);
        }
        
        return cardHTML;
    },

    renderCategoryCard(category, container = null) {
        const gradients = [
            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
        ];
        
        const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];
        
        const icons = {
            sneakers: 'fas fa-running',
            running: 'fas fa-shoe-prints',
            casual: 'fas fa-walking',
            skateboard: 'fas fa-skating',
            lifestyle: 'fas fa-heart'
        };

        const cardHTML = `
            <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
                <a href="shop.html?category=${category.id}" class="category-card bounce-in">
                    <div class="category-image" style="background: ${randomGradient}">
                        <div class="category-icon">
                            <i class="${icons[category.id] || 'fas fa-shoe-prints'}"></i>
                        </div>
                    </div>
                    <div class="category-info">
                        <h5 class="category-title">${category.name}</h5>
                        <p class="category-description">${category.description}</p>
                    </div>
                </a>
            </div>
        `;

        if (container) {
            container.insertAdjacentHTML('beforeend', cardHTML);
        }
        
        return cardHTML;
    },

    updateCartCount() {
        const totalItems = App.cart.reduce((sum, item) => sum + item.quantity, 0);
        if (DOM.cartCount) {
            DOM.cartCount.textContent = totalItems;
            if (totalItems > 0) {
                DOM.cartCount.style.display = 'inline-block';
            } else {
                DOM.cartCount.style.display = 'none';
            }
        }
    }
};

// Cart management
const Cart = {
    addItem(productId, quantity = 1, size = null, color = null) {
        const product = DataLoader.getProductById(productId);
        if (!product) {
            Utils.showToast('Không tìm thấy sản phẩm', 'error');
            return false;
        }

        // Check if item already exists in cart
        const existingItemIndex = App.cart.findIndex(item => 
            item.id == productId && 
            item.size === size && 
            item.color === color
        );

        if (existingItemIndex > -1) {
            // Update quantity
            App.cart[existingItemIndex].quantity += quantity;
        } else {
            // Add new item
            App.cart.push({
                id: productId,
                name: product.name,
                brand: product.brand,
                price: product.price,
                image: product.images[0],
                quantity: quantity,
                size: size,
                color: color
            });
        }

        // Save to localStorage
        localStorage.setItem('shoemart_cart', JSON.stringify(App.cart));
        
        // Update UI
        UI.updateCartCount();
        Utils.showToast(`Đã thêm "${product.name}" vào giỏ hàng`, 'success');
        
        return true;
    },

    removeItem(productId, size = null, color = null) {
        const initialLength = App.cart.length;
        App.cart = App.cart.filter(item => 
            !(item.id == productId && item.size === size && item.color === color)
        );

        if (App.cart.length < initialLength) {
            localStorage.setItem('shoemart_cart', JSON.stringify(App.cart));
            UI.updateCartCount();
            Utils.showToast('Đã xóa sản phẩm khỏi giỏ hàng', 'success');
            return true;
        }
        return false;
    },

    updateQuantity(productId, newQuantity, size = null, color = null) {
        const itemIndex = App.cart.findIndex(item => 
            item.id == productId && item.size === size && item.color === color
        );

        if (itemIndex > -1) {
            if (newQuantity <= 0) {
                return Cart.removeItem(productId, size, color);
            } else {
                App.cart[itemIndex].quantity = newQuantity;
                localStorage.setItem('shoemart_cart', JSON.stringify(App.cart));
                UI.updateCartCount();
                return true;
            }
        }
        return false;
    },

    getTotal() {
        return App.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    },

    getItemCount() {
        return App.cart.reduce((count, item) => count + item.quantity, 0);
    },

    clear() {
        App.cart = [];
        localStorage.removeItem('shoemart_cart');
        UI.updateCartCount();
        Utils.showToast('Đã xóa tất cả sản phẩm khỏi giỏ hàng', 'info');
    }
};

// Search functionality
const Search = {
    init() {
        if (DOM.searchInput) {
            // Create debounced search function
            const debouncedSearch = Utils.debounce((query) => {
                if (query.length >= 2) {
                    Search.performSearch(query);
                }
            }, 300);

            DOM.searchInput.addEventListener('input', (e) => {
                const query = e.target.value.trim();
                debouncedSearch(query);
            });

            // Handle search form submission
            const searchForm = DOM.searchInput.closest('form');
            if (searchForm) {
                searchForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const query = DOM.searchInput.value.trim();
                    if (query) {
                        Search.redirectToShop(query);
                    }
                });
            }
        }
    },

    performSearch(query) {
        // This would typically show a dropdown with search results
        console.log('Searching for:', query);
        // For now, we'll just log the results
        const results = DataLoader.searchProducts(query);
        console.log('Search results:', results);
    },

    redirectToShop(query) {
        window.location.href = `shop.html?search=${encodeURIComponent(query)}`;
    }
};

// Page-specific initialization
const PageInit = {
    home() {
        console.log('Initializing home page...');
        
        // Load and display featured products
        if (DOM.featuredProducts) {
            const featuredProducts = DataLoader.getFeaturedProducts(4);
            DOM.featuredProducts.innerHTML = '';
            
            if (featuredProducts.length > 0) {
                featuredProducts.forEach(product => {
                    UI.renderProductCard(product, DOM.featuredProducts);
                });
            } else {
                DOM.featuredProducts.innerHTML = `
                    <div class="col-12 text-center">
                        <p class="text-muted">Không có sản phẩm nào để hiển thị.</p>
                    </div>
                `;
            }
        }

        // Load and display categories
        if (DOM.categoriesSection) {
            DOM.categoriesSection.innerHTML = '';
            
            if (App.categories.length > 0) {
                App.categories.forEach(category => {
                    UI.renderCategoryCard(category, DOM.categoriesSection);
                });
            } else {
                DOM.categoriesSection.innerHTML = `
                    <div class="col-12 text-center">
                        <p class="text-muted">Không có danh mục nào để hiển thị.</p>
                    </div>
                `;
            }
        }

        // Initialize hero carousel auto-play
        const heroCarousel = document.getElementById('heroCarousel');
        if (heroCarousel) {
            const carousel = new bootstrap.Carousel(heroCarousel, {
                interval: 5000,
                wrap: true,
                pause: 'hover'
            });
        }
    },

    shop() {
        console.log('Initializing shop page...');
        // Shop page initialization will be handled in a separate file
    },

    productDetail() {
        console.log('Initializing product detail page...');
        // Product detail initialization will be handled in a separate file
    },

    cart() {
        console.log('Initializing cart page...');
        // Cart page initialization will be handled in a separate file
    }
};

// Event handlers
const Events = {
    init() {
        // Add to cart buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.btn-add-cart')) {
                e.preventDefault();
                const button = e.target.closest('.btn-add-cart');
                const productId = button.getAttribute('data-product-id');
                
                if (productId) {
                    // For now, add with default options
                    // In product detail page, we'll get size and color
                    Cart.addItem(productId, 1);
                    
                    // Add visual feedback
                    button.innerHTML = '<i class="fas fa-check me-2"></i>Đã thêm';
                    button.disabled = true;
                    
                    setTimeout(() => {
                        button.innerHTML = '<i class="fas fa-cart-plus me-2"></i>Thêm vào giỏ';
                        button.disabled = false;
                    }, 2000);
                }
            }
        });

        // Wishlist buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.product-wishlist')) {
                e.preventDefault();
                const button = e.target.closest('.product-wishlist');
                const icon = button.querySelector('i');
                
                if (icon.classList.contains('far')) {
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                    icon.style.color = '#dc3545';
                    Utils.showToast('Đã thêm vào danh sách yêu thích', 'success');
                } else {
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                    icon.style.color = '';
                    Utils.showToast('Đã xóa khỏi danh sách yêu thích', 'info');
                }
            }
        });

        // Quick view buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.btn-quick-view')) {
                e.preventDefault();
                const button = e.target.closest('.btn-quick-view');
                const productId = button.getAttribute('data-product-id');
                
                if (productId) {
                    window.location.href = `product-detail.html?id=${productId}`;
                }
            }
        });

        // Newsletter form
        const newsletterForms = document.querySelectorAll('form');
        newsletterForms.forEach(form => {
            form.addEventListener('submit', (e) => {
                if (form.querySelector('input[type="email"]')) {
                    e.preventDefault();
                    const email = form.querySelector('input[type="email"]').value;
                    Utils.showToast(`Cảm ơn bạn đã đăng ký! Chúng tôi sẽ gửi thông tin khuyến mãi đến ${email}`, 'success');
                    form.reset();
                }
            });
        });

        // Chat buttons
        if (DOM.startChatBtn) {
            DOM.startChatBtn.addEventListener('click', () => {
                if (window.AIChatbot) {
                    window.AIChatbot.show();
                }
            });
        }

        if (DOM.chatFloatBtn) {
            DOM.chatFloatBtn.addEventListener('click', () => {
                if (window.AIChatbot) {
                    window.AIChatbot.toggle();
                }
            });
        }
    }
};

// Main initialization
const init = async () => {
    console.log('Initializing ShoeMart AI application...');

    // Get DOM elements
    DOM.loadingOverlay = document.getElementById('loadingOverlay');
    DOM.cartCount = document.getElementById('cartCount');
    DOM.searchInput = document.getElementById('searchInput');
    DOM.featuredProducts = document.getElementById('featuredProducts');
    DOM.categoriesSection = document.getElementById('categoriesSection');
    DOM.chatFloatBtn = document.getElementById('chatFloatBtn');
    DOM.startChatBtn = document.getElementById('startChatBtn');

    // Load initial data
    await DataLoader.loadProducts();

    // Initialize cart count
    UI.updateCartCount();

    // Initialize search
    Search.init();

    // Initialize events
    Events.init();

    // Determine current page and initialize accordingly
    const path = window.location.pathname;
    const page = path.split('/').pop().replace('.html', '') || 'index';
    
    switch (page) {
        case 'index':
        case '':
            App.currentPage = 'home';
            PageInit.home();
            break;
        case 'shop':
            App.currentPage = 'shop';
            PageInit.shop();
            break;
        case 'product-detail':
            App.currentPage = 'product-detail';
            PageInit.productDetail();
            break;
        case 'cart':
            App.currentPage = 'cart';
            PageInit.cart();
            break;
    }

    console.log('Application initialized successfully');
    
    // Hide loading after a short delay for better UX
    setTimeout(() => {
        Utils.hideLoading();
    }, 500);
};

// Start application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Export globals for other scripts to use
window.App = App;
window.Utils = Utils;
window.DataLoader = DataLoader;
window.UI = UI;
window.Cart = Cart;
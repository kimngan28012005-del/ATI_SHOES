// ShoeMart AI - Main JavaScript File
// Production Ready - Optimized Version

// ===== API CONFIGURATION =====
const GEMINI_API_KEY = 'AIzaSyDbMkY5fOk3_XfBIy2CJy42ViyLuLEHpUk';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

// ===== PRODUCT DATA =====
const products = [
  {
    id: 1,
    name: 'Nike Air Max 90',
    brand: 'Nike',
    price: 2990000,
    originalPrice: 3490000,
    discount: 14,
    category: 'sneakers',
    gender: 'unisex',
    colors: ['white', 'black', 'red'],
    sizes: ['38', '39', '40', '41', '42', '43', '44'],
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop'
    ],
    description: 'Nike Air Max 90 với thiết kế iconic và công nghệ đệm Air Max mang lại sự thoải mái tuyệt vời cho mọi bước chân.',
    features: [
      'Công nghệ đệm Air Max',
      'Upper da tổng hợp bền bỉ',
      'Đế cao su chống trượt',
      'Phù hợp mọi hoạt động'
    ],
    inStock: true,
    stockCount: 25,
    rating: 4.5,
    reviewCount: 128
  },
  {
    id: 2,
    name: 'Adidas Ultraboost 22',
    brand: 'Adidas',
    price: 4200000,
    originalPrice: 4690000,
    discount: 10,
    category: 'running',
    gender: 'unisex',
    colors: ['white', 'black', 'blue'],
    sizes: ['38', '39', '40', '41', '42', '43', '44', '45'],
    images: [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=300&fit=crop'
    ],
    description: 'Adidas Ultraboost 22 với công nghệ Boost độc quyền và upper Primeknit thoáng khí, hoàn hảo cho chạy bộ.',
    features: [
      'Đế Boost trả năng lượng',
      'Upper Primeknit thoáng khí',
      'Continental Rubber outsole',
      'Torsion System hỗ trợ vòm chân'
    ],
    inStock: true,
    stockCount: 15,
    rating: 4.7,
    reviewCount: 89
  },
  {
    id: 3,
    name: 'Converse Chuck Taylor All Star',
    brand: 'Converse',
    price: 1590000,
    originalPrice: 1590000,
    discount: 0,
    category: 'casual',
    gender: 'unisex',
    colors: ['white', 'black', 'red', 'navy'],
    sizes: ['36', '37', '38', '39', '40', '41', '42', '43'],
    images: [
      'https://images.unsplash.com/photo-1539185441755-769473a23570?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=400&h=300&fit=crop'
    ],
    description: 'Converse Chuck Taylor All Star - biểu tượng bất tử của thế giới giày thể thao với thiết kế classic timeless.',
    features: [
      'Thiết kế iconic từ 1957',
      'Upper canvas bền bỉ',
      'Đế cao su vulcanized',
      'Dễ phối đồ mọi phong cách'
    ],
    inStock: true,
    stockCount: 35,
    rating: 4.3,
    reviewCount: 245
  },
  {
    id: 4,
    name: 'Vans Old Skool',
    brand: 'Vans',
    price: 1890000,
    originalPrice: 2190000,
    discount: 14,
    category: 'skateboard',
    gender: 'unisex',
    colors: ['black', 'white', 'checkerboard'],
    sizes: ['36', '37', '38', '39', '40', '41', '42', '43', '44'],
    images: [
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=400&h=300&fit=crop'
    ],
    description: 'Vans Old Skool với side stripe đặc trưng, được yêu thích bởi cộng đồng skateboard và streetwear trên toàn thế giới.',
    features: [
      'Side stripe iconic',
      'Đế waffle grip tuyệt vời',
      'Upper canvas + suede',
      'Phù hợp skateboard và casual'
    ],
    inStock: true,
    stockCount: 20,
    rating: 4.4,
    reviewCount: 156
  },
  {
    id: 5,
    name: 'New Balance 574',
    brand: 'New Balance',
    price: 2390000,
    originalPrice: 2790000,
    discount: 14,
    category: 'lifestyle',
    gender: 'unisex',
    colors: ['grey', 'navy', 'burgundy'],
    sizes: ['38', '39', '40', '41', '42', '43', '44'],
    images: [
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=300&fit=crop'
    ],
    description: 'New Balance 574 - sự kết hợp hoàn hảo giữa heritage styling và công nghệ hiện đại cho sự thoải mái cả ngày.',
    features: [
      'ENCAP midsole technology',
      'Upper da lộn premium',
      'Đế cao su bền bỉ',
      'Comfort collar và lưỡi gà'
    ],
    inStock: true,
    stockCount: 18,
    rating: 4.2,
    reviewCount: 92
  },
  {
    id: 6,
    name: 'Puma RS-X',
    brand: 'Puma',
    price: 3190000,
    originalPrice: 3590000,
    discount: 11,
    category: 'sneakers',
    gender: 'unisex',
    colors: ['white', 'black', 'multicolor'],
    sizes: ['38', '39', '40', '41', '42', '43', '44'],
    images: [
      'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1604671801908-6f0c6a092c05?w=400&h=300&fit=crop'
    ],
    description: 'Puma RS-X với thiết kế futuristic và công nghệ RS (Running System), mang đến sự kết hợp độc đáo giữa performance và style.',
    features: [
      'RS (Running System) technology',
      'Upper mesh + synthetic',
      'Đế cao su có độ bám cao',
      'Thiết kế chunky trendy'
    ],
    inStock: true,
    stockCount: 12,
    rating: 4.1,
    reviewCount: 67
  }
];

const categories = [
  { id: 'sneakers', name: 'Sneakers', description: 'Giày thể thao phong cách', icon: 'fas fa-running' },
  { id: 'running', name: 'Chạy bộ', description: 'Giày chạy bộ chuyên nghiệp', icon: 'fas fa-bolt' },
  { id: 'casual', name: 'Giày thường', description: 'Giày dành cho mọi ngày', icon: 'fas fa-walking' },
  { id: 'skateboard', name: 'Skateboard', description: 'Giày trượt ván', icon: 'fas fa-skating' },
  { id: 'lifestyle', name: 'Lifestyle', description: 'Giày sinh hoạt thể thao', icon: 'fas fa-heart' }
];

const brands = [
  { id: 'nike', name: 'Nike' },
  { id: 'adidas', name: 'Adidas' },
  { id: 'converse', name: 'Converse' },
  { id: 'vans', name: 'Vans' },
  { id: 'newbalance', name: 'New Balance' },
  { id: 'puma', name: 'Puma' }
];

// ===== APPLICATION STATE =====
let currentPage = 'home';
let filteredProducts = [...products];
let searchQuery = '';
let filters = {
  categories: [],
  brands: [],
  priceRanges: [],
  sizes: [],
  ratings: []
};
let sortBy = 'default';
let viewMode = 'grid';
let currentPageNum = 1;
const itemsPerPage = 6;
let cart = [];
let chatMessages = [];
let isTyping = false;

// ===== UTILITY FUNCTIONS =====
function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function showLoading() {
  const loading = document.getElementById('loadingOverlay');
  if (loading) loading.classList.add('show');
}

function hideLoading() {
  const loading = document.getElementById('loadingOverlay');
  if (loading) loading.classList.remove('show');
}

function showToast(message, type = 'success') {
  const toastContainer = document.getElementById('toastContainer');
  if (!toastContainer) return;

  const toastId = 'toast_' + Date.now();
  const toastHTML = `
    <div id="${toastId}" class="toast toast-${type}">
      <span>${message}</span>
      <button class="toast-close">&times;</button>
    </div>
  `;
  toastContainer.innerHTML += toastHTML;

  const toastElement = document.getElementById(toastId);
  if (toastElement) {
    const closeBtn = toastElement.querySelector('.toast-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        toastElement.remove();
      });
    }

    setTimeout(() => {
      if (toastElement.parentElement) {
        toastElement.remove();
      }
    }, 3000);
  }
}

// ===== SEARCH & FILTER FUNCTIONS =====
function searchProducts(query) {
  searchQuery = query.toLowerCase();
  applyFilters();
}

function applyFilters() {
  filteredProducts = products.filter(product => {
    const matchesSearch = !searchQuery ||
      product.name.toLowerCase().includes(searchQuery) ||
      product.brand.toLowerCase().includes(searchQuery) ||
      product.category.toLowerCase().includes(searchQuery);

    const matchesCategory = filters.categories.length === 0 ||
      filters.categories.includes(product.category);

    const matchesBrand = filters.brands.length === 0 ||
      filters.brands.includes(product.brand.toLowerCase());

    return matchesSearch && matchesCategory && matchesBrand;
  });

  sortProducts();
  renderProducts();
}

function sortProducts() {
  switch (sortBy) {
    case 'price-asc':
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      filteredProducts.sort((a, b) => b.rating - a.rating);
      break;
    case 'newest':
      filteredProducts.sort((a, b) => b.id - a.id);
      break;
    default:
      // Keep default order
  }
}

function renderProducts() {
  const container = document.getElementById('productsContainer');
  if (!container) return;

  if (filteredProducts.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <p>Không tìm thấy sản phẩm phù hợp</p>
        <p style="font-size: 14px; color: #999; margin-top: 10px;">
          Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
        </p>
      </div>
    `;
    return;
  }

  const start = (currentPageNum - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedProducts = filteredProducts.slice(start, end);

  container.innerHTML = paginatedProducts.map(product => `
    <div class="product-card" data-product-id="${product.id}">
      <div class="product-image">
        <img src="${product.images[0]}" alt="${product.name}" loading="lazy">
        ${product.discount > 0 ? `<div class="discount-badge">-${product.discount}%</div>` : ''}
      </div>
      <div class="product-info">
        <p class="product-brand">${product.brand}</p>
        <h3 class="product-name">${product.name}</h3>
        <p class="product-description">${product.description}</p>
        <div class="product-rating">
          <span class="stars">⭐ ${product.rating}</span>
          <span class="review-count">(${product.reviewCount} reviews)</span>
        </div>
        <div class="product-price">
          <span class="current-price">${formatPrice(product.price)}</span>
          ${product.discount > 0 ? `<span class="original-price">${formatPrice(product.originalPrice)}</span>` : ''}
        </div>
        <div class="product-stock">
          ${product.inStock ? `<span class="in-stock">Còn hàng: ${product.stockCount}</span>` : '<span class="out-stock">Hết hàng</span>'}
        </div>
        <button class="btn-add-cart" data-product-id="${product.id}">
          ${product.inStock ? 'Thêm vào giỏ' : 'Thông báo'}
        </button>
      </div>
    </div>
  `).join('');

  // Add event listeners to "Add to Cart" buttons
  document.querySelectorAll('.btn-add-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const productId = parseInt(e.target.dataset.productId);
      addToCart(productId);
    });
  });

  renderPagination();
}

function renderPagination() {
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginationContainer = document.getElementById('pagination');

  if (!paginationContainer || totalPages <= 1) {
    if (paginationContainer) paginationContainer.innerHTML = '';
    return;
  }

  let html = '';
  if (currentPageNum > 1) {
    html += `<button class="page-btn" onclick="changePage(${currentPageNum - 1})">← Previous</button>`;
  }

  for (let i = 1; i <= totalPages; i++) {
    html += `<button class="page-btn ${i === currentPageNum ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
  }

  if (currentPageNum < totalPages) {
    html += `<button class="page-btn" onclick="changePage(${currentPageNum + 1})">Next →</button>`;
  }

  paginationContainer.innerHTML = html;
}

function changePage(pageNum) {
  currentPageNum = pageNum;
  renderProducts();
  window.scrollTo(0, 0);
}

// ===== CART FUNCTIONS =====
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  showToast(`Đã thêm "${product.name}" vào giỏ hàng`, 'success');
  updateCartBadge();
  updateWindow();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCartBadge();
  updateWindow();
}

function updateCartQuantity(productId, quantity) {
  const item = cart.find(item => item.id === productId);
  if (item) {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      item.quantity = quantity;
      updateWindow();
    }
  }
}

function updateCartBadge() {
  const badge = document.getElementById('cartBadge');
  if (badge) {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = count;
    badge.style.display = count > 0 ? 'block' : 'none';
  }
}

function getCartTotal() {
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function getCartSubtotal() {
  return cart.reduce((total, item) => total + (item.originalPrice * item.quantity), 0);
}

// ===== EXPORT FOR GLOBAL USE =====
window.App = {
  products: products,
  categories: categories,
  brands: brands,
  cart: cart,
  currentPage: currentPage,
  filteredProducts: filteredProducts,
  formatPrice: formatPrice,
  addToCart: addToCart,
  removeFromCart: removeFromCart,
  updateCartQuantity: updateCartQuantity,
  getCartTotal: getCartTotal,
  searchProducts: searchProducts,
  applyFilters: applyFilters,
  changePage: changePage
};

function updateWindow() {
  window.App.cart = cart;
  window.App.filteredProducts = filteredProducts;
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ ShoeMart Application Initialized');
  console.log('📦 Total Products:', products.length);
  console.log('🛒 Cart:', cart);
});
/**
 * ShoeMart AI - Shop Page JavaScript
 * Handles product filtering, sorting, pagination and search functionality
 */

// Shop page state
const ShopState = {
    currentPage: 1,
    itemsPerPage: 12,
    totalPages: 0,
    filteredProducts: [],
    allProducts: [],
    activeFilters: {
        search: '',
        category: '',
        brand: '',
        minPrice: null,
        maxPrice: null,
        size: '',
        rating: null
    },
    sortBy: 'default',
    viewMode: 'grid' // grid or list
};

// DOM elements for shop page
const ShopDOM = {
    productsGrid: null,
    productsCount: null,
    loadingState: null,
    noResultsState: null,
    paginationNav: null,
    paginationList: null,
    
    // Filters
    productSearch: null,
    categoryFilters: null,
    brandFilters: null,
    minPrice: null,
    maxPrice: null,
    sizeFilters: null,
    ratingFilters: null,
    
    // Toolbar
    sortSelect: null,
    itemsPerPageSelect: null,
    gridViewBtn: null,
    listViewBtn: null,
    
    // Active filters
    activeFilters: null,
    filterTags: null,
    clearFilters: null
};

// Shop functionality
class ShopManager {
    constructor() {
        this.init();
    }

    init() {
        this.bindDOMElements();
        this.setupEventListeners();
        this.initializeFilters();
        this.loadURLParams();
        this.loadProducts();
    }

    bindDOMElements() {
        // Main containers
        ShopDOM.productsGrid = document.getElementById('productsGrid');
        ShopDOM.productsCount = document.getElementById('productsCount');
        ShopDOM.loadingState = document.getElementById('loadingState');
        ShopDOM.noResultsState = document.getElementById('noResultsState');
        ShopDOM.paginationNav = document.getElementById('paginationNav');
        ShopDOM.paginationList = document.getElementById('paginationList');

        // Filters
        ShopDOM.productSearch = document.getElementById('productSearch');
        ShopDOM.categoryFilters = document.getElementById('categoryFilters');
        ShopDOM.brandFilters = document.getElementById('brandFilters');
        ShopDOM.minPrice = document.getElementById('minPrice');
        ShopDOM.maxPrice = document.getElementById('maxPrice');
        ShopDOM.sizeFilters = document.getElementById('sizeFilters');

        // Toolbar
        ShopDOM.sortSelect = document.getElementById('sortSelect');
        ShopDOM.itemsPerPageSelect = document.getElementById('itemsPerPage');
        ShopDOM.gridViewBtn = document.getElementById('gridView');
        ShopDOM.listViewBtn = document.getElementById('listView');

        // Active filters
        ShopDOM.activeFilters = document.getElementById('activeFilters');
        ShopDOM.filterTags = document.getElementById('filterTags');
        ShopDOM.clearFilters = document.getElementById('clearFilters');
    }

    setupEventListeners() {
        // Search functionality
        if (ShopDOM.productSearch) {
            const debouncedSearch = Utils.Performance.debounce((value) => {
                ShopState.activeFilters.search = value;
                this.applyFilters();
            }, 300);

            ShopDOM.productSearch.addEventListener('input', (e) => {
                debouncedSearch(e.target.value.trim());
            });
        }

        // Category filters
        if (ShopDOM.categoryFilters) {
            ShopDOM.categoryFilters.addEventListener('change', (e) => {
                if (e.target.type === 'checkbox') {
                    const categories = Array.from(ShopDOM.categoryFilters.querySelectorAll('input:checked'))
                        .map(input => input.value);
                    ShopState.activeFilters.category = categories.join(',');
                    this.applyFilters();
                }
            });
        }

        // Brand filters
        if (ShopDOM.brandFilters) {
            ShopDOM.brandFilters.addEventListener('change', (e) => {
                if (e.target.type === 'checkbox') {
                    const brands = Array.from(ShopDOM.brandFilters.querySelectorAll('input:checked'))
                        .map(input => input.value);
                    ShopState.activeFilters.brand = brands.join(',');
                    this.applyFilters();
                }
            });
        }

        // Price filters
        if (ShopDOM.minPrice) {
            ShopDOM.minPrice.addEventListener('change', (e) => {
                ShopState.activeFilters.minPrice = e.target.value ? parseInt(e.target.value) : null;
                this.applyFilters();
            });
        }

        if (ShopDOM.maxPrice) {
            ShopDOM.maxPrice.addEventListener('change', (e) => {
                ShopState.activeFilters.maxPrice = e.target.value ? parseInt(e.target.value) : null;
                this.applyFilters();
            });
        }

        // Price preset buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.price-presets .btn')) {
                const btn = e.target.closest('.price-presets .btn');
                const minPrice = btn.getAttribute('data-min');
                const maxPrice = btn.getAttribute('data-max');
                
                // Update UI
                if (ShopDOM.minPrice) ShopDOM.minPrice.value = minPrice;
                if (ShopDOM.maxPrice) ShopDOM.maxPrice.value = maxPrice === '999999999' ? '' : maxPrice;
                
                // Update state
                ShopState.activeFilters.minPrice = parseInt(minPrice);
                ShopState.activeFilters.maxPrice = maxPrice === '999999999' ? null : parseInt(maxPrice);
                
                // Update button states
                document.querySelectorAll('.price-presets .btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                this.applyFilters();
            }
        });

        // Size filters
        if (ShopDOM.sizeFilters) {
            ShopDOM.sizeFilters.addEventListener('click', (e) => {
                if (e.target.hasAttribute('data-size')) {
                    const sizeBtn = e.target;
                    const size = sizeBtn.getAttribute('data-size');
                    
                    // Toggle button state
                    if (sizeBtn.classList.contains('active')) {
                        sizeBtn.classList.remove('active');
                        ShopState.activeFilters.size = '';
                    } else {
                        // Remove active from other size buttons
                        ShopDOM.sizeFilters.querySelectorAll('.btn').forEach(btn => 
                            btn.classList.remove('active'));
                        sizeBtn.classList.add('active');
                        ShopState.activeFilters.size = size;
                    }
                    
                    this.applyFilters();
                }
            });
        }

        // Rating filters
        document.addEventListener('change', (e) => {
            if (e.target.name === 'rating') {
                ShopState.activeFilters.rating = e.target.value ? parseFloat(e.target.value) : null;
                this.applyFilters();
            }
        });

        // Sort functionality
        if (ShopDOM.sortSelect) {
            ShopDOM.sortSelect.addEventListener('change', (e) => {
                ShopState.sortBy = e.target.value;
                this.sortProducts();
                this.renderProducts();
                this.updateURL();
            });
        }

        // Items per page
        if (ShopDOM.itemsPerPageSelect) {
            ShopDOM.itemsPerPageSelect.addEventListener('change', (e) => {
                ShopState.itemsPerPage = parseInt(e.target.value);
                ShopState.currentPage = 1;
                this.renderProducts();
                this.updateURL();
            });
        }

        // View mode toggle
        if (ShopDOM.gridViewBtn) {
            ShopDOM.gridViewBtn.addEventListener('click', () => {
                this.setViewMode('grid');
            });
        }

        if (ShopDOM.listViewBtn) {
            ShopDOM.listViewBtn.addEventListener('click', () => {
                this.setViewMode('list');
            });
        }

        // Clear filters
        if (ShopDOM.clearFilters) {
            ShopDOM.clearFilters.addEventListener('click', () => {
                this.clearAllFilters();
            });
        }

        // Clear filters from no results state
        const clearFiltersNoResults = document.getElementById('clearFiltersNoResults');
        if (clearFiltersNoResults) {
            clearFiltersNoResults.addEventListener('click', () => {
                this.clearAllFilters();
            });
        }

        // AI Recommendation
        const startAIRecommendation = document.getElementById('startAIRecommendation');
        if (startAIRecommendation) {
            startAIRecommendation.addEventListener('click', () => {
                if (window.AIChatbot) {
                    window.AIChatbot.show();
                    window.AIChatbot.sendMessage('Tôi cần tư vấn chọn giày phù hợp');
                }
            });
        }
    }

    initializeFilters() {
        // Load categories into filter
        if (ShopDOM.categoryFilters && window.App && window.App.categories) {
            ShopDOM.categoryFilters.innerHTML = '';
            window.App.categories.forEach(category => {
                const filterOption = `
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="${category.id}" id="cat_${category.id}">
                        <label class="form-check-label" for="cat_${category.id}">
                            ${category.name}
                        </label>
                    </div>
                `;
                ShopDOM.categoryFilters.insertAdjacentHTML('beforeend', filterOption);
            });
        }

        // Load brands into filter
        if (ShopDOM.brandFilters && window.App && window.App.brands) {
            ShopDOM.brandFilters.innerHTML = '';
            window.App.brands.forEach(brand => {
                const filterOption = `
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="${brand.id}" id="brand_${brand.id}">
                        <label class="form-check-label" for="brand_${brand.id}">
                            ${brand.name}
                        </label>
                    </div>
                `;
                ShopDOM.brandFilters.insertAdjacentHTML('beforeend', filterOption);
            });
        }

        // Load categories into navigation dropdown
        const navCategoriesDropdown = document.getElementById('navCategoriesDropdown');
        if (navCategoriesDropdown && window.App && window.App.categories) {
            navCategoriesDropdown.innerHTML = '';
            window.App.categories.forEach(category => {
                const categoryLink = `
                    <li><a class="dropdown-item" href="shop.html?category=${category.id}">${category.name}</a></li>
                `;
                navCategoriesDropdown.insertAdjacentHTML('beforeend', categoryLink);
            });
        }
    }

    loadURLParams() {
        const urlParams = Utils.URL.getParams();
        
        // Load filters from URL
        if (urlParams.search) {
            ShopState.activeFilters.search = urlParams.search;
            if (ShopDOM.productSearch) {
                ShopDOM.productSearch.value = urlParams.search;
            }
        }

        if (urlParams.category) {
            ShopState.activeFilters.category = urlParams.category;
            // Update category checkboxes
            urlParams.category.split(',').forEach(categoryId => {
                const checkbox = document.getElementById(`cat_${categoryId}`);
                if (checkbox) checkbox.checked = true;
            });
        }

        if (urlParams.brand) {
            ShopState.activeFilters.brand = urlParams.brand;
            // Update brand checkboxes
            urlParams.brand.split(',').forEach(brandId => {
                const checkbox = document.getElementById(`brand_${brandId}`);
                if (checkbox) checkbox.checked = true;
            });
        }

        if (urlParams.minPrice) {
            ShopState.activeFilters.minPrice = parseInt(urlParams.minPrice);
            if (ShopDOM.minPrice) {
                ShopDOM.minPrice.value = urlParams.minPrice;
            }
        }

        if (urlParams.maxPrice) {
            ShopState.activeFilters.maxPrice = parseInt(urlParams.maxPrice);
            if (ShopDOM.maxPrice) {
                ShopDOM.maxPrice.value = urlParams.maxPrice;
            }
        }

        if (urlParams.size) {
            ShopState.activeFilters.size = urlParams.size;
            // Update size button
            const sizeBtn = document.querySelector(`[data-size="${urlParams.size}"]`);
            if (sizeBtn) sizeBtn.classList.add('active');
        }

        if (urlParams.rating) {
            ShopState.activeFilters.rating = parseFloat(urlParams.rating);
            // Update rating radio
            const ratingRadio = document.getElementById(`rating${Math.floor(urlParams.rating)}`);
            if (ratingRadio) ratingRadio.checked = true;
        }

        if (urlParams.sort) {
            ShopState.sortBy = urlParams.sort;
            if (ShopDOM.sortSelect) {
                ShopDOM.sortSelect.value = urlParams.sort;
            }
        }

        if (urlParams.limit) {
            ShopState.itemsPerPage = parseInt(urlParams.limit);
            if (ShopDOM.itemsPerPageSelect) {
                ShopDOM.itemsPerPageSelect.value = urlParams.limit;
            }
        }

        if (urlParams.page) {
            ShopState.currentPage = parseInt(urlParams.page);
        }

        if (urlParams.view) {
            ShopState.viewMode = urlParams.view;
        }
    }

    async loadProducts() {
        try {
            this.showLoading();
            
            // Get products from global App state or load them
            if (window.App && window.App.products && window.App.products.length > 0) {
                ShopState.allProducts = window.App.products;
            } else {
                // Load products if not already loaded
                const data = await window.DataLoader.loadProducts();
                ShopState.allProducts = data.products || [];
            }

            this.applyFilters();
            
        } catch (error) {
            console.error('Error loading products:', error);
            this.showError('Không thể tải sản phẩm. Vui lòng thử lại sau.');
        }
    }

    applyFilters() {
        let filtered = [...ShopState.allProducts];

        // Apply search filter
        if (ShopState.activeFilters.search) {
            const searchTerm = ShopState.activeFilters.search.toLowerCase();
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchTerm) ||
                product.brand.toLowerCase().includes(searchTerm) ||
                product.description.toLowerCase().includes(searchTerm) ||
                product.category.toLowerCase().includes(searchTerm)
            );
        }

        // Apply category filter
        if (ShopState.activeFilters.category) {
            const categories = ShopState.activeFilters.category.split(',');
            filtered = filtered.filter(product => categories.includes(product.category));
        }

        // Apply brand filter
        if (ShopState.activeFilters.brand) {
            const brands = ShopState.activeFilters.brand.split(',');
            filtered = filtered.filter(product => brands.includes(product.brand.toLowerCase()));
        }

        // Apply price filter
        if (ShopState.activeFilters.minPrice !== null) {
            filtered = filtered.filter(product => product.price >= ShopState.activeFilters.minPrice);
        }

        if (ShopState.activeFilters.maxPrice !== null) {
            filtered = filtered.filter(product => product.price <= ShopState.activeFilters.maxPrice);
        }

        // Apply size filter
        if (ShopState.activeFilters.size) {
            filtered = filtered.filter(product => product.sizes.includes(ShopState.activeFilters.size));
        }

        // Apply rating filter
        if (ShopState.activeFilters.rating !== null) {
            filtered = filtered.filter(product => product.rating >= ShopState.activeFilters.rating);
        }

        ShopState.filteredProducts = filtered;
        ShopState.currentPage = 1; // Reset to first page

        this.sortProducts();
        this.updateActiveFiltersDisplay();
        this.renderProducts();
        this.updateURL();
    }

    sortProducts() {
        const products = ShopState.filteredProducts;

        switch (ShopState.sortBy) {
            case 'name-asc':
                products.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                products.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'price-asc':
                products.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                products.sort((a, b) => b.price - a.price);
                break;
            case 'rating-desc':
                products.sort((a, b) => b.rating - a.rating);
                break;
            case 'discount-desc':
                products.sort((a, b) => b.discount - a.discount);
                break;
            default:
                // Default sorting (featured products first)
                products.sort((a, b) => {
                    const aScore = (a.rating * 0.4) + (a.discount * 0.3) + ((5 - a.id) * 0.3);
                    const bScore = (b.rating * 0.4) + (b.discount * 0.3) + ((5 - b.id) * 0.3);
                    return bScore - aScore;
                });
        }
    }

    renderProducts() {
        if (!ShopDOM.productsGrid) return;

        this.hideLoading();

        // Calculate pagination
        ShopState.totalPages = Math.ceil(ShopState.filteredProducts.length / ShopState.itemsPerPage);
        const start = (ShopState.currentPage - 1) * ShopState.itemsPerPage;
        const end = start + ShopState.itemsPerPage;
        const productsToShow = ShopState.filteredProducts.slice(start, end);

        // Update products count
        if (ShopDOM.productsCount) {
            ShopDOM.productsCount.textContent = `${ShopState.filteredProducts.length} sản phẩm`;
        }

        // Show/hide no results state
        if (ShopState.filteredProducts.length === 0) {
            ShopDOM.noResultsState.style.display = 'block';
            ShopDOM.productsGrid.style.display = 'none';
            ShopDOM.paginationNav.style.display = 'none';
            return;
        } else {
            ShopDOM.noResultsState.style.display = 'none';
            ShopDOM.productsGrid.style.display = '';
        }

        // Set view mode
        ShopDOM.productsGrid.className = `products-grid row g-4 ${ShopState.viewMode}-view`;

        // Render products
        ShopDOM.productsGrid.innerHTML = '';
        productsToShow.forEach(product => {
            if (window.UI && typeof window.UI.renderProductCard === 'function') {
                window.UI.renderProductCard(product, ShopDOM.productsGrid);
            }
        });

        // Render pagination
        this.renderPagination();

        // Update view mode buttons
        this.updateViewModeButtons();
    }

    renderPagination() {
        if (!ShopDOM.paginationList || ShopState.totalPages <= 1) {
            if (ShopDOM.paginationNav) {
                ShopDOM.paginationNav.style.display = 'none';
            }
            return;
        }

        ShopDOM.paginationNav.style.display = 'block';
        ShopDOM.paginationList.innerHTML = '';

        // Previous button
        const prevDisabled = ShopState.currentPage === 1 ? 'disabled' : '';
        ShopDOM.paginationList.innerHTML += `
            <li class="page-item ${prevDisabled}">
                <a class="page-link" href="#" data-page="${ShopState.currentPage - 1}">
                    <i class="fas fa-chevron-left"></i>
                </a>
            </li>
        `;

        // Page numbers
        const startPage = Math.max(1, ShopState.currentPage - 2);
        const endPage = Math.min(ShopState.totalPages, ShopState.currentPage + 2);

        if (startPage > 1) {
            ShopDOM.paginationList.innerHTML += `
                <li class="page-item">
                    <a class="page-link" href="#" data-page="1">1</a>
                </li>
            `;
            if (startPage > 2) {
                ShopDOM.paginationList.innerHTML += `
                    <li class="page-item disabled">
                        <span class="page-link">...</span>
                    </li>
                `;
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            const active = i === ShopState.currentPage ? 'active' : '';
            ShopDOM.paginationList.innerHTML += `
                <li class="page-item ${active}">
                    <a class="page-link" href="#" data-page="${i}">${i}</a>
                </li>
            `;
        }

        if (endPage < ShopState.totalPages) {
            if (endPage < ShopState.totalPages - 1) {
                ShopDOM.paginationList.innerHTML += `
                    <li class="page-item disabled">
                        <span class="page-link">...</span>
                    </li>
                `;
            }
            ShopDOM.paginationList.innerHTML += `
                <li class="page-item">
                    <a class="page-link" href="#" data-page="${ShopState.totalPages}">${ShopState.totalPages}</a>
                </li>
            `;
        }

        // Next button
        const nextDisabled = ShopState.currentPage === ShopState.totalPages ? 'disabled' : '';
        ShopDOM.paginationList.innerHTML += `
            <li class="page-item ${nextDisabled}">
                <a class="page-link" href="#" data-page="${ShopState.currentPage + 1}">
                    <i class="fas fa-chevron-right"></i>
                </a>
            </li>
        `;

        // Add event listeners to pagination links
        ShopDOM.paginationList.addEventListener('click', (e) => {
            e.preventDefault();
            if (e.target.hasAttribute('data-page')) {
                const page = parseInt(e.target.getAttribute('data-page'));
                if (page !== ShopState.currentPage && page >= 1 && page <= ShopState.totalPages) {
                    ShopState.currentPage = page;
                    this.renderProducts();
                    this.updateURL();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            }
        });
    }

    updateActiveFiltersDisplay() {
        if (!ShopDOM.activeFilters || !ShopDOM.filterTags) return;

        const filterTags = [];

        // Search filter
        if (ShopState.activeFilters.search) {
            filterTags.push({
                type: 'search',
                label: `Tìm kiếm: "${ShopState.activeFilters.search}"`,
                value: ShopState.activeFilters.search
            });
        }

        // Category filter
        if (ShopState.activeFilters.category) {
            const categories = ShopState.activeFilters.category.split(',');
            categories.forEach(categoryId => {
                const category = window.App.categories.find(cat => cat.id === categoryId);
                if (category) {
                    filterTags.push({
                        type: 'category',
                        label: `Danh mục: ${category.name}`,
                        value: categoryId
                    });
                }
            });
        }

        // Brand filter
        if (ShopState.activeFilters.brand) {
            const brands = ShopState.activeFilters.brand.split(',');
            brands.forEach(brandId => {
                const brand = window.App.brands.find(b => b.id === brandId);
                if (brand) {
                    filterTags.push({
                        type: 'brand',
                        label: `Thương hiệu: ${brand.name}`,
                        value: brandId
                    });
                }
            });
        }

        // Price filter
        if (ShopState.activeFilters.minPrice || ShopState.activeFilters.maxPrice) {
            let priceLabel = 'Giá: ';
            if (ShopState.activeFilters.minPrice && ShopState.activeFilters.maxPrice) {
                priceLabel += `${Utils.Price.formatVND(ShopState.activeFilters.minPrice)} - ${Utils.Price.formatVND(ShopState.activeFilters.maxPrice)}`;
            } else if (ShopState.activeFilters.minPrice) {
                priceLabel += `Từ ${Utils.Price.formatVND(ShopState.activeFilters.minPrice)}`;
            } else {
                priceLabel += `Đến ${Utils.Price.formatVND(ShopState.activeFilters.maxPrice)}`;
            }
            filterTags.push({
                type: 'price',
                label: priceLabel,
                value: 'price'
            });
        }

        // Size filter
        if (ShopState.activeFilters.size) {
            filterTags.push({
                type: 'size',
                label: `Size: ${ShopState.activeFilters.size}`,
                value: ShopState.activeFilters.size
            });
        }

        // Rating filter
        if (ShopState.activeFilters.rating) {
            filterTags.push({
                type: 'rating',
                label: `Đánh giá: ${ShopState.activeFilters.rating}+ sao`,
                value: ShopState.activeFilters.rating
            });
        }

        // Render filter tags
        if (filterTags.length > 0) {
            ShopDOM.filterTags.innerHTML = '';
            filterTags.forEach(tag => {
                const tagElement = document.createElement('span');
                tagElement.className = 'filter-tag';
                tagElement.innerHTML = `
                    ${tag.label}
                    <button type="button" class="btn-close btn-close-white" 
                            data-filter-type="${tag.type}" data-filter-value="${tag.value}">
                    </button>
                `;
                ShopDOM.filterTags.appendChild(tagElement);
            });
            
            ShopDOM.activeFilters.style.display = 'block';

            // Add event listeners to remove filter tags
            ShopDOM.filterTags.addEventListener('click', (e) => {
                if (e.target.classList.contains('btn-close')) {
                    const filterType = e.target.getAttribute('data-filter-type');
                    const filterValue = e.target.getAttribute('data-filter-value');
                    this.removeFilter(filterType, filterValue);
                }
            });
        } else {
            ShopDOM.activeFilters.style.display = 'none';
        }
    }

    removeFilter(type, value) {
        switch (type) {
            case 'search':
                ShopState.activeFilters.search = '';
                if (ShopDOM.productSearch) {
                    ShopDOM.productSearch.value = '';
                }
                break;
            case 'category':
                const categories = ShopState.activeFilters.category.split(',').filter(cat => cat !== value);
                ShopState.activeFilters.category = categories.join(',');
                const categoryCheckbox = document.getElementById(`cat_${value}`);
                if (categoryCheckbox) categoryCheckbox.checked = false;
                break;
            case 'brand':
                const brands = ShopState.activeFilters.brand.split(',').filter(brand => brand !== value);
                ShopState.activeFilters.brand = brands.join(',');
                const brandCheckbox = document.getElementById(`brand_${value}`);
                if (brandCheckbox) brandCheckbox.checked = false;
                break;
            case 'price':
                ShopState.activeFilters.minPrice = null;
                ShopState.activeFilters.maxPrice = null;
                if (ShopDOM.minPrice) ShopDOM.minPrice.value = '';
                if (ShopDOM.maxPrice) ShopDOM.maxPrice.value = '';
                document.querySelectorAll('.price-presets .btn').forEach(btn => 
                    btn.classList.remove('active'));
                break;
            case 'size':
                ShopState.activeFilters.size = '';
                const sizeBtn = document.querySelector(`[data-size="${value}"]`);
                if (sizeBtn) sizeBtn.classList.remove('active');
                break;
            case 'rating':
                ShopState.activeFilters.rating = null;
                const ratingRadio = document.querySelector('input[name="rating"]:checked');
                if (ratingRadio) ratingRadio.checked = false;
                break;
        }

        this.applyFilters();
    }

    clearAllFilters() {
        // Reset filter state
        ShopState.activeFilters = {
            search: '',
            category: '',
            brand: '',
            minPrice: null,
            maxPrice: null,
            size: '',
            rating: null
        };

        // Reset UI elements
        if (ShopDOM.productSearch) ShopDOM.productSearch.value = '';
        if (ShopDOM.minPrice) ShopDOM.minPrice.value = '';
        if (ShopDOM.maxPrice) ShopDOM.maxPrice.value = '';

        // Reset checkboxes
        document.querySelectorAll('#categoryFilters input[type="checkbox"]').forEach(cb => cb.checked = false);
        document.querySelectorAll('#brandFilters input[type="checkbox"]').forEach(cb => cb.checked = false);
        
        // Reset radio buttons
        document.querySelectorAll('input[name="rating"]').forEach(radio => radio.checked = false);
        
        // Reset buttons
        document.querySelectorAll('.price-presets .btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.size-options .btn').forEach(btn => btn.classList.remove('active'));

        // Reset page
        ShopState.currentPage = 1;

        // Apply filters (which will show all products)
        this.applyFilters();
    }

    setViewMode(mode) {
        ShopState.viewMode = mode;
        this.updateViewModeButtons();
        this.renderProducts();
        this.updateURL();
    }

    updateViewModeButtons() {
        if (ShopDOM.gridViewBtn && ShopDOM.listViewBtn) {
            if (ShopState.viewMode === 'grid') {
                ShopDOM.gridViewBtn.classList.add('active');
                ShopDOM.listViewBtn.classList.remove('active');
            } else {
                ShopDOM.gridViewBtn.classList.remove('active');
                ShopDOM.listViewBtn.classList.add('active');
            }
        }
    }

    updateURL() {
        const params = {};

        if (ShopState.activeFilters.search) params.search = ShopState.activeFilters.search;
        if (ShopState.activeFilters.category) params.category = ShopState.activeFilters.category;
        if (ShopState.activeFilters.brand) params.brand = ShopState.activeFilters.brand;
        if (ShopState.activeFilters.minPrice) params.minPrice = ShopState.activeFilters.minPrice;
        if (ShopState.activeFilters.maxPrice) params.maxPrice = ShopState.activeFilters.maxPrice;
        if (ShopState.activeFilters.size) params.size = ShopState.activeFilters.size;
        if (ShopState.activeFilters.rating) params.rating = ShopState.activeFilters.rating;
        if (ShopState.sortBy !== 'default') params.sort = ShopState.sortBy;
        if (ShopState.itemsPerPage !== 12) params.limit = ShopState.itemsPerPage;
        if (ShopState.currentPage > 1) params.page = ShopState.currentPage;
        if (ShopState.viewMode !== 'grid') params.view = ShopState.viewMode;

        Utils.URL.updateURL(params, true);
    }

    showLoading() {
        if (ShopDOM.loadingState) {
            ShopDOM.loadingState.style.display = 'block';
        }
        if (ShopDOM.productsGrid) {
            ShopDOM.productsGrid.style.display = 'none';
        }
    }

    hideLoading() {
        if (ShopDOM.loadingState) {
            ShopDOM.loadingState.style.display = 'none';
        }
        if (ShopDOM.productsGrid) {
            ShopDOM.productsGrid.style.display = '';
        }
    }

    showError(message) {
        this.hideLoading();
        if (ShopDOM.productsGrid) {
            ShopDOM.productsGrid.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
                    <h4>Có lỗi xảy ra</h4>
                    <p class="text-muted">${message}</p>
                    <button class="btn btn-primary" onclick="location.reload()">
                        <i class="fas fa-refresh me-2"></i>Thử lại
                    </button>
                </div>
            `;
        }
    }
}

// Initialize shop page when DOM is ready
let shopManagerInstance = null;

const initializeShopPage = () => {
    // Only initialize if we're on the shop page
    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage === 'shop.html' || currentPage === 'shop') {
        shopManagerInstance = new ShopManager();
        window.ShopManager = shopManagerInstance;
        console.log('Shop page initialized successfully');
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeShopPage);
} else {
    initializeShopPage();
}
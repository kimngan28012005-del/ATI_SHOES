# 📋 ShoeMart AI - Website Outline & Project Plan

## 🎯 Project Overview

**ShoeMart AI** is a modern e-commerce website specializing in shoes with an integrated AI chatbot for customer support. The project is built with vanilla JavaScript, responsive CSS, and Docker deployment.

### Target Audience
- 👟 Shoe enthusiasts
- 🛍️ Online shoppers
- 📱 Mobile-first users
- 🌍 Global customers

### Project Objectives
1. ✅ Create professional shoe e-commerce website
2. ✅ Implement AI chatbot for 24/7 support
3. ✅ Ensure mobile responsiveness
4. ✅ Optimize performance
5. ✅ Easy deployment with Docker

---

## 📑 Website Structure

### 1. Homepage (`index.html`)

#### Above the Fold
```
┌─────────────────────────────────┐
│     HEADER / NAVIGATION          │
│  Logo | Shop | Cart | Search    │
└─────────────────────────────────┘
┌─────────────────────────────────┐
│     HERO SECTION                 │
│  "Find Your Perfect Shoes"       │
│  [Search Box] [CTA Button]       │
└─────────────────────────────────┘
```

#### Content Sections
1. **Hero Banner**
   - Eye-catching background
   - Compelling headline
   - Search functionality
   - Call-to-action button

2. **Featured Products**
   - Top-selling shoes
   - New arrivals
   - Best-rated items
   - Quick add-to-cart

3. **Brand Showcase**
   - Nike
   - Adidas
   - Converse
   - Vans
   - Puma
   - New Balance

4. **Features Section**
   - Free shipping (>1.5M)
   - 30-day return policy
   - 24/7 chatbot support
   - Secure payment

5. **Testimonials/Reviews**
   - Customer ratings
   - Review highlights
   - Success stories

6. **Newsletter Signup**
   - Email subscription
   - Exclusive offers
   - Updates

7. **Footer**
   - Quick links
   - Contact info
   - Social media
   - Copyright

---

### 2. Shop Page (`shop.html`)

#### Layout Structure
```
┌──────────────────────────────────────┐
│         HEADER / NAVIGATION           │
│  Logo | Shop | Cart | Search         │
└──────────────────────────────────────┘
┌─────────────┬──────────────────────┐
│   FILTERS   │    PRODUCT GRID      │
│             │                      │
│ • Brand     │  [Product Cards]     │
│ • Price     │  [Product Cards]     │
│ • Size      │  [Product Cards]     │
│ • Rating    │  [Product Cards]     │
│             │                      │
│ [Clear All] │   Pagination         │
└─────────────┴──────────────────────┘
```

#### Components

**Left Sidebar - Filters**
- Brand filter (checkbox list)
- Price range (slider)
- Size (multi-select)
- Rating (stars)
- Clear filters button

**Main Content - Product Grid**
- Product card layout (3-4 per row, responsive)
- Each card contains:
  - Product image
  - Product name
  - Brand
  - Price
  - Rating (stars)
  - "Quick view" button
  - "Add to cart" button

**Pagination**
- Previous/Next buttons
- Page numbers
- "X items per page" selector

**Search/Sort Bar**
- Search input
- Sort options:
  - Newest
  - Price: Low to High
  - Price: High to Low
  - Most Popular
  - Best Rating

---

### 3. Product Detail Page (Modal/Overlay)

```
┌─────────────────────────────────┐
│  X (Close)                      │
├─────────────────────────────────┤
│ [Image Gallery] │ [Details]     │
│                 │               │
│ Main Image      │ Name          │
│ Thumbnails      │ Brand         │
│                 │ Price         │
│                 │ Rating (★★★★★)│
│                 │ Description   │
│                 │ Size Guide    │
│                 │ Color Options │
│                 │ [Add to Cart] │
│                 │ [Share]       │
│                 │               │
│                 │ [Reviews]     │
└─────────────────────────────────┘
```

#### Content Sections
- Product images gallery
- Product name & brand
- Price & discount (if any)
- Star rating & reviews count
- Detailed description
- Size guide
- Color/variant options
- Quantity selector
- Add to cart button
- Share on social
- Customer reviews
- Related products

---

### 4. Shopping Cart

```
┌──────────────────────────────┐
│  Your Shopping Cart          │
├──────────────────────────────┤
│ [Product 1] Qty: 1  $1.5M   │
│ [Product 2] Qty: 2  $3.0M   │
│ [Product 3] Qty: 1  $2.0M   │
├──────────────────────────────┤
│ Subtotal:        $6.5M       │
│ Shipping:        FREE         │
│ Tax:             $0           │
├──────────────────────────────┤
│ TOTAL:           $6.5M       │
├──────────────────────────────┤
│ [Continue Shopping]          │
│ [Proceed to Checkout]        │
└──────────────────────────────┘
```

#### Features
- Product list with images
- Quantity adjusters (±)
- Remove item button
- Subtotal calculator
- Shipping costs
- Tax calculation
- Total amount
- Promo code input
- Proceed to checkout
- Continue shopping link

---

### 5. Checkout Page

```
┌──────────────────────────────┐
│  Checkout                    │
├──────────────────────────────┤
│ 1. SHIPPING INFO              │
│   [Delivery Address Form]    │
│                              │
│ 2. PAYMENT METHOD             │
│   ○ Bank Transfer             │
│   ○ Credit Card               │
│   ○ COD                       │
│   ○ E-wallet                  │
│                              │
│ 3. ORDER SUMMARY              │
│   [Products List]             │
│   Total: $6.5M                │
│                              │
│ [Place Order]                │
└──────────────────────────────┘
```

#### Sections
- Delivery address form
- Payment method selection
- Order summary
- Terms & conditions
- Place order button

---

## 🤖 Chatbot Integration

### Chatbot Widget
```
┌──────────────────────────┐
│  🤖 ShoeMart Assistant   │ X
├──────────────────────────┤
│ Messages                 │
│ [Message 1]              │
│ [Message 2]              │
│ [Typing indicator...]    │
├──────────────────────────┤
│ [Type message...]        │
│ [Send Button]            │
└──────────────────────────┘
```

### Chatbot Capabilities
1. **Greeting** - Welcomes customer
2. **Sizing** - Helps choose correct size
3. **Browsing** - Recommends products
4. **Checkout** - Assists with purchase
5. **Support** - Answers FAQs
6. **General** - Handles other queries

### Response Categories
- **50+ predefined responses** in 6 categories
- **Smart intent detection** using NLU
- **Instant responses** (<100ms)
- **Session memory** for conversation context
- **Caching** for repeated questions

---

## 🛍️ Product Catalog

### Product Categories

| Category | Brands | Count |
|----------|--------|-------|
| Sneakers | Nike, Adidas, Converse, Vans | ~100 |
| Casual | Puma, New Balance, Skechers | ~80 |
| Running | Nike, Adidas, Brooks | ~60 |
| Skateboard | Vans, DC, Element | ~40 |
| Formal | Clarks, Oxford | ~30 |
| Sports | Nike, Adidas, Puma | ~70 |
| **Total** | | **~500** |

### Product Information
- Product ID
- Name
- Brand
- Price (VND)
- Category
- Sizes (36-47)
- Colors
- Images (multiple)
- Description
- Rating (1-5 stars)
- Reviews count
- In stock status

---

## 📱 Responsive Design

### Breakpoints
```
Mobile:   < 640px   (Full width)
Tablet:   640-1024  (2-column)
Desktop:  > 1024px  (3-4 column)
```

### Responsive Elements
- Navigation (hamburger menu on mobile)
- Product grid (responsive columns)
- Forms (full width on mobile)
- Images (scaled appropriately)
- Text (readable sizes)
- Buttons (touch-friendly)

---

## 🎨 Design System

### Color Palette
```
Primary:    #2d90b2 (Teal)
Secondary:  #1e5a75 (Dark Teal)
Accent:     #ff6b6b (Red)
Success:    #4caf50 (Green)
Warning:    #ff9800 (Orange)
Error:      #f44336 (Red)
Neutral:    #f5f5f5 (Light Gray)
Text:       #333333 (Dark Gray)
```

### Typography
- **Headings**: Bold, 1.5-2x larger
- **Body**: Regular, readable size
- **Accents**: Lighter weight for secondary info
- **Font**: System fonts (performance)

### Components
- Buttons (primary, secondary, ghost)
- Cards (product, review, info)
- Forms (inputs, selects, checkboxes)
- Modals (product detail, cart)
- Alerts (success, error, warning, info)
- Navigation (header, footer, sidebar)

---

## 🔄 User Journeys

### Journey 1: Browse & Purchase
```
1. Visit homepage
2. Browse products
3. Apply filters
4. Select product
5. View details
6. Add to cart
7. Proceed to checkout
8. Enter shipping info
9. Select payment method
10. Place order
11. Confirmation
```

### Journey 2: Ask Chatbot for Help
```
1. Open chatbot
2. Type question
3. Get instant response
4. Ask follow-up (if needed)
5. Get recommended product
6. Add to cart directly
```

### Journey 3: Search Specific Product
```
1. Use search bar
2. Enter keywords
3. View filtered results
4. Sort by preference
5. Select best match
6. View details
7. Add to cart
```

---

## 📊 Features Roadmap

### Phase 1: MVP (v4.1) ✅ CURRENT
- E-commerce shop
- AI chatbot (local)
- Shopping cart
- Responsive design
- Docker deployment

### Phase 2: Enhancement (v4.2) 🔄 PLANNED
- User accounts
- Order history
- Wishlist
- Advanced filters
- Product reviews
- Email notifications

### Phase 3: Integration (v4.3) 🚀 FUTURE
- Payment gateway (Stripe, Paypal)
- Inventory sync
- Admin dashboard
- Analytics
- Recommendation engine
- Mobile app

### Phase 4: Scale (v5.0) 📈 LONG-TERM
- Microservices architecture
- Machine learning recommendations
- Real-time chat
- Video chat support
- AR try-on
- Global shipping

---

## 🎯 Key Metrics & Goals

### Performance Targets
| Metric | Target | Status |
|--------|--------|--------|
| Page Load | <2s | ✅ |
| Chatbot Response | <100ms | ✅ |
| Lighthouse Score | 85+ | ✅ |
| Mobile Friendliness | 100% | ✅ |

### Business Metrics
- 500+ products
- $0 API costs (local chatbot)
- 24/7 customer support
- Easy deployment
- Scalable architecture

### User Goals
- Browse products easily
- Find perfect size
- Add items to cart
- Checkout quickly
- Get support anytime

---

## 📁 File Dependencies

```
index.html
├── style.css
├── styles.css
├── app.js
├── main.js
├── utils.js
├── ai-chatbot.js
└── config.json, products.json

shop.html
├── style.css
├── styles.css
├── app.js
├── shop.js
├── utils.js
├── ai-chatbot.js
└── config.json, products.json
```

---

## 🚀 Deployment Checklist

- [x] Docker Compose setup
- [x] Nginx configuration
- [x] Environment variables
- [x] Performance optimization
- [x] Security headers
- [x] Responsive design
- [x] Cross-browser testing
- [x] Error handling
- [x] Documentation
- [ ] CDN setup (future)
- [ ] SSL certificate (future)
- [ ] Monitoring (future)

---

## 📞 Contact & Support

**Customer Support**
- Chatbot: 24/7 (built-in)
- Email: support@shoemart.vn
- Phone: 1900 1234
- Hours: 8 AM - 9 PM

**Developer Support**
- GitHub Issues: Report bugs
- Documentation: See README.md
- Email: dev@shoemart.vn

---

## 📜 Project Information

| Item | Details |
|------|---------|
| **Project Name** | ShoeMart AI |
| **Version** | 4.1 |
| **Status** | Production Ready |
| **Last Updated** | 2025-11-15 |
| **Tech Stack** | HTML5, CSS3, JavaScript, Docker |
| **License** | MIT |
| **Author** | ShoeMart Team |

---

**This outline ensures comprehensive coverage of the website structure, features, and user experience for the ShoeMart AI project.** ✅

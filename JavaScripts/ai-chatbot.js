/**
 * ShoeMart AI - Chatbot v4.0 Google Gemini Edition
 * Using Google Gemini API for AI responses
 * Created: 2025-11-19
 * API: AIzaSyDbMkY5fOk3_XfBIy2CJy42ViyLuLEHpUk
 */

// ============================================
// 1. AI CONFIGURATION - Google Gemini API
// ============================================
const AICONFIG = {
  apiKey: 'AIzaSyDbMkY5fOk3_XfBIy2CJy42ViyLuLEHpUk',
  apiUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
  model: 'gemini-1.5-flash',
  maxTokens: 1500,
  temperature: 0.9,
  topP: 0.95,
  topK: 40
};

// ============================================
// 2. INTENT PATTERNS (Vietnamese)
// ============================================
const IntentPatterns = {
  sizing: {
    keywords: ['size', 'kích cỡ', 'vừa', 'to', 'nhỏ', 'rộng', 'chật', 'số', 'cỡ', '38', '39', '40', '41', '42', '43', '44', '45'],
    patterns: [
      /(\?|tôi)\s*c[oó]\s*kích\s*c[oơ]/i,
      /bao\s*nhiêu/i,
      /\b(to|nhỏ|vừa|rộng|chật|s[oố])\b/i
    ]
  },
  browsing: {
    keywords: ['tìm', 'cần', 'muốn', 'loại', 'gì', 'nào', 'màu', 'thương hiệu', 'brand', 'giá', 'bao nhiêu'],
    patterns: [
      /(\?|tôi)\s*(tìm|cần|muốn|giúp)\b/i,
      /(giày|shoe|sneaker|casual|skateboard|chạy)/i
    ]
  },
  checkout: {
    keywords: ['mua', 'thanh toán', 'tổ', 'order', 'giỏ', 'check out', 'add to cart'],
    patterns: [
      /(\?|tôi)\s*(mua|muốn\s*mua|thanh\s*toán)/i,
      /thêm\s*(vào\s*)?giỏ/i
    ]
  },
  support: {
    keywords: ['giao hàng', 'vận chuyển', 'đổi', 'trả', 'bảo hành', 'hotline', 'liên hệ'],
    patterns: [
      /giao\s*hàng|vận\s*chuyển|ship/i,
      /đổi|trả|hoàn/i
    ]
  },
  greeting: {
    keywords: ['xin chào', 'chào', 'hi', 'hello', 'alo'],
    patterns: [
      /^(xin\s*chào|chào|hi|hello|alo)/i
    ]
  }
};

// ============================================
// 3. CHATBOT STATE MANAGEMENT
// ============================================
const ChatbotState = {
  isOpen: false,
  isTyping: false,
  messages: [],
  conversationHistory: [],
  context: {
    customerName: '',
    currentProducts: [],
    preferredCategories: [],
    conversationStage: 'greeting',
    detectedIntents: [],
    lastUserMessage: ''
  }
};

// ============================================
// 4. DOM REFERENCES
// ============================================
const ChatbotDOM = {
  container: null,
  floatBtn: null,
  messages: null,
  input: null,
  form: null,
  closeBtn: null
};

// ============================================
// 5. FALLBACK RESPONSES (Local Processing)
// ============================================
const FallbackResponses = {
  sizing: [
    '👟 Cỡ bàn chân của bạn bao nhiêu? Chúng tôi có size từ 35 đến 47.',
    '📏 Bạn thường mang size bao nhiêu? Tôi có thể gợi ý giày phù hợp.',
    '🦶 Size giày bạn hay mang là gì?',
    '👟 Size nào vừa với bạn?',
    '📐 Cỡ giày bạn thường là bao nhiêu?'
  ],
  browsing: [
    '🛍️ Bạn muốn tìm giày loại nào? Sneaker, Chạy, Casual, Skateboard, Lifestyle.',
    '👟 Brand nào bạn thích? Nike, Adidas, Converse, Vans, Puma, New Balance...',
    '💰 Bạn tìm giày trong khoảng giá nào?',
    '🎨 Bạn ưu tiên giá rẻ hay chất lượng tốt?',
    '🔍 Tôi có thể giúp bạn tìm giày phù hợp.'
  ],
  checkout: [
    '🛒 Giỏ hàng của bạn đã sẵn sàng để thanh toán!',
    '💳 Chúng tôi nhận thanh toán qua: Tiền mặt, Chuyển khoản, Ví điện tử.',
    '📦 Quá trình thanh toán sẽ mất 2-3 phút.',
    '✅ Nhấn "Thanh toán" để hoàn tất đơn hàng.',
    '🎁 Có mã giảm giá không?'
  ],
  support: [
    '🚚 Giao hàng: Miễn phí từ 1.5 triệu đồng trở lên.',
    '↩️ Đổi trả 30 ngày nếu không hài lòng.',
    '☎️ Hotline: 1900 1234 (8:00 - 22:00 hàng ngày).',
    '📧 Email: support@shoemart.vn',
    '🛡️ Bảo hành chính hãng 12 tháng.'
  ],
  greeting: [
    '👋 Xin chào! Chào mừng bạn đến ShoeMart - Cửa hàng giày hàng đầu Việt Nam.',
    '😊 Hi! Tôi là AI Assistant của ShoeMart. Sẵn sàng giúp bạn tìm đôi giày hoàn hảo!',
    '🎯 Chào bạn! Tôi sẵn sàng hỗ trợ bạn.',
    '👟 Xin chào! Bạn đang tìm loại giày nào hôm nay?',
    '🤖 Chào mừng! Tôi là chatbot của ShoeMart.'
  ],
  general: [
    '😊 Tôi có thể giúp: Tìm giày, kiểm tra giá, thông tin giao hàng.',
    '🎨 Bạn muốn mua giày hay chỉ tìm hiểu?',
    '🛍️ Có gì tôi có thể hỗ trợ?',
    '👟 Tôi sẵn sàng trợ giúp bạn.',
    '💬 Bạn muốn hỏi gì?'
  ]
};

// ============================================
// 6. AI CHATBOT CLASS
// ============================================
class AIChatbot {
  constructor() {
    this.init();
  }

  init() {
    // Get DOM references
    ChatbotDOM.container = document.getElementById('chatbotContainer');
    ChatbotDOM.floatBtn = document.getElementById('chatFloatBtn');
    ChatbotDOM.messages = document.getElementById('chatMessages');
    ChatbotDOM.input = document.getElementById('messageInput');
    ChatbotDOM.form = document.getElementById('chatForm');
    ChatbotDOM.closeBtn = document.getElementById('closeChatBtn');

    this.setupEventListeners();
    this.initializeContext();

    console.log('✅ ShoeMart Chatbot v4.0 (Google Gemini) initialized');
  }

  setupEventListeners() {
    if (ChatbotDOM.floatBtn) {
      ChatbotDOM.floatBtn.addEventListener('click', () => this.toggle());
    }

    if (ChatbotDOM.closeBtn) {
      ChatbotDOM.closeBtn.addEventListener('click', () => this.hide());
    }

    if (ChatbotDOM.form) {
      ChatbotDOM.form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleUserMessage();
      });
    }

    if (ChatbotDOM.input) {
      ChatbotDOM.input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.handleUserMessage();
        }
      });
    }
  }

  initializeContext() {
    const currentPage = window.App?.currentPage || 'home';
    ChatbotState.context.currentProducts = window.App?.products || [];

    switch (currentPage) {
      case 'shop':
        ChatbotState.context.conversationStage = 'browsing';
        break;
      case 'product-detail':
        ChatbotState.context.conversationStage = 'sizing';
        break;
      case 'cart':
        ChatbotState.context.conversationStage = 'checkout';
        break;
      default:
        ChatbotState.context.conversationStage = 'greeting';
    }
  }

  show() {
    if (ChatbotDOM.container) {
      ChatbotDOM.container.classList.add('show');
      ChatbotState.isOpen = true;
    }

    if (ChatbotDOM.floatBtn) {
      ChatbotDOM.floatBtn.style.display = 'none';
    }

    if (ChatbotDOM.input) {
      setTimeout(() => ChatbotDOM.input.focus(), 300);
    }
  }

  hide() {
    if (ChatbotDOM.container) {
      ChatbotDOM.container.classList.remove('show');
      ChatbotState.isOpen = false;
    }

    if (ChatbotDOM.floatBtn) {
      ChatbotDOM.floatBtn.style.display = 'flex';
    }
  }

  toggle() {
    ChatbotState.isOpen ? this.hide() : this.show();
  }

  async handleUserMessage() {
    const message = ChatbotDOM.input?.value.trim();

    if (!message) return;

    // Add user message to UI
    this.addMessage(message, 'user');

    // Clear input
    if (ChatbotDOM.input) {
      ChatbotDOM.input.value = '';
    }

    // Show typing indicator
    this.showTyping();

    try {
      // Get AI response
      const response = await this.getAIResponse(message);
      
      // Hide typing indicator
      this.hideTyping();

      // Add bot response
      this.addMessage(response, 'bot');

      // Update conversation history
      ChatbotState.conversationHistory.push({
        user: message,
        bot: response,
        timestamp: new Date(),
        intents: ChatbotState.context.detectedIntents
      });

      // Keep conversation history limited
      if (ChatbotState.conversationHistory.length > 25) {
        ChatbotState.conversationHistory = ChatbotState.conversationHistory.slice(-25);
      }
    } catch (error) {
      console.error('❌ Chatbot Error:', error);
      this.hideTyping();
      this.addMessage(
        'Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau hoặc liên hệ 1900 1234.',
        'bot'
      );
    }
  }

  detectIntents(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    const detectedIntents = [];

    Object.entries(IntentPatterns).forEach(([intentType, config]) => {
      const matchesPattern = config.patterns.some(pattern => pattern.test(userMessage));
      const matchesKeyword = config.keywords.some(kw => lowerMessage.includes(kw.toLowerCase()));

      if (matchesPattern || matchesKeyword) {
        if (intentType !== 'greeting') {
          detectedIntents.push({
            type: intentType,
            confidence: matchesPattern ? 0.9 : 0.7,
            keywords: config.keywords.filter(kw => lowerMessage.includes(kw.toLowerCase()))
          });
        }
      }
    });

    if (detectedIntents.length === 0) {
      detectedIntents.push({
        type: 'general',
        confidence: 0.5,
        keywords: []
      });
    }

    return detectedIntents.sort((a, b) => b.confidence - a.confidence);
  }

  extractEntities(userMessage) {
    const entities = {
      size: null,
      color: null,
      brand: null,
      category: null
    };

    const lowerMessage = userMessage.toLowerCase();

    // Extract size
    const sizeMatch = userMessage.match(/(\d{2})/);
    if (sizeMatch) entities.size = sizeMatch[1];

    // Extract color
    const colors = ['trắng', 'đen', 'xanh', 'đỏ', 'vàng', 'tím', 'nâu', 'xám', 'hồng', 'cam'];
    colors.forEach(color => {
      if (lowerMessage.includes(color)) entities.color = color;
    });

    // Extract brand
    const brands = ['nike', 'adidas', 'converse', 'vans', 'puma', 'new balance'];
    brands.forEach(brand => {
      if (lowerMessage.includes(brand)) entities.brand = brand;
    });

    // Extract category
    const categories = ['sneaker', 'chạy', 'casual', 'skateboard', 'lifestyle'];
    categories.forEach(cat => {
      if (lowerMessage.includes(cat)) entities.category = cat;
    });

    return entities;
  }

  buildSmartContext(userMessage, intents, entities) {
    const products = ChatbotState.context.currentProducts.slice(0, 8);
    const cartItems = window.App?.cart || [];
    const recentHistory = ChatbotState.conversationHistory.slice(-6);

    return {
      currentPage: window.App?.currentPage || 'home',
      featuredProducts: products.map(p => ({
        name: p.name,
        brand: p.brand,
        price: p.price,
        rating: p.rating
      })),
      cartItems: cartItems.length,
      conversationStage: ChatbotState.context.conversationStage,
      customerName: ChatbotState.context.customerName,
      detectedIntents: intents,
      entities: entities,
      recentHistory: recentHistory.map(h => `Khách: ${h.user} | Bot: ${h.bot}`).join('\n---\n')
    };
  }

  buildSystemPrompt(intents, entities, context) {
    const products = context.featuredProducts
      .map(p => `${p.name} (${p.brand}) - ${this.formatPrice(p.price)} - ${p.rating}⭐`)
      .join('\n');

    const history = context.recentHistory
      .split('\n---\n')
      .slice(-3)
      .join('\n');

    let contextHint = 'Khách tại trang chính';
    const intent = intents[0]?.type;

    if (intent === 'sizing') {
      contextHint = 'Khách quan tâm đến size giày';
    } else if (intent === 'browsing') {
      contextHint = 'Khách tìm kiếm sản phẩm';
    } else if (intent === 'checkout') {
      contextHint = 'Khách muốn thanh toán';
    } else if (intent === 'support') {
      contextHint = 'Khách cần hỗ trợ chính sách';
    }

    return `Bạn là AI bán hàng chuyên nghiệp của ShoeMart - cửa hàng giày hàng đầu Việt Nam.

HƯỚNG DẪN:
- Trả lời tự nhiên, thân thiện, không máy móc
- Ngắn gọn 1-3 câu, tối đa 80 từ
- Hiểu khách từ context
- Gợi sản phẩm nếu liên quan
- Dùng emoji phù hợp

CONTEXT HIỆN TẠI:
- Gợi ý: ${contextHint}
- Khách: ${context.customerName || 'Chưa biết'}
- Đang ở: ${context.conversationStage}
- Giỏ hàng: ${context.cartItems} sản phẩm

ENTITY TỪ KHÁCH:
- Size: ${entities.size || 'N/A'}
- Màu: ${entities.color || 'N/A'}
- Brand: ${entities.brand || 'N/A'}

SẢN PHẨM NỔIBRR:
${products}

CHÍNH SÁCH:
- Giao hàng miễn phí từ 1.5M
- Đổi trả 30 ngày
- Hotline: 1900 1234
- Bảo hành 12 tháng

LỊCH SỬ TRÒ CHUYỆN:
${history}`;
  }

  formatPrice(price) {
    if (!price) return '0₫';
    return price.toLocaleString('vi-VN') + '₫';
  }

  // ============================================
  // 7. GOOGLE GEMINI API INTEGRATION
  // ============================================
  async getAIResponse(userMessage) {
    const intents = this.detectIntents(userMessage);
    ChatbotState.context.detectedIntents = intents;

    const entities = this.extractEntities(userMessage);
    const context = this.buildSmartContext(userMessage, intents, entities);
    const systemPrompt = this.buildSystemPrompt(intents, entities, context);

    try {
      // Call Google Gemini API
      const response = await this.callGeminiAPI(systemPrompt, userMessage);

      if (response && response.trim()) {
        this.updateContext(userMessage, response, intents, entities);
        return response;
      }

      // Fallback if no response
      return this.getFallbackResponse(intents[0]?.type || 'general');

    } catch (error) {
      console.error('❌ Gemini API Error:', error);
      
      // Use fallback response on error
      return this.getFallbackResponse(intents[0]?.type || 'general');
    }
  }

  async callGeminiAPI(systemPrompt, userMessage) {
    const requestBody = {
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: systemPrompt + '\n\nKhách nói: ' + userMessage
            }
          ]
        }
      ],
      generationConfig: {
        temperature: AICONFIG.temperature,
        topP: AICONFIG.topP,
        topK: AICONFIG.topK,
        maxOutputTokens: AICONFIG.maxTokens
      },
      safetySettings: [
        {
          category: 'HARM_CATEGORY_UNSPECIFIED',
          threshold: 'BLOCK_NONE'
        }
      ]
    };

    const url = `${AICONFIG.apiUrl}?key=${AICONFIG.apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API Error (${response.status}): ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();

    // Extract text from response
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiResponse) {
      throw new Error('No response from Gemini API');
    }

    return aiResponse;
  }

  getFallbackResponse(intentType) {
    const responses = FallbackResponses[intentType] || FallbackResponses.general;
    const randomIndex = Math.floor(Math.random() * responses.length);
    return responses[randomIndex];
  }

  updateContext(userMessage, aiResponse, intents, entities) {
    // Extract name from message
    const nameMatch = userMessage.match(/(?:tên|gọi|là)\s+([a-zA-Zàáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ\s]{2,20})/i);

    if (nameMatch && !ChatbotState.context.customerName) {
      ChatbotState.context.customerName = nameMatch[1].trim();
    }

    // Update conversation stage based on primary intent
    const primaryIntent = intents[0]?.type;
    if (primaryIntent === 'sizing') {
      ChatbotState.context.conversationStage = 'sizing';
    } else if (primaryIntent === 'browsing') {
      ChatbotState.context.conversationStage = 'browsing';
    } else if (primaryIntent === 'checkout') {
      ChatbotState.context.conversationStage = 'checkout';
    }

    // Update preferred categories
    if (entities.category && !ChatbotState.context.preferredCategories.includes(entities.category)) {
      ChatbotState.context.preferredCategories.push(entities.category);
    }

    // Add to messages
    ChatbotState.messages.push({
      type: 'user',
      content: userMessage,
      timestamp: new Date()
    });

    ChatbotState.messages.push({
      type: 'bot',
      content: aiResponse,
      timestamp: new Date()
    });

    // Limit messages
    if (ChatbotState.messages.length > 50) {
      ChatbotState.messages = ChatbotState.messages.slice(-50);
    }
  }

  // ============================================
  // 8. MESSAGE DISPLAY & UI HANDLING
  // ============================================
  addMessage(content, type = 'bot') {
    if (!ChatbotDOM.messages) return;

    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}-message`;

    const timeString = new Date().toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });

    messageElement.innerHTML = `
      <div class="message-content">
        <div class="message-text">${this.formatMessage(content)}</div>
        <span class="message-time">${timeString}</span>
      </div>
    `;

    ChatbotDOM.messages.appendChild(messageElement);
    ChatbotDOM.messages.scrollTop = ChatbotDOM.messages.scrollHeight;

    // Animation
    messageElement.style.opacity = '0';
    messageElement.style.transform = 'translateY(10px)';
    requestAnimationFrame(() => {
      messageElement.style.transition = 'all 0.3s ease';
      messageElement.style.opacity = '1';
      messageElement.style.transform = 'translateY(0)';
    });
  }

  formatMessage(content) {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>')
      .replace(/^-\s/gm, '<li>')
      .replace(/\*\s/g, '<li>')
      .trim();
  }

  showTyping() {
    if (!ChatbotDOM.messages) return;

    const typingElement = document.createElement('div');
    typingElement.className = 'message bot-message typing';
    typingElement.innerHTML = `
      <div class="typing-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    `;
    typingElement.id = 'typingIndicator';

    ChatbotDOM.messages.appendChild(typingElement);
    ChatbotDOM.messages.scrollTop = ChatbotDOM.messages.scrollHeight;
  }

  hideTyping() {
    const typingElement = document.getElementById('typingIndicator');
    if (typingElement) {
      typingElement.remove();
    }
  }

  // ============================================
  // 9. UTILITY METHODS
  // ============================================
  getStats() {
    return {
      isOpen: ChatbotState.isOpen,
      messagesCount: ChatbotState.messages.length,
      conversationHistoryCount: ChatbotState.conversationHistory.length,
      customerName: ChatbotState.context.customerName,
      conversationStage: ChatbotState.context.conversationStage,
      preferredCategories: ChatbotState.context.preferredCategories
    };
  }

  clearHistory() {
    ChatbotState.messages = [];
    ChatbotState.conversationHistory = [];
    ChatbotState.context.detectedIntents = [];
    if (ChatbotDOM.messages) {
      ChatbotDOM.messages.innerHTML = '';
    }
    console.log('✅ Chat history cleared');
  }

  exportConversation() {
    const data = {
      timestamp: new Date().toISOString(),
      customerName: ChatbotState.context.customerName,
      conversationHistory: ChatbotState.conversationHistory,
      stats: this.getStats()
    };
    return JSON.stringify(data, null, 2);
  }

  setCustomerName(name) {
    ChatbotState.context.customerName = name;
    console.log(`✅ Customer name set to: ${name}`);
  }
}

// ============================================
// 10. INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  window.chatbot = new AIChatbot();
  console.log('✅ ShoeMart Chatbot v4.0 (Google Gemini) initialized successfully');
  console.log('📊 Available methods:');
  console.log('   - chatbot.show()');
  console.log('   - chatbot.hide()');
  console.log('   - chatbot.toggle()');
  console.log('   - chatbot.getStats()');
  console.log('   - chatbot.clearHistory()');
  console.log('   - chatbot.exportConversation()');
  console.log('   - chatbot.setCustomerName(name)');
});

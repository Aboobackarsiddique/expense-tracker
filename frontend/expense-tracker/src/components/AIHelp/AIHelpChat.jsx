import React, { useState, useRef, useEffect } from 'react';
import { LuSend, LuBot, LuX } from 'react-icons/lu';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATH } from '../../utils/apiPath';
import toast from 'react-hot-toast';

const AIHelpChat = ({ isOpen, onClose, anchorRect = null }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I'm your AI financial assistant. I can help you with:\n• Budget recommendations\n• Spending analysis\n• Savings tips\n• Financial planning advice\n\nWhat would you like to know?",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [dockMode, setDockMode] = useState('floating'); // 'floating' | 'left' | 'right' | 'bottom'

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getFinancialAdvice = async (userMessage, userData) => {
    // Simple AI-like response based on user data
    const lowerMessage = userMessage.toLowerCase();
    
    // Analyze spending patterns
    const totalExpense = userData?.totalExpense || 0;
    const totalIncome = userData?.totalIncome || 0;
    const balance = userData?.totalBalance || 0;
    
    let response = '';

    if (lowerMessage.includes('budget') || lowerMessage.includes('spending')) {
      if (totalExpense > totalIncome * 0.8) {
        response = `⚠️ Your expenses (₹${totalExpense.toLocaleString()}) are quite high compared to your income (₹${totalIncome.toLocaleString()}). I recommend:\n\n1. Review your expenses and identify non-essential items\n2. Create a monthly budget limiting expenses to 70% of income\n3. Set aside 20% for savings and 10% for emergencies\n4. Track daily spending to stay within budget`;
      } else {
        response = `✅ Your spending looks balanced! Your expenses are ₹${totalExpense.toLocaleString()} against income of ₹${totalIncome.toLocaleString()}.\n\nTips to optimize:\n1. Aim to save at least 20% of your income\n2. Build an emergency fund (3-6 months of expenses)\n3. Review recurring subscriptions monthly\n4. Use the 50/30/20 rule: 50% needs, 30% wants, 20% savings`;
      }
    } else if (lowerMessage.includes('save') || lowerMessage.includes('saving')) {
      response = `💰 Savings Strategy:\n\n1. **Emergency Fund**: Save ₹${(totalExpense * 3).toLocaleString()} (3 months expenses)\n2. **Automated Savings**: Set up auto-transfer of 20% income\n3. **Cut Expenses**: Review subscriptions, reduce dining out\n4. **Set Goals**: Use the Goals feature to track progress\n5. **Track Progress**: Monitor savings growth monthly\n\nYour current balance: ₹${balance.toLocaleString()}`;
    } else if (lowerMessage.includes('expense') || lowerMessage.includes('spend')) {
      response = `📊 Expense Analysis:\n\n• Total Expenses: ₹${totalExpense.toLocaleString()}\n• Monthly Average: ₹${(totalExpense / 12).toLocaleString()}\n\nRecommendations:\n1. Categorize expenses to identify patterns\n2. Set monthly limits per category\n3. Review and eliminate unnecessary expenses\n4. Use the expense tracking feature regularly\n5. Compare month-over-month trends`;
    } else if (lowerMessage.includes('income') || lowerMessage.includes('earn')) {
      response = `💵 Income Insights:\n\n• Total Income: ₹${totalIncome.toLocaleString()}\n• Net Balance: ₹${balance.toLocaleString()}\n\nTips to increase income:\n1. Track all income sources\n2. Look for additional revenue streams\n3. Invest in skills development\n4. Consider freelance opportunities\n5. Review and negotiate salary regularly`;
    } else if (lowerMessage.includes('goal') || lowerMessage.includes('target')) {
      response = `🎯 Goal Setting Tips:\n\n1. **SMART Goals**: Specific, Measurable, Achievable, Relevant, Time-bound\n2. **Short-term**: 1-3 months (emergency fund, small purchases)\n3. **Medium-term**: 3-12 months (vacation, major purchase)\n4. **Long-term**: 1+ years (house, retirement)\n5. **Track Progress**: Update goals regularly\n6. **Celebrate Milestones**: Reward yourself at 25%, 50%, 75% completion\n\nUse the Goals feature to create and track your financial goals!`;
    } else {
      response = `I can help you with:\n\n📊 **Budget Planning**: Ask about creating a budget\n💰 **Savings Tips**: Get personalized savings advice\n📈 **Expense Analysis**: Understand your spending patterns\n💵 **Income Optimization**: Tips to increase earnings\n🎯 **Goal Setting**: Help with financial goal planning\n\nTry asking: "How can I save more?" or "Analyze my spending"`;
    }

    return response;
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      // Fetch user's financial data
      const dashboardResponse = await axiosInstance.get(API_PATH.DASHBOARD.GET_DASHBOARD_DATA);
      const userData = dashboardResponse.data;

      // Simulate AI thinking delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const aiResponse = await getFinancialAdvice(userMessage, userData);
      
      setMessages((prev) => [...prev, { role: 'assistant', content: aiResponse }]);
    } catch (error) {
      toast.error('Failed to get AI response');
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const containerClass = (() => {
    switch (dockMode) {
      case 'left':
        return 'fixed top-0 left-0 h-full w-80 bg-white border-r border-gray-200 flex flex-col z-50';
      case 'right':
        return 'fixed top-0 right-0 h-full w-80 bg-white border-l border-gray-200 flex flex-col z-50';
      case 'bottom':
        return 'fixed left-0 right-0 bottom-0 h-64 bg-white border-t border-gray-200 flex flex-col z-50';
      default:
        // For floating we compute positioning dynamically from anchorRect when available
        return 'fixed w-96 max-h-[80vh] h-[70vh] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50';
    }
  })();

  // compute inline style for floating mode so the panel appears below the emoji/button
  const floatingStyle = (() => {
    if (dockMode !== 'floating') return {};
    if (!anchorRect) {
      // fallback to bottom-right when no anchor available
      return { bottom: '3rem', right: '1rem' };
    }

    const panelWidth = 384; // matches w-96 (24rem)
    const panelHeight = Math.min(window.innerHeight * 0.8, window.innerHeight * 0.7); // approximate h-[70vh]/max-h-[80vh]

    // center under the anchor by default
    const anchorCenterX = anchorRect.left + anchorRect.width / 2;
    let left = Math.round(anchorCenterX - panelWidth / 2);
    // If the panel would overflow on the right, position it to the left of the button
    if (left + panelWidth > window.innerWidth - 8) {
      left = Math.round(anchorRect.left - panelWidth - 8);
    }
    // clamp to viewport left edge
    if (left < 8) left = 8;

    // position below the anchor, but clamp if it would overflow bottom
    let top = Math.round(anchorRect.bottom + 8);
    if (top + panelHeight > window.innerHeight - 8) {
      top = Math.max(8, Math.round(window.innerHeight - panelHeight - 8));
    }

    return { left: `${left}px`, top: `${top}px` };
  })();

  return (
    <div className={`${containerClass}`} style={floatingStyle}>
      {/* Header */}
      <div className="flex items-start justify-between p-4 border-b border-gray-200">
        <div className="flex flex-col items-start gap-2">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
              <LuBot className="text-white text-xl" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Assistant</h3>
              <p className="text-xs text-gray-500">Helper</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              title="Dock Left"
              onClick={() => setDockMode('left')}
              className={`px-2 py-1 text-xs rounded ${dockMode === 'left' ? 'bg-gray-100' : 'hover:bg-gray-100'}`}
            >
              L
            </button>
            <button
              title="Dock Bottom"
              onClick={() => setDockMode('bottom')}
              className={`px-2 py-1 text-xs rounded ${dockMode === 'bottom' ? 'bg-gray-100' : 'hover:bg-gray-100'}`}
            >
              B
            </button>
            <button
              title="Dock Right"
              onClick={() => setDockMode('right')}
              className={`px-2 py-1 text-xs rounded ${dockMode === 'right' ? 'bg-gray-100' : 'hover:bg-gray-100'}`}
            >
              R
            </button>
            <button
              title="Floating"
              onClick={() => setDockMode('floating')}
              className={`px-2 py-1 text-xs rounded ${dockMode === 'floating' ? 'bg-gray-100' : 'hover:bg-gray-100'}`}
            >
              F
            </button>
          </div>
        </div>

        <div className="flex items-center">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <LuX size={20} />
          </button>
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me anything..."
            className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <LuSend size={20} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                msg.role === 'user'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <p className="text-sm whitespace-pre-line">{msg.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default AIHelpChat;


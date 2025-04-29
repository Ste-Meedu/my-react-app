// Chatbot.js - Final Implementation
import React, { useState, useEffect, useRef } from 'react';
import './Chatbot.css';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showEmptyState, setShowEmptyState] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  
  // Auto-scroll to the latest message
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input field on load
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Initialize conversation
  useEffect(() => {
    const loadSavedMessages = () => {
      // Load existing messages from local storage
      const savedMessages = localStorage.getItem('chatMessages');
      if (savedMessages) {
        try {
          const parsedMessages = JSON.parse(savedMessages);
          setMessages(parsedMessages);
          setShowEmptyState(parsedMessages.length === 0);
        } catch (e) {
          console.error("Error parsing saved messages:", e);
          localStorage.removeItem('chatMessages');
        }
      }
    };
    
    loadSavedMessages();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage = { 
      id: Date.now().toString(), 
      sender: 'user', 
      text: input.trim(), 
      timestamp: new Date().toISOString() 
    };
    
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setShowEmptyState(false);
    setIsLoading(true);
    
    // Save messages to local storage
    localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));

    try {
      // Simulate a response
      setTimeout(() => {
        const simulatedResponse = {
          id: `ai-${Date.now()}`,
          sender: 'bot',
          text: getSimulatedResponse(userMessage.text),
          timestamp: new Date().toISOString()
        };
        
        const finalMessages = [...updatedMessages, simulatedResponse];
        setMessages(finalMessages);
        localStorage.setItem('chatMessages', JSON.stringify(finalMessages));
        setIsLoading(false);
        // Focus back on input after response
        inputRef.current?.focus();
      }, 1500);
    } catch (error) {
      console.error('Error in chat:', error);
      
      const errorMessage = { 
        id: Date.now().toString(), 
        sender: 'bot', 
        text: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString(),
        isError: true
      };
      
      const finalMessages = [...updatedMessages, errorMessage];
      setMessages(finalMessages);
      localStorage.setItem('chatMessages', JSON.stringify(finalMessages));
      setIsLoading(false);
      // Focus back on input after response
      inputRef.current?.focus();
    }
  };

  // Function to generate simulated responses
  const getSimulatedResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    if (input.includes('hello') || input.includes('hi')) {
      return "Hello! How can I help you today?";
    } else if (input.includes('help')) {
      return "I'm here to help! Feel free to ask me about our products, services, or any other questions you might have.";
    } else if (input.includes('product') || input.includes('service')) {
      return "Our company offers a range of innovative products and services designed to help businesses grow. Would you like to know more about a specific offering?";
    } else if (input.includes('price') || input.includes('cost')) {
      return "Our pricing varies depending on your specific needs. I'd be happy to connect you with our sales team who can provide a customized quote.";
    } else if (input.includes('contact') || input.includes('support')) {
      return "You can reach our support team at support@company.com or call us at (555) 123-4567 during business hours.";
    } else if (input.includes('thank')) {
      return "You're welcome! Is there anything else I can help you with?";
    } else {
      return "Thank you for your message. I'm here to assist with any questions about our company, products, or services. What would you like to know more about?";
    }
  };

  const formatTimestamp = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '';
    }
  };

  const clearChat = () => {
    setMessages([]);
    setShowEmptyState(true);
    localStorage.removeItem('chatMessages');
  };

  return (
    <div className="chat-container">
      <div className="chatbot">
        <div className="chat-messages">
          {showEmptyState && messages.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🤖</div>
              <h2>How can I help you?</h2>
              <p>Ask me anything about our products or services!</p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div 
                key={msg.id || index} 
                className={`chat-message ${msg.sender} ${msg.isError ? 'error' : ''}`}
              >
                <div className="message-avatar">
                  {msg.sender === 'user' ? '👤' : '🤖'}
                </div>
                <div className="message-content">
                  <div className="message-header">
                    <span className="sender-name">
                      {msg.sender === 'user' ? 'You' : 'AI Assistant'}
                    </span>
                    <span className="message-time">
                      {formatTimestamp(msg.timestamp)}
                    </span>
                  </div>
                  <div className="message-text">{msg.text}</div>
                </div>
              </div>
            ))
          )}
          
          {isLoading && (
            <div className="chat-message bot thinking">
              <div className="message-avatar">🤖</div>
              <div className="message-content">
                <div className="message-header">
                  <span className="sender-name">AI Assistant</span>
                </div>
                <div className="thinking-indicator">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        <div className="chat-input-container">
          {messages.length > 0 && (
            <button 
              onClick={clearChat} 
              className="clear-chat-button"
              aria-label="Clear chat"
            >
              Clear Chat
            </button>
          )}
          <div className="chat-input">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              disabled={isLoading}
              placeholder="Type your message..."
              aria-label="Message input"
            />
            <button 
              onClick={sendMessage} 
              disabled={isLoading || !input.trim()}
              className="send-button"
              aria-label="Send message"
            >
              {isLoading ? <span className="spinner">⟳</span> : <span>➤</span>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
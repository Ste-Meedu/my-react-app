// App.js
import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import Chatbot from './Chatbot';

const App = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [position, setPosition] = useState('right'); // 'right' or 'left'
  const [dimensions, setDimensions] = useState({ width: 350, height: 550 });
  const [isResizing, setIsResizing] = useState(false);
  const chatWindowRef = useRef(null);
  const resizeStartPos = useRef({ x: 0, y: 0 });
  const initialDimensions = useRef({ width: 350, height: 550 });

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const togglePosition = () => {
    setPosition(position === 'right' ? 'left' : 'right');
  };

  const startResize = (e) => {
    e.preventDefault();
    setIsResizing(true);
    
    // Get starting position
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    
    resizeStartPos.current = {
      x: clientX,
      y: clientY
    };
    
    initialDimensions.current = { ...dimensions };

    // Add event listeners for mouse/touch move and up/end
    document.addEventListener('mousemove', handleResize);
    document.addEventListener('mouseup', stopResize);
    document.addEventListener('touchmove', handleResize, { passive: false });
    document.addEventListener('touchend', stopResize);
  };

  const handleResize = (e) => {
    if (!isResizing) return;
    e.preventDefault();

    // Get current position
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    
    // Calculate difference based on position
    let widthDiff, heightDiff;
    
    if (position === 'right') {
      // For right-positioned chat, dragging right increases width
      widthDiff = clientX - resizeStartPos.current.x;
      // Dragging down increases height
      heightDiff = clientY - resizeStartPos.current.y;
    } else {
      // For left-positioned chat, dragging left increases width
      widthDiff = resizeStartPos.current.x - clientX;
      // Dragging down increases height
      heightDiff = clientY - resizeStartPos.current.y;
    }
    
    // Calculate new dimensions
    const newWidth = Math.max(300, initialDimensions.current.width + widthDiff);
    const newHeight = Math.max(400, initialDimensions.current.height + heightDiff);
    
    // Update dimensions
    setDimensions({
      width: newWidth,
      height: newHeight
    });
  };

  const stopResize = () => {
    setIsResizing(false);
    document.removeEventListener('mousemove', handleResize);
    document.removeEventListener('mouseup', stopResize);
    document.removeEventListener('touchmove', handleResize);
    document.removeEventListener('touchend', stopResize);
  };

  // Clean up event listeners on unmount
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleResize);
      document.removeEventListener('mouseup', stopResize);
      document.removeEventListener('touchmove', handleResize);
      document.removeEventListener('touchend', stopResize);
    };
  }, []);

  return (
    <div className="app-container">
      {/* Pretend Website Header */}
      <header className="website-header">
        <div className="logo">CompanyName</div>
        <nav className="main-nav">
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#products">Products</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="website-content">
        <section className="hero-section">
          <h1>Welcome to Our Platform</h1>
          <p>The best solution for your business needs</p>
          <button className="cta-button">Get Started</button>
        </section>

        <section className="features-section">
          <h2>Our Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Analytics</h3>
              <p>Powerful insights into your business performance</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Security</h3>
              <p>Enterprise-grade security for your data</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Speed</h3>
              <p>Lightning fast performance for all operations</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Mobile</h3>
              <p>Fully responsive design works on all devices</p>
            </div>
          </div>
        </section>

        <section className="testimonials-section">
          <h2>What Our Customers Say</h2>
          <div className="testimonial-card">
            <p>"This platform has transformed how we do business. Highly recommended!"</p>
            <div className="testimonial-author">- Jane Doe, CEO</div>
          </div>
        </section>
      </main>

      {/* Website Footer */}
      <footer className="website-footer">
        <div className="footer-columns">
          <div className="footer-column">
            <h4>Company</h4>
            <ul>
              <li><a href="#about">About Us</a></li>
              <li><a href="#careers">Careers</a></li>
              <li><a href="#press">Press</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Resources</h4>
            <ul>
              <li><a href="#blog">Blog</a></li>
              <li><a href="#guides">Guides</a></li>
              <li><a href="#webinars">Webinars</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Legal</h4>
            <ul>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms of Service</a></li>
              <li><a href="#cookies">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="copyright">
          © 2025 CompanyName. All rights reserved.
        </div>
      </footer>

      {/* Chat Widget */}
      <div className={`chat-widget ${isChatOpen ? 'open' : ''} ${position}`}>
        {isChatOpen ? (
          <div 
            className="chat-window"
            ref={chatWindowRef}
            style={{ 
              width: `${dimensions.width}px`, 
              height: `${dimensions.height}px`
            }}
          >
            <div className="chat-header-controls">
              <div className="chat-title">Meedu Chat</div>
              <div className="header-buttons">
                <div className="resize-icon-wrapper" title="Drag to resize">
                  <div 
                    className="resize-button" 
                    onMouseDown={startResize}
                    onTouchStart={startResize}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                    </svg>
                  </div>
                </div>
                <button 
                  className="position-toggle-button" 
                  onClick={togglePosition}
                  aria-label={position === 'right' ? "Move to left" : "Move to right"}
                >
                  {position === 'right' ? '⇦' : '⇨'}
                </button>
                <button 
                  className="close-chat-button" 
                  onClick={toggleChat}
                  aria-label="Close chat"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <Chatbot />
          </div>
        ) : (
          <button 
            className="chat-toggle-button" 
            onClick={toggleChat}
            aria-label="Open chat"
          >
            <div className="chat-icon">💬</div>
            <span className="chat-label">Chat with us</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default App;
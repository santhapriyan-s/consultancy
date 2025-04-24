
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import "./GiftCards.css";

const GiftCards = () => {
  const { user } = useOutletContext();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("personal");
  const [giftCard, setGiftCard] = useState({
    email: "",
    name: "",
    value: "",
    quantity: 1,
    gifterName: "",
    message: "",
  });
  const [corporateCard, setCorporateCard] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    email: "",
    location: "",
    companyName: "",
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGiftCard((prev) => ({ ...prev, [name]: value }));
  };

  const handleCorporateChange = (e) => {
    const { name, value } = e.target;
    setCorporateCard((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === "personal") {
      if (!giftCard.email || !giftCard.name || !giftCard.value) {
        alert("Please fill all required fields");
        return;
      }
      alert(`Personal Gift Card purchased for ₹${giftCard.value}`);
    } else {
      if (!corporateCard.firstName || !corporateCard.mobile || !corporateCard.email || !corporateCard.location || !corporateCard.companyName) {
        alert("Please fill all required fields");
        return;
      }
      alert(`Corporate Gift Card request submitted for ${corporateCard.companyName}`);
    }
  };

  return (
    <div className="gift-card-page">
      <div className="gift-card-header">
        <h2>SR Electricals Gift Card</h2>
        <div className="gift-card-tabs">
          <button 
            className={activeTab === "personal" ? "active" : ""}
            onClick={() => setActiveTab("personal")}
          >
            Buy a Gift Card
          </button>
          <button 
            className={activeTab === "corporate" ? "active" : ""}
            onClick={() => setActiveTab("corporate")}
          >
            Corporate Requirements
          </button>
          <button 
            className={activeTab === "balance" ? "active" : ""}
            onClick={() => setActiveTab("balance")}
          >
            Check Gift Card Balance
          </button>
        </div>
      </div>

      <div className="gift-card-content">
        {activeTab === "personal" && (
          <form className="personal-gift-form" onSubmit={handleSubmit}>
            <h3>Buy a SR Electricals Gift Card</h3>
            <p>Issued by SR Electricals</p>
            
            <div className="form-group">
              <label>Receiver's Email ID *</label>
              <input 
                type="email" 
                name="email" 
                value={giftCard.email} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label>Receiver's Name *</label>
              <input 
                type="text" 
                name="name" 
                value={giftCard.name} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Card Value in ₹ *</label>
                <select 
                  name="value" 
                  value={giftCard.value} 
                  onChange={handleChange}
                  required
                >
                  <option value="">Select</option>
                  <option value="500">500</option>
                  <option value="1000">1000</option>
                  <option value="2000">2000</option>
                  <option value="5000">5000</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>No of Cards</label>
                <input 
                  type="number" 
                  name="quantity" 
                  value={giftCard.quantity} 
                  onChange={handleChange} 
                  min="1" 
                  max="10"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Gifter's Name (Optional)</label>
              <input 
                type="text" 
                name="gifterName" 
                value={giftCard.gifterName} 
                onChange={handleChange} 
              />
            </div>
            
            <div className="form-group">
              <label>Write a message (Optional, 100 characters)</label>
              <textarea 
                name="message" 
                value={giftCard.message} 
                onChange={handleChange} 
                maxLength="100"
                rows="3"
              />
              <div className="char-count">
                {giftCard.message.length}/100 characters
              </div>
            </div>
            
            <div className="form-actions">
              <button type="button" className="add-another-btn">
                + Buy Another Gift Card
              </button>
              <button 
                type="submit" 
                className="buy-btn"
                disabled={!giftCard.email || !giftCard.name || !giftCard.value}
              >
                BUY GIFT CARD FOR ₹{giftCard.value ? giftCard.value * giftCard.quantity : 0}
              </button>
            </div>
          </form>
        )}

        {activeTab === "corporate" && (
          <form className="corporate-gift-form" onSubmit={handleSubmit}>
            <h3>Buy SR Electricals Gift Cards for Businesses</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label>First Name *</label>
                <input 
                  type="text" 
                  name="firstName" 
                  value={corporateCard.firstName} 
                  onChange={handleCorporateChange} 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label>Last Name (Optional)</label>
                <input 
                  type="text" 
                  name="lastName" 
                  value={corporateCard.lastName} 
                  onChange={handleCorporateChange} 
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Mobile Number *</label>
                <input 
                  type="tel" 
                  name="mobile" 
                  value={corporateCard.mobile} 
                  onChange={handleCorporateChange} 
                  required 
                  pattern="[0-9]{10}"
                  maxLength="10"
                />
              </div>
              
              <div className="form-group">
                <label>Email ID *</label>
                <input 
                  type="email" 
                  name="email" 
                  value={corporateCard.email} 
                  onChange={handleCorporateChange} 
                  required 
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Location *</label>
                <select 
                  name="location" 
                  value={corporateCard.location} 
                  onChange={handleCorporateChange}
                  required
                >
                  <option value="">Select</option>
                  <option value="India">India</option>
                  <option value="USA">USA</option>
                  <option value="UK">UK</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Company Name *</label>
                <input 
                  type="text" 
                  name="companyName" 
                  value={corporateCard.companyName} 
                  onChange={handleCorporateChange} 
                  required 
                />
              </div>
            </div>
            
            <div className="form-actions">
              <button 
                type="submit" 
                className="buy-btn"
                disabled={!corporateCard.firstName || !corporateCard.mobile || !corporateCard.email || !corporateCard.location || !corporateCard.companyName}
              >
                SUBMIT REQUIREMENTS
              </button>
            </div>
          </form>
        )}

        {activeTab === "balance" && (
          <div className="balance-check">
            <h3>Check Gift Card Balance</h3>
            <div className="form-group">
              <label>Enter Gift Card Number</label>
              <input type="text" placeholder="16-digit number" />
            </div>
            <button className="check-balance-btn">CHECK BALANCE</button>
          </div>
        )}

        <div className="faq-section">
          <h4>FAQs</h4>
          <div className="faq-item">
            <h5>How do I buy/gift a SR Electricals Gift Card?</h5>
            <p>Enter the name and email address of the person you want to send the SR Electricals Gift Card to. Select the value of the card you would like to purchase, then click "BUY GIFT CARD".</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GiftCards;
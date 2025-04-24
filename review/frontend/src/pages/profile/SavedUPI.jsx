// src/pages/SavedUPI.jsx
import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Import useAuth
import "./SavedUPI.css";

const SavedUPI = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Get user from AuthContext

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <div className="profile-section">
      <div className="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#2874f0" strokeWidth="1.5">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          <path d="M12 8v4l2 2"></path>
        </svg>
        <h3>No Saved UPI IDs</h3>
        <p>You haven't saved any UPI IDs yet.</p>
        <button className="add-upi-btn">
          + Add UPI ID
        </button>
      </div>
      
      <div className="faq-section">
        <h4>FAQs</h4>
        <div className="faq-item">
          <h5>Why is my UPI being saved on SR Electricals?</h5>
          <p>It's quicker. You can save the hassle of typing in the complete UPI information every time you shop at SR Electricals by saving your UPI details. You can make your payment by selecting the saved UPI ID of your choice at checkout. While this is obviously faster, it is also very secure.</p>
        </div>
        <div className="faq-item">
          <h5>How to save my UPI on SR Electricals?</h5>
          <p>Go to the payment methods section and select "Add UPI ID". Enter your UPI ID and verify it to save for future transactions.</p>
        </div>
        <div className="faq-item">
          <h5>What all UPI information does SR Electricals store?</h5>
          <p>SR Electricals only stores UPI ID and payment provider details. We do not store PIN/MPIN or any other sensitive information.</p>
        </div>
        <div className="faq-item">
          <h5>Can I delete my saved UPI?</h5>
          <p>Yes, you can delete your UPI ID at any time from your payment methods settings.</p>
        </div>
        <Link to="#" className="view-faq-link">View all FAQs</Link>
      </div>
    </div>
  );
};

export default SavedUPI;
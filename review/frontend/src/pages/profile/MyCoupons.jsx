import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./MyCoupons.css";

const Coupons = ({ user, setUser }) => {
  const coupons = [
    { 
      code: "SRE100", 
      title: "Festive Season Offer", 
      discount: "₹100 OFF on orders above ₹999", 
      validTill: "31 Dec 2025",
      category: "All Products"
    },
    { 
      code: "SRE150APP", 
      title: "App Exclusive", 
      discount: "₹150 OFF on app orders above ₹1499", 
      validTill: "30 Nov 2025",
      category: "Mobile App Only"
    },
    { 
      code: "SRE500ELEC", 
      title: "Electronics Special", 
      discount: "₹500 OFF on electronics above ₹4999", 
      validTill: "15 Jan 2026",
      category: "Electronics"
    },
    { 
      code: "SRE300HOME", 
      title: "Home Appliances Deal", 
      discount: "₹300 OFF on home appliances", 
      validTill: "28 Feb 2026",
      category: "Home Appliances"
    },
    { 
      code: "SRE200FIRST", 
      title: "New Customer Offer", 
      discount: "₹200 OFF on first order", 
      validTill: "31 Mar 2026",
      category: "First Order"
    },
    { 
      code: "SRE1000FEST", 
      title: "Festive Mega Sale", 
      discount: "₹1000 OFF on orders above ₹7999", 
      validTill: "10 Oct 2025",
      category: "Festive Special"
    },
  ];

  useEffect(() => {
    console.log("Coupons component mounted");
    return () => {
      console.log("Coupons component unmounted");
    };
  }, []);

  return (
    <div className="coupons-page">
      <div className="coupons-header">
        <h2>My Coupons</h2>
        <p>Available discount coupons for your next purchase</p>
      </div>

      <div className="coupons-grid">
        {coupons.map((coupon, index) => (
          <div key={index} className="coupon-card">
            <div className="coupon-badge">{coupon.category}</div>
            <div className="coupon-content">
              <h3>{coupon.title}</h3>
              <div className="coupon-code">
                <span>Code: </span>
                <strong>{coupon.code}</strong>
              </div>
              <p className="coupon-discount">{coupon.discount}</p>
              <div className="coupon-validity">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                Valid till: {coupon.validTill}
              </div>
            </div>
            <div className="coupon-actions">
              <button className="copy-btn">COPY CODE</button>
              <NavLink to="#" className="terms-link">View Terms</NavLink>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Coupons;
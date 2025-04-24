import React, { useState, useEffect } from "react";
import "./ManageAddresses.css";

const ManageAddress = () => {
  const [addresses, setAddresses] = useState([
    { 
      id: 1, 
      name: "Santhapriyan", 
      mobile: "8438956047", 
      address: "Kongu engineering college, Thoppupalayam, Perundurai, Tamil Nadu - 638060",
      type: "Home"
    },
    { 
      id: 2, 
      name: "Santhapriyan", 
      mobile: "8438956047", 
      address: "4/138, Komatty, Karur District, Tamil Nadu - 639119",
      type: "Work"
    },
    { 
      id: 3, 
      name: "Subramanian", 
      mobile: "9566557236", 
      address: "4/138, Komatty, Karur District, Tamil Nadu - 639119",
      type: "Home"
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newAddress, setNewAddress] = useState({
    name: "",
    mobile: "",
    address: "",
    locality: "",
    city: "",
    state: "",
    landmark: "",
    type: "Home"
  });

  // Parse existing address when editing
  useEffect(() => {
    if (editingId) {
      const addressToEdit = addresses.find(a => a.id === editingId);
      if (addressToEdit) {
        const addressParts = addressToEdit.address.split(', ');
        setNewAddress({
          name: addressToEdit.name,
          mobile: addressToEdit.mobile,
          address: addressParts[0],
          locality: addressParts[1] || '',
          city: addressParts[2] || '',
          state: addressParts[3]?.split(' - ')[0] || '',
          landmark: addressParts[3]?.split(' - ')[1] || '',
          type: addressToEdit.type || "Home"
        });
      }
    }
  }, [editingId, addresses]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedAddress = `${newAddress.address}, ${newAddress.locality}, ${newAddress.city}, ${newAddress.state} - ${newAddress.landmark}`;
    
    if (editingId) {
      // Update existing address
      setAddresses(addresses.map(a => 
        a.id === editingId 
          ? { 
              ...a, 
              name: newAddress.name,
              mobile: newAddress.mobile,
              address: formattedAddress,
              type: newAddress.type
            } 
          : a
      ));
    } else {
      // Add new address
      const newId = Math.max(...addresses.map(a => a.id), 0) + 1;
      setAddresses([
        ...addresses,
        {
          id: newId,
          name: newAddress.name,
          mobile: newAddress.mobile,
          address: formattedAddress,
          type: newAddress.type
        }
      ]);
    }
    
    // Reset form
    resetForm();
  };

  const handleRemove = (id) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      setAddresses(addresses.filter(a => a.id !== id));
    }
  };

  const handleEdit = (id) => {
    setEditingId(id);
    setShowForm(true);
  };

  const resetForm = () => {
    setNewAddress({
      name: "",
      mobile: "",
      address: "",
      locality: "",
      city: "",
      state: "",
      landmark: "",
      type: "Home"
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="profile-section">
      <div className="section-header">
        <h3>Manage Addresses</h3>
        <button 
          className="add-new-btn" 
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
          }}
        >
          <span>+</span> Add a New Address
        </button>
      </div>

      {showForm && (
        <form className="address-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={newAddress.name}
              onChange={handleInputChange}
              required
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label>Mobile Number</label>
            <input
              type="tel"
              name="mobile"
              value={newAddress.mobile}
              onChange={handleInputChange}
              required
              placeholder="10-digit mobile number"
              pattern="[0-9]{10}"
              maxLength="10"
            />
          </div>

          <div className="form-group">
            <label>Address (Area and Street)</label>
            <textarea
              name="address"
              value={newAddress.address}
              onChange={handleInputChange}
              required
              placeholder="House no., Building, Street name"
            />
          </div>

          <div className="form-group">
            <label>Locality/Town</label>
            <input
              type="text"
              name="locality"
              value={newAddress.locality}
              onChange={handleInputChange}
              required
              placeholder="Locality or town name"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>City/District</label>
              <input
                type="text"
                name="city"
                value={newAddress.city}
                onChange={handleInputChange}
                required
                placeholder="City or district"
              />
            </div>
            <div className="form-group">
              <label>State</label>
              <input
                type="text"
                name="state"
                value={newAddress.state}
                onChange={handleInputChange}
                required
                placeholder="State"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Landmark (Optional)</label>
            <input
              type="text"
              name="landmark"
              value={newAddress.landmark}
              onChange={handleInputChange}
              placeholder="Nearby landmark (optional)"
            />
          </div>

          <div className="form-group">
            <label>Address Type</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="type"
                  value="Home"
                  checked={newAddress.type === "Home"}
                  onChange={handleInputChange}
                />
                Home
              </label>
              <label>
                <input
                  type="radio"
                  name="type"
                  value="Work"
                  checked={newAddress.type === "Work"}
                  onChange={handleInputChange}
                />
                Work
              </label>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="save-btn">
              {editingId ? "UPDATE ADDRESS" : "SAVE ADDRESS"}
            </button>
            <button 
              type="button" 
              className="cancel-btn"
              onClick={resetForm}
            >
              CANCEL
            </button>
          </div>
        </form>
      )}

      <div className="address-grid">
        {addresses.map((address, index) => (
          <div 
            key={address.id} 
            className="address-item"
            style={{ '--order': index }}
          >
            <div className="address-type-badge">
              {address.type === "Home" ? "🏠 Home" : "💼 Work"}
            </div>
            <p><strong>{address.name}</strong> | {address.mobile}</p>
            <p>{address.address}</p>
            <div className="address-actions">
              <button 
                className="edit-btn"
                onClick={() => handleEdit(address.id)}
                aria-label="Edit address"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
              <button 
                className="remove-btn"
                onClick={() => handleRemove(address.id)}
                aria-label="Remove address"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {addresses.length === 0 && !showForm && (
        <div className="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#2874f0" strokeWidth="1.5">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <h4>No Saved Addresses</h4>
          <p>You haven't saved any addresses yet. Add one to get started!</p>
          <button 
            className="add-new-btn" 
            onClick={() => setShowForm(true)}
          >
            + Add Your First Address
          </button>
        </div>
      )}
    </div>
  );
};

export default ManageAddress;
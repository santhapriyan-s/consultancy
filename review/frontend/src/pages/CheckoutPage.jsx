import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import { ChevronLeft, ChevronRight, CreditCard, Truck, CheckCircle, User } from 'lucide-react';
import { toast } from '../components/ui/use-toast';

const CheckoutPage = () => {
  const { cart, getCartTotal, placeOrder } = useShop();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Checkout steps
  const steps = ['Login', 'Shipping', 'Payment', 'Review'];
  
  // State
  const [activeStep, setActiveStep] = useState(0);
  const [shippingAddress, setShippingAddress] = useState({
    name: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
  });
  
  const [paymentMethod, setPaymentMethod] = useState('card');
  
  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // If user is already logged in, skip to shipping step
  useEffect(() => {
    if (user) {
      setActiveStep(1);
      setShippingAddress(prev => ({
        ...prev,
        name: user.name || '',
        phone: user.phone || '',
        email: user.email || ''
      }));
    }
  }, [user]);
  
  // Handle navigation between steps
  const handleNext = () => {
    if (activeStep === 0 && !user) {
      toast({
        title: "Login Required",
        description: "Please login to proceed with checkout.",
        variant: "destructive",
      });
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    
    if (activeStep === 1) {
      // Validate shipping address
      const { name, phone, addressLine1, city, state, pincode } = shippingAddress;
      if (!name || !phone || !addressLine1 || !city || !state || !pincode) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }
      
      // Validate phone number
      if (!/^[0-9]{10}$/.test(phone)) {
        toast({
          title: "Invalid Phone Number",
          description: "Please enter a valid 10-digit phone number.",
          variant: "destructive",
        });
        return;
      }
      
      // Validate pincode
      if (!/^[0-9]{6}$/.test(pincode)) {
        toast({
          title: "Invalid Pincode",
          description: "Please enter a valid 6-digit pincode.",
          variant: "destructive",
        });
        return;
      }
    }
    
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };
  
  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };
  
  // Handle shipping address changes
  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress({
      ...shippingAddress,
      [name]: value,
    });
  };
  
  // Handle payment method change
  const handlePaymentChange = (method) => {
    setPaymentMethod(method);
  };
  
  // Handle order placement
  const handlePlaceOrder = async () => {
    try {
      const orderDetails = {
        shipping: shippingAddress,
        payment: {
          method: paymentMethod,
          status: 'pending',
        },
        items: cart,
        total: getCartTotal(),
      };

      if (paymentMethod === 'card') {
        if (!window.Razorpay) {
          throw new Error("Payment system not loaded. Please try again.");
        }

        const options = {
          key: "rzp_test_pYO1RxhwzDCppY",
          amount: Math.round(getCartTotal() * 100), // Convert to paise
          currency: "INR",
          name: "ElectroMart",
          description: "Order Payment",
          image: "/logo.png",
          handler: function (response) {
            const completedOrder = {
              ...orderDetails,
              payment: {
                ...orderDetails.payment,
                status: 'paid',
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
              },
            };
            
            const orderId = placeOrder(completedOrder);
            
            toast({
              title: "Payment Successful!",
              description: `Your order #${orderId} has been placed.`,
            });
            
            navigate('/profile/orders');
          },
          prefill: {
            name: shippingAddress.name,
            contact: shippingAddress.phone,
            email: user?.email || '',
          },
          notes: {
            address: `${shippingAddress.addressLine1}, ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.pincode}`,
          },
          modal: {
            ondismiss: function() {
              toast({
                title: "Payment Cancelled",
                description: "You cancelled the payment process.",
                variant: "destructive",
              });
            }
          },
          theme: {
            color: "#6d28d9"
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // For COD/UPI payments
        const orderId = placeOrder(orderDetails);
        
        toast({
          title: "Order Placed!",
          description: `Your order #${orderId} has been placed successfully.`,
        });
        
        navigate('/profile/orders');
      }
    } catch (error) {
      toast({
        title: "Payment Error",
        description: error.message || "Failed to process payment.",
        variant: "destructive",
      });
    }
  };

  // Render step content
  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return <LoginStep />;
      case 1:
        return (
          <ShippingStep
            shippingAddress={shippingAddress}
            handleShippingChange={handleShippingChange}
          />
        );
      case 2:
        return (
          <PaymentStep
            paymentMethod={paymentMethod}
            handlePaymentChange={handlePaymentChange}
          />
        );
      case 3:
        return (
          <ReviewStep
            cart={cart}
            shippingAddress={shippingAddress}
            paymentMethod={paymentMethod}
            total={getCartTotal()}
          />
        );
      default:
        return <div>Unknown step</div>;
    }
  };

  // If cart is empty, redirect to cart page
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-6">
            Please add some products to your cart before proceeding to checkout.
          </p>
          <button
            onClick={() => navigate('/products')}
            className="px-6 py-3 bg-brand-purple text-white rounded-md hover:bg-brand-deep-purple transition-colors"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        {/* Checkout Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {steps.map((step, index) => (
              <div key={step} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                    index === activeStep
                      ? 'bg-brand-purple text-white'
                      : index < activeStep
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {index < activeStep ? (
                    <CheckCircle size={16} />
                  ) : (
                    index + 1
                  )}
                </div>
                <span className={`text-sm ${index === activeStep ? 'font-medium' : 'text-gray-500'}`}>
                  {step}
                </span>
              </div>
            ))}
          </div>
          
          <div className="relative mt-2">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200">
              <div
                className="h-1 bg-brand-purple"
                style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          {renderStepContent()}
        </div>
        
        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={handleBack}
            disabled={activeStep === 0}
            className={`px-6 py-3 flex items-center ${
              activeStep === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            } rounded-md transition-colors`}
          >
            <ChevronLeft size={18} className="mr-1" /> Back
          </button>
          
          {activeStep === steps.length - 1 ? (
            <button
              onClick={handlePlaceOrder}
              className="px-6 py-3 bg-brand-purple text-white rounded-md hover:bg-brand-deep-purple transition-colors flex items-center"
            >
              {paymentMethod === 'card' ? 'Pay Now' : 'Place Order'} <CheckCircle size={18} className="ml-1" />
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-brand-purple text-white rounded-md hover:bg-brand-deep-purple transition-colors flex items-center"
            >
              Next <ChevronRight size={18} className="ml-1" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Login Step (shown if user is not logged in)
const LoginStep = () => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center py-8">
      <div className="mb-6">
        <User size={64} className="mx-auto text-brand-purple" />
      </div>
      <h2 className="text-2xl font-semibold mb-4">Sign in to continue</h2>
      <p className="text-gray-600 mb-6">
        Please sign in to your account to proceed with the checkout process.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => navigate('/login', { state: { from: '/checkout' } })}
          className="px-6 py-3 bg-brand-purple text-white rounded-md hover:bg-brand-deep-purple transition-colors"
        >
          Sign In
        </button>
        <button
          onClick={() => navigate('/register', { state: { from: '/checkout' } })}
          className="px-6 py-3 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors"
        >
          Create Account
        </button>
      </div>
    </div>
  );
};

// Shipping Step
const ShippingStep = ({ shippingAddress, handleShippingChange }) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 flex items-center">
        <Truck size={24} className="mr-2 text-brand-purple" />
        Shipping Address
      </h2>
      
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-gray-700 font-medium mb-1">
              Full Name*
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={shippingAddress.name}
              onChange={handleShippingChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-purple"
              required
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-gray-700 font-medium mb-1">
              Phone Number*
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={shippingAddress.phone}
              onChange={handleShippingChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-purple"
              required
              maxLength="10"
              pattern="[0-9]{10}"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="addressLine1" className="block text-gray-700 font-medium mb-1">
            Address Line 1*
          </label>
          <input
            type="text"
            id="addressLine1"
            name="addressLine1"
            value={shippingAddress.addressLine1}
            onChange={handleShippingChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-purple"
            required
          />
        </div>
        
        <div>
          <label htmlFor="addressLine2" className="block text-gray-700 font-medium mb-1">
            Address Line 2
          </label>
          <input
            type="text"
            id="addressLine2"
            name="addressLine2"
            value={shippingAddress.addressLine2}
            onChange={handleShippingChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-purple"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="city" className="block text-gray-700 font-medium mb-1">
              City*
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={shippingAddress.city}
              onChange={handleShippingChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-purple"
              required
            />
          </div>
          
          <div>
            <label htmlFor="state" className="block text-gray-700 font-medium mb-1">
              State*
            </label>
            <input
              type="text"
              id="state"
              name="state"
              value={shippingAddress.state}
              onChange={handleShippingChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-purple"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="pincode" className="block text-gray-700 font-medium mb-1">
              Pincode*
            </label>
            <input
              type="text"
              id="pincode"
              name="pincode"
              value={shippingAddress.pincode}
              onChange={handleShippingChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-purple"
              required
              maxLength="6"
              pattern="[0-9]{6}"
            />
          </div>
          
          <div>
            <label htmlFor="country" className="block text-gray-700 font-medium mb-1">
              Country*
            </label>
            <select
              id="country"
              name="country"
              value={shippingAddress.country}
              onChange={handleShippingChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-purple"
              required
            >
              <option value="India">India</option>
              <option value="United States">United States</option>
              <option value="Canada">Canada</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Australia">Australia</option>
            </select>
          </div>
        </div>
      </form>
    </div>
  );
};

// Payment Step
const PaymentStep = ({ paymentMethod, handlePaymentChange }) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 flex items-center">
        <CreditCard size={24} className="mr-2 text-brand-purple" />
        Payment Method
      </h2>
      
      <div className="space-y-4">
        <div className={`border rounded-lg p-4 cursor-pointer transition-colors ${
          paymentMethod === 'card' ? 'border-brand-purple bg-purple-50' : 'border-gray-200 hover:border-brand-purple'
        }`}>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="paymentMethod"
              value="card"
              checked={paymentMethod === 'card'}
              onChange={() => handlePaymentChange('card')}
              className="mr-3 text-brand-purple focus:ring-brand-purple h-5 w-5"
            />
            <div>
              <h3 className="font-medium">Credit/Debit Card (Razorpay)</h3>
              <p className="text-gray-500 text-sm">Secure payment via Razorpay</p>
              <div className="mt-2 flex space-x-2">
                <img src="https://razorpay.com/assets/razorpay-glyph.svg" alt="Razorpay" className="h-6" />
              </div>
            </div>
          </label>
          
          {paymentMethod === 'card' && (
            <div className="mt-4 pl-8">
              <p className="text-sm text-gray-500">
                You'll be redirected to Razorpay's secure payment page to complete your transaction.
              </p>
            </div>
          )}
        </div>
        
        <div className={`border rounded-lg p-4 cursor-pointer transition-colors ${
          paymentMethod === 'upi' ? 'border-brand-purple bg-purple-50' : 'border-gray-200 hover:border-brand-purple'
        }`}>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="paymentMethod"
              value="upi"
              checked={paymentMethod === 'upi'}
              onChange={() => handlePaymentChange('upi')}
              className="mr-3 text-brand-purple focus:ring-brand-purple h-5 w-5"
            />
            <div>
              <h3 className="font-medium">UPI</h3>
              <p className="text-gray-500 text-sm">Pay using UPI apps like Google Pay, PhonePe, etc.</p>
            </div>
          </label>
          
          {paymentMethod === 'upi' && (
            <div className="mt-4 space-y-4 pl-8">
              <div>
                <label htmlFor="upiId" className="block text-gray-700 font-medium mb-1">
                  UPI ID
                </label>
                <input
                  type="text"
                  id="upiId"
                  placeholder="username@upi"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-purple"
                />
              </div>
            </div>
          )}
        </div>
        
        <div className={`border rounded-lg p-4 cursor-pointer transition-colors ${
          paymentMethod === 'cod' ? 'border-brand-purple bg-purple-50' : 'border-gray-200 hover:border-brand-purple'
        }`}>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="paymentMethod"
              value="cod"
              checked={paymentMethod === 'cod'}
              onChange={() => handlePaymentChange('cod')}
              className="mr-3 text-brand-purple focus:ring-brand-purple h-5 w-5"
            />
            <div>
              <h3 className="font-medium">Cash on Delivery</h3>
              <p className="text-gray-500 text-sm">Pay when your order is delivered</p>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};

// Review Step
const ReviewStep = ({ cart, shippingAddress, paymentMethod, total }) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Order Review</h2>
      
      <div className="space-y-8">
        {/* Order Items */}
        <div>
          <h3 className="text-lg font-medium mb-4">Items in Your Order</h3>
          <div className="divide-y divide-gray-200">
            {cart.map((item) => (
              <div key={item.id} className="py-4 flex items-center">
                <div className="w-16 h-16 mr-4">
                  <img
                    src={item.image || "https://via.placeholder.com/64x64?text=Product+Image"}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-gray-500 text-sm">
                    ₹{item.price.toFixed(2)} x {item.quantity}
                  </p>
                </div>
                <div className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Shipping Address */}
        <div>
          <h3 className="text-lg font-medium mb-4">Shipping Address</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-medium">{shippingAddress.name}</p>
            <p>{shippingAddress.phone}</p>
            <p>{shippingAddress.addressLine1}</p>
            {shippingAddress.addressLine2 && <p>{shippingAddress.addressLine2}</p>}
            <p>
              {shippingAddress.city}, {shippingAddress.state} {shippingAddress.pincode}
            </p>
            <p>{shippingAddress.country}</p>
          </div>
        </div>
        
        {/* Payment Method */}
        <div>
          <h3 className="text-lg font-medium mb-4">Payment Method</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="capitalize">
              {paymentMethod === 'cod' ? 'Cash on Delivery' : 
               paymentMethod === 'card' ? 'Credit/Debit Card (Razorpay)' : 
               paymentMethod.toUpperCase()}
            </p>
          </div>
        </div>
        
        {/* Order Summary */}
        <div>
          <h3 className="text-lg font-medium mb-4">Order Summary</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between font-medium text-lg pt-2 border-t border-gray-300 mt-2">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

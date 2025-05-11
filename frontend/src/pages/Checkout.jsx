
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useProduct } from '@/context/ProductContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { 
  CreditCard, 
  MoreHorizontal, 
  Clipboard, 
  ShoppingBag, 
  Phone,
  Mail,
  HomeIcon
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Checkout = () => {
  const location = useLocation();
  const buyNowItem = location.state?.buyNow ? location.state.buyNowProduct : null;
  const { 
    cart, 
    user, 
    placeOrder, 
    getCartTotal, 
    addresses, 
    savedPaymentMethods,
    storeSettings,
    addAddress,
    savePaymentMethod
  } = useProduct();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [newAddress, setNewAddress] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedUpi, setSelectedUpi] = useState(null);
  const [newCard, setNewCard] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
    save: false
  });
  const [upiId, setUpiId] = useState('');
  const [saveUpi, setSaveUpi] = useState(false);

  // Filter payment methods to only show the current user's cards and UPI IDs
  const userCards = user ? savedPaymentMethods.cards.filter(card => card.userId === user.id) : [];
  const userUpi = user ? savedPaymentMethods.upi.filter(upi => upi.userId === user.id) : [];

  // Use either the regular cart or the buy now item
  const checkoutItems = buyNowItem ? [buyNowItem] : cart;

  // Redirect if cart is empty and no buy now item
  useEffect(() => {
    if (checkoutItems.length === 0) {
      navigate('/cart');
    }
    // Set default selected address if available
    if (addresses.length > 0 && !selectedAddress) {
      setSelectedAddress(addresses[0]);
    }
  }, [checkoutItems, navigate, addresses, selectedAddress]);

  // Calculate cart total and shipping
  const cartTotal = buyNowItem 
    ? buyNowItem.price * buyNowItem.quantity 
    : getCartTotal();
  const shipping = cartTotal >= 1000 ? 0 : 100;
  const total = cartTotal + shipping;

  // Filter payment methods based on admin settings
  const availablePaymentMethods = {
    cod: storeSettings?.enableCod ?? true,
    card: storeSettings?.enableRazorpay ?? true,
    upi: storeSettings?.enableUpi ?? true
  };

  // Set default payment method based on available methods
  useEffect(() => {
    // Find first enabled payment method
    if (!availablePaymentMethods[paymentMethod]) {
      if (availablePaymentMethods.cod) setPaymentMethod('cod');
      else if (availablePaymentMethods.card) setPaymentMethod('card');
      else if (availablePaymentMethods.upi) setPaymentMethod('upi');
    }
  }, [storeSettings, availablePaymentMethods, paymentMethod]);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress({
      ...newAddress,
      [name]: value
    });
  };

  const handleCardChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewCard({
      ...newCard,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const nextStep = () => {
    // Validate current step
    if (step === 1 && !selectedAddress) {
      if (!newAddress.name || !newAddress.phone || !newAddress.street || !newAddress.city || !newAddress.state || !newAddress.pincode) {
        toast({
          title: "Missing information",
          description: "Please complete all address fields",
          variant: "destructive",
        });
        return;
      }
      
      // Save the new address to the user's profile if it's filled out
      const savedAddress = addAddress(newAddress);
      
      // Use the new address for checkout
      setSelectedAddress(savedAddress);
      
      toast({
        title: "Address Saved",
        description: "Your address has been saved to your profile",
      });
    }

    if (step === 2) {
      // Validate payment method
      if (paymentMethod === 'card' && !selectedCard) {
        if (!newCard.number || !newCard.name || !newCard.expiry || !newCard.cvv) {
          toast({
            title: "Missing payment information",
            description: "Please complete all card details",
            variant: "destructive",
          });
          return;
        }
        
        // Save the card if the checkbox is checked
        if (newCard.save) {
          savePaymentMethod('card', {
            number: newCard.number,
            name: newCard.name,
            expiry: newCard.expiry
            // CVV not saved for security reasons
          });
          
          toast({
            title: "Card Saved",
            description: "Your card has been saved to your profile",
          });
        }
      }
      
      if (paymentMethod === 'upi' && !selectedUpi && !upiId) {
        toast({
          title: "Missing UPI information",
          description: "Please enter UPI ID",
          variant: "destructive",
        });
        return;
      }
      
      // Save UPI if the checkbox is checked
      if (paymentMethod === 'upi' && !selectedUpi && upiId && saveUpi) {
        savePaymentMethod('upi', upiId);
        
        toast({
          title: "UPI Saved",
          description: "Your UPI ID has been saved to your profile",
        });
      }
    }

    setStep(step + 1);
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    let orderDetails = {
      address: selectedAddress,
      paymentMethod: paymentMethod,
      paymentDetails: {},
    };

    if (paymentMethod === 'card' && selectedCard) {
      orderDetails.paymentDetails = {
        cardId: selectedCard.id,
        lastFourDigits: selectedCard.number ? selectedCard.number.slice(-4) : 'XXXX',
      };
    } else if (paymentMethod === 'card' && newCard.number) {
      orderDetails.paymentDetails = {
        lastFourDigits: newCard.number ? newCard.number.slice(-4) : 'XXXX',
      };
      
      // Save card if it's new and the save option is checked (again to ensure it's saved)
      if (newCard.save) {
        savePaymentMethod('card', {
          number: newCard.number,
          name: newCard.name,
          expiry: newCard.expiry
        });
      }
    } else if (paymentMethod === 'upi' && selectedUpi) {
      orderDetails.paymentDetails = {
        upiId: selectedUpi.upiId
      };
    } else if (paymentMethod === 'upi' && upiId) {
      orderDetails.paymentDetails = {
        upiId: upiId
      };
      
      // Save UPI if it's new and the save option is checked (again to ensure it's saved)
      if (saveUpi) {
        savePaymentMethod('upi', upiId);
      }
    }

    try {
      // Use buy now item if present
      const newOrder = buyNowItem 
        ? placeOrder(orderDetails, [buyNowItem])
        : placeOrder(orderDetails);
      
      // Redirect to order success
      navigate(`/order/${newOrder.id}`);
      
      toast({
        title: "Order Placed!",
        description: "Your order has been placed successfully.",
      });
    } catch (error) {
      toast({
        title: "Error placing order",
        description: "There was a problem placing your order.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/cart">Cart</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/checkout">Checkout</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Checkout</h2>
            
            <div className="flex items-center mb-8">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-srblue text-white' : 'bg-gray-200'} mr-2`}>1</div>
              <div className={`flex-1 h-1 ${step >= 2 ? 'bg-srblue' : 'bg-gray-200'} mx-2`}></div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-srblue text-white' : 'bg-gray-200'} mr-2`}>2</div>
              <div className={`flex-1 h-1 ${step >= 3 ? 'bg-srblue' : 'bg-gray-200'} mx-2`}></div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 3 ? 'bg-srblue text-white' : 'bg-gray-200'}`}>3</div>
            </div>
            
            {/* Step 1: Shipping Address */}
            {step === 1 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Shipping Address</h3>
                
                {addresses.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-medium mb-3">Saved Addresses</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {addresses.map((address) => (
                        <Card 
                          key={address.id} 
                          className={`cursor-pointer transition-all ${selectedAddress && selectedAddress.id === address.id ? 'border-2 border-srblue' : ''}`}
                          onClick={() => setSelectedAddress(address)}
                        >
                          <CardHeader className="p-4 pb-2">
                            <CardTitle className="text-md flex items-center gap-2">
                              <HomeIcon className="h-4 w-4" />
                              {address.name}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-4 pt-0 text-sm">
                            <p>{address.street},</p>
                            <p>{address.city}, {address.state} - {address.pincode}</p>
                            <div className="flex items-center gap-3 mt-2">
                              <div className="flex items-center gap-1">
                                <Phone className="h-3 w-3 text-gray-500" />
                                <span>{address.phone}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Mail className="h-3 w-3 text-gray-500" />
                                <span>{address.email}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="mt-6">
                  <h4 className="font-medium mb-3">Add New Address</h4>
                  <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <Input
                        type="text"
                        name="name"
                        value={newAddress.name}
                        onChange={handleAddressChange}
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <Input
                        type="email"
                        name="email"
                        value={newAddress.email}
                        onChange={handleAddressChange}
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <Input
                        type="text"
                        name="phone"
                        value={newAddress.phone}
                        onChange={handleAddressChange}
                        placeholder="+91 9876543210"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                      <Input
                        type="text"
                        name="street"
                        value={newAddress.street}
                        onChange={handleAddressChange}
                        placeholder="123 Main St"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <Input
                        type="text"
                        name="city"
                        value={newAddress.city}
                        onChange={handleAddressChange}
                        placeholder="Mumbai"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                      <Input
                        type="text"
                        name="state"
                        value={newAddress.state}
                        onChange={handleAddressChange}
                        placeholder="Maharashtra"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">PIN Code</label>
                      <Input
                        type="text"
                        name="pincode"
                        value={newAddress.pincode}
                        onChange={handleAddressChange}
                        placeholder="400001"
                      />
                    </div>
                  </form>
                </div>
              </div>
            )}
            
            {/* Step 2: Payment Method */}
            {step === 2 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {availablePaymentMethods.cod && (
                    <Card 
                      className={`cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-2 border-srblue' : ''}`}
                      onClick={() => setPaymentMethod('cod')}
                    >
                      <CardContent className="flex items-center justify-center p-4 h-full">
                        <div className="text-center">
                          <ShoppingBag className="h-8 w-8 mx-auto mb-2 text-srblue" />
                          <p>Cash on Delivery</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  
                  {availablePaymentMethods.card && (
                    <Card 
                      className={`cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-2 border-srblue' : ''}`}
                      onClick={() => setPaymentMethod('card')}
                    >
                      <CardContent className="flex items-center justify-center p-4 h-full">
                        <div className="text-center">
                          <CreditCard className="h-8 w-8 mx-auto mb-2 text-srblue" />
                          <p>Credit/Debit Card</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  
                  {availablePaymentMethods.upi && (
                    <Card 
                      className={`cursor-pointer transition-all ${paymentMethod === 'upi' ? 'border-2 border-srblue' : ''}`}
                      onClick={() => setPaymentMethod('upi')}
                    >
                      <CardContent className="flex items-center justify-center p-4 h-full">
                        <div className="text-center">
                          <Clipboard className="h-8 w-8 mx-auto mb-2 text-srblue" />
                          <p>UPI</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
                
                {/* Cash on Delivery */}
                {paymentMethod === 'cod' && (
                  <div className="mt-4 border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium mb-2">Cash on Delivery</h4>
                    <p className="text-gray-600 text-sm mb-4">Pay when your order is delivered to your doorstep.</p>
                  </div>
                )}
                
                {/* Credit/Debit Card */}
                {paymentMethod === 'card' && (
                  <div className="mt-4">
                    {userCards.length > 0 && (
                      <div className="mb-6">
                        <h4 className="font-medium mb-3">Saved Cards</h4>
                        <div className="grid grid-cols-1 gap-3">
                          {userCards.map((card) => (
                            <Card 
                              key={card.id} 
                              className={`cursor-pointer transition-all ${selectedCard && selectedCard.id === card.id ? 'border-2 border-srblue' : ''}`}
                              onClick={() => {
                                setSelectedCard(card);
                                setNewCard({ number: '', name: '', expiry: '', cvv: '', save: false });
                              }}
                            >
                              <CardContent className="p-4 flex items-center justify-between">
                                <div>
                                  <p className="font-medium">{card.name}</p>
                                  <p className="text-gray-600 text-sm">•••• •••• •••• {card.number && card.number.slice(-4)}</p>
                                  <p className="text-gray-600 text-sm">{card.expiry}</p>
                                </div>
                                <CreditCard className="h-6 w-6 text-srblue" />
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium mb-3">Add New Card</h4>
                      <form className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                          <Input
                            type="text"
                            name="number"
                            value={newCard.number}
                            onChange={handleCardChange}
                            placeholder="1234 5678 9012 3456"
                            maxLength={16}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Name on Card</label>
                          <Input
                            type="text"
                            name="name"
                            value={newCard.name}
                            onChange={handleCardChange}
                            placeholder="John Doe"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Expiry (MM/YY)</label>
                            <Input
                              type="text"
                              name="expiry"
                              value={newCard.expiry}
                              onChange={handleCardChange}
                              placeholder="MM/YY"
                              maxLength={5}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                            <Input
                              type="text"
                              name="cvv"
                              value={newCard.cvv}
                              onChange={handleCardChange}
                              placeholder="123"
                              maxLength={3}
                            />
                          </div>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="save-card"
                            name="save"
                            checked={newCard.save}
                            onChange={handleCardChange}
                            className="h-4 w-4 rounded border-gray-300 text-srblue focus:ring-srblue"
                          />
                          <label htmlFor="save-card" className="ml-2 block text-sm text-gray-900">
                            Save card for future payments
                          </label>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
                
                {/* UPI */}
                {paymentMethod === 'upi' && (
                  <div className="mt-4">
                    {userUpi.length > 0 && (
                      <div className="mb-6">
                        <h4 className="font-medium mb-3">Saved UPI IDs</h4>
                        <div className="grid grid-cols-1 gap-3">
                          {userUpi.map((upi) => (
                            <Card 
                              key={upi.id} 
                              className={`cursor-pointer transition-all ${selectedUpi && selectedUpi.id === upi.id ? 'border-2 border-srblue' : ''}`}
                              onClick={() => {
                                setSelectedUpi(upi);
                                setUpiId('');
                              }}
                            >
                              <CardContent className="p-4 flex items-center justify-between">
                                <p className="font-medium">{upi.upiId}</p>
                                <Clipboard className="h-6 w-6 text-srblue" />
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium mb-3">Enter UPI ID</h4>
                      <div className="mb-4">
                        <Input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="name@upi"
                        />
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="save-upi"
                          checked={saveUpi}
                          onChange={(e) => setSaveUpi(e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300 text-srblue focus:ring-srblue"
                        />
                        <label htmlFor="save-upi" className="ml-2 block text-sm text-gray-900">
                          Save UPI ID for future payments
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Step 3: Review Order */}
            {step === 3 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Review Order</h3>
                
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Shipping Address</h4>
                  <div className="border border-gray-200 rounded-lg p-4 text-sm">
                    <p className="font-semibold">{selectedAddress.name}</p>
                    <p>{selectedAddress.street},</p>
                    <p>{selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}</p>
                    <p className="mt-1">Phone: {selectedAddress.phone}</p>
                    <p>Email: {selectedAddress.email}</p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Payment Method</h4>
                  <div className="border border-gray-200 rounded-lg p-4">
                    {paymentMethod === 'cod' && (
                      <div className="flex items-center">
                        <ShoppingBag className="h-5 w-5 mr-2 text-srblue" />
                        <p>Cash on Delivery</p>
                      </div>
                    )}
                    {paymentMethod === 'card' && selectedCard && (
                      <div className="flex items-center">
                        <CreditCard className="h-5 w-5 mr-2 text-srblue" />
                        <div>
                          <p>Credit/Debit Card</p>
                          <p className="text-sm text-gray-600">
                            •••• {selectedCard.number ? selectedCard.number.slice(-4) : 'XXXX'}
                          </p>
                        </div>
                      </div>
                    )}
                    {paymentMethod === 'card' && !selectedCard && newCard.number && (
                      <div className="flex items-center">
                        <CreditCard className="h-5 w-5 mr-2 text-srblue" />
                        <div>
                          <p>Credit/Debit Card</p>
                          <p className="text-sm text-gray-600">
                            •••• {newCard.number ? newCard.number.slice(-4) : 'XXXX'}
                          </p>
                        </div>
                      </div>
                    )}
                    {paymentMethod === 'upi' && selectedUpi && (
                      <div className="flex items-center">
                        <Clipboard className="h-5 w-5 mr-2 text-srblue" />
                        <div>
                          <p>UPI</p>
                          <p className="text-sm text-gray-600">{selectedUpi.upiId}</p>
                        </div>
                      </div>
                    )}
                    {paymentMethod === 'upi' && !selectedUpi && upiId && (
                      <div className="flex items-center">
                        <Clipboard className="h-5 w-5 mr-2 text-srblue" />
                        <div>
                          <p>UPI</p>
                          <p className="text-sm text-gray-600">{upiId}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Order Items</h4>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    {checkoutItems.map((item) => (
                      <div key={item.id} className="flex items-center p-4 border-b border-gray-200 last:border-b-0">
                        <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden mr-4">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200">
                              <ShoppingBag className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium">{item.name}</h5>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                          <p className="text-sm text-gray-600">₹{item.price.toFixed(2)} each</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-between mt-6">
              {step > 1 && (
                <Button variant="outline" onClick={prevStep} disabled={isSubmitting}>
                  Back
                </Button>
              )}
              {step < 3 && (
                <Button onClick={nextStep} className="ml-auto">
                  Continue
                </Button>
              )}
              {step === 3 && (
                <Button 
                  onClick={handleOrderSubmit} 
                  disabled={isSubmitting || checkoutItems.length === 0}
                  className="ml-auto"
                >
                  {isSubmitting ? 'Processing...' : 'Place Order'}
                </Button>
              )}
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
            <div className="space-y-4">
              {checkoutItems.map((item) => (
                <div key={item.id} className="flex items-center">
                  <div className="w-12 h-12 flex-shrink-0 bg-gray-100 rounded overflow-hidden mr-3">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <ShoppingBag className="h-4 w-4 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h5 className="text-sm font-medium truncate w-28">{item.name}</h5>
                      <p className="text-sm font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
              
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">{shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}</span>
                </div>
                {shipping === 0 && (
                  <div className="text-green-600 text-xs mb-2">Free shipping on orders over ₹1000</div>
                )}
                <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                  <span className="font-semibold">Total</span>
                  <span className="font-semibold">₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
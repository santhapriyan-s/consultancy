
import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useProduct } from '@/context/ProductContext';
import { 
  Package, User, MapPin, Gift, CreditCard, Star, Tag, Heart, LogOut, AlertCircle, Plus, Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Profile = () => {
  const { section } = useParams();
  const { 
    isLoggedIn, 
    user, 
    logout, 
    orders, 
    addresses, 
    addAddress, 
    favorites,
    products, 
    savedPaymentMethods, 
    savePaymentMethod, 
    removePaymentMethod 
  } = useProduct();
  
  // These states are for the form inputs
  const [newAddress, setNewAddress] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [isUpiDialogOpen, setIsUpiDialogOpen] = useState(false);
  const [isCardDialogOpen, setIsCardDialogOpen] = useState(false);
  const [newUpi, setNewUpi] = useState('');
  const [newCard, setNewCard] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: ''
  });

  // Redirect to login if not logged in
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  // Handle tab selection
  const selectedTab = section || 'orders';

  // Get user-specific payment methods
  const userPaymentMethods = {
    cards: savedPaymentMethods.cards ? savedPaymentMethods.cards.filter(card => card.userId === user.id) : [],
    upi: savedPaymentMethods.upi ? savedPaymentMethods.upi.filter(upi => upi.userId === user.id) : []
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    addAddress(newAddress);
    setNewAddress({
      name: '',
      phone: '',
      street: '',
      city: '',
      state: '',
      pincode: ''
    });
    setIsAddressDialogOpen(false);
  };

  const handleUpiSubmit = (e) => {
    e.preventDefault();
    if (newUpi.trim()) {
      savePaymentMethod('upi', newUpi);
      setNewUpi('');
      setIsUpiDialogOpen(false);
    }
  };

  const handleCardSubmit = (e) => {
    e.preventDefault();
    if (newCard.cardNumber && newCard.cardName && newCard.expiry) {
      savePaymentMethod('card', newCard);
      setNewCard({
        cardNumber: '',
        cardName: '',
        expiry: '',
        cvv: ''
      });
      setIsCardDialogOpen(false);
    }
  };

  const handleRemovePaymentMethod = (type, id) => {
    removePaymentMethod(type, id);
  };

  // Define sidebar links
  const profileSections = [
    { id: 'orders', label: 'My Orders', icon: <Package className="h-5 w-5 mr-2" /> },
    { id: 'info', label: 'Profile Information', icon: <User className="h-5 w-5 mr-2" /> },
    { id: 'addresses', label: 'Manage Addresses', icon: <MapPin className="h-5 w-5 mr-2" /> },
    { id: 'gift-cards', label: 'Gift Cards', icon: <Gift className="h-5 w-5 mr-2" /> },
    { id: 'upi', label: 'Saved UPI', icon: <CreditCard className="h-5 w-5 mr-2" /> },
    { id: 'cards', label: 'Saved Cards', icon: <CreditCard className="h-5 w-5 mr-2" /> },
    { id: 'reviews', label: 'My Reviews & Ratings', icon: <Star className="h-5 w-5 mr-2" /> },
    { id: 'coupons', label: 'My Coupons', icon: <Tag className="h-5 w-5 mr-2" /> }
  ];

  // Get user-specific reviews
  const userReviews = products
    .filter(product => product.reviews && product.reviews.some(review => review.userId === user.id))
    .flatMap(product => 
      product.reviews
        .filter(review => review.userId === user.id)
        .map(review => ({ ...review, product }))
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 mx-auto mb-3">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <h3 className="font-semibold text-lg">{user?.name || 'User'}</h3>
              <p className="text-gray-500 text-sm">{user?.email || 'user@example.com'}</p>
            </div>
            
            <nav className="space-y-1">
              {profileSections.map((item) => (
                <Link
                  key={item.id}
                  to={`/profile${item.id === 'orders' ? '' : `/${item.id}`}`}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    selectedTab === item.id 
                      ? 'bg-srblue text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
              
              <Link
                to="/favorites"
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                <Heart className="h-5 w-5 mr-2" />
                My Wishlist
              </Link>
              
              <button
                onClick={logout}
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-red-500 hover:bg-red-50 w-full text-left"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <Card className="p-6">
            {selectedTab === 'orders' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">My Orders</h2>
                {orders.length > 0 ? (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div key={order.id} className="border rounded-lg overflow-hidden">
                        <div className="bg-gray-50 p-4 flex justify-between items-center">
                          <div>
                            <div className="text-sm text-gray-500">Order #{order.id}</div>
                            <div className="text-sm text-gray-500">
                              Placed on {new Date(order.date).toLocaleDateString()}
                            </div>
                          </div>
                          <div className={`
                            px-3 py-1 rounded-full text-sm font-medium
                            ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : ''}
                            ${order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' : ''}
                            ${order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' : ''}
                            ${order.status === 'Pending' ? 'bg-gray-100 text-gray-800' : ''}
                            ${order.status === 'Cancelled' ? 'bg-red-100 text-red-800' : ''}
                          `}>
                            {order.status}
                          </div>
                        </div>
                        
                        <div className="p-4">
                          <div className="space-y-4">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex items-center">
                                <div className="w-12 h-12 flex-shrink-0 mr-4 bg-gray-100 rounded">
                                  <img 
                                    src={item.image} 
                                    alt={item.name}
                                    className="w-full h-full object-cover rounded"
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = 'https://placehold.co/100/e2e8f0/1e293b?text=SR';
                                    }}
                                  />
                                </div>
                                <div className="flex-1">
                                  <Link to={`/products/${item.id}`} className="text-sm font-medium hover:text-srblue transition-colors">
                                    {item.name}
                                  </Link>
                                  <div className="text-sm text-gray-500">
                                    Quantity: {item.quantity}
                                  </div>
                                </div>
                                <div className="text-sm font-medium">
                                  ₹{(item.price * item.quantity).toFixed(2)}
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          <div className="mt-4 pt-4 border-t flex justify-between items-center">
                            <div className="text-xl font-bold">
                              Total: ₹{order.total.toFixed(2)}
                            </div>
                            <Link to={`/order/${order.id}`}>
                              <Button variant="outline">
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-medium mb-2">No orders yet</h3>
                    <p className="text-gray-500 mb-6">
                      When you place orders, they will appear here.
                    </p>
                    <Link to="/products">
                      <Button className="bg-srblue hover:bg-blue-700">
                        Shop Now
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            )}

            {selectedTab === 'info' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Profile Information</h2>
                <div className="max-w-md mx-auto">
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-gray-500">Full Name</div>
                      <div className="col-span-2 font-medium">{user?.name || 'Not provided'}</div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-gray-500">Email</div>
                      <div className="col-span-2 font-medium">{user?.email || 'Not provided'}</div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-gray-500">Phone</div>
                      <div className="col-span-2 font-medium">{user?.phone || 'Not provided'}</div>
                    </div>
                    
                    <div className="pt-4">
                      <Button variant="outline" className="w-full">
                        Edit Profile
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'addresses' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Manage Addresses</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Button className="w-full h-40 border-2 border-dashed flex flex-col items-center justify-center bg-white hover:bg-gray-50"
                      onClick={() => setIsAddressDialogOpen(true)}
                    >
                      <MapPin className="h-8 w-8 text-gray-400 mb-2" />
                      <span>Add New Address</span>
                    </Button>
                  </div>
                  
                  {addresses.map((address) => (
                    <div key={address.id} className="border rounded-lg p-4 relative">
                      <div className="font-semibold mb-1">{address.name}</div>
                      <div className="text-sm text-gray-600 mb-1">{address.phone}</div>
                      <div className="text-sm text-gray-600">
                        {address.street}, {address.city}, {address.state} - {address.pincode}
                      </div>
                      <div className="absolute top-2 right-2">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedTab === 'gift-cards' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Gift Cards</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="border rounded-lg p-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 -mt-8 -mr-8 bg-white bg-opacity-10 rounded-full"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 -mb-8 -ml-8 bg-white bg-opacity-10 rounded-full"></div>
                    
                    <div className="relative z-10">
                      <h3 className="font-bold text-xl mb-2">Welcome Bonus</h3>
                      <div className="flex justify-between items-center mb-4">
                        <div className="text-xs opacity-75">Valid till 31 Dec 2025</div>
                        <div className="text-2xl font-bold">₹500</div>
                      </div>
                      <div className="text-sm">Use code: <span className="font-mono font-bold">WELCOME500</span></div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4 bg-gradient-to-r from-green-500 to-teal-500 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 -mt-8 -mr-8 bg-white bg-opacity-10 rounded-full"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 -mb-8 -ml-8 bg-white bg-opacity-10 rounded-full"></div>
                    
                    <div className="relative z-10">
                      <h3 className="font-bold text-xl mb-2">Birthday Special</h3>
                      <div className="flex justify-between items-center mb-4">
                        <div className="text-xs opacity-75">Valid for 30 days</div>
                        <div className="text-2xl font-bold">₹200</div>
                      </div>
                      <div className="text-sm">Use code: <span className="font-mono font-bold">BDAY200</span></div>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-6">
                  <h3 className="font-semibold text-lg mb-4">Redeem Gift Card</h3>
                  <div className="flex gap-2">
                    <Input placeholder="Enter gift card code" className="flex-1" />
                    <Button>Redeem</Button>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'upi' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Saved UPI IDs</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userPaymentMethods.upi && userPaymentMethods.upi.length > 0 ? (
                    userPaymentMethods.upi.map(upi => (
                      <div key={upi.id} className="border rounded-lg p-4 relative">
                        <div className="font-semibold mb-1 flex items-center">
                          <span className="bg-blue-100 text-blue-800 p-1 rounded mr-2">UPI</span>
                          {upi.upiId}
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="absolute top-2 right-2 h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleRemovePaymentMethod('upi', upi.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-8">
                      <p className="text-gray-500 mb-4">You don't have any UPI IDs saved yet.</p>
                    </div>
                  )}
                  
                  <div className="col-span-1">
                    <Button 
                      variant="outline" 
                      className="w-full h-16 flex items-center justify-center"
                      onClick={() => setIsUpiDialogOpen(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add New UPI ID
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {selectedTab === 'cards' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Saved Payment Cards</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userPaymentMethods.cards && userPaymentMethods.cards.length > 0 ? (
                    userPaymentMethods.cards.map(card => (
                      <div key={card.id} className="border rounded-lg p-4 relative bg-gradient-to-r from-gray-100 to-gray-200">
                        <div className="font-semibold mb-2">{card.cardName}</div>
                        <div className="font-mono mb-2">
                          •••• •••• •••• {card.cardNumber && card.cardNumber.slice(-4)}
                        </div>
                        <div className="text-sm text-gray-500">
                          Expires: {card.expiry}
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="absolute top-2 right-2 h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleRemovePaymentMethod('card', card.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-8">
                      <p className="text-gray-500 mb-4">You don't have any cards saved yet.</p>
                    </div>
                  )}
                  
                  <div className="col-span-1">
                    <Button 
                      variant="outline" 
                      className="w-full h-16 flex items-center justify-center"
                      onClick={() => setIsCardDialogOpen(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Card
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'reviews' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">My Reviews & Ratings</h2>
                
                {userReviews.length > 0 ? (
                  <div className="space-y-6">
                    {userReviews.map(review => (
                      <div key={review.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <div className="w-12 h-12 flex-shrink-0 mr-4 bg-gray-100 rounded">
                              <img 
                                src={review.product.image} 
                                alt={review.product.name}
                                className="w-full h-full object-cover rounded"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = 'https://placehold.co/100/e2e8f0/1e293b?text=SR';
                                }}
                              />
                            </div>
                            <div>
                              <Link to={`/products/${review.product.id}`} className="font-medium hover:text-srblue transition-colors">
                                {review.product.name}
                              </Link>
                              <div className="flex items-center mt-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star 
                                    key={star} 
                                    className={`h-4 w-4 ${review.rating >= star ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-sm text-gray-500">
                            {new Date(review.date).toLocaleDateString()}
                          </div>
                        </div>
                        
                        <p className="text-gray-700">{review.comment}</p>
                        
                        <div className="mt-4 flex justify-end">
                          <Link to={`/products/${review.product.id}`}>
                            <Button variant="outline" size="sm">
                              Edit Review
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Star className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-medium mb-2">No Reviews Yet</h3>
                    <p className="text-gray-500 mb-6">
                      You haven't reviewed any products yet.
                    </p>
                    <Link to="/products">
                      <Button className="bg-srblue hover:bg-blue-700">
                        Browse Products
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            )}

            {selectedTab === 'coupons' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">My Coupons</h2>
                
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-lg">WELCOME10</div>
                      <div className="text-sm text-gray-500">10% off on your first order</div>
                      <div className="text-xs text-gray-400 mt-1">Valid till 31 Dec 2025</div>
                    </div>
                    <Button variant="outline" className="whitespace-nowrap">
                      Copy Code
                    </Button>
                  </div>
                  
                  <div className="border rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-lg">SUMMER25</div>
                      <div className="text-sm text-gray-500">25% off on summer collection</div>
                      <div className="text-xs text-gray-400 mt-1">Valid till 31 Aug 2025</div>
                    </div>
                    <Button variant="outline" className="whitespace-nowrap">
                      Copy Code
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Add Address Dialog */}
      <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Address</DialogTitle>
            <DialogDescription>
              Enter the details for your new delivery address.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleAddressSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={newAddress.name}
                    onChange={(e) => setNewAddress({...newAddress, name: e.target.value})}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={newAddress.phone}
                    onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                    placeholder="+91 9876543210"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="street">Street Address</Label>
                <Input
                  id="street"
                  value={newAddress.street}
                  onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
                  placeholder="123 Main Street, Apartment 4B"
                  required
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                    placeholder="Mumbai"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={newAddress.state}
                    onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                    placeholder="Maharashtra"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input
                    id="pincode"
                    value={newAddress.pincode}
                    onChange={(e) => setNewAddress({...newAddress, pincode: e.target.value})}
                    placeholder="400001"
                    required
                  />
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddressDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-srblue hover:bg-blue-700">
                Save Address
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add UPI Dialog */}
      <Dialog open={isUpiDialogOpen} onOpenChange={setIsUpiDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add UPI ID</DialogTitle>
            <DialogDescription>
              Enter your UPI ID to save it for future payments.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleUpiSubmit}>
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="upiId">UPI ID</Label>
                <Input
                  id="upiId"
                  value={newUpi}
                  onChange={(e) => setNewUpi(e.target.value)}
                  placeholder="yourname@upi"
                  required
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsUpiDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-srblue hover:bg-blue-700">
                Save UPI ID
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Card Dialog */}
      <Dialog open={isCardDialogOpen} onOpenChange={setIsCardDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Payment Card</DialogTitle>
            <DialogDescription>
              Enter your card details to save for future payments.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleCardSubmit}>
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  value={newCard.cardNumber}
                  onChange={(e) => setNewCard({...newCard, cardNumber: e.target.value})}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="cardName">Name on Card</Label>
                <Input
                  id="cardName"
                  value={newCard.cardName}
                  onChange={(e) => setNewCard({...newCard, cardName: e.target.value})}
                  placeholder="John Doe"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input
                    id="expiry"
                    value={newCard.expiry}
                    onChange={(e) => setNewCard({...newCard, expiry: e.target.value})}
                    placeholder="MM/YY"
                    maxLength={5}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    type="password"
                    value={newCard.cvv}
                    onChange={(e) => setNewCard({...newCard, cvv: e.target.value})}
                    placeholder="•••"
                    maxLength={3}
                    required
                  />
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCardDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-srblue hover:bg-blue-700">
                Save Card
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
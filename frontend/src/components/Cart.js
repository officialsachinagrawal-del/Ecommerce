import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { addToCart, removeFromCart } from '../actions/cartAction'
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

function Cart() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { cartItems } = useSelector(state => state.cart)
  const { isAuthenticated } = useSelector(state => state.user)
  const [removingId, setRemovingId] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    // Cleanup function to clear timer on unmount
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      setRemovingId(null);
    }
  }, [])

  const increaseQty = (id, quantity, stock) => {
    const newQty = quantity + 1
    if (newQty > stock) return;
    dispatch(addToCart(id, newQty))
  }

  const decreaseQty = (id, quantity) => {
    const newQty = quantity - 1
    if (newQty <= 0) return;
    dispatch(addToCart(id, newQty))
  }

  const removeItem = (id) => {
    setRemovingId(id);
    timerRef.current = setTimeout(() => {
      dispatch(removeFromCart(id))
      setRemovingId(null);
    }, 300);
  }

  const checkoutHandler = () => {
    if (isAuthenticated) {
      navigate('/shipping')
    } else {
      navigate('/login?redirect=shipping')
    }
  }

  const totalItems = cartItems.reduce((acc, item) => (acc + Number(item.quantity)), 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <RemoveShoppingCartIcon 
              sx={{ width: 100, height: 100, color: '#cbd5e1', marginBottom: 2 }}
            />
            <h1 className='text-2xl md:text-3xl font-bold text-secondary-900 mb-4'>Your Cart is Empty</h1>
            <p className='text-secondary-600 text-lg mb-8'>Start shopping to add items to your cart</p>
            <button 
              onClick={() => navigate('/products')}
              className="btn-primary"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="mb-12">
              <h1 className='text-3xl md:text-4xl font-bold text-secondary-900 mb-2'>Shopping Cart</h1>
              <p className="text-secondary-600">You have {totalItems} item{totalItems !== 1 ? 's' : ''} in your cart</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="space-y-4">
                  {cartItems && cartItems.map((item) => {
                    const { stock, quantity, image, price, name, product } = item
                    return (
                      <div 
                        key={product} 
                        className={`bg-white rounded-lg shadow-base hover:shadow-md transition-all duration-300 p-4 md:p-6 flex gap-4 md:gap-6 ${
                          removingId === product ? 'opacity-50 scale-95' : ''
                        }`}
                      >
                        {/* Product Image */}
                        <div className="flex-shrink-0 w-20 h-20 md:w-24 md:h-24 bg-secondary-100 rounded-lg overflow-hidden">
                          <img 
                            src={image} 
                            alt={name}
                            className='w-full h-full object-cover'
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-grow">
                          <h3 className='text-base md:text-lg font-semibold text-secondary-900 mb-1'>{name}</h3>
                          <p className='text-primary-600 font-bold text-lg md:text-xl mb-4'>
                            ₹{Number(price).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                          
                          {/* Quantity Controls */}
                          <div className='flex items-center gap-3 mb-4'>
                            <span className='text-sm text-secondary-600'>Qty:</span>
                            <div className='flex items-center border border-secondary-300 rounded-lg overflow-hidden'>
                              <button 
                                onClick={() => decreaseQty(product, quantity)}
                                className="bg-secondary-100 text-secondary-600 hover:bg-secondary-200 px-2 py-1 transition-colors"
                              >
                                −
                              </button>
                              <span className="px-4 py-1 font-semibold text-secondary-900">{quantity}</span>
                              <button 
                                onClick={() => increaseQty(product, quantity, stock)}
                                className="bg-secondary-100 text-secondary-600 hover:bg-secondary-200 px-2 py-1 transition-colors"
                                disabled={quantity >= stock}
                              >
                                +
                              </button>
                            </div>
                            <span className="text-xs text-secondary-500">({stock} available)</span>
                          </div>

                          {/* Subtotal */}
                          <p className="text-sm text-secondary-600">
                            Subtotal: <span className="font-bold text-secondary-900">
                              ₹{(quantity * price).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                          </p>
                        </div>

                        {/* Remove Button */}
                        <button 
                          onClick={() => removeItem(product)}
                          className='flex-shrink-0 p-2 text-danger hover:bg-danger hover:text-white rounded-lg transition-colors'
                        >
                          <DeleteIcon />
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 bg-white rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-bold text-secondary-900 mb-6">Order Summary</h2>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-secondary-600">
                      <span>Subtotal ({totalItems} items)</span>
                      <span className="font-semibold">₹{totalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    
                    <div className="flex justify-between text-secondary-600">
                      <span>Shipping</span>
                      <span className="font-semibold text-success">FREE</span>
                    </div>
                    
                    <div className="flex justify-between text-secondary-600">
                      <span>Tax</span>
                      <span className="font-semibold">Calculated at checkout</span>
                    </div>
                    
                    <div className="border-t border-secondary-200 pt-4">
                      <div className="flex justify-between text-lg">
                        <span className="font-bold text-secondary-900">Total</span>
                        <span className="font-bold text-primary-600">
                          ₹{totalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={checkoutHandler}
                    className="w-full btn-primary mb-3"
                  >
                    Proceed to Checkout
                  </button>

                  <button 
                    onClick={() => navigate('/products')}
                    className="w-full btn-secondary"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart

import React from 'react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import Carousel from 'react-material-ui-carousel'
import { useSelector, useDispatch } from 'react-redux'
import { getProductDetails } from '../actions/productAction'
import Loader from './Layout/loader';
import ReviewCard from './ReviewCard';
import { useAlert } from 'react-alert';
import MetaData from './Layout/MetaData';
import { addToCart } from '../actions/cartAction';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Rating from '@mui/material/Rating';
import { newReview } from '../actions/productAction';
import noImage from '../assets/no-image.svg'
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { NEW_REVIEW_RESET } from '../constants/productConstant'

function ProductDetails() {
  const alert = useAlert();
  const [quantity, setQuantity] = useState(1)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [open, setOpen] = useState(false);

  const incrementQuantity = () => {
    const count = quantity + 1
    if (count > product.quantity) return;
    setQuantity(count)
  }

  const decrementQuantity = () => {
    const count = quantity - 1
    if (count < 1) return;
    setQuantity(count)
  }

  const { id } = useParams()
  const dispatch = useDispatch()
  const { loading, error, product } = useSelector(state => state.productDetails)
  const { success, error: reviewError } = useSelector(state => state.newReview)

  const addToCartHandler = () => {
    dispatch(addToCart(id, quantity))
    alert.success('Item Added to Cart')
  }

  const submitReviewToggle = () => {
    setOpen(!open)
  }

  const submitReviewHandler = () => {
    const formData = new FormData()
    formData.set('rating', rating)
    formData.set('comment', comment)
    formData.set('productId', id)
    dispatch(newReview(formData))
    setOpen(false)
  }

  useEffect(() => {
    if (error) {
      alert.error(error)
    }
    if (reviewError) {
      alert.error(reviewError)
    }
    if (success) {
      alert.success('Review Posted Successfully')
      dispatch({ type: NEW_REVIEW_RESET })
    }
    dispatch(getProductDetails(id))
  }, [dispatch, id, alert, error, reviewError, success])

  return (
    <>
      <MetaData title={product.name} />
      
      {loading ? <Loader /> : (
        <div className="min-h-screen bg-secondary-50">
          {/* Breadcrumb */}
          <div className="bg-white border-b border-secondary-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center gap-2 text-sm text-secondary-600">
                <a href="/products" className="hover:text-primary-600">Products</a>
                <span>/</span>
                <span className="font-medium text-secondary-900">{product.name}</span>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-16">
              
              {/* Product Images */}
              <div className="bg-white rounded-lg shadow-base p-6 sticky top-24 h-fit">
                <Carousel
                  navButtonsAlwaysVisible={true}
                  sx={{
                    '& .MuiIconButton-root': {
                      backgroundColor: 'rgba(14, 165, 233, 0.8)',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'rgba(14, 165, 233, 1)',
                      }
                    }
                  }}
                >
                  {product.images && product.images.map((item, i) => (
                    <img
                      key={i}
                      className='w-full h-[400px] md:h-[500px] object-contain'
                      src={item?.url || noImage}
                      alt={`${product.name} ${i + 1}`}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = noImage;
                      }}
                    />
                  ))}
                </Carousel>
              </div>

              {/* Product Info */}
              <div>
                {/* Title & Rating */}
                <div className="mb-6">
                  <h1 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
                    {product.name}
                  </h1>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Rating 
                        readOnly 
                        precision={0.5} 
                        value={Number(product.ratings) || 0} 
                        size="medium"
                        sx={{ color: '#f59e0b' }}
                      />
                      <span className="text-secondary-600 text-sm">
                        ({product.numOfReviews} reviews)
                      </span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-6 pb-6 border-b border-secondary-200">
                    <p className="text-4xl font-bold text-primary-600 mb-2">
                      ₹{Number(product.price).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <p className="text-secondary-600">
                      {product.quantity > 0 ? (
                        <span className="flex items-center gap-2 text-success font-semibold">
                          <CheckCircleIcon sx={{ width: 20, height: 20 }} />
                          In Stock
                        </span>
                      ) : (
                        <span className="flex items-center gap-2 text-danger font-semibold">
                          <CancelIcon sx={{ width: 20, height: 20 }} />
                          Out of Stock
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-8 pb-8 border-b border-secondary-200">
                  <h3 className="text-lg font-semibold text-secondary-900 mb-3">Description</h3>
                  <p className="text-secondary-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Quantity & Add to Cart */}
                <div className="mb-8">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-secondary-700 font-medium">Quantity:</span>
                    <div className="flex items-center border border-secondary-300 rounded-lg overflow-hidden">
                      <button
                        onClick={decrementQuantity}
                        disabled={quantity <= 1}
                        className="p-2 text-secondary-600 hover:bg-secondary-100 transition-colors disabled:opacity-50"
                      >
                        <RemoveIcon sx={{ width: 20, height: 20 }} />
                      </button>
                      <span className="px-6 py-2 font-bold text-secondary-900">{quantity}</span>
                      <button
                        onClick={incrementQuantity}
                        disabled={quantity >= product.quantity}
                        className="p-2 text-secondary-600 hover:bg-secondary-100 transition-colors disabled:opacity-50"
                      >
                        <AddIcon sx={{ width: 20, height: 20 }} />
                      </button>
                    </div>
                    <span className="text-sm text-secondary-600">
                      ({product.quantity} available)
                    </span>
                  </div>

                  <button
                    disabled={product.quantity < 1}
                    onClick={addToCartHandler}
                    className="w-full btn-primary flex items-center justify-center gap-2 text-lg py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingCartIcon sx={{ width: 24, height: 24 }} />
                    Add to Cart
                  </button>
                </div>

                {/* Review Button */}
                <button
                  onClick={submitReviewToggle}
                  className="w-full btn-secondary"
                >
                  Write a Review
                </button>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-16 pt-16 border-t border-secondary-200">
              <h2 className="text-3xl font-bold text-secondary-900 mb-8">Customer Reviews</h2>

              {/* Review Modal */}
              <Dialog
                open={open}
                onClose={submitReviewToggle}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                  sx: {
                    borderRadius: '0.75rem',
                  }
                }}
              >
                <DialogTitle className="text-lg font-bold text-secondary-900">
                  Share Your Review
                </DialogTitle>

                <DialogContent className="py-6">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Rating
                      </label>
                      <Rating
                        onChange={(e) => setRating(e.target.value)}
                        value={Number(rating)}
                        size="large"
                        sx={{ color: '#f59e0b' }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Your Review
                      </label>
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows="4"
                        className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Share your thoughts about this product..."
                        maxLength={500}
                      />
                      <p className="text-xs text-secondary-500 mt-1">
                        {comment.length}/500 characters
                      </p>
                    </div>
                  </div>
                </DialogContent>

                <DialogActions className="p-4 gap-2">
                  <button
                    onClick={submitReviewToggle}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitReviewHandler}
                    className="btn-primary"
                  >
                    Submit Review
                  </button>
                </DialogActions>
              </Dialog>

              {/* Reviews List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map((review) => (
                    <ReviewCard key={review._id || review.user} review={review} />
                  ))
                ) : (
                  <div className="col-span-full bg-white rounded-lg shadow-base p-12 text-center">
                    <p className="text-secondary-600 text-lg">
                      No reviews yet. Be the first to review this product!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ProductDetails;

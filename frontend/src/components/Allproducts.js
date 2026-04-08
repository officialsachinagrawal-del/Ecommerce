import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getProducts, clearErrors } from '../actions/productAction'
import Loader from './Layout/loader'
import Product from './Product'
import { useEffect, useState } from 'react'
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import { useAlert } from 'react-alert'
import MetaData from './Layout/MetaData'
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';

function Allproducts() {
  const [keyword] = useState('')
  const [page, setPage] = useState(1)
  const [price, setPrice] = useState([1, 500])
  const [ratings, setRatings] = useState(0)
  const [category, setCategory] = useState('')
  const [showFilters, setShowFilters] = useState(false);

  const dispatch = useDispatch()
  const alert = useAlert()

  const { loading, products, error, productsCount, limit } = useSelector(state => state.products)

  const safeProductsCount = Number(productsCount) || 0
  const safeLimit = Number(limit) || 1
  const count = Math.ceil(safeProductsCount / safeLimit)

  const categories = ['Electronics', 'Cameras', 'Laptop', 'Accessories', 'Headphones', 'Food', 'Books', 'Clothes/Shoes'];

  const handlePageChange = (_, value) => {
    setPage(value);
    window.scrollTo(0, 0);
  }

  const priceHandler = (event, newValue) => {
    setPrice(newValue);
  };

  useEffect(() => {
    if (error) {
      alert.error(error)
      dispatch(clearErrors())
    }
    dispatch(getProducts(keyword, page, price, category, ratings))
  }, [dispatch, page, error, keyword, price, category, ratings, alert])

  return (
    <>
      <MetaData title='All Products' />

      <div className="min-h-screen bg-secondary-50">
        {/* Page Header */}
        <div className="bg-white border-b border-secondary-200 py-6 md:py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-2">
              All Products
            </h1>
            <p className="text-secondary-600">
              {safeProductsCount > 0 && `Showing ${(page - 1) * safeLimit + 1} - ${Math.min(page * safeLimit, safeProductsCount)} of ${safeProductsCount} products`}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Filters Sidebar - Desktop */}
            <div className="hidden lg:block">
              <div className="sticky top-24">
                <FilterSidebar 
                  price={price}
                  priceHandler={priceHandler}
                  categories={categories}
                  category={category}
                  setCategory={setCategory}
                  ratings={ratings}
                  setRatings={setRatings}
                />
              </div>
            </div>

            {/* Filters Sidebar - Mobile */}
            {showFilters && (
              <div className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden">
                <div className="fixed left-0 top-0 h-full w-full max-w-xs bg-white overflow-y-auto">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold text-secondary-900">Filters</h2>
                      <button onClick={() => setShowFilters(false)}>
                        <CloseIcon />
                      </button>
                    </div>
                    <FilterSidebar 
                      price={price}
                      priceHandler={priceHandler}
                      categories={categories}
                      category={category}
                      setCategory={setCategory}
                      ratings={ratings}
                      setRatings={setRatings}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Products Grid */}
            <div className="lg:col-span-3">
              {/* Filter Toggle Button - Mobile */}
              <div className="lg:hidden mb-6">
                <button 
                  onClick={() => setShowFilters(true)}
                  className="w-full flex items-center justify-center gap-2 bg-white border border-secondary-200 rounded-lg px-4 py-3 font-medium text-secondary-900 hover:bg-secondary-50 transition-colors"
                >
                  <FilterListIcon sx={{ width: 20, height: 20 }} />
                  Show Filters
                </button>
              </div>

              {loading ? (
                <Loader />
              ) : (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-12">
                    {products && products.map((product) => (
                      <div key={product._id} className="animate-fade-in">
                        <Product 
                          id={product._id} 
                          name={product.name} 
                          price={product.price} 
                          image={product.images} 
                          rating={product.rating} 
                          ratings={product.ratings} 
                          reviewsCount={product.numOfReviews}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {count > 1 && (
                    <div className="flex justify-center mt-12 pt-8 border-t border-secondary-200">
                      <Stack spacing={2}>
                        <Pagination 
                          onChange={handlePageChange} 
                          count={count} 
                          color="primary"
                          shape="rounded"
                          sx={{
                            '& .MuiPaginationItem-root': {
                              borderRadius: '0.5rem',
                              '&:hover': {
                                backgroundColor: '#e0f2fe',
                              }
                            },
                            '& .Mui-selected': {
                              background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                              '&:hover': {
                                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                              }
                            }
                          }}
                        />
                      </Stack>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function FilterSidebar({ price, priceHandler, categories, category, setCategory, ratings, setRatings }) {
  return (
    <div className="space-y-6">
      {/* Price Filter */}
      <div className="bg-white rounded-lg shadow-base p-6">
        <h3 className="text-lg font-bold text-secondary-900 mb-4">Price Range</h3>
        <Slider
          value={price}
          onChange={priceHandler}
          valueLabelDisplay="auto"
          min={1}
          max={500}
          disableSwap
          sx={{
            '& .MuiSlider-thumb': {
              backgroundColor: '#0ea5e9',
              '&:hover': {
                boxShadow: '0 0 0 8px rgba(14, 165, 233, 0.16)',
              }
            },
            '& .MuiSlider-track': {
              background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
              border: 'none',
            },
            '& .MuiSlider-rail': {
              backgroundColor: '#e2e8f0',
            }
          }}
        />
        <div className="flex justify-between text-sm text-secondary-600 mt-4">
          <span>₹{price[0]}</span>
          <span>₹{price[1]}</span>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white rounded-lg shadow-base p-6">
        <h3 className="text-lg font-bold text-secondary-900 mb-4">Categories</h3>
        <div className="space-y-3">
          <button
            onClick={() => setCategory('')}
            className={`w-full text-left px-4 py-2 rounded-lg transition-all ${
              category === ''
                ? 'bg-primary-100 text-primary-700 font-semibold'
                : 'text-secondary-600 hover:bg-secondary-100'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`w-full text-left px-4 py-2 rounded-lg transition-all ${
                category === cat
                  ? 'bg-primary-100 text-primary-700 font-semibold'
                  : 'text-secondary-600 hover:bg-secondary-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Rating Filter */}
      <div className="bg-white rounded-lg shadow-base p-6">
        <h3 className="text-lg font-bold text-secondary-900 mb-4">Rating</h3>
        <Slider
          value={ratings}
          onChange={(e, newRating) => setRatings(newRating)}
          valueLabelDisplay="auto"
          min={0}
          max={5}
          step={0.5}
          marks={true}
          sx={{
            '& .MuiSlider-thumb': {
              backgroundColor: '#0ea5e9',
              '&:hover': {
                boxShadow: '0 0 0 8px rgba(14, 165, 233, 0.16)',
              }
            },
            '& .MuiSlider-track': {
              background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
              border: 'none',
            },
            '& .MuiSlider-rail': {
              backgroundColor: '#e2e8f0',
            },
            '& .MuiSlider-mark': {
              backgroundColor: '#cbd5e1',
            }
          }}
        />
        <p className="text-sm text-secondary-600 mt-4">
          {ratings === 0 ? 'All ratings' : `${ratings} stars & up`}
        </p>
      </div>
    </div>
  )
}

export default Allproducts

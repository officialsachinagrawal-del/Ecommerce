import React from 'react';
import Product from './Product';
import MetaData from './Layout/MetaData';
import { getProducts } from '../actions/productAction';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import Loader from './Layout/loader';
import { useAlert } from 'react-alert';
import { useNavigate } from 'react-router-dom';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

function Home() {
  const alert = useAlert();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, products, error, productsCount } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    if (error) {
      alert.error(error);
    }
    dispatch(getProducts('', 1, [1, 500], '', 0, 16))
  }, [dispatch, alert, error])

  return (
    <>
      <MetaData title="Home" />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 via-primary-500 to-primary-700 py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -left-20 -top-20"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full -right-20 -bottom-20"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-slide-up">
              Welcome to SmartShop
            </h1>
            <p className="text-lg md:text-2xl text-primary-100 mb-8 max-w-3xl mx-auto">
              Discover an exclusive collection of amazing products at unbeatable prices. Shop with confidence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/products')}
                className="btn-primary flex items-center justify-center gap-2 bg-white text-primary-600 hover:bg-primary-50"
              >
                Shop Now
                <ArrowRightIcon sx={{ width: 20, height: 20 }} />
              </button>
              <button 
                onClick={() => navigate('/products')}
                className="btn-secondary hover:bg-primary-500 hover:text-white border-white text-white"
              >
                Explore Collection
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
            Featured Products
          </h2>
          <p className="text-secondary-600 text-lg max-w-2xl mx-auto">
            Handpicked items selected just for you. Don't miss out on these trending products.
          </p>
          <div className="h-1 w-16 bg-gradient-to-r from-primary-500 to-primary-600 mx-auto mt-6 rounded-full"></div>
        </div>

        {loading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
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
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-secondary-50 border-t border-secondary-200 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
            Don't Find What You're Looking For?
          </h2>
          <p className="text-secondary-600 text-lg mb-8 max-w-2xl mx-auto">
            Browse our complete collection and discover thousands of products.
          </p>
          <button 
            onClick={() => navigate('/products')}
            className="btn-primary"
          >
            View All Products
          </button>
        </div>
      </div>
    </>
  );
}

export default Home;

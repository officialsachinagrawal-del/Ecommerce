import React from 'react'
import { Link } from 'react-router-dom'
import Rating from '@mui/material/Rating'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useState, useEffect } from 'react';
import noImage from '../assets/no-image.svg'
import { optimizeImageUrl } from '../imageUtils';

function Product({id, name, price, image, rating, reviewsCount, ratings}) {
  const [isFavorite, setIsFavorite] = useState(false);

  // Cleanup function (if needed in future)
  useEffect(() => {
    return () => {
      setIsFavorite(false);
    }
  }, [])

  const productImage =
    Array.isArray(image) && image[0]?.url
      ? optimizeImageUrl(image[0].url, { width: 520, height: 520 })
      : noImage;
  
  return (
    <Link to={`/product/${id}`} className="group">
      <div className="bg-white rounded-xl shadow-base hover:shadow-lg transition-all duration-300 overflow-hidden hover:-translate-y-2">
        
        {/* Image Container */}
        <div className="relative bg-secondary-50 overflow-hidden h-48 md:h-64 flex items-center justify-center">
          <img
            src={productImage}
            alt={name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = noImage;
            }}
          />
          
          {/* Overlay Badge */}
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
          
          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsFavorite(!isFavorite);
            }}
            className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300"
          >
            {isFavorite ? (
              <FavoriteIcon sx={{ color: '#ef4444', width: 20, height: 20 }} />
            ) : (
              <FavoriteBorderIcon sx={{ color: '#cbd5e1', width: 20, height: 20 }} />
            )}
          </button>

          {/* New Badge */}
          <div className="absolute top-3 left-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
            New
          </div>
        </div>

        {/* Content Container */}
        <div className="p-4 md:p-5">
          {/* Product Name */}
          <h3 className="text-sm md:text-base font-semibold text-secondary-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <Rating 
              readOnly 
              precision={0.5} 
              value={Number(ratings) || 0} 
              size="small"
              sx={{ color: '#f59e0b' }}
            />
            <span className="text-xs text-secondary-500">({reviewsCount})</span>
          </div>

          {/* Price */}
          <div className="mb-4">
            <p className="text-lg md:text-xl font-bold text-secondary-900">
              ₹{Number(price).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>

          {/* Add to Cart Button */}
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold py-2 px-3 rounded-lg hover:shadow-md transition-all duration-300 text-sm md:text-base"
          >
            View Details
          </button>
        </div>
      </div>
    </Link>
  )
}

export default Product

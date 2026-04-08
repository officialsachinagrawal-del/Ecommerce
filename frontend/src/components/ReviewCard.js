import React from 'react'
import Rating from '@mui/material/Rating'
import userIcon from '../assets/user.png'
import VerifiedIcon from '@mui/icons-material/Verified';

function ReviewCard({ review }) {
  return (
    <div className="bg-white rounded-lg shadow-base p-6 hover:shadow-md transition-all duration-300">
      {/* Header with User Info */}
      <div className="flex items-start gap-4 mb-4">
        <div className="flex-shrink-0">
          <img 
            src={userIcon} 
            className='w-12 h-12 rounded-full object-cover border-2 border-primary-200' 
            alt="User"
          />
        </div>
        
        <div className="flex-grow">
          <div className="flex items-center gap-2">
            <h3 className="text-base md:text-lg font-semibold text-secondary-900">
              {review.name || 'Anonymous'}
            </h3>
            <VerifiedIcon sx={{ width: 16, height: 16, color: '#10b981' }} />
          </div>
          
          <div className="flex items-center gap-2 mt-1">
            <Rating 
              readOnly 
              precision={0.5} 
              value={Number(review.rating) || 0} 
              size="small"
              sx={{ color: '#f59e0b' }}
            />
            <span className="text-xs text-secondary-500">
              {review.rating} out of 5
            </span>
          </div>
        </div>
      </div>

      {/* Review Comment */}
      <p className="text-secondary-700 leading-relaxed line-clamp-4 text-sm md:text-base">
        {review.comment || 'No comment provided'}
      </p>

      {/* Helpful Footer */}
      <div className="mt-4 pt-4 border-t border-secondary-100 flex justify-between items-center text-xs text-secondary-500">
        <span>Verified Purchase</span>
        <button className="hover:text-primary-600 transition-colors">
          Helpful?
        </button>
      </div>
    </div>
  )
}

export default ReviewCard

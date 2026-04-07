import React from 'react'
import Rating from '@mui/material/Rating'
import user from '../assets/user.png'


function ReviewCard({ review }) {
  return (
    
        <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
      <h3 className="text-lg font-semibold flex ">
<img src={user} className='block w-[15%] max-w-[15%]' alt="" />
  <h3 className='my-auto mx-2'>{review.name}</h3> 
      </h3>

      <p className="text-gray-500 mb-1">
      <Rating readOnly precision={0.5} value={Number(review.rating) || 0} size="small" />

      </p>
      <p className="text-gray-700">
        {review.comment}

      </p>
    </div>
  
  )
}

export default ReviewCard

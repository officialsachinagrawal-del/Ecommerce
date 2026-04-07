import React from 'react'
import { Link } from 'react-router-dom'
import Rating from '@mui/material/Rating'
import noImage from '../assets/no-image.svg'

// const options = {
//     edit: false,
//     color: "gray",
//     activeColor: "yellow",
//     size: window.innerWidth < 768 ? 20 : 30,
//     value: 3.5,
//     isHalf: true,
    
// }



function Product({id,name,price,image,rating,reviewsCount,ratings}) {
  const productImage =
    Array.isArray(image) && image[0]?.url
      ? image[0].url
      : noImage;
  
  return (
    <Link to={`/product/${id}`} >
        
    <div key={id} className="bg-white h-full min-height: 20em   rounded-lg shadow-lg  overflow-hidden hover:scale-105 transition-transform duration-300">

              <img
                src={productImage}
                alt={name}
                className="block mx-auto md:w-[45%] w-[40%]  object-cover rounded-t-lg"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = noImage;
                }}
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{name}</h3>
                <Rating readOnly precision={0.5} value={Number(ratings) || 0} size="small" />
                {/* number of reviews */}
                <p className="text-gray-600 mb-1">{reviewsCount} reviews</p>
                <p className="text-gray-600">₹{Number(price).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
              
              
      </div>
    </Link>
  )
}

export default Product

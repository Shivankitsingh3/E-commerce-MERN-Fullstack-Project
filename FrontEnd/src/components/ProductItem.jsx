import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom'

const ProductItem = ({ id, image, name, price }) => {
  const { currency } = useContext(ShopContext)

  return (
    <div key={id} className='hover:shadow-lg transition-shadow'>
      <Link
        to={`/product/${id}`}
        className='text-gray-700 cursor-pointer'
        aria-label={`View ${name}`}
      >
        <div className='overflow-hidden'>
          <img
            src={image?.[0] || 'fallback-image-url'}
            alt={name || 'Product image'}
            className='hover:scale-105 transition ease-in-out rounded'
            loading='lazy'
          />
        </div>
        <p className='pt-3 pb-1 text-sm line-clamp-2'>{name}</p>
        <p className='text-sm font-medium'>
          {currency}
          {Number(price).toFixed(2)}
        </p>
      </Link>
    </div>
  )
}

export default ProductItem
import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import CartTotal from '../components/CartTotal'

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate } =
    useContext(ShopContext)

  const [cartData, setCartData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      
      if (!products || products.length === 0) {
        setIsLoading(true)
        return
      }

      const tempData = []

      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            tempData.push({
              _id: items,
              size: item,
              quantity: cartItems[items][item],
            })
          }
        }
      }
      setCartData(tempData)
      setIsLoading(false)
    } catch (error) {
      console.error('Error processing cart data:', error)
      setIsLoading(false)
    }
  }, [cartItems, products])

  
  if (isLoading) {
    return (
      <div className='border-t pt-14'>
        <div className='text-2xl mb-3'>
          <Title text1={'YOUR'} text2={'CART'} />
        </div>
        <div className='text-center py-10'>Loading cart items...</div>
      </div>
    )
  }

  
  if (cartData.length === 0) {
    return (
      <div className='border-t pt-14'>
        <div className='text-2xl mb-3'>
          <Title text1={'YOUR'} text2={'CART'} />
        </div>
        <div className='text-center py-10'>
          <p className='mb-5'>Your cart is empty</p>
          <button
            onClick={() => navigate('/')}
            className='bg-black text-white text-sm px-6 py-2 cursor-pointer'
          >
            CONTINUE SHOPPING
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='border-t pt-14'>
      <div className='text-2xl mb-3'>
        <Title text1={'YOUR'} text2={'CART'} />
      </div>

      <div className=''>
        {cartData.map((item, index) => {
          
          const productData = products.find(
            (product) => product && product._id === item._id
          )

          
          if (!productData || !productData.image || !productData.image[0]) {
            return null
          }

          return (
            <div
              className='py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] item-center gap-4'
              key={`${item._id}-${item.size}-${index}`}
            >
              <div className='flex items-start gap-6'>
                <img
                  src={productData.image[0]}
                  alt={productData.name || 'Product image'}
                  className='w-16 sm:w-20'
                  onError={(e) => {
                    e.target.src =
                      assets.placeholder_img ||
                      'https://via.placeholder.com/150'
                    e.target.onerror = null
                  }}
                />
                <div className=''>
                  <p className='text-xs sm:text-lg font-medium'>
                    {productData.name}
                  </p>
                  <div className='flex items-center gap-5 mt-2'>
                    <p>
                      {currency}
                      {productData.price}
                    </p>
                    <p className='px-2 sm:px-3 sm:py-1 border border-slate-300 bg-slate-100'>
                      {item.size}
                    </p>
                  </div>
                </div>
              </div>
              <input
                onChange={(e) => {
                  const value = e.target.value
                  if (value === '' || value === '0') return
                  updateQuantity(item._id, item.size, Number(value))
                }}
                type='number'
                className='border border-slate-400 max-w-10 sm:max-w-20 h-10 px-1 sm:px-2 py-1 mt-2'
                min={1}
                value={item.quantity}
              />
              <img
                onClick={() => updateQuantity(item._id, item.size, 0)}
                src={assets.bin_icon}
                alt='Remove item'
                className='w-4 mr-4 sm:w-5 cursor-pointer mt-5'
              />
            </div>
          )
        })}
      </div>

      <div className='flex justify-end my-20'>
        <div className='w-full sm:w-[450px]'>
          <CartTotal />

          <div className='w-full text-end'>
            <button
              onClick={() => navigate('/place-order')}
              className='bg-black text-white text-sm my-8 px-8 py-3 cursor-pointer'
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
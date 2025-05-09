/* eslint-disable no-case-declarations */
import React, { useContext, useState, useEffect } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'
import { toast } from 'react-toastify'
import axios from 'axios'

// Simple function to decode JWT tokens
const decodeToken = (token) => {
  try {
    
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )

    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('Error decoding token:', error)
    return null
  }
}

const PlaceOrder = () => {
  const [method, setMethod] = useState('cod')
  const {
    navigate,
    backendUrl,
    token,
    cartItems,
    setCartItems,
    getCartAmount,
    delivery_fee,
    products,
  } = useContext(ShopContext)
  const [userId, setUserId] = useState(null)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: '',
  })

  
  useEffect(() => {
    if (token) {
      try {
        
        const decodedToken = decodeToken(token)
        if (
          decodedToken &&
          (decodedToken.id || decodedToken._id || decodedToken.userId)
        ) {
          
          const extractedUserId =
            decodedToken.id || decodedToken._id || decodedToken.userId
          
          setUserId(extractedUserId)
        } else {
          console.error(
            'Could not find user ID in token payload:',
            decodedToken
          )
        }
      } catch (error) {
        console.error('Error extracting user ID from token:', error)
      }
    }
  }, [token])

  const onChangeHandler = (event) => {
    const name = event.target.name
    const value = event.target.value

    setFormData((data) => ({ ...data, [name]: value }))
  }

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Order Payment',
      description: 'Order Payment',
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        console.log(response)
        try {
          // Just add the orderId (our database order ID)
          const paymentData = {
            ...response,
            orderId: order.receipt, // Include our database orderId
          }

          const { data } = await axios.post(
            `${backendUrl}/api/order/verifyRazorpay`,
            paymentData,
            { headers: { token } } // The token contains userId
          )

          if (data.success) {
            toast.success('Payment successful!')
            navigate('/orders')
            setCartItems({})
          } else {
            toast.error(data.message || 'Payment verification failed')
          }
        } catch (error) {
          console.log(error)
          toast.error(
            error.response?.data?.message || 'Payment verification error'
          )
        }
      },
    }
    const rzp = new window.Razorpay(options)
    rzp.open()
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault()

    if (!token) {
      toast.error('Please login to place an order')
      navigate('/login')
      return
    }

    if (!userId) {
      toast.error(
        'User information not available. Please try logging in again.'
      )
      navigate('/login')
      return
    }

    try {
      let orderItems = []

      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(
              products.find((product) => product._id === items)
            )
            if (itemInfo) {
              itemInfo.size = item
              itemInfo.quantity = cartItems[items][item]
              orderItems.push(itemInfo)
            }
          }
        }
      }

      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
        userId: userId,
      }

      console.log('Sending order data:', orderData)

      switch (method) {
        // for COD api call
        case 'cod':
          const response = await axios.post(
            `${backendUrl}/api/order/place`,
            orderData,
            {
              headers: {
                'Content-Type': 'application/json',
                token: token,
              },
            }
          )

          console.log('Order response:', response.data)

          if (response.data.success) {
            toast.success('Order placed successfully!')
            setCartItems({})
            navigate('/orders')
          } else {
            toast.error(response.data.message || 'Failed to place order')
          }
          break;
        
        case "stripe":
          const responseStripe = await axios.post(`${backendUrl}/api/order/stripe`, orderData, { headers: { token } });

          if (responseStripe.data.success) {
            const { session_url } = responseStripe.data;
            window.location.replace(session_url);
          } else {
            toast.error(responseStripe.data.message);
          }
          
          break;
        
        case "razorpay":
          
          const responseRazorpay = await axios.post(`${backendUrl}/api/order/razorpay`, orderData, { headers: { token } });

          if (responseRazorpay.data.success) {
            initPay(responseRazorpay.data.order);
          }
          
          break;

        default:
          toast.warning('Payment method not implemented yet')
          break
      }
    } catch (error) {
      console.error('Order placement error:', error)
      console.error('Error details:', error.response?.data)
      toast.error(
        error.response?.data?.message ||
          'Failed to place order. Please try again.'
      )
    }
  }

  return (
    <form
      onSubmit={onSubmitHandler}
      className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'
    >
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
        <div className='text-xl sm:text-2xl my-3'>
          <Title text1={'DELIVERY'} text2={'INFORMATION'} />
        </div>

        <div className='flex gap-3'>
          <input
            required
            onChange={onChangeHandler}
            name='firstName'
            value={formData.firstName}
            type='text'
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
            placeholder='First name'
          />
          <input
            required
            onChange={onChangeHandler}
            name='lastName'
            value={formData.lastName}
            type='text'
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
            placeholder='Last name'
          />
        </div>
        <input
          required
          onChange={onChangeHandler}
          name='email'
          value={formData.email}
          type='email'
          className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
          placeholder='Email address'
        />
        <input
          required
          onChange={onChangeHandler}
          name='street'
          value={formData.street}
          type='text'
          className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
          placeholder='Street'
        />
        <div className='flex gap-3'>
          <input
            required
            onChange={onChangeHandler}
            name='city'
            value={formData.city}
            type='text'
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
            placeholder='City'
          />
          <input
            required
            onChange={onChangeHandler}
            name='state'
            value={formData.state}
            type='text'
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
            placeholder='State'
          />
        </div>
        <div className='flex gap-3'>
          <input
            required
            onChange={onChangeHandler}
            name='zipcode'
            value={formData.zipcode}
            type='number'
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
            placeholder='Zipcode'
          />
          <input
            required
            onChange={onChangeHandler}
            name='country'
            value={formData.country}
            type='text'
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
            placeholder='Country'
          />
        </div>
        <input
          required
          onChange={onChangeHandler}
          name='phone'
          value={formData.phone}
          type='number'
          className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
          placeholder='Phone'
        />
      </div>

      <div className='mt-8'>
        <div className='mt-8 min-w-80'>
          <CartTotal />
        </div>
        <div className='mt-12'>
          <Title text1={'PAYMENT'} text2={'METHOD'} />
          <div className='flex gap-3 flex-col lg:flex-row'>
            <div
              onClick={() => setMethod('stripe')}
              className='flex items-center gap-3 border border-gray-400 p-2 cursor-pointer'
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === 'stripe' ? 'bg-green-400' : ''
                }`}
              ></p>
              <img src={assets.stripe_logo} alt='' className='h-5 mx-4' />
            </div>
            <div
              onClick={() => setMethod('razorpay')}
              className='flex items-center gap-3 border border-gray-400 p-2 cursor-pointer'
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === 'razorpay' ? 'bg-green-400' : ''
                }`}
              ></p>
              <img src={assets.razorpay_logo} alt='' className='h-5 mx-4' />
            </div>
            <div
              onClick={() => setMethod('cod')}
              className='flex items-center gap-3 border border-gray-400 p-2 cursor-pointer'
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === 'cod' ? 'bg-green-400' : ''
                }`}
              ></p>
              <p className='text-gray-500 text-sm font-medium mx-4'>
                CASH ON DELIVERY
              </p>
            </div>
          </div>

          <div className='w-full text-end mt-8'>
            <button
              type='submit'
              className='bg-black text-white px-16 py-3 text-sm cursor-pointer'
            >
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder
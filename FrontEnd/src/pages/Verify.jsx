import React, { useContext, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const Verify = () => {
  const { token, setCartItems, backendUrl } = useContext(ShopContext)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate();

  const success = searchParams.get('success')
  const orderId = searchParams.get('orderId')

  const verifyPayment = async () => {
    try {
      if (!token) {
        navigate('/login')
        return
      }

      if (!success || !orderId) {
        navigate('/cart')
        return
      }

      const response = await axios.post(
        `${backendUrl}/api/order/verifyStripe`,
        { success, orderId },
        { headers: { token } }
      )

      if (response.data.success) {
        setCartItems({})
        toast.success('Payment verified successfully!')
        navigate('/orders')
      } else {
        toast.error(response.data.message || 'Payment verification failed')
        navigate('/cart')
      }
    } catch (error) {
      console.error('Verification error:', error)
      toast.error(
        error.response?.data?.message ||
          error.message ||
          'Payment verification error'
      )
      navigate('/cart')
    }
  }

  useEffect(() => {
    verifyPayment()
  }, [token]);

  return (
    <div className='flex justify-center items-center h-screen'>
      <div className='text-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto'></div>
        <p className='mt-4 text-lg'>Verifying your payment...</p>
      </div>
    </div>
  )
}

export default Verify
import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Orders = () => {

  const { backendUrl, token, currency } = useContext(ShopContext);

  const [orderData, setOrderData] = useState([]);

  function formatDateTimeWithoutSeconds(dateString) {
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')

    return `${day}-${month}-${year}  ${hours}:${minutes}`
  }

  const loadOrderData = async () => {

    try {
      if (!token) {
        return null
      }

      const response = await axios.post(`${backendUrl}/api/order/userorders`, {}, { headers: { token } });
      if (response.data.success) {
        let allOrdersItem = [];
        response.data.orders.map((order) => {
          order.items.map((item) => {
            item["status"] = order.status
            item["payment"] = order.payment
            item["paymentMethod"] = order.paymentMethod
            item["createdAt"] = order.createdAt
            allOrdersItem.push(item)
          })
        })
        setOrderData(allOrdersItem.reverse())
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }


  useEffect(() => {
    loadOrderData();
  }, [token]);


  return (
    <div className='border-t pt-16'>
      <div className='text-2xl'>
        <Title text1={'MY'} text2={'ORDERS'} />
      </div>

      <div>
        {orderData.map((item, index) => (
          <div
            key={index}
            className='py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4'
          >
            <div className='flex items-start gap-6 text-sm'>
              <img src={item.image[0]} alt='' className='w-16 sm:w-20' />
              <div>
                <p className='sm:text-base font-medium'>{item.name}</p>
                <div className='flex items-center gap-3 mt-1 text-base text-gray-700'>
                  <p className='text-lg'>
                    {currency}
                    {item.price}
                  </p>
                  <p className=''>Quantity: {item.quantity}</p>
                  <p className=''>Size: {item.size}</p>
                </div>
                <p className='mt-1'>
                  Date:
                  <span className='text-gray-500 ml-1'>
                    {formatDateTimeWithoutSeconds(item.createdAt)}
                  </span>
                </p>
                <p className='mt-1'>
                  Payment:
                  <span className='text-gray-500 ml-1'>{item.paymentMethod}</span>
                </p>
              </div>
            </div>
            <div className='md:w-1/2 flex justify-between'>
              <div className='flex items-center gap-2'>
                <p className='min-w-2 h-2 rounded-full bg-green-500'></p>
                <p className='text-sm md:text-base'>{item.status}</p>
              </div>
              <button
                onClick={loadOrderData}
                className='border px-4 py-2 text-sm font-medium rounded-sm cursor-pointer'
              >
                Track Order
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Orders
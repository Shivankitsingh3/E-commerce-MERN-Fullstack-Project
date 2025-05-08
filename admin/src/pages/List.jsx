import React, { useEffect, useState } from 'react'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import axios from 'axios'

const List = ({ token }) => {
  const [list, setList] = useState([])

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list')

      if (response.data.success) {
        console.log(response.data)
        setList(response.data.products)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(
        backendUrl + '/api/product/remove',
        { id },
        { headers: { token } }
      )

      if (response.data.success) {
        toast.success(response.data.message)
        await fetchList()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchList()
  }, [])

  return (
    <div className='p-4'>
      <h2 className='text-lg font-bold mb-4'>All Products List</h2>

      <div className='hidden md:block'>
        <div className='flex bg-gray-100 p-2 font-bold'>
          <div className='w-24'>Image</div>
          <div className='flex-1'>Name</div>
          <div className='w-32'>Category</div>
          <div className='w-24'>Price</div>
          <div className='w-20'>Action</div>
        </div>

        {list.map((item, index) => (
          <div key={index} className='flex items-center p-2 border-b'>
            <img src={item.image[0]} alt='' className='w-15 h-15 mr-4' />
            <div className='flex-1'>{item.name}</div>
            <div className='w-32'>{item.category}</div>
            <div className='w-24'>
              {currency}
              {item.price}
            </div>
            <button
              onClick={() => removeProduct(item._id)}
              className='w-20 h-8 text-white bg-red-500'
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <div className='md:hidden'>
        {list.map((item, index) => (
          <div key={index} className='border p-3 mb-3 rounded'>
            <div className='flex items-start'>
              <img src={item.image[0]} alt='' className='w-16 h-16 mr-3' />
              <div>
                <p className='font-bold'>{item.name}</p>
                <p className='text-gray-600'>{item.category}</p>
                <p className='font-bold mt-1'>
                  {currency}
                  {item.price}
                </p>
              </div>
            </div>
            <button
              onClick={() => removeProduct(item._id)}
              className='mt-2 bg-red-100 text-red-500 px-3 py-1 rounded'
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default List
import React, { useState } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

const Add = ({ token }) => {
  const [image1, setImage1] = useState(null)
  const [image2, setImage2] = useState(null)
  const [image3, setImage3] = useState(null)
  const [image4, setImage4] = useState(null)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('Men')
  const [subCategory, setSubCategory] = useState('Topwear')
  const [bestseller, setBestseller] = useState(false)
  const [sizes, setSizes] = useState([])

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    try {
      const formData = new FormData()

      formData.append('name', name)
      formData.append('description', description)
      formData.append('price', price)
      formData.append('category', category)
      formData.append('subCategory', subCategory)
      formData.append('bestseller', bestseller)
      formData.append('sizes', JSON.stringify(sizes))

      image1 && formData.append('image1', image1) // Append if image is selected
      image2 && formData.append('image2', image2)
      image3 && formData.append('image3', image3)
      image4 && formData.append('image4', image4)

      const response = await axios.post(
        backendUrl + '/api/product/add',
        formData,
        { headers: { token } }
      )

      if (response.data.success) {
        toast.success(response.data.message)
        setName('')
        setDescription('')
        setPrice('')
        setCategory('Men')
        setSubCategory('Topwear')
        setBestseller(false)
        setSizes([])
        setImage1(null)
        setImage2(null)
        setImage3(null)
        setImage4(null)
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error adding product:', error)
      toast.error(error.message);
    }
  }

  return (
    <form
      onSubmit={onSubmitHandler}
      className='flex flex-col w-full items-start gap-3'
    >
      <div>
        <p className='mb-2'>Upload Image</p>

        <div className='flex gap-2'>
          <label htmlFor='image1'>
            <img
              src={!image1 ? assets.upload_area : URL.createObjectURL(image1)}
              alt=''
              className='w-20 cursor-pointer'
            />
            <input
              onChange={(e) => setImage1(e.target.files[0])}
              type='file'
              className=''
              id='image1'
              hidden
            />
          </label>
          <label htmlFor='image2'>
            <img
              src={!image2 ? assets.upload_area : URL.createObjectURL(image2)}
              alt=''
              className='w-20 cursor-pointer'
            />
            <input
              onChange={(e) => setImage2(e.target.files[0])}
              type='file'
              className=''
              id='image2'
              hidden
            />
          </label>
          <label htmlFor='image3'>
            <img
              src={!image3 ? assets.upload_area : URL.createObjectURL(image3)}
              alt=''
              className='w-20 cursor-pointer'
            />
            <input
              onChange={(e) => setImage3(e.target.files[0])}
              type='file'
              className=''
              id='image3'
              hidden
            />
          </label>
          <label htmlFor='image4' className=''>
            <img
              src={!image4 ? assets.upload_area : URL.createObjectURL(image4)}
              alt=''
              className='w-20 cursor-pointer'
            />
            <input
              onChange={(e) => setImage4(e.target.files[0])}
              type='file'
              className=''
              id='image4'
              hidden
            />
          </label>
        </div>
      </div>
      <div className='w-full'>
        <p className='mb-2'>Product name</p>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          type='text'
          className='w-full max-w-[500px] px-3 py-2'
          placeholder='Type here'
          required
        />
      </div>

      <div className='w-full'>
        <p className='mb-2'>Product description</p>
        <input
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          type='text'
          className='w-full max-w-[500px] px-3 py-2'
          placeholder='Write content here here'
          required
        />
      </div>

      <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
        <div>
          <p className='mb-2'>Product category</p>
          <select
            onChange={(e) => setCategory(e.target.value)}
            className='w-full px-3 py-2'
            name=''
            id=''
          >
            <option value='Men' className=''>
              Men
            </option>
            <option value='Women' className=''>
              Women
            </option>
            <option value='Kids' className=''>
              Kids
            </option>
          </select>
        </div>

        <div>
          <p className='mb-2'>Sub category</p>
          <select
            onChange={(e) => setSubCategory(e.target.value)}
            className='w-full px-3 py-2'
            name=''
            id=''
          >
            <option value='Topwear' className=''>
              Topwear
            </option>
            <option value='Bottomwear' className=''>
              Bottomwear
            </option>
            <option value='Winterwear' className=''>
              Winterwear
            </option>
          </select>
        </div>

        <div>
          <p className='mb-2'>Product Price</p>
          <input
            onChange={(e) => setPrice(e.target.value)} // Corrected onChange
            value={price}
            type='number' // Corrected input type
            className='w-full px-3 py-[6.5px] sm:w-[120px]'
            placeholder='25'
          />
        </div>
      </div>

      <div>
        <p className='mb-2'>Product Sizes</p>
        <div className='flex gap-3'>
          <div
            onClick={() =>
              setSizes((prev) =>
                prev.includes('S')
                  ? prev.filter((item) => item !== 'S')
                  : [...prev, 'S']
              )
            }
          >
            <p
              className={`${
                sizes.includes('S') ? 'bg-pink-100' : 'bg-slate-200'
              } px-3 py-1 cursor-pointer`}
            >
              S
            </p>
          </div>

          <div
            onClick={() =>
              setSizes((prev) =>
                prev.includes('M')
                  ? prev.filter((item) => item !== 'M')
                  : [...prev, 'M']
              )
            }
          >
            <p
              className={`${
                sizes.includes('M') ? 'bg-pink-100' : 'bg-slate-200'
              } px-3 py-1 cursor-pointer`}
            >
              M
            </p>
          </div>

          <div
            onClick={() =>
              setSizes((prev) =>
                prev.includes('L')
                  ? prev.filter((item) => item !== 'L')
                  : [...prev, 'L']
              )
            }
            className=''
          >
            <p
              className={`${
                sizes.includes('L') ? 'bg-pink-100' : 'bg-slate-200'
              } px-3 py-1 cursor-pointer`}
            >
              L
            </p>
          </div>

          <div
            onClick={() =>
              setSizes((prev) =>
                prev.includes('XL')
                  ? prev.filter((item) => item !== 'XL')
                  : [...prev, 'XL']
              )
            }
            className=''
          >
            <p
              className={`${
                sizes.includes('XL') ? 'bg-pink-100' : 'bg-slate-200'
              } px-3 py-1 cursor-pointer`}
            >
              XL
            </p>
          </div>

          <div
            onClick={() =>
              setSizes((prev) =>
                prev.includes('XXL')
                  ? prev.filter((item) => item !== 'XXL')
                  : [...prev, 'XXL']
              )
            }
          >
            <p
              className={`${
                sizes.includes('XXL') ? 'bg-pink-100' : 'bg-slate-200'
              } px-3 py-1 cursor-pointer`}
            >
              XXL
            </p>
          </div>
        </div>
      </div>

      <div className='flex gap-2 mt-2'>
        <input
          onChange={() => setBestseller((prev) => !prev)}
          checked={bestseller}
          type='checkbox'
          className=''
          id='bestseller'
        />
        <label htmlFor='bestseller' className='cursor-pointer'>
          Add to bestseller
        </label>
      </div>

      <button
        className='text-white bg-black w-28 py-3 mt-4 cursor-pointer'
        type='submit'
      >
        ADD
      </button>
    </form>
  )
}

export default Add

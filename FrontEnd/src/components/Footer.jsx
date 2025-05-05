import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className=''>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
        <div className=''>
          <img src={assets.shopinitylogo} alt='' className='mb-5 w-40 h-14' />
          <p className='w-full md:w-2/3 text-gray-600'>
            Look good. Do better. Because the Earth doesn’t do returns. We craft
            with conscience, you wear with pride. Together, we’re changing the
            game— one stitch at a time.
          </p>
        </div>

        <div>
          <p className='text-xl font-medium mb-5'>COMPANY</p>
          <ul className='flex flex-col gap-1 text-gray-600'>
            <li className=''>Home</li>
            <li className=''>About us</li>
            <li className=''>Delivery</li>
            <li className=''>Privacy policy</li>
          </ul>
        </div>

        <div>
          <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
          <ul className='flex flex-col gap-1 text-gray-600'>
            <li>+1-212-456-7890</li>
            <li>contact@shopinity.com</li>
          </ul>
        </div>
      </div>
      <div className=''>
        <hr />
        <p className='py-5 text-sm text-center'>
          Copyright © 2025 shopinity.com - All Rights Reserved.
        </p>
      </div>
    </div>
  )
}

export default Footer
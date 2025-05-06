import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const About = () => {
  return (
    <div>
      <div className='text-2xl text-center pt-8 border-t'>
        <Title text1={'ABOUT'} text2={'US'} />
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-16'>
        <img
          src={assets.about_img}
          alt=''
          className='w-full md:max-w-[450px]'
        />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
          <p className=''>
            <strong>Shopinity</strong> is a vibrant online destination for
            costume lovers and fashion adventurers, offering uniquely crafted
            outfits that bring characters and creativity to life.
          </p>
          <p className=''>
            Born from the frustration of mass-produced, low-quality costumes, we
            connect passionate designers with expressive wearers through curated
            collections, inclusive sizing, and sustainable rental options. Our
            vision is to revolutionize costume culture with virtual try-ons,
            AI-powered customization, and a community-driven showcase for
            wearable art. Whether for cosplay, themed events, or bold everyday
            style, Shopinity celebrates transformation through fashion.
          </p>
          <b className='text-gray-800'>Our Mission</b>
          <p>
            At Shopinity, we believe every outfit tells a story—and every wearer
            deserves to feel extraordinary. Our mission is to empower
            self-expression through meticulously crafted costumes and clothing,
            blending artistry with inclusivity.
            <p className='mt-3'>"Dress the part. Live the fantasy."</p>
          </p>
        </div>
      </div>

      <div className='text-4xl py-4'>
        <Title text1={'WHY'} text2={'CHOOSE US'} />
      </div>

      <div className='flex flex-col md:flex-row text-sm mb-20'>
        <div className='border px-5 md:px-16 py-8 sm:py-20 flex flex-col gap-5 md:w-1/3'>
          <b>Quality Assurance:</b>
          <p className='text-gray-600'>
            At Shopinity, quality isn’t just a step—it’s our standard. Every
            stitch, fabric, and detail undergoes rigorous checks to ensure
            durability, comfort, and authenticity.
          </p>
          <p className='mt-3 text-black font-semibold'>
            "No flimsy zippers, fading prints, or loose threads. Just
            camera-ready craftsmanship."
          </p>
        </div>
        <div className='border px-5 md:px-16 py-8 sm:py-20 flex flex-col gap-5 md:w-1/3'>
          <b>Convenience:</b>
          <p className='text-gray-600'>
            At Shopinity, we make extraordinary style effortlessly yours. With
            lightning-fast shipping, easy returns, and AR try-before-you-buy,
            your dream costume arrives without the hassle.
          </p>
          <p className='mt-3 text-black font-semibold'>
            "Costume drama belongs on stage, not in your shopping cart."
          </p>
        </div>
        <div className='border px-5 md:px-16 py-8 sm:py-20 flex flex-col gap-5 md:w-1/3'>
          <b>Customer Service:</b>
          <p className='text-gray-600'>
            At Shopinity, your satisfaction is our spotlight. Our dedicated
            support team is available 24/7 to ensure every query, exchange, or
            styling question gets a standing ovation.
          </p>
          <p className='mt-3 text-black font-semibold'>
            "Your happiness, guaranteed—or we’ll rewrite the script."
          </p>
        </div>
      </div>
      <NewsletterBox />
    </div>
  )
}

export default About
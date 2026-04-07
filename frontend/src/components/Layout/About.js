import React from 'react'
import MetaData from './MetaData'

function About() {
  return (
    <>
      <MetaData title='About' />
      <section className='min-h-[70vh] px-6 py-12 md:px-12'>
        <div className='mx-auto max-w-3xl'>
          <h1 className='text-3xl font-semibold mb-4'>About SmartShop</h1>
          <p className='text-slate-700'>
            SmartShop is a modern ecommerce platform focused on quality products,
            trusted delivery, and a smooth shopping experience from discovery to checkout.
          </p>
        </div>
      </section>
    </>
  )
}

export default About

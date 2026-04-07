import React from 'react'
import MetaData from './MetaData'

function Contact() {
  return (
    <>
      <MetaData title='Contact' />
      <section className='min-h-[70vh] px-6 py-12 md:px-12'>
        <div className='mx-auto max-w-3xl'>
          <h1 className='text-3xl font-semibold mb-4'>Contact Us</h1>
          <p className='text-slate-700 mb-4'>
            Reach us for order support, delivery questions, or product assistance.
          </p>
          <div className='space-y-2 text-slate-800'>
            <p>Email: support@smartshop.com</p>
            <p>Phone: +1 (555) 000-1234</p>
            <p>Hours: Mon - Sat, 9:00 AM - 6:00 PM</p>
          </div>
        </div>
      </section>
    </>
  )
}

export default Contact

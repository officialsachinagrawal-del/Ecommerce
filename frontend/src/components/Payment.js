import React, { useEffect, useRef, useState } from 'react'
import { useAlert } from 'react-alert'
import { useSelector, useDispatch } from 'react-redux'
import MetaData from './Layout/MetaData'
import { useNavigate } from 'react-router-dom'
import Checkoutstep from './Checkoutstep'
import axios from 'axios'
import baseUrl from '../baseUrl'
import { createOrder, clearErrors } from '../actions/orderAction'

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

function Payment() {
  const navigate = useNavigate()
  const alert = useAlert()
  const dispatch = useDispatch()
  const payBtn = useRef(null)

  const [razorpayKey, setRazorpayKey] = useState('')

  const { user } = useSelector((state) => state.user)
  const { cartItems, shippingInfo } = useSelector((state) => state.cart)
  const { error } = useSelector((state) => state.newOrder)

  const orderInfo = JSON.parse(sessionStorage.getItem('orderInfo') || '{}')

  const order = {
    orderItems: cartItems,
    shippingInfo,
    itemsPrice: orderInfo.subtotal || 0,
    taxPrice: orderInfo.tax || 0,
    shippingPrice: orderInfo.shippingCharges || 0,
    totalPrice: orderInfo.total || 0,
  }

  useEffect(() => {
    const initializePayment = async () => {
      const scriptLoaded = await loadRazorpayScript()

      if (!scriptLoaded) {
        alert.error('Unable to load Razorpay SDK. Please check your internet connection.')
      }

      try {
        const { data } = await axios.get(`${baseUrl}/api/v1/razorpay/key`, { withCredentials: true })
        setRazorpayKey(data.razorpayKey || '')
      } catch (err) {
        console.error('Failed to load Razorpay key:', err.message)
      }
    }

    initializePayment()
  }, [alert])

  useEffect(() => {
    if (error) {
      alert.error(error)
      dispatch(clearErrors())
    }
  }, [dispatch, alert, error])

  const submitHandler = async (e) => {
    e.preventDefault()

    if (payBtn.current) {
      payBtn.current.disabled = true
    }

    try {
      if (!window.Razorpay) {
        throw new Error('Razorpay SDK not loaded')
      }

      if (!razorpayKey) {
        throw new Error('Razorpay key is missing in backend configuration')
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }

      const amountInPaise = Math.round((orderInfo.total || 0) * 100)

      const { data } = await axios.post(
        `${baseUrl}/api/v1/payment/razorpay/order`,
        { amount: amountInPaise },
        config
      )

      const options = {
        key: razorpayKey,
        amount: data.order.amount,
        currency: data.order.currency,
        name: 'SmartShop',
        description: 'Order Payment',
        order_id: data.order.id,
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: shippingInfo?.phoneNo || '',
        },
        notes: {
          address: `${shippingInfo?.address || ''}, ${shippingInfo?.city || ''}`,
        },
        theme: {
          color: '#6d28d9',
        },
        handler: async function (response) {
          try {
            const verifyPayload = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }

            const verifyResponse = await axios.post(
              `${baseUrl}/api/v1/payment/razorpay/verify`,
              verifyPayload,
              config
            )

            if (!verifyResponse.data?.success) {
              throw new Error('Razorpay payment verification failed')
            }

            order.paymentInfo = {
              id: response.razorpay_payment_id,
              status: 'paid',
              provider: 'razorpay',
            }

            await dispatch(createOrder(order))
            navigate('/success')
          } catch (err) {
            if (payBtn.current) {
              payBtn.current.disabled = false
            }
            alert.error(err.response?.data?.error || err.response?.data?.message || err.message)
          }
        },
        modal: {
          ondismiss: function () {
            if (payBtn.current) {
              payBtn.current.disabled = false
            }
          },
        },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.on('payment.failed', function (response) {
        if (payBtn.current) {
          payBtn.current.disabled = false
        }

        alert.error(response.error?.description || 'Payment failed')
      })

      razorpay.open()
    } catch (err) {
      if (payBtn.current) {
        payBtn.current.disabled = false
      }

      alert.error(err.response?.data?.error || err.response?.data?.message || err.message)
    }
  }

  return (
    <>
      <MetaData title="Payment" />
      <Checkoutstep activeStep={2} />
      <div className='max-w-md mx-auto m-[5em] p-[3em] bg-white shadow-lg rounded'>
        {!razorpayKey && (
          <div className='mb-6 p-4 bg-yellow-100 text-yellow-800 rounded'>
            Razorpay is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in backend env.
          </div>
        )}

        <form className='' onSubmit={submitHandler}>
          <h1 className='text-center text-xl font-semibold border-b-2 mb-8 w-1/2 mx-auto p-2'>Razorpay Checkout</h1>
          <input
            type='submit'
            className='cursor-pointer focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900 w-full mt-5 mb-5'
            value={`Pay ₹${Number(orderInfo?.total || 0).toLocaleString('en-IN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`}
            ref={payBtn}
            disabled={!razorpayKey}
          />
        </form>
      </div>
    </>
  )
}

export default Payment

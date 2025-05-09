import { response } from 'express'
import orderModel from '../models/order.models.js'
import userModel from '../models/user.models.js'
import Stripe from 'stripe'
import razorpay from 'razorpay'

//global variables
const currency = 'inr'
const deliveryCharge = 10

// gateway initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
})

// creating for cod method
const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: 'COD',
      payment: false,
    }

    const newOrder = new orderModel(orderData)
    await newOrder.save()

    await userModel.findByIdAndUpdate(userId, { cartData: {} })

    res.json({ success: true, message: 'Order Placed!' })
  } catch (error) {
    console.log(error)
    res.json({ response: false, message: error.message })
  }
}

// for Stripe method
const placeOrderStripe = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body
    const { origin } = req.headers

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: 'Stripe',
      payment: false,
    }

    const newOrder = new orderModel(orderData)
    await newOrder.save()

    const line_items = items.map((item) => ({
      price_data: {
        currency: currency,
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }))

    line_items.push({
      price_data: {
        currency: currency,
        product_data: {
          name: 'Delivery Charges',
        },
        unit_amount: deliveryCharge * 100,
      },
      quantity: 1,
    })

    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: 'payment',
    })

    res.json({ success: true, session_url: session.url })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

//verify Stripe
const verifyStripe = async (req, res) => {
  const { orderId, success } = req.body
  const { userId } = req

  try {
    if (success === 'true') {
      await orderModel.findByIdAndUpdate(orderId, {
        payment: true,
        paymentMethod: 'Stripe',
      })

      await userModel.findByIdAndUpdate(userId, { cartData: {} })
      res.json({ success: true })
    } else {
      await orderModel.findByIdAndDelete(orderId)

      const user = await userModel.findById(userId)
      const currentCart = user.cartData || {}

      const failedOrder = await orderModel.findById(orderId)
      if (failedOrder) {
        failedOrder.items.forEach((item) => {
          delete currentCart[item._id.toString()]
        })
      }

      await userModel.findByIdAndUpdate(userId, { cartData: currentCart })

      res.json({ success: false })
    }
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// for razorpay method
const placeOrderRazorpay = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: 'Razorpay',
      payment: false,
    }

    const newOrder = new orderModel(orderData)
    await newOrder.save()

    const options = {
      amount: amount * 100,
      currency: currency.toUpperCase(),
      receipt: newOrder._id.toString(),
      notes: {
        userId: userId.toString(), // Store user ID for reference
      },
    }

    // Convert callback to promise
    const order = await new Promise((resolve, reject) => {
      razorpayInstance.orders.create(options, (error, order) => {
        if (error) reject(error)
        else resolve(order)
      })
    })

    res.json({
      success: true,
      order,
      orderId: newOrder._id, // Send our database order ID to frontend
    })
  } catch (error) {
    console.log(error)
    // Clean up any created order if Razorpay fails
    if (newOrder) {
      await orderModel.findByIdAndDelete(newOrder._id)
    }
    res.json({ success: false, message: error.message })
  }
}

const verifyRazorpay = async (req, res) => {
  try {
    
    const userId = req.userId

    
    const {
      razorpay_payment_id,
      razorpay_order_id,
      orderId,
    } = req.body

    console.log('Verification data received:', req.body)

    if (!razorpay_payment_id || !razorpay_order_id) {
      throw new Error('Missing payment details')
    }

    const order = await orderModel.findById(orderId)

    if (!order) {
      throw new Error('Order not found')
    }

    if (order.userId.toString() !== userId.toString()) {
      throw new Error('Unauthorized: Order does not belong to this user')
    }

    await orderModel.findByIdAndUpdate(orderId, {
      payment: true,
      paymentMethod: 'Razorpay',
      razorpay_payment_id,
      razorpay_order_id,
    })

    await userModel.findByIdAndUpdate(userId, { cartData: {} })

    res.json({ success: true, message: 'Payment successful!' })
  } catch (error) {
    console.log(error)

    res.status(400).json({
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        'Payment verification error',
    })
  }
}

// All orders data for Admin Panel
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({})
    res.json({ success: true, orders })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// User order data for frontend
const userOrders = async (req, res) => {
  try {
    const userId = req.userId

    const orders = await orderModel.find({ userId })
    res.json({ success: true, orders })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// update order status from Admin Panel

const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body
    const order = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    )

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: 'Order not found' })
    }

    res.json({ success: true, order })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: error.message })
  }
}

export {
  verifyRazorpay,
  verifyStripe,
  placeOrder,
  placeOrderStripe,
  placeOrderRazorpay,
  allOrders,
  userOrders,
  updateStatus,
}

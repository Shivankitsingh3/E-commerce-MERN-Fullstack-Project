import userModel from '../models/user.models.js'

const addToCart = async (req, res) => {
  try {
    const userId = req.userId
    const { itemId, size } = req.body

    const userData = await userModel.findById(userId)
    let cartData = userData.cartData || {};

    if (cartData[itemId]) {
      
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1
      } else {
        cartData[itemId][size] = 1
      }
    } else {
      cartData[itemId] = {}
      cartData[itemId][size] = 1
    }

    await userModel.findByIdAndUpdate(userId, { cartData })

    res.json({ success: true, message: 'Added to Cart' })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

const updateCart = async (req, res) => {
  try {

    console.log('Request Body:', req.body);
    
    const { itemId, size, quantity } = req.body

    const userId = req.userId
    const userData = await userModel.findById(userId)
    let cartData = userData.cartData || {}

    if (cartData[itemId] && cartData[itemId][size] !== undefined) {
      cartData[itemId][size] = quantity
    } else {
      return res.json({ success: false, message: 'Item or size not found' })
    }

    await userModel.findByIdAndUpdate(userId, { cartData })

    res.json({ success: true, message: 'Cart Updated' })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

const getUserCart = async (req, res) => {
  try {
    const userId = req.userId

    const userData = await userModel.findById(userId)
    const cartData = userData.cartData || {};

    res.json({ success: true, cartData })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

export { addToCart, updateCart, getUserCart };
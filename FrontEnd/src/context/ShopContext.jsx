import { createContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export const ShopContext = createContext()

const ShopContextProvider = (props) => {
  const currency = '₹'
  const delivery_fee = 10
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'
  const [search, setSearch] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [cartItems, setCartItems] = useState({})
  const [products, setProducts] = useState([])
  const [token, setToken] = useState('')
  const navigate = useNavigate()

  
  useEffect(() => {
    
    const savedCartItems = localStorage.getItem('cartItems')
    if (savedCartItems) {
      try {
        setCartItems(JSON.parse(savedCartItems))
      } catch (error) {
        console.error('Error parsing cart items from localStorage:', error)
      }
    }
  }, [])

  
  useEffect(() => {
    try {
      localStorage.setItem('cartItems', JSON.stringify(cartItems))
    } catch (error) {
      console.error('Error saving cart items to localStorage:', error)
    }
  }, [cartItems])

  const getCartCount = () => {
    try {
      let totalCount = 0
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            totalCount += cartItems[items][item]
          }
        }
      }
      return totalCount
    } catch (error) {
      console.error('Error calculating cart count:', error)
      return 0
    }
  }

  const updateQuantity = async (itemId, size, quantity) => {
    try {
      let cartData = structuredClone(cartItems)
      if (!cartData[itemId]) cartData[itemId] = {}
      cartData[itemId][size] = quantity
      setCartItems(cartData)

      if (token) {
        await axios.post(
          `${backendUrl}/api/cart/update`,
          { itemId, size, quantity },
          { headers: { token } }
        )
      }
    } catch (error) {
      console.error('Error updating quantity:', error)
      toast.error(error.message || 'Failed to update quantity')
    }
  }

  
  const getCartAmount = () => {
    try {
      let totalAmount = 0

      
      if (!products || products.length === 0) return 0

      for (const items in cartItems) {
        
        let itemInfo = products.find((product) => product._id === items)

        
        if (!itemInfo) continue

        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            totalAmount += itemInfo.price * cartItems[items][item]
          }
        }
      }
      return totalAmount
    } catch (error) {
      console.error('Error calculating cart amount:', error)
      return 0
    }
  }

  const getProductsData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`)
      if (response.data.success) {
        setProducts(response.data.products)
      } else {
        toast.error(response.data.message || 'Failed to load products')
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error(error.message || 'Failed to load products')
    }
  }

  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error('Select Product Size')
      return
    }

    try {
      let cartData = structuredClone(cartItems)
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
      setCartItems(cartData)

      if (!token) {
        toast.warning('Please log in to save your cart!')
        return
      }

      await axios.post(
        `${backendUrl}/api/cart/add`,
        { itemId, size },
        { headers: { token } }
      )
      toast.success('Item added to cart!')
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast.error(error.response?.data?.message || 'Failed to add item')
    }
  }

  const getUserCart = async (userToken) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/cart/get`,
        {},
        { headers: { token: userToken } }
      )
      if (response.data.success) {
        setCartItems(response.data.cartData)
      }
    } catch (error) {
      console.error('Error fetching user cart:', error)
      toast.error(error.message || 'Failed to fetch cart')

      
      const savedCartItems = localStorage.getItem('cartItems')
      if (savedCartItems) {
        try {
          setCartItems(JSON.parse(savedCartItems))
        } catch (localError) {
          console.error('Error parsing local cart:', localError)
        }
      }
    }
  }

  useEffect(() => {
    getProductsData()
  }, [])

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      setToken(storedToken)
      getUserCart(storedToken)
    }
  }, [])

  const value = {
    products,
    currency,
    delivery_fee,
    showSearch,
    setShowSearch,
    search,
    setSearch,
    cartItems,
    setCartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    backendUrl,
    setToken,
    token,
  }

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  )
}

export default ShopContextProvider;
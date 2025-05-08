import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
  const { token } = req.headers

  if (!token) {
    return res.json({ success: false, message: 'Not Authorized! Login Again' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) // Verifying token without Bearer
    req.userId = decoded.id // Store userId in the request object
    next()
  } catch (error) {
    console.log(error)
    return res.json({ success: false, message: 'Invalid Token. Login Again.' })
  }
}

export default authUser
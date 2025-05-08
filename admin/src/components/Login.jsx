import React from 'react'

const Login = () => {
  return (
    <div>
      <div>
        <h1 className=''>Admin Panel</h1>
        <form action=''>
          <div className=''>
            <p className=''>Email Address</p>
            <input
              type='email'
              className=''
              placeholder='your@email.com'
              required
            />
          </div>
          <div className=''>
            <p className=''>Password</p>
            <input
              type='password'
              className=''
              placeholder='Enter your password'
              required
            />
          </div>
          <button type='submit'>Login</button>
        </form>
      </div>
    </div>
  )
}

export default Login

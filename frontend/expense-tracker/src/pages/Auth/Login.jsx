import { useContext, useState } from 'react'
import React from 'react'
import '../../components/layouts/AuthLayout.jsx'
import AuthLayout from '../../components/layouts/AuthLayout.jsx'
import { useNavigate, Link } from 'react-router-dom'
import Input from '../../components/Inputs/input.jsx'
import { validateEmail } from '../../utils/helper.js'
import axiosInstance from '../../utils/axiosInstance.js'
import { API_PATH } from '../../utils/apiPath.js'
import { UserContext } from '../../context/userContext.js'


function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const { updateUser } = useContext(UserContext)
const navigate = useNavigate();
// Handle Login Form Submission
const handleLogin = async (e) => {
    e.preventDefault();
  if (!validateEmail(email)) {
    setError("Please enter a valid email address.");
    return;
  }
  if(!password){
    setError("Please enter your password.");
    return;
  }
  setError('');
  // Login API Calls
  try {
    const response = await axiosInstance.post(API_PATH.AUTH.LOGIN, {
      email,
      password,
    });
    const { token , user } = response.data;
    if(token){
    localStorage.setItem('token', token);
    updateUser(user);
    navigate('/dashboard');
  
    }
  } catch (error) {
     console.error("Login error:", error);
  if(error.response && error.response.data.message){
    setError(error.response.data.message);
  }else{
    setError("Something went wrong. Please try again later.");
  }

    }
  }

  return (
    <AuthLayout>
        <div className='lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center'>
            <h3 className='text-xl font-semibold text-black'>Welcome Back</h3>
            <p className='text-xs text-slate-700 mt-[5px] mb-6'>Please enter details to Login</p>
          <form onSubmit={handleLogin}>
            <Input
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              label='Email Address'
              placeholder='Enter your email'
              type='email'
            />
            <Input
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              label='Password'
              placeholder='Enter your password'
              type='password'
            />
            {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}
            <button type='submit' className='btn-success'>
              LOGIN
            </button>
            <p className='text-[13px] text-slate-800 mt-4'>
              Don't have an account?{' '}
              <Link className='font-medium text-primary underline' to='/signup'>
                Sign Up
              </Link>
            </p>

          </form>
        </div>
    </AuthLayout>
  )
}

export default Login

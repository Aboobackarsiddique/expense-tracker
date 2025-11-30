import React, { useContext } from 'react'
import { useState } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout.jsx'
import { useNavigate, Link } from 'react-router-dom'
import Input from '../../components/Inputs/input.jsx'
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector.jsx'
import { validateEmail } from '../../utils/helper.js'
import axiosInstance from '../../utils/axiosInstance.js'
import { API_PATH } from '../../utils/apiPath.js'
import { UserContext } from '../../context/userContext.js'
import { UploadImage } from '../../utils/uploadImage.js'

function SignUp() {
  const [profilePic, setProfilePic] = useState(null);
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const { updateUser } = useContext(UserContext);

const navigate = useNavigate();

// Handle SignUp Form Submission
const handleSignUp = async (e) => {
  e.preventDefault();
   let profileimgurl = "";
  if (!fullname) {
    setError("Please enter your name.");
    return;
  }
  if (!validateEmail(email)) {
    setError("Please enter a valid email address.");
    return;
  }
  if(!password){
    setError("Please enter your password.");
    return;
  }
  setError('');
  // SignUp API Calls
  if (profilePic) {
   const ImgUploadRes = await UploadImage(profilePic);
   profileimgurl = ImgUploadRes.imageUrl || "";
  }
  console.log(profileimgurl)
  try {
    const response = await axiosInstance.post(API_PATH.AUTH.REGISTER, {
      fullName: fullname,
      email,
      password,
      profileImageURL: profileimgurl,
    });
    const { token , user } = response.data;
    if(token){
    localStorage.setItem('token', token);
    updateUser(user);
    navigate('/dashboard');
  
    }
  } catch (error) {
     console.error("SignUp error:", error);
  if(error.response && error.response.data.message){
    setError(error.response.data.message);
  }else{
    setError("Something went wrong. Please try again later.");
  }

    }

}
  return (
    <AuthLayout>
        <div className='lg-w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center'>
          <h3 className='text-xl font-semibold text-black'>Create an Account</h3>
          <p className='text-xs text-slate-700 mt-[5px] mb-6'>Join us now by entering details below.</p>

          <form onSubmit={handleSignUp}>
            <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <Input
                value={fullname}
                onChange={({ target }) => setFullname(target.value)}
                label='Full Name'
                placeholder='Enter your full name'
                type='text'
              />
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
            </div>
             {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}
            <button type='submit' className='btn-success w-full md:col-span-2'>
              SIGN UP
            </button>
            <p className='text-[13px] text-slate-800 mt-4'>
              Already have an account?{' '}
              <Link className='font-medium text-primary underline' to='/login'>
                Log In
              </Link>
            </p>
          </form>
        </div>
    </AuthLayout>
  )
}

export default SignUp

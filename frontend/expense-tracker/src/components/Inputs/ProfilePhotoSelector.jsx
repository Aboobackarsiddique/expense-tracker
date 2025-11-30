import React from 'react'
import { useRef, useState } from 'react'
import { LuUser, LuUpload, LuTrash } from 'react-icons/lu'

function ProfilePhotoSelector({ image, setImage }) {
    const inputRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState(null);

const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        // Update the selected image in parent component
        setImage(file);
        // Gemerate a preview URL from the selected file
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
    }
}
const handleImageRemove = () => {
    setImage(null);
    setPreviewUrl(null);
}
const ChooseFile = () => {
    inputRef.current.click();
}
  return <div className='flex justify-center mb-6'>
    <input
      type="file"
      accept="image/*"
      ref={inputRef}
      onChange={handleImageChange}
      className='hidden'
    />
    {!image ? (
        <div className='w-20 h-20 flex items-center justify-center bg-emerald-100 rounded-full relative'>
            <LuUser className='text-4xl text-emerald-600' />
            <button 
            type='button' 
            className='w-8 h-8 flex items-center justify-center bg-emerald-500 text-white rounded-full absolute -bottom-1 -right-1' 
            onClick={ChooseFile} 
            >
            <LuUpload />
            </button>
        </div>
    ) : (
        <div className='relative'>
            <img 
            src={previewUrl} 
            alt="Profile Photo" 
            className='w-20 h-20 rounded-full object-cover'
            />
            <button 
            type='button' 
            className='w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1'
            onClick={handleImageRemove}
            >
            <LuTrash />
            </button>
        </div>
    )}
  </div>
}

export default ProfilePhotoSelector

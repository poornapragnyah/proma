"use client"
import Navbar from '@/components/Navbar';
import React, { useState } from 'react';
import { Pen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { validateToken } from '@/utils/auth';
import { jwtDecode } from 'jwt-decode';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ImageUpload from '@/components/ImageUpload';
import { User } from 'lucide-react';
import Image from 'next/image';

const UserImage = '/profile.jpg';


const ProfilePage = () => {
  const [profileImage, setProfileImage] = useState(UserImage);
  const [userName,setUserName] = useState(null)
  const [userEmail,setUserEmail] = useState(null)
  const [loading, setLoading] = useState(false)
  const decodedToken = jwtDecode(localStorage.getItem('token'));
  const userRole = decodedToken.role;
  const router = useRouter();

  useEffect(() => {
    validateToken(router);
  }, [router]);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    const validateAndFetchProfile = async () => {
      // Check and validate token
      const token = localStorage.getItem('token');
      const decodedToken = jwtDecode(token)
      if (!token) {
        router.push("/login");
        return;
      }
      try {
        const response = await fetch(`http://localhost:3001/api/profile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const parsedResponse = await response.json()

        setUserName(parsedResponse.username)
        setUserEmail(parsedResponse.email)

      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    validateAndFetchProfile();
  }, [router]);

  const updateProfile = async () => {
    const formattedData = {
      username: userName.trim(),
      email: userEmail.trim()
    }
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:3001/api/profile`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(formattedData),
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    toast.success("Successfully updated profile!")
  }
  catch(error){
    console.log("Error updating profile",error)
    toast.error("Some error occured!")
  }
}

const fetchProfileImage = async () => {
  try {
      const response = await fetch('http://localhost:3001/api/profile/image', {
          headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          credentials:'include'
      });
      const {profileImage} = await response.json()
      setProfileImage(profileImage);
  } catch (err) {
      console.error("Error fetching profile image:", err);
      setProfileImage(UserImage)
      setError("Failed to load profile image.");
  } finally {
      setLoading(false);
  }
};

useEffect(() => {
  fetchProfileImage();
}, []);
  
  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-base-100 text-xl">
      <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            {/* Profile Header */}
            <div className="flex items-center mb-8">
              <div className="relative">
                <Image 
                  src={profileImage || '/profile.jpg'}
                  alt="Profile" 
                  className="w-32 h-32 rounded-full object-cover"
                  width={128}
                  height={128}
                  />
              </div>
              <div className="ml-6 relative">

                <h1 className="text-2xl font-bold">{userName}</h1>
                <p className="text-gray-600">{userEmail}</p>
                
                <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600" onClick={updateProfile}>
                  Save Profile
                </button>
                <p className='absolute top-1 left-80 text-lg bg-blue-200 p-3 m-1 text-black rounded-full'>{userRole}</p>
              </div>
            </div>

            {/* Profile Form */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="grid gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <input 
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                    defaultValue={userName}
                    onChange={(e)=>{setUserName(e.target.value)}}
                    />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input 
                    type="email"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                    defaultValue={userEmail}
                    onChange={(e)=>{setUserEmail(e.target.value)}}
                    />
                </div>
                <div>
                  <ImageUpload text={"Edit/Upload Profile Image"}/>
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>
<ToastContainer/>
    </>
  );
};

export default ProfilePage;
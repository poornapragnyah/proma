// contexts/UserDetailsContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import { useUserRole } from './UserRoleContext';

const UserDetailsContext = createContext();

export const UserDetailsProvider = ({ children }) => {
  const { userRole, loading: roleLoading } = useUserRole();
  const [userDetails, setUserDetails] = useState({
    name: null,
    email: null,
    image: null,
    username: null,
    phone: null,
    address: null,
    createdAt: null,
    updatedAt: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;
      console.log("decoded id",decodedToken.id);
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`localhost:3001/api/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user details');
      }

      const data = await response.json();
      setUserDetails(data);
    } catch (err) {
      console.error('Error fetching user details:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateUserDetails = async (updatedDetails) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`localhost:3001/api/users/me`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedDetails),
      });

      if (!response.ok) {
        throw new Error('Failed to update user details');
      }

      const data = await response.json();
      setUserDetails(prev => ({
        ...prev,
        ...data
      }));

      return { success: true, data };
    } catch (err) {
      console.error('Error updating user details:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updateProfileImage = async (file) => {
    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append('image', file);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`localhost:3001/api/users/profile-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to update profile image');
      }

      const data = await response.json();
      setUserDetails(prev => ({
        ...prev,
        image: data.imageUrl
      }));

      return { success: true, imageUrl: data.imageUrl };
    } catch (err) {
      console.error('Error updating profile image:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Fetch user details when role is available and not loading
  useEffect(() => {
    if (!roleLoading && userRole) {
      fetchUserDetails();
    }
  }, [roleLoading, userRole]);

  const clearUserDetails = () => {
    setUserDetails({
      name: null,
      email: null,
      image: null,
      username: null,
      bio: null,
      phone: null,
      address: null,
      createdAt: null,
      updatedAt: null,
    });
  };

  const contextValue = {
    userDetails,
    loading: loading || roleLoading,
    error,
    updateUserDetails,
    updateProfileImage,
    refreshUserDetails: fetchUserDetails,
    clearUserDetails,
  };

  return (
    <UserDetailsContext.Provider value={contextValue}>
      {children}
    </UserDetailsContext.Provider>
  );
};

export const useUserDetails = () => {
  const context = useContext(UserDetailsContext);
  if (context === undefined) {
    throw new Error('useUserDetails must be used within a UserDetailsProvider');
  }
  return context;
};

// Usage Example:
/*
// In your _app.js or layout component:
import { UserRoleProvider } from '../contexts/UserRoleContext';
import { UserDetailsProvider } from '../contexts/UserDetailsContext';

function App({ Component, pageProps }) {
  return (
    <UserRoleProvider>
      <UserDetailsProvider>
        <Component {...pageProps} />
      </UserDetailsProvider>
    </UserRoleProvider>
  );
}

// In your components:
import { useUserDetails } from '../contexts/UserDetailsContext';

function ProfileComponent() {
  const { 
    userDetails, 
    loading, 
    error, 
    updateUserDetails,
    updateProfileImage 
  } = useUserDetails();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleUpdateProfile = async () => {
    const result = await updateUserDetails({
      name: "New Name",
      bio: "New Bio"
    });
    if (result.success) {
      // Handle success
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    const result = await updateProfileImage(file);
    if (result.success) {
      // Handle success
    }
  };

  return (
    <div>
      <h1>{userDetails.name}</h1>
      <img src={userDetails.image} alt="Profile" />
      // ... rest of your component
    </div>
  );
}
*/
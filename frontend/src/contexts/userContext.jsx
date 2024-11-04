// contexts/UserRoleContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import {jwtDecode} from "jwt-decode"
const UserRoleContext = createContext();

export const UserRoleProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
          setLoading(false);
          console.log("No token found");
          return;
      }
      try {
          const decodedToken = jwtDecode(token);
          setUserRole(decodedToken.role);
      } catch (error) {
          console.error('Error decoding token:', error);
      } finally {
          setLoading(false);
      }
  }, []);

  return (
    <UserRoleContext.Provider value={{ userRole, setUserRole, loading }}>
      {children}
    </UserRoleContext.Provider>
  );
};

export const useUserRole = () => {
  const context = useContext(UserRoleContext);
  if (context === undefined) {
    throw new Error('useUserRole must be used within a UserRoleProvider');
  }
  return context;
};
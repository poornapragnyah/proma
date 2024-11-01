import {jwtDecode} from "jwt-decode"
export const validateToken = (router) => {

  const token = localStorage.getItem("token");
//   console.log("Token from auth:", token);
  if (!token) {
    router.push("/login");
    return;
  }

  try {
    // console.log("Validating token");
    const decodedToken = jwtDecode(token);
    console.log("Decoded token:", decodedToken);
    const currentTime = Math.floor(Date.now() / 1000);
    console.log("Current time:", currentTime);
    console.log("Token expiry:", decodedToken.exp);    
    if (decodedToken.exp < currentTime) {
    //   console.log("Token expired");
      localStorage.removeItem("token");
      router.push("/login");
    }
  } catch (error) {
    console.error("Invalid token:", error);
    localStorage.removeItem("token");
    router.push("/login");
  }
};

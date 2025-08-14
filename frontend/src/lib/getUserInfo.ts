import { jwtDecode } from "jwt-decode";

const getUserInfoFromToken = () => {
  const token = localStorage.getItem("token");
  if (token) {
    const decoded: any = jwtDecode(token);
    return {
      myUserId: decoded.userId,
      myUserRole: decoded.userRole,
    };
  }
  return null;
};

export default getUserInfoFromToken;

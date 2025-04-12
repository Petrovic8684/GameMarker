import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { IoMdExit } from "react-icons/io";
import { FiUser } from "react-icons/fi";
import { GrGamepad } from "react-icons/gr";
import getUserInfoFromToken from "../lib/getUserInfo";

const Navbar = () => {
  const navigate = useNavigate();
  const { myUserId } = getUserInfoFromToken() || {};

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex md:flex-row flex-col md:gap-y-0 gap-y-4 justify-around items-center p-6 bg-white shadow-md">
      <Link
        to={"/"}
        className="inline-block text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400 transform transition-all duration-300 ease-in-out hover:rotate-3"
      >
        GameMarker
      </Link>

      <div className="relative flex items-center space-x-4">
        <button
          onClick={() => navigate("/games")}
          className="text-gray-600 cursor-pointer"
          title="Browse games"
        >
          <GrGamepad size={30} fontWeight={600} />
        </button>
        {myUserId ? (
          <>
            <button
              onClick={() => navigate(`/users/${myUserId}`)}
              className="text-gray-600 cursor-pointer"
              title="My profile"
            >
              <FiUser size={30} fontWeight={600} />
            </button>
            <button
              onClick={handleLogout}
              className="text-gray-600 cursor-pointer"
              title="Logout"
            >
              <IoMdExit size={30} fontWeight={600} />
            </button>
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default Navbar;

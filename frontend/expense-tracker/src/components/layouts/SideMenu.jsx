import React, { useContext } from 'react';
import { SIDE_MENU_DATA } from '../../utils/data';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/userContext';
import { ThemeContext } from '../../context/themeContext';
import CharAvatar from '../Cards/CharAvatar';

const SideMenu = ({ activeMenu }) => {
  const { user, clearUser } = useContext(UserContext);
  const themeContext = useContext(ThemeContext);
  const { theme = 'light' } = themeContext || {};
  const navigate = useNavigate();

  const handleClick = (route) => {
    if (route === "/logout" || route === "logout") {
      handleLogout();
      return;
    }
    navigate(route);
  };

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate('/login');
  };

  return (
    <div className="w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 p-5 sticky top-[61px] z-20">
      <div className="flex flex-col items-center justify-center gap-3 mt-3 mb-7">
        {user?.profileImageURL ? (
          <img
            src={user.profileImageURL}
            alt="Profile Image"
            className="w-20 h-20 bg-slate-400 rounded-full"
          />
        ) : (
          <CharAvatar
            fullName={user?.fullName}
            width="w-20"
            height="h-20"
            style="text-xl"
          />
        )}
        <h5 className="text-gray-800 font-medium leading-6">
          {user?.fullName || ""}
        </h5>
      </div>

      {SIDE_MENU_DATA.map((item, index) => (
        <button
          key={`menu_${index}`}
          className={`w-full flex items-center text-[15px] ${
            activeMenu === item.label
              ? "text-white bg-emerald-600"
              : "text-gray-700 hover:bg-gray-100"
          } py-3 px-6 rounded-lg mb-3 transition-colors`}
          onClick={() => handleClick(item.path)}
        >
          <item.icon className="text-xl mr-2" />
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default SideMenu;

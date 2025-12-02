import React, { useEffect, useState } from "react";
import { IoPerson } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { Dropdown } from "antd";

interface UserBlockProps {
  avatar?: string;
  accountname?: string;
  isLoggedIn?: boolean;
  loginRoute?: string;
  signupRoute?: string;
}

const UserBlock: React.FC<UserBlockProps> = ({
  avatar = "",
  loginRoute = "login",
  signupRoute = "register",
}) => {
  const navigate = useNavigate();
  const [username, setUserName] = useState("");
  const [userRole, setUserRole] = useState<string>("");

  useEffect(() => {
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");
    console.log("Current user role:", role); // Debug log
    setUserName(username ?? "");
    setUserRole(role ?? "");
  }, []);

  const handleNavigation = (route: string) => {
    navigate(route);
  };

  const handleLogout = () => {
    console.log('Logout clicked');
    localStorage.removeItem("username");
    localStorage.removeItem("accessToken");
    console.log('LocalStorage cleared');
    setUserName("");
    console.log('Username state cleared');
    navigate("/login");
  };

  const handleMenuClick = ({ key }: { key: string }) => {
    console.log('Menu item clicked:', key);
    switch (key) {
      case '1':
        navigate("/profile");
        break;
      case '2':
        handleLogout();
        break;
      case '3':
        navigate("/dashboard");
        break;
    }
  };

  const menuProps = {
    items: [
      ...(userRole === "admin" ? [
        {
          key: "3",
          label: "Dashboard",
          onClick: () => navigate("/dashboard")
        }
      ] : []),
      {
        key: "2",
        label: "Đăng xuất"
      }
    ],
    onClick: handleMenuClick
  };

  return (
    <div className="user-block-container">
      {username ? (
        <Dropdown menu={menuProps} trigger={["click"]}>
          <div className="user-block-info" style={{ cursor: "pointer" }}>
            <img
              src={
                avatar
                  ? avatar
                  : "https://phunuvietnam.mediacdn.vn/media/news/33abffcedac43a654ac7f501856bf700/anh-profile-tiet-lo-g-ve-ban-1.jpg"
              }
              alt="Avatar"
              className="user-block-avatar"
            />
            <span className="user-block-name">{username}</span>
          </div>
        </Dropdown>
      ) : (
        <div className="user-block-login">
          <div className="user-block-icon">
            <IoPerson size={20} color="white" />
          </div>
          <div className="user-links">
            <span
              onClick={() => handleNavigation(loginRoute)}
              className="user-block-link"
            >
              Đăng nhập
            </span>
            <span className="user-block-desk">{" / "}</span>
            <span
              onClick={() => handleNavigation(signupRoute)}
              className="user-block-link"
            >
              Đăng ký
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserBlock;

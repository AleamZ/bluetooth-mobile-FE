import { NavLink } from "react-router-dom";
import { IoIosLogOut } from "react-icons/io";
import {
  AiOutlineDashboard,
  AiOutlineProduct,
  AiOutlineSignature,
  AiOutlineFileProtect,
  AiOutlineSetting,
  AiOutlineContainer,
  AiOutlinePercentage,
  AiOutlineInfoCircle,
} from "react-icons/ai";
import { GoLog } from "react-icons/go";
import { MdOutlineLocalShipping } from "react-icons/md";
import { GrGroup, GrUser } from "react-icons/gr";

import Logo from "../../assets/logo-blue.png";

const MenuDashboard = () => {
  return (
    <div className="menu-dashboard">
      <div className="logo">
        <img src={Logo} alt="Logo" />
      </div>
      <div className="menu-items">
        <div className="menu-section">
          <ul>
            <li>
              <NavLink
                to="/dashboard"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <AiOutlineDashboard className="icon-dashboard" /> Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/products"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <AiOutlineProduct className="icon-dashboard" /> Sản Phẩm
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/categories"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <AiOutlineContainer className="icon-dashboard" /> Danh Mục
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/orders"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <AiOutlineFileProtect className="icon-dashboard" /> Đơn Hàng
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/bill-of-lading"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <MdOutlineLocalShipping className="icon-dashboard" /> Vận Đơn
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/even"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <AiOutlinePercentage className="icon-dashboard" /> Ưu Đãi
              </NavLink>
            </li>
          </ul>
        </div>

        <div className="menu-section dash">
          <ul>
            <li>
              <NavLink
                to="/customers"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <GrGroup className="icon-dashboard" /> Khách Hàng
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/employees"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <GrUser className="icon-dashboard" /> Nhân Viên
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/specifications"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <AiOutlineInfoCircle className="icon-dashboard" /> Thông Số KT
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/blog"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <GoLog className="icon-dashboard" /> Bài Viết
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/design/menu"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <AiOutlineSignature className="icon-dashboard" /> Thiết kế
              </NavLink>
            </li>
          </ul>
        </div>

        <div className="menu-section dash"></div>

        <div className="menu-section logout">
          <ul>
            <ul>
              <li>
                <NavLink
                  to="/settings"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  <AiOutlineSetting className="icon-dashboard" /> Chỉnh Sửa
                </NavLink>
              </li>
            </ul>
            <li>
              <NavLink
                to=""
                className={({ isActive }) => (isActive ? "active" : "")}
                onClick={() => {
                  localStorage.removeItem("accessToken");
                  localStorage.removeItem("username");
                }}
              >
                <IoIosLogOut className="icon-dashboard" /> Đăng Xuất
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MenuDashboard;

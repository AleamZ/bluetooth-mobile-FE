import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";

interface ItemProps {
  title?: string;
  link?: string;
  icon?: string;
}

const MenuItem: React.FC<ItemProps> = ({
  title = "",
  link = "",
  icon = "",
}) => {
  const navigate = useNavigate();

  return (
    <div className="menu-item-container">
      <div className="menu-item-title">
        <Link to={link}>
          <div className="menu-item-div-img">
            <img src={icon} className="menu-item-img" />
          </div>
        </Link>
        <div className="menu-item-title" onClick={() => navigate(link)}>
          {title}
        </div>
      </div>
      <div className="menu-item-arrow">
        <MdOutlineKeyboardArrowRight />
      </div>
    </div>
  );
};

export default MenuItem;

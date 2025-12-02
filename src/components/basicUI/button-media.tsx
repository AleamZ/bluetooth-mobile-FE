import React from "react";
import { Link } from "react-router-dom";

interface ButtonMediaItem {
  icon?: string;
  title?: string;
  link?: string;
}

const ButtonMedia: React.FC<ButtonMediaItem> = ({
  icon,
  title,
  link = "#",
}) => {
  return (
    <Link to={link} className="button-media-link">
      <div className="button-media-container">
        <div className="button-media-icon">
          <img className="button-media-img-icon" src={icon} />
        </div>
        <div className="button-media-title">{title}</div>
      </div>
    </Link>
  );
};

export default ButtonMedia;

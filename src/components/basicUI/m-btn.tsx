import { Button } from "antd";
import React from "react";
import { AiFillCaretDown } from "react-icons/ai";

interface IMButton {
  icon: React.ReactElement;
  title: string;
  render?: () => React.ReactNode;
  isShow?: boolean;
  onClick?: () => void;
}
const MBtn: React.FC<IMButton> = ({ icon, title, onClick, isShow, render }) => {
  const isCaretDown = icon.type === AiFillCaretDown;
  return (
    <div>
      <Button className="btn-filter-category" onClick={onClick}>
        {isCaretDown ? (
          <div className="btn-f-c-detail">
            <div className="btn-f-c-title">{title}</div>
            <div className="btn-f-c-icon">{icon}</div>
          </div>
        ) : (
          <div className="btn-f-c-detail">
            <div className="btn-f-c-icon">{icon}</div>
            <div className="btn-f-c-title">{title}</div>
          </div>
        )}
      </Button>
      {isShow && render && (
        <div
          style={{
            position: "absolute",
            zIndex: "1000",
            background: "white",
            width: 350,
            marginTop: 5,
          }}
        >
          {render()}
        </div>
      )}
    </div>
  );
};

export default MBtn;

import React from "react";
import { useNavigate } from "react-router-dom";

interface OptionItem {
  name?: string;
  img?: string;
  color?: string;
  link?: string;
}

interface OrtherProductProps {
  title?: string;
  listItem?: OptionItem[];
  linkMore: string;
}

const OrtherProduct: React.FC<OrtherProductProps> = ({
  title,
  listItem,
  linkMore,
}) => {
  const navigate = useNavigate();

  return (
    <div className="orther-product-container">
      <div className="orther-product-div-title">
        <p className="orther-product-title">{title}</p>
        <p className="orther-product-more" onClick={() => navigate(linkMore)}>
          Xem tất cả
        </p>
      </div>
      <div className="orther-product-div-option">
        {listItem?.map((item, index) => (
          <div
            className="orther-product-option"
            key={index}
            style={{ backgroundColor: item.color }}
            onClick={() => item.link && navigate(item.link)}
          >
            <p className="orther-product-option-title">{item.name}</p>
            <img
              className="orther-product-option-img"
              src={item.img}
              alt={item.name || "img-item"}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrtherProduct;

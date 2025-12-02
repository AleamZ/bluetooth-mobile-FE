import React, { useState } from "react";

interface Option {
  colorName: string;
  price: string;
  imgSrc: string;
  isDisabled?: boolean;
}

const options: Option[] = [
  {
    colorName: "Titan Sa Mạc",
    price: "41.790.000đ",
    imgSrc: "https://cdn2.cellphones.com.vn/insecure/rs:fill:50:50/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-titan-sa-mac_3.png",
  },
  {
    colorName: "Titan Tự Nhiên",
    price: "41.790.000đ",
    imgSrc: "https://cdn2.cellphones.com.vn/insecure/rs:fill:50:50/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-titan-sa-mac_3.png",
  },
  {
    colorName: "Titan Đen",
    price: "41.790.000đ",
    imgSrc: "https://cdn2.cellphones.com.vn/insecure/rs:fill:50:50/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-titan-sa-mac_3.png",
    isDisabled: true,
  },
  {
    colorName: "Titan Trắng",
    price: "41.790.000đ",
    imgSrc: "https://cdn2.cellphones.com.vn/insecure/rs:fill:50:50/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-titan-sa-mac_3.png",
    isDisabled: true,
  },
];

const ColorOption: React.FC = () => {
  const [selected, setSelected] = useState<string>("Titan Tự Nhiên");

  const handleSelect = (colorName: string) => {
    if (options.find((option) => option.colorName === colorName)?.isDisabled) {
      return;
    }
    setSelected(colorName);
  };

  return (
    <div className="color-options">
      <h3>Chọn màu để xem giá và chi nhánh có hàng</h3>
      <div className="options">
        {options.map((option) => (
          <div
            key={option.colorName}
            className={`option ${
              selected === option.colorName ? "selected" : ""
            } ${option.isDisabled ? "disabled" : ""}`}
            onClick={() => handleSelect(option.colorName)}
          >
            <div className="image-container">
              <img src={option.imgSrc} alt={option.colorName} />
            </div>
            <span className="color-name">{option.colorName}</span>
            <span className="price">{option.price}</span>
            {selected === option.colorName && <div className="checkmark" />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColorOption;

import React, { useState } from "react";

interface Option {
  size: string;
  price: string;
}

const options: Option[] = [
  { size: "1TB", price: "41.790.000 đ" },
  { size: "512GB", price: "36.590.000 đ" },
  { size: "256GB", price: "30.390.000 đ" },
  { size: "128GB", price: "27.390.000 đ" },
];

const StorageOptions: React.FC = () => {
  const [selected, setSelected] = useState<string>("1TB");

  const handleSelect = (size: string) => {
    setSelected(size);
  };

  return (
    <div className="storage-options">
      {options.map((option) => (
        <div
          key={option.size}
          className={`option ${selected === option.size ? "selected" : ""}`}
          onClick={() => handleSelect(option.size)}
        >
          <span className="size">{option.size}</span>
          <span className="price">{option.price}</span>
          {selected === option.size && <div className="checkmark" />}
        </div>
      ))}
    </div>
  );
};

export default StorageOptions;

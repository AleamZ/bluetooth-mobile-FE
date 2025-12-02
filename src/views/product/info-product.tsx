import { FiSmartphone } from "react-icons/fi";
import { RiDiscountPercentLine } from "react-icons/ri";
import { FaBoxOpen } from "react-icons/fa";
import { useState } from "react";
import { Modal } from "antd";
const dataDescription = [
  {
    icon: <FiSmartphone />,
    content:
      "Máy mới 100% , chính hãng Apple Việt Nam. Bluetooth hiện là đại lý bán lẻ uỷ quyền iPhone chính hãng VN/A của Apple Việt Nam",
  },
  {
    icon: <FaBoxOpen />,
    content: "iPhone sử dụng iOS 18, Cáp Sạc USB‑C (1m), Tài liệu",
  },
  {
    icon: <RiDiscountPercentLine />,
    content: "Giá sản phẩm đã bao gồm VAT",
  },
];
const InfoProduct = () => {
  const [openModalLocation, setOpenModalLocation] = useState<boolean>(false);
  return (
    <div className="info-product-container">
      <div className="info-detail">
        <h3>Thông tin sản phẩm</h3>
        <div className="description-info">
          {dataDescription.map((item) => (
            <div className="item-description">
              <span>{item.icon}</span>
              <span className="item-content">{item.content}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="branch-store">
        <div className="header-address">
          <button
            className="button-location"
            onClick={() => setOpenModalLocation(true)}
          >
            Hà Nội
          </button>
          <select className="select-district">
            <option value="">Quận/Huyện</option>
            <option value="1">Quận Hai Bà Trưng</option>
            <option value="2">Quận Đống Đa</option>
            <option value="3">Quận Bắc Từ Liêm</option>
          </select>
        </div>
      </div>
      <Modal
        className="modal-location"
        open={openModalLocation}
        onCancel={() => setOpenModalLocation(false)}
        footer={null}
        width={"40%"}
      >
        <div className="location-wrap">
          <input className="search-location" />
        </div>
      </Modal>
    </div>
  );
};

export default InfoProduct;

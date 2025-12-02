import React, { useState } from "react";
import MFAQ from "../basicUI/m-faq";
import MReview from "../basicUI/m-review";
import { Button } from "antd";
interface Store {
  phone: string;
  address: string;
  district: string;
  city: string;
}

const stores: Store[] = [
  {
    phone: "0708592979",
    address: "263 Đặng Văn Bi",
    district: "Thủ Đức",
    city: "Hồ Chí Minh",
  },
  {
    phone: "0903303231",
    address: "280 Trần Phú",
    district: "Bảo Lộc",
    city: "Lâm Đồng",
  },
];

interface IPropProduct {
  productDetail: any;
}

interface NormalQuestion {
  question: string;
  answer: string;
}

const normalQuestionList: NormalQuestion[] = [
  {
    question: "Điện thoại thông minh là gì?",
    answer:
      "Điện thoại thông minh là thiết bị di động có hệ điều hành, cho phép cài đặt ứng dụng và kết nối internet.",
  },
  {
    question: "Sự khác biệt giữa Android và iOS là gì?",
    answer:
      "Android là hệ điều hành mã nguồn mở của Google, trong khi iOS là hệ điều hành độc quyền của Apple.",
  },
  {
    question: "Những yếu tố nào quan trọng khi chọn mua điện thoại?",
    answer:
      "Các yếu tố quan trọng bao gồm hiệu năng, dung lượng pin, camera, màn hình và hệ điều hành.",
  },
  {
    question: "Làm thế nào để kéo dài tuổi thọ pin điện thoại?",
    answer:
      "Có thể kéo dài tuổi thọ pin bằng cách giảm độ sáng màn hình, tắt ứng dụng không cần thiết và sử dụng chế độ tiết kiệm pin.",
  },
  {
    question: "Công nghệ sạc nhanh hoạt động như thế nào?",
    answer:
      "Công nghệ sạc nhanh tăng công suất sạc giúp nạp pin nhanh hơn bằng cách điều chỉnh điện áp và cường độ dòng điện phù hợp.",
  },
];

const ProductInfo: React.FC<IPropProduct> = ({ productDetail }) => {
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("all");
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const cities = Array.from(new Set(stores.map((store) => store.city)));
  const districts = Array.from(
    new Set(
      stores
        .filter(
          (store) => selectedCity === "all" || store.city === selectedCity
        )
        .map((store) => store.district)
    )
  );

  const filteredStores = stores.filter(
    (store) =>
      (selectedCity === "all" || store.city === selectedCity) &&
      (selectedDistrict === "all" || store.district === selectedDistrict)
  );

  return (
    <>
      <div className="product-info">
        <div className="info-section">
          <div
            dangerouslySetInnerHTML={{ __html: productDetail?.infoProduct }}
          ></div>
        </div>
        <div className="store-section">
          <div className="store-header">
            <select
              value={selectedCity}
              onChange={(e) => {
                setSelectedCity(e.target.value);
                setSelectedDistrict("all");
              }}
            >
              <option value="all">Tất cả tỉnh thành</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
            >
              <option value="all">Tất cả quận huyện</option>
              {districts.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </div>
          <p>Có {filteredStores.length} cửa hàng có sản phẩm</p>
          <ul className="store-list">
            {filteredStores.map((store, index) => (
              <li key={index}>
                <span className="store-phone">📞 {store.phone}</span>
                <span className="store-address">
                  {store.address}, {store.district}, {store.city}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="detail-card-container">
        <div className="right-content">
          <div className="detail-card-product">
            <div
              className={`description ${isVisible ? "expanded" : ""}`}
              dangerouslySetInnerHTML={{ __html: productDetail?.description }}
            />
            <button onClick={toggleVisibility}>
              {isVisible ? "Ẩn" : "Hiển thị"} nội dung
            </button>
          </div>
          <MFAQ faqs={normalQuestionList} />
          <MReview />
        </div>
        <div className="spec-container">
          <p className="spec-title">Thông số kỹ thuật</p>
          {productDetail?.specifications.map((spec: any) => (
            <div key={spec._id}>
              {spec.specificationsSub.map((item: any) => (
                <div className="spec-box" key={item._id}>
                  <p className="spec-p">{item.key}</p>
                  <p className="spec-p">
                    {item.value
                      .split("/")
                      .map(
                        (
                          part:
                            | string
                            | number
                            | boolean
                            | React.ReactElement<
                                any,
                                string | React.JSXElementConstructor<any>
                              >
                            | Iterable<React.ReactNode>
                            | React.ReactPortal
                            | null
                            | undefined,
                          index: React.Key | null | undefined
                        ) => (
                          <React.Fragment key={index}>
                            {part}
                            {index !== item.value.split("/").length - 1 && (
                              <br />
                            )}
                          </React.Fragment>
                        )
                      )}
                  </p>
                </div>
              ))}
            </div>
          ))}
          <Button className="view-spec-detail">Xem cấu hình chi tiết</Button>
        </div>
      </div>
    </>
  );
};

export default ProductInfo;

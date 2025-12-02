import BannerSale from "@/components/basicUI/banner-sale";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaSortAmountDown, FaSortAmountDownAlt } from "react-icons/fa";
import { MdOutlinePercent } from "react-icons/md";
import MFAQ from "@/components/basicUI/m-faq";
import { IPromotion } from "@/types/promotion/promotion.interface";
import { PromotionService } from "@/services/promotion.service";
import { handleError } from "@/utils/catch-error";
import Countdown from "antd/es/statistic/Countdown";
interface PromotionNavigate {
  title: string;
  link: string;
}

const promotionNavigate: PromotionNavigate[] = [
  { title: "Chọn quà 8.3", link: "" },
  { title: "Vocher chớp nhoáng", link: "" },
  { title: "Ốp dán", link: "" },
  { title: "Quà đặc biệt", link: "" },
];

const promotionfilter = [
  {
    title: "Noi Bat",
  },
  {
    title: "Gia Dung",
  },
  {
    title: "Tablet",
  },
  {
    title: "Phu Kien",
  },
  {
    title: "Camera",
  },
];

const promotionSort = [
  {
    title: "xem nhieu",
    icon: <FaEye />,
  },
  {
    title: "khuyen mai hot",
    icon: <MdOutlinePercent />,
  },
  {
    title: "Gia Cao - Thap",
    icon: <FaSortAmountDown />,
  },
  {
    title: "Gia Thap - Cao",
    icon: <FaSortAmountDownAlt />,
  },
];

const cardData = [
  {
    cardImg:
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-14-plus_1__2.png",
    cardTitle: "Sản phẩm 1",
    cardPrice: 500000,
    cardOriginalPrice: 700000,
    cardPromotionMember: "Giảm 10%",
    cardPromotionStudent: "Giảm 5%",
    cardDetail: "Sản phẩm chất lượng cao, phù hợp với mọi nhu cầu.",
    cardStar: 4.5,
    cardFavorite: true,
    cardInstallment: "Trả góp 0%",
    cardDiscountZeroPercent: true,
    onClick: () => console.log("Đã chọn Sản phẩm 1"),
  },
  {
    cardImg:
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-14-plus_1__2.png",
    cardTitle: "Sản phẩm 2",
    cardPrice: 300000,
    cardOriginalPrice: 500000,
    cardPromotionMember: "Giảm 15%",
    cardPromotionStudent: "Giảm 8%",
    cardDetail: "Sản phẩm chất lượng, giá cả hợp lý.",
    cardStar: 4.8,
    cardFavorite: false,
    cardInstallment: "Trả góp 6 tháng",
    cardDiscountZeroPercent: false,
    onClick: () => console.log("Đã chọn Sản phẩm 2"),
  },
  {
    cardImg:
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-14-plus_1__2.png",
    cardTitle: "Sản phẩm 2",
    cardPrice: 300000,
    cardOriginalPrice: 500000,
    cardPromotionMember: "Giảm 15%",
    cardPromotionStudent: "Giảm 8%",
    cardDetail: "Sản phẩm chất lượng, giá cả hợp lý.",
    cardStar: 4.8,
    cardFavorite: false,
    cardInstallment: "Trả góp 6 tháng",
    cardDiscountZeroPercent: false,
    onClick: () => console.log("Đã chọn Sản phẩm 2"),
  },
  {
    cardImg:
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-14-plus_1__2.png",
    cardTitle: "Sản phẩm 2",
    cardPrice: 300000,
    cardOriginalPrice: 500000,
    cardPromotionMember: "Giảm 15%",
    cardPromotionStudent: "Giảm 8%",
    cardDetail: "Sản phẩm chất lượng, giá cả hợp lý.",
    cardStar: 4.8,
    cardFavorite: false,
    cardInstallment: "Trả góp 6 tháng",
    cardDiscountZeroPercent: false,
    onClick: () => console.log("Đã chọn Sản phẩm 2"),
  },
  {
    cardImg:
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-14-plus_1__2.png",
    cardTitle: "Sản phẩm 2",
    cardPrice: 300000,
    cardOriginalPrice: 500000,
    cardPromotionMember: "Giảm 15%",
    cardPromotionStudent: "Giảm 8%",
    cardDetail: "Sản phẩm chất lượng, giá cả hợp lý.",
    cardStar: 4.8,
    cardFavorite: false,
    cardInstallment: "Trả góp 6 tháng",
    cardDiscountZeroPercent: false,
    onClick: () => console.log("Đã chọn Sản phẩm 2"),
  },
  {
    cardImg:
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-14-plus_1__2.png",
    cardTitle: "Sản phẩm 2",
    cardPrice: 300000,
    cardOriginalPrice: 500000,
    cardPromotionMember: "Giảm 15%",
    cardPromotionStudent: "Giảm 8%",
    cardDetail: "Sản phẩm chất lượng, giá cả hợp lý.",
    cardStar: 4.8,
    cardFavorite: false,
    cardInstallment: "Trả góp 6 tháng",
    cardDiscountZeroPercent: false,
    onClick: () => console.log("Đã chọn Sản phẩm 2"),
  },
];

const cardDataImg = [
  {
    cardImg:
      "https://cdn2.cellphones.com.vn/x/https://dashboard.cellphones.com.vn/storage/Block-SW.png",
  },
  {
    cardImg:
      "https://cdn2.cellphones.com.vn/x/https://dashboard.cellphones.com.vn/storage/Block-SW.png",
  },
  {
    cardImg:
      "https://cdn2.cellphones.com.vn/x/https://dashboard.cellphones.com.vn/storage/Block-SW.png",
  },
  {
    cardImg:
      "https://cdn2.cellphones.com.vn/x/https://dashboard.cellphones.com.vn/storage/Block-SW.png",
  },
  {
    cardImg:
      "https://cdn2.cellphones.com.vn/x/https://dashboard.cellphones.com.vn/storage/Block-SW.png",
  },
  {
    cardImg:
      "https://cdn2.cellphones.com.vn/x/https://dashboard.cellphones.com.vn/storage/Block-SW.png",
  },
];

const BannerSaleData = [
  {
    imgTitle:
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:1156:0/q:90/plain/https://cellphones.com.vn/media/wysiwyg/83_Dday_mobile_title-desk.png",
    filter: promotionfilter,
    sort: promotionSort,
    card: cardData,
  },
  {
    imgTitle:
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:1156:0/q:90/plain/https://cellphones.com.vn/media/wysiwyg/83_Dday_household_title-desk.png",
    filter: promotionfilter,
    sort: promotionSort,
    card: cardData,
  },
  {
    imgTitle:
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:1156:0/q:90/plain/https://cellphones.com.vn/media/wysiwyg/83_Dday_beauty_title-desk.png",
    filter: promotionfilter,
    sort: promotionSort,
    card: cardData,
  },
  {
    imgTitle:
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:1156:0/q:90/plain/https://cellphones.com.vn/media/wysiwyg/83_Dday_case_title-desk.png",
    filter: promotionfilter,
    card: cardDataImg,
  },
];

const faqs = [
  {
    question: "Làm thế nào để đăng ký tài khoản?",
    answer: "Bạn có thể đăng ký bằng email hoặc số điện thoại.",
  },
  {
    question: "Tôi có thể đặt lịch hẹn trước bao lâu?",
    answer: "Bạn có thể đặt lịch trước tối đa 30 ngày.",
  },
  {
    question: "Có thể hủy đặt lịch không?",
    answer: "Có, bạn có thể hủy lịch trước 24 giờ.",
  },
];

const Promotion: React.FC = () => {
  const navigate = useNavigate();
  const [dataEvent, setDataEvent] = useState<IPromotion>();
  const asyncDataEvent = async () => {
    try {
      const response = await PromotionService.getPromotionActive();
      setDataEvent(response);
    } catch (error) {
      handleError(error);
    }
  };
  useEffect(() => {
    asyncDataEvent();
  }, []);
  return (
    <div
      className="promotion-container"
      style={{
        backgroundColor: `${dataEvent?.colorNavigation}`,
        backgroundImage: `${dataEvent?.background}`,
      }}
    >
      <div className="promotion-banner-header">
        <img
          className="promotion-img"
          src={dataEvent?.imageHeader}
          alt="banner-header"
        />
      </div>
      <div
        className="promotion-nav-container"
        style={{ backgroundColor: `${dataEvent?.colorNavigation}` }}
      >
        <ul className="promotion-navigate">
          {promotionNavigate.map((item, index) => (
            <li
              className="promotion-nav"
              key={index}
              onClick={() => navigate(item.link)}
            >
              {item.title}
            </li>
          ))}
        </ul>
      </div>
      <div className="promotion-countdown">
        {dataEvent && (
          <>
            {new Date() < new Date(dataEvent.startDate) ? (
              <>
                <div>
                  <p>Còn {<Countdown value={new Date(dataEvent.startDate).getTime()} />} để bắt đầu sự kiện</p>
                </div>
              </>
            ) : new Date() < new Date(dataEvent.endDate) && new Date() > new Date(dataEvent.startDate) ? (
              <>
                <Countdown
                  value={new Date(dataEvent.endDate).getTime()}
                  format="D ngày H giờ m phút s giây"
                />
                <div>
                  <p>Chỉ còn {<Countdown value={new Date(dataEvent.endDate).getTime()} />} sự kiện sẽ kết thúc</p>
                </div>
              </>
            ) : (
              <div>
                <p>Sự kiện đã kết thúc</p>
              </div>
            )}
          </>
        )}
      </div>
      <div className="promotion-banner-voucher">
        <img
          className="promotion-banner-voucher"
          src={dataEvent?.banner}
          alt="banner-voucher"
        />
      </div>
      <div className="Promotion-product-sale">
        {BannerSaleData.map((item, index) => (
          <BannerSale key={index} {...item} />
        ))}
      </div>
      {dataEvent?.listImageEvent.map((item) => (
        <div className="promotion-banner-voucher">
          <img
            className="promotion-banner-voucher"
            src={item}
            alt="banner-voucher"
          />
        </div>
      ))}

      <div style={{ maxWidth: "600px", margin: "50px auto" }}>
        <MFAQ faqs={faqs} />
      </div>
    </div>
  );
};

export default Promotion;

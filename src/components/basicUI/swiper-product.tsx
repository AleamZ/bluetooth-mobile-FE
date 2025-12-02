import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules"; // Import Navigation module


interface CardInfor {
  cardImg?: string;
  cardTitle?: string;
  cardPrice?: number;
  cardOriginalPrice?: number;
  cardPromotionMember?: string; 
  cardPromotionStudent?: string; 
  onClick?: () => void;
}

interface SwiperProductProps {
  card?: CardInfor[];
}

const SwiperProduct: React.FC<SwiperProductProps> = ({ card = [] }) => {
  const renderCard = () => {
      return card.map((cardData, index) => (
        <SwiperSlide  key={index}>
          <div className="swiper-product-slide">
            <img className="swiper-product-img" src={cardData.cardImg}/>
            {cardData.cardTitle !== undefined ? (
              <p className="swiper-product-title"> {cardData.cardTitle} </p>
            ) : (
              null
            )}
            <div className="swiper-product-price">
              <div className="swiper-product-price-r">
                {cardData.cardPrice !== undefined ? cardData.cardPrice.toLocaleString("vi-VN") : ""}
              </div>
              <div className="swiper-product-price-l">
                {cardData.cardOriginalPrice !== undefined ? cardData.cardOriginalPrice.toLocaleString("vi-VN") : ""}
              </div>
            </div>
              {cardData.cardPromotionMember !== undefined ? (
                <div className="swiper-product-discount">
                  {cardData.cardPromotionMember}
                </div>
              ) : (
                null
              )}
          </div>
        </SwiperSlide>
      ));
  };
  return (
    <div>
      <Swiper
      className="swiper-product-conatiner"
        navigation={true}
        modules={[Navigation]} // Thêm Navigation vào modules
        breakpoints={{
          1024: {
            slidesPerView: 5,
          },
          768: {
            slidesPerView: 3,
          },
          480: {
            slidesPerView: 1,
          },
        }}
      >
        {card.length > 0 ? (
          renderCard()
        ) : (
          <p>Không có sản phẩm nào!</p>
        )}
      </Swiper>
    </div>
  );
};

export default SwiperProduct;

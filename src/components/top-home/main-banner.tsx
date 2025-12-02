import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { IBanner } from "@/types/main-banner/main-banner.interface";
import { MainBannerService } from "@/services/main-banner.service";
import { handleError } from "@/utils/catch-error";

const MainBanner: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<any>(null);
  const [bannersIsShow, setBannersIsShow] = useState<IBanner[]>([]);
  const asyncDataMainBannersIsShow = async () => {
    try {
      const response = await MainBannerService.getIsShowBanner();
      setBannersIsShow(response);
    } catch (error) {
      handleError(error);
    }
  };
  useEffect(() => {
    asyncDataMainBannersIsShow();
  }, []);
  return (
    <div className="main-banner">
      <Swiper
        className="main-banner-swiper-container"
        navigation
        pagination={{ clickable: true }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        modules={[Navigation, Autoplay, Pagination]}
      >
        {bannersIsShow.map((item, index) => (
          <SwiperSlide key={index}>
            <img src={item.image} alt={item.title} className="banner-image" />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="menu">
        {bannersIsShow.map((banner, index) => (
          <button
            key={index}
            className={`menu-item ${activeIndex === index ? "active" : ""}`}
            onClick={() => {
              swiperRef.current?.slideTo(index);
            }}
          >
            {banner.title.toLocaleUpperCase()}
            <br />
            <span>{banner.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MainBanner;

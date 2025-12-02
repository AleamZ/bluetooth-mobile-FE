import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import React, { useRef, useState } from "react";
interface IMSwiper {
  data: any[];
  isMenu?: boolean;
}
const MSwiper: React.FC<IMSwiper> = ({ data, isMenu }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<any>(null);
  return (
    <div>
      <Swiper
        className="swiper-wrap"
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
        {data.map((item, index) => (
          <SwiperSlide key={index}>
            <img src={item} className="banner-image" />
          </SwiperSlide>
        ))}
      </Swiper>
      {isMenu && (
        <div className="menu">
          {data.map((item, index) => (
            <img
              src={item}
              className={`item-image ${activeIndex === index ? "active" : ""}`}
              onClick={() => {
                swiperRef.current?.slideTo(index);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MSwiper;

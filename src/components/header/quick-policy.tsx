import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules"; 
import images from "../../data/quick-policy.json"; 

const QuickPolicy: React.FC = () => {
  return (
    <>
      <div className="quick-policy-container">
        <Swiper
          className="quick-policy-swiper-sub-container"
          navigation={true}
          autoplay ={{
            delay: 3000,
            disableOnInteraction: false,
          }} 
          breakpoints={{
            1024: {
              slidesPerView: 3, 
            },
            768: {
              slidesPerView: 2, 
            },
            480: {
              slidesPerView: 1, 
            },
          }}
          modules={[Navigation, Autoplay]} 
        >
          {images.map((image) => (
            <SwiperSlide key={image.id}>
              <img 
                className="quick-policy-img" 
                src={image.url} 
                alt={image.alt} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
};

export default QuickPolicy;

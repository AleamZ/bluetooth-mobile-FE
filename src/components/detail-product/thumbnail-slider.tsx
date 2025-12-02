import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs, Navigation, FreeMode } from "swiper/modules";

interface IPropsThumbnail {
  images: string[]
}
const ThumbnailSlider: React.FC<IPropsThumbnail> = ({images}) => {
  const [thumbsSwiper, setThumbsSwiper] = React.useState<any>(null);

  return (
    <div className="swipper-container">
      <Swiper
        modules={[Thumbs, Navigation]}
        spaceBetween={10}
        navigation 
        thumbs={{ swiper: thumbsSwiper }} 
        className="main-swipper"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index} className="main-swipper-slide">
            <div className="main-swipper-item">
              <img className="main-swiper-img"
                src={image}
                alt={`Slide ${index + 1}`}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <Swiper
        modules={[Thumbs, FreeMode]}
        onSwiper={setThumbsSwiper}
        slidesPerView={9}
        freeMode 
        watchSlidesProgress
        className="sub-swipper"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index} className="sub-swipper-slide">
            <div className="sub-swipper-item">
              <img className="sub-swipper-img"
                src={image}
                alt={`Thumb ${index + 1}`}
              />
            </div> 
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ThumbnailSlider;

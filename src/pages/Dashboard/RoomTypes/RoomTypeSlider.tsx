import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Constants from "../../../common/configs/Constants";

interface RoomTypeSliderProps {
  images: string[];
  name: string;
}

const RoomTypeSlider: React.FC<RoomTypeSliderProps> = React.memo(
  ({ images, name }) => {
    if (!images || images.length === 0) {
      return <div>Không có hình ảnh</div>;
    }

    return (
      <Swiper
        slidesPerView={1}
        loop
        pagination={{
          clickable: true,
        }}
      >
        {images.map((image, idx) => (
          <SwiperSlide
            key={idx}
            className="w-full cursor-pointer"
          >
            <img
              className="w-full h-[200px] object-cover"
              src={`${Constants.BASE_URL_BACKEND}/${image}`}
              alt={name}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    );
  }
);

export default RoomTypeSlider;

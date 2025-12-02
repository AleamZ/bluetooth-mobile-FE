import { Player } from "@lottiefiles/react-lottie-player";
import animation from "@/data/animation-gift-box.json";
const HotSale = () => {
  return (
    <div className="hot-sale-container">
      <div className="hot-sale-top">
        <div className="hot-sale-top-left">
          <Player
            autoplay
            loop
            src={animation}
            style={{ height: "100px", width: "100px" }}
          />
          <span className="title">HOT SALE CUỐI TUẦN</span>
        </div>
        <div className="navigate-category">
          <button className="category-button active-category ">
            Điện thoại, Tablet
          </button>
          <button className="category-button">Điện thoại, Tablet</button>
          <button className="category-button">Điện thoại, Tablet</button>
        </div>
      </div>
      <div className="hot-sale-bottom"></div>
    </div>
  );
};

export default HotSale;

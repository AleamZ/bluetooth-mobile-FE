import MSwiper from "@/components/basicUI/m-swiper";
import ImagesDetail from "@/data/product-images-detail.json";
import InfoProduct from "./info-product";

const ProductDetail = () => {
  return (
    <div className="product-detail-container">
      <div className="header-title">
        <h2>iPhone 16 Pro Max 256GB | Chính hãng VN/A</h2>
        <span>{"⭐".repeat(5)}</span>
      </div>
      <div className="content-wrapper">
        <div className="right-content">
          <MSwiper data={ImagesDetail} />
          <InfoProduct />
        </div>
        <div className="left-content">ss</div>
      </div>
    </div>
  );
};

export default ProductDetail;

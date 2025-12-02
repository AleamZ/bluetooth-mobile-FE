import React from "react";
import SwiperProduct from "./swiper-product";

interface CardInfor {
    cardImg?: string;
    cardTitle?: string;
    cardPrice?: number;
    cardOriginalPrice?: number;
    cardPromotionMember?: string; // Chỉnh lại thành string
    cardPromotionStudent?: string; // Chỉnh lại thành string
    cardDetail?: string;
    cardStar?: number; // Chỉnh lại thành number
    cardFavorite?: boolean;
    cardInstallment?: string;
    cardDiscountZeroPercent?: boolean;
    onClick?: () => void;
}

interface PromotionFilter {
  title?: string;
  onclick?: () => void;
}

interface PromotionSort {
  title?: string;
  onclick?: () => void;
  icon?: React.ReactNode;
}

interface BannerSaleProps {
  imgTitle?: string;
  filter?: PromotionFilter[];
  sort?: PromotionSort[];
  card?: CardInfor[];
}

const BannerSale: React.FC<BannerSaleProps> = ({ imgTitle, filter = [], sort = [], card = [] }) => {
  return (
    <div className="product-sale-container">
      {/* Hình ảnh banner */}
      {imgTitle && (
        <div className="product-sale-img-title">
          <img className="product-sale-img"src={imgTitle} alt="img-title" />
        </div>
      )}

      {/* Danh sách Filter */}
      {filter.length > 0 && (
        <ul className="product-sale-nav-filter">
          {filter.map((itemFilter, indexFilter) => (
            <li className="product-sale-filter" key={indexFilter} onClick={itemFilter.onclick}>
              {itemFilter.title}
            </li>
          ))}
        </ul>
      )}

      {/* Danh sách Sort */}
      {sort.length > 0 && (
        <ul className="product-sale-nav-sort">
          {sort.map((itemSort, indexSort) => (
            <li className="product-sale-sort" key={indexSort} onClick={itemSort.onclick}>
              {itemSort.icon}{itemSort.title}
            </li>
          ))}
        </ul>
      )}

      {/* Swiper Product */}
      <div className="product-sale-product-slide">
        <SwiperProduct card={card} />
      </div>
    </div>
  );
};

export default BannerSale;

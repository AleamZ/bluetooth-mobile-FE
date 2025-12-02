import React from "react";

interface CardInfor {
  cardImg?: string;
  cardTitle?: string;
  cardPrice?: number;
  cardOriginalPrice?: number;
  cardPromotionMember?: number;
  cardPromotionStudent?: number;
  cardDetail?: string;
  cardStar?: boolean;
  cardFavorite?: boolean;
  cardInstallment?: string;
  cardDiscountZeroPercent?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardInfor> = ({
  cardImg,
  cardTitle,
  cardPrice,
  cardOriginalPrice,
  cardPromotionMember,
  cardPromotionStudent,
  cardStar,
  cardFavorite,
  cardInstallment,
  onClick,
}) => {
  return (
    <div className="card-container" onClick={onClick}>
      {/* Installment */}
      {cardInstallment && <div className="card-installment">Trả góp 0%</div>}

      {/* Discount Zero Percent */}
      {cardOriginalPrice && cardPrice && cardOriginalPrice > cardPrice && (
        <div className="card-discount">
          Giảm{" "}
          {(
            ((cardOriginalPrice - cardPrice) / cardOriginalPrice) *
            100
          ).toFixed(0)}
          %
        </div>
      )}

      {/* Image */}
      <div className="img-frame">
        <img
          className="card-img"
          src={cardImg || "default-image.png"}
          alt={cardTitle || "Sản phẩm"}
        />
      </div>

      {/* Title */}
      <div className="card-title">
        {cardTitle || "Tên sản phẩm không có sẵn"}
      </div>
      <div className="price-box">
        <div className="card-price">
          {cardOriginalPrice?.toLocaleString("vi-VN")}đ
        </div>
        {cardPrice && cardPrice !== 0 && (
          <div className="card-original-price">
            {(cardPrice || 0).toLocaleString("vi-VN")}đ
          </div>
        )}
      </div>

      {/* Promotion */}
      {cardPromotionMember && (
        <div className="card-promotion">
          Smember giảm thêm đến:
          <span className="card-promotion-price">
            {" "}
            {cardPromotionMember.toLocaleString("vi-VN")}đ
          </span>
        </div>
      )}
      {cardPromotionStudent && (
        <div className="card-promotion">
          S-Student giảm thêm đến:
          <span className="card-promotion-price">
            {" "}
            {cardPromotionStudent.toLocaleString("vi-VN")}đ
          </span>
        </div>
      )}

      {/* Details */}
      {/* <div className="card-detail">
        {cardDetail || "Không có thông tin chi tiết"}
      </div> */}

      {/* Interact */}
      <div className="card-interact">
        {cardStar ? (
          <div className="card-star">{"⭐".repeat(5)}</div>
        ) : (
          <div className="card-star">{"⭐".repeat(0)}</div>
        )}
        {cardFavorite ? (
          <div className="card-favorite">
            <span className="card-favorite-tt">Yêu Thích</span>
            ❤️
          </div>
        ) : (
          <div className="card-favorite">🤍</div>
        )}
      </div>
    </div>
  );
};

export default Card;

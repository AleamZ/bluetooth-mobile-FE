import { Rate, Button, Tag, Progress, Avatar } from "antd";
import { FaStar } from "react-icons/fa6";

const MReview = () => {
  return (
    <div className="review-container">
      {/* Header */}
      <div className="review-header">
        <h2>Đánh giá & nhận xét Samsung S25 Ultra 12GB 256GB</h2>
        <div className="review-score">
          <h1>4.9/5</h1>
          <Rate disabled allowHalf defaultValue={4.9} />
          <p className="review-count">13 đánh giá</p>
        </div>
      </div>

      {/* Thống kê đánh giá */}
      <div className="review-summary">
        {[5, 4, 3, 2, 1].map((star) => (
          <div key={star} className="review-stat">
            <span className="number-star">
              {star}
              <FaStar style={{ color: "#fadb14" }} />
            </span>
            <Progress
              style={{ width: "80%" }}
              percent={star === 5 ? 90 : star === 4 ? 10 : 0}
              showInfo={false}
              strokeColor="red"
            />
            <span>{star === 5 ? 12 : star === 4 ? 1 : 0} đánh giá</span>
          </div>
        ))}
      </div>

      {/* Đánh giá theo tiêu chí */}
      <div className="review-experience-container">
        <h2>Đánh giá theo trải nghiệm</h2>
        <div className="review-experience">
          {["Hiệu năng", "Thời lượng pin", "Chất lượng camera"].map(
            (category) => (
              <div key={category} className="review-category">
                <p>{category}</p>
                <Rate disabled defaultValue={4.8} />
                <span>4.8/5 (11)</span>
              </div>
            )
          )}
        </div>
      </div>

      {/* Nút đánh giá */}
      <div className="review-action">
        <p>Bạn đánh giá sao về sản phẩm này?</p>
        <Button className="btn-review">Đánh giá ngay</Button>
      </div>

      {/* Bộ lọc */}
      <div className="review-filters">
        <Tag color="red">Tất cả</Tag>
        <Tag>📷 Có hình ảnh</Tag>
        <Tag>✅ Đã mua hàng</Tag>
        {[5, 4, 3, 2, 1].map((star) => (
          <Tag key={star}>{star} ★</Tag>
        ))}
      </div>

      {/* Danh sách đánh giá */}
      <div className="review-list">
        {[1, 2].map((item) => (
          <div key={item} className="review-item">
            <Avatar>{item === 1 ? "H" : "L"}</Avatar>
            <div className="review-content">
              <h4>{item === 1 ? "Hung Vuong" : "Lê Hùng"}</h4>
              <p className="review-time">19/2/2025 20:56</p>
              <Rate disabled defaultValue={5} />
              <p className="review-text">
                {item === 1
                  ? "Tốt, máy đẹp, dịch vụ tốt"
                  : "Giá tăng lên 1 triệu!!!"}
              </p>
              <div className="review-tags">
                <Tag>Hiệu năng Siêu mạnh mẽ</Tag>
                <Tag>Thời lượng pin Cực khủng</Tag>
                <Tag>Chất lượng camera Chụp đẹp, chuyên nghiệp</Tag>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MReview;

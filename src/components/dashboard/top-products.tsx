import { useState } from "react";

const TopProducts = () => {
    const [selectedPeriod, setSelectedPeriod] = useState("today");

    // Dữ liệu giả cho danh sách sản phẩm bán chạy
    const topProducts = [
        {
            thumbnail: "path/to/thumbnail1.jpg",
            name: "Sản phẩm A",
            sales: 1500,
            views: 2000,
            revenue: 1000000,
        },
        {
            thumbnail: "path/to/thumbnail2.jpg",
            name: "Sản phẩm B",
            sales: 1300,
            views: 1800,
            revenue: 800000,
        },
        {
            thumbnail: "path/to/thumbnail2.jpg",
            name: "Sản phẩm B",
            sales: 1300,
            views: 1800,
            revenue: 800000,
        },
        {
            thumbnail: "path/to/thumbnail2.jpg",
            name: "Sản phẩm B",
            sales: 1300,
            views: 1800,
            revenue: 800000,
        },
        {
            thumbnail: "path/to/thumbnail2.jpg",
            name: "Sản phẩm B",
            sales: 1300,
            views: 1800,
            revenue: 800000,
        },

        // Thêm sản phẩm khác ở đây
    ];

    const timePeriods = ["Hôm nay", "Hôm qua", "Tuần này", "Tháng Này"];

    return (
        <div className="dashboard-top-products">
            <div className="dashboard-top-products-header">
                <h1>Sản Phẩm Hot</h1>

                {/* Dropdown chọn mốc thời gian */}
                <div className="time-period-selector">
                    <label htmlFor="time-period" className="mr-2"></label>
                    <select
                        id="time-period"
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                        className="select-time-period"
                    >
                        {timePeriods.map((period, index) => (
                            <option key={index} value={period.toLowerCase().replace(" ", "")}>
                                {period}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Tiêu đề cột */}
            <div className="product-list-header">
                <span className="header-thumbnail">Ảnh</span>
                <span className="header-name">Tên Sản Phẩm</span>
                <span className="header-sales">Số Bán</span>
                <span className="header-views">Lượt Xem</span>
                <span className="header-revenue">Doanh Thu</span>
            </div>

            {/* Danh sách sản phẩm bán chạy */}
            <div className="product-list">
                {topProducts.map((product, index) => (
                    <div key={index} className="product-item">
                        <img src={product.thumbnail} alt={product.name} className="product-thumbnail" />
                        <span className="product-name">{product.name}</span>
                        <span className="product-sales">Số bán: {product.sales}</span>
                        <span className="product-views">Lượt xem: {product.views}</span>
                        <span className="product-revenue">Doanh thu: {product.revenue.toLocaleString()} VND</span>
                    </div>
                ))}
            </div>
        </div>

    );
};

export default TopProducts;

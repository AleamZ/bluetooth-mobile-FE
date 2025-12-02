import { useState, useEffect } from "react";

const ProductOverview = () => {
    const [expanded, setExpanded] = useState(false);
    const [data, setData] = useState({
        totalProducts: 0,
        currentProducts: 0,
        hiddenProducts: 0,
        deletedProducts: 0,
    });

    const toggleExpand = () => setExpanded(!expanded);

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log("Fetching data from JSON...");
                const response = await fetch("/data/product-overview.json");

                console.log("Response status:", response.status);

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const jsonData = await response.json();
                console.log("Fetched JSON data:", jsonData);

                // Kiểm tra cấu trúc jsonData trước khi lưu
                if (
                    jsonData &&
                    typeof jsonData.totalProducts === "number" &&
                    typeof jsonData.currentProducts === "number" &&
                    typeof jsonData.hiddenProducts === "number" &&
                    typeof jsonData.deletedProducts === "number"
                ) {
                    setData(jsonData);
                    console.log("State updated with data:", jsonData);
                } else {
                    console.error("Invalid JSON structure:", jsonData);
                }
            } catch (error) {
                console.error("Error fetching product overview data:", error);
            }
        };

        fetchData();
    }, []);

    const { totalProducts, currentProducts, hiddenProducts, deletedProducts } = data;

    return (
        <div className="product-overview">
            <div className="header">
                <h2>Tổng quan sản phẩm</h2>
                <button className="details-button" onClick={toggleExpand}>
                    {expanded ? "Thu gọn" : "Chi tiết"}
                </button>
            </div>
            <div className="progress-container">
                <div className="progress-bar">
                    <div
                        className="progress-filled"
                        style={{
                            width: totalProducts
                                ? `${(currentProducts / totalProducts) * 100}%`
                                : "0%",
                        }}
                    ></div>
                </div>
                <span className="progress-text">
                    {currentProducts}/{totalProducts}
                </span>
            </div>

            {expanded && (
                <div className="extra-info">
                    <div className="info-item">
                        <strong>Sản phẩm đang ẩn:</strong> {hiddenProducts}
                    </div>
                    <div className="info-item">
                        <strong>Sản phẩm đã xóa:</strong> {deletedProducts}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductOverview;

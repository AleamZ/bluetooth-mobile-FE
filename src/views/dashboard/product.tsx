import ProductOverview from "@/components/dashboard/product-overview";
import ProductList from "@/components/dashboard/product-list";
import ProductCategory from "@/components/dashboard/product-category";
import ProductBrand from "@/components/dashboard/product-brand";
import { AiOutlinePlus } from "react-icons/ai";
import { Link } from "react-router-dom";
import { Col, Row } from "antd";

const ProductPage = () => {
  return (
    <div className="product-page">
      <div className="product-header">
        <h1>Quản Lý Sản phẩm</h1>
        <Link to="/add-product" className="btn">
          <AiOutlinePlus className="icon" />
          Tạo Sản Phẩm
        </Link>
      </div>
      {/* Component Tổng Quản Sản Phẩm */}
      <ProductOverview />
      {/* Bố cục chia 2:8 */}
      {/* <div className="product-content"> */}
      <Row gutter={[12, 12]}>
        <Col span={4}>
          <Row gutter={[12, 6]}>
            <Col span={24} className="product-category">
              <ProductCategory />
            </Col>
            <Col span={24} className="product-brand">
              <ProductBrand />
            </Col>
          </Row>
        </Col>
        <Col span={20}>
          <div>
            <ProductList />
          </div>
        </Col>
      </Row>
      {/* </div> */}
    </div>
  );
};

export default ProductPage;

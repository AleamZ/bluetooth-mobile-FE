import MBreadcrumb from "@/components/basicUI/breadcrumb";
import MBtnBackToTop from "@/components/basicUI/m-btn-backtotop";
import { ProductService } from "@/services/product.service";
import { handleError } from "@/utils/catch-error";
import ProductDetail from "@/views/product_detail/product-detail.view";
import { Spin } from "antd";
import React, { useEffect, useState } from "react";

interface IProductDetail {
  category: any;
  product: any;
  brand: any;
}
const ProductDetailLayout: React.FC = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [productDetail, setProductDetail] = useState<IProductDetail>({
    category: {},
    product: {},
    brand: {},
  });
  const asyncGetProductById = async () => {
    try {
      setLoading(true);
      const response = await ProductService.getProductById(
        location.pathname.split("/")[2]
      );
      setProductDetail(response);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    asyncGetProductById();
    window.scrollTo(0, 0);
  }, []);
  const breadcrumb = [
    { name: "Trang chủ", url: "/" },
    {
      name: productDetail?.category.name,
      url: `/${productDetail?.category.url}`,
    },
    {
      name: productDetail?.brand.name,
      url: `/${productDetail?.category.url}/${productDetail?.brand.name}`,
    },
    {
      name: productDetail?.product.name,
      url: location.pathname,
    },
  ];
  return (
    <Spin spinning={isLoading}>
      <MBreadcrumb breadcrumb={breadcrumb} />
      <ProductDetail />
      <MBtnBackToTop />
    </Spin>
  );
};

export default ProductDetailLayout;

import React, { useEffect, useState } from "react";
import CategoryDetail from "@/views/product_detail/category-detail.view";
import MBreadcrumb from "@/components/basicUI/breadcrumb";
import { handleError } from "@/utils/catch-error";
import { ProductService } from "@/services/product.service";
import { CategoryService } from "@/services/category.service";
import { Spin } from "antd";
import MBtnBackToTop from "@/components/basicUI/m-btn-backtotop";
import { SpecificationService } from "@/services/specification.service";
import { IProduct } from "@/types/product/product.interface";

const Category: React.FC = () => {
  const [specifications, setSpecifications] = useState([]);
  const [products, setProducts] = React.useState<IProduct[]>([]);
  const [category, setCategory] = React.useState({
    name: "",
    url: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const asyncProducts = async () => {
    try {
      setIsLoading(true);
      const response = await ProductService.getProductFilter({
        url: location.pathname.split("/")[1],
      });
      const resCategory = await CategoryService.getCategoryByUrl(
        location.pathname.split("/")[1]
      );
      setProducts(response);
      setCategory(resCategory);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };
  const asyncSpecifications = async () => {
    try {
      setIsLoading(true);
      const response = await SpecificationService.getSpecificationsByUrl(
        location.pathname.split("/")[1]
      );
      setSpecifications(response);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    asyncProducts();
    asyncSpecifications();
  }, []);
  const breadcrumb = [
    { name: "Trang chủ", url: "/" },
    { name: category.name, url: `${category.url}` },
  ];
  return (
    <Spin spinning={isLoading}>
      <MBreadcrumb breadcrumb={breadcrumb} />
      <CategoryDetail
        setProducts={setProducts}
        products={products}
        specifications={specifications}
      />
      <MBtnBackToTop />
    </Spin>
  );
};

export default Category;

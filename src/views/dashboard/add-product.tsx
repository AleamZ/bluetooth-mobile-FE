import React, { useState } from "react";
import CreateProductComponent from "@/components/dashboard/create-product-basicinfo";
import CreateProductVariant from "@/components/dashboard/create-product-variant";
import CreateProductSpecifications from "../../components/dashboard/create-product-specifications";
import { Button, message, Spin } from "antd";
import { ProductService } from "@/services/product.service";
import axios from "axios";

interface IFormData {
  name: string;
  categoryId: string;
  brandId: string;
  basePrice: number;
  salePrice: number;
  description: string;
  imageThumbnailUrl: string;
  imageUrls: string[];
  infoProduct: string;
}

interface IVariant {
  attributes: Record<string, string>;
  price: number;
  salePrice?: number;
  stock: number;
  images: string[];
  status: "available" | "unavailable";
}

type IVariants = IVariant[];

const AddProduct: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [thumbnail, setThumbnail] = useState<any[]>([]);
  const [imageList, setImageList] = useState<any[]>([]);
  const [specificationGroups, setSpecificationGroups] = useState<
    Array<{
      groupName: string;
      specifications: Array<{ name: string; value: string }>;
    }>
  >([]);
  const [formData, setFormData] = useState<IFormData>({
    name: "",
    categoryId: "",
    brandId: "",
    basePrice: 0,
    salePrice: 0,
    description: "",
    imageThumbnailUrl: "",
    imageUrls: [],
    infoProduct: "",
  });

  const [variantProduct, setVariantProduct] = useState<IVariants>([]);

  const handleCreateProduct = async () => {
    try {
      setIsLoading(true);
      if (!thumbnail.length) {
        message.error("Vui lòng chọn ảnh thumbnail");
        return;
      }
      const payloadImage = new FormData();
      thumbnail.forEach((file) => {
        payloadImage.append("image", file.originFileObj);
      });
      const responseThumbnail = await axios.post(
        "https://bluetooth-mobile-web-backend.onrender.com/upload/single",
        payloadImage,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      let responseList = {
        status: 200,
        data: {
          urls: [],
        },
      };
      if (imageList.length) {
        const payloadImages = new FormData();
        imageList.forEach((file) => {
          payloadImages.append("images", file.originFileObj);
        });
        responseList = await axios.post(
          "https://bluetooth-mobile-web-backend.onrender.com/upload/multiple",
          payloadImages,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      if (responseThumbnail.status === 200 && responseList.status === 200) {
        const transformedSpecifications = specificationGroups.map((group) => ({
          nameGroup: group.groupName,
          specificationsSub: group.specifications
            .filter((spec) => spec.value)
            .map((spec) => ({
              key: spec.name,
              value: spec.value,
            })),
        }));

        let payload: any = {
          name: formData.name,
          categoryId: formData.categoryId,
          brandId: formData.brandId,
          description: formData.description,
          imageThumbnailUrl: responseThumbnail.data?.url,
          imageUrls: responseList?.data?.urls,
          infoProduct: formData.infoProduct,
          specifications: transformedSpecifications,
        };

        // Tính tổng stock của các biến thể
        const totalStock = variantProduct.reduce(
          (total, variant) => total + (variant.stock || 0),
          0
        );

        // Nếu có các biến thể (ví dụ: Màu sắc với nhiều giá trị)
        if (variantProduct.length > 1) {
          payload = {
            ...payload,
            variants: variantProduct,
            stock: totalStock, // Tổng stock của biến thể sẽ được tính vào sản phẩm chính
          };
        }
        // Nếu không có biến thể (chỉ có một biến thể duy nhất)
        else if (variantProduct.length === 1) {
          // Lấy thông tin từ biến thể và thêm vào payload
          payload = {
            ...payload,
            price: variantProduct[0].price,
            salePrice: variantProduct[0].salePrice,
            stock: variantProduct[0].stock, // Lấy stock từ biến thể
          };
        }
        // Nếu không có biến thể nào, chỉ gửi giá trị chung
        else {
          payload = {
            ...payload,
            price: formData.basePrice,
            salePrice: formData.salePrice,
            stock: 0, // Nếu không có biến thể thì stock sẽ là 0
          };
        }

        // Log payload to console

        await ProductService.createProduct(payload);

        // Reset formData và variantProduct
        setFormData({
          name: "",
          categoryId: "",
          brandId: "",
          basePrice: 0,
          salePrice: 0,
          description: "",
          imageThumbnailUrl: "",
          imageUrls: [],
          infoProduct: "",
        });
        setVariantProduct([]);
        setSpecificationGroups([]);

        message.success("Tạo sản phẩm thành công!");
      }
    } catch (error) {
      console.log({ error });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Spin spinning={isLoading}>
      <div className="add-product-container">
        <h1 className="add-product-title">Tạo Sản phẩm</h1>
        <div className="add-product-basic-info">
          <CreateProductComponent
            setImageList={setImageList}
            setThumbnail={setThumbnail}
            formData={formData}
            setFormData={setFormData}
          />
        </div>
        <div className="add-product-characteristics">
          <CreateProductVariant setVariantProduct={setVariantProduct} />
        </div>
        {formData.categoryId && ( // Only render if categoryId exists
          <div className="add-product-specifications">
            <CreateProductSpecifications
              specificationGroups={specificationGroups}
              setSpecificationGroups={setSpecificationGroups}
              selectedCategory={formData.categoryId}
            />
          </div>
        )}
        <div style={{ marginTop: "20px" }}>
          <Button type="default" style={{ marginRight: "10px" }}>
            Lưu bản nháp
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            onClick={handleCreateProduct}
          >
            Gửi đi
          </Button>
        </div>
      </div>
    </Spin>
  );
};

export default AddProduct;

import React, { useEffect, useState } from "react";
import { Input, Typography, Upload, message, Row, Col } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import MSelect from "../basicUI/m-select";
import { DashboardService } from "@/services/dashboard.service";
import { BrandService } from "@/services/brand.service";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";

const { Text } = Typography;

const CreateProductComponent = ({
  setImageList,
  setThumbnail,
  formData,
  setFormData,
}: {
  setImageList: React.Dispatch<React.SetStateAction<any[]>>;
  setThumbnail: React.Dispatch<React.SetStateAction<any[]>>;
  formData: {
    name: string;
    categoryId: string;
    brandId: string;
    basePrice: number;
    salePrice: number;
    description: string;
    infoProduct: string;
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      name: string;
      categoryId: string;
      brandId: string;
      basePrice: number;
      salePrice: number;
      description: string;
      imageThumbnailUrl: string;
      imageUrls: string[];
      infoProduct: string;
    }>
  >;
}) => {
  const [categoryOption, setCategoryOption] = useState<[]>([]);
  const [brandOption, setBrandOption] = useState<[]>([]);
  const maxLength = 255;
  // Thêm state cho thumbnail

  const handleImageUpload = ({ file, fileList }: any) => {
    console.log({ file });
    setImageList(fileList);
  };

  const convertDataOption = (data: any) => {
    return data.map((item: any) => ({
      label: item.name,
      value: item._id,
    }));
  };
  const handleThumbnailUpload = async ({ file, fileList }: any) => {
    console.log({ file });
    setThumbnail(fileList);
  };
  const fetchCategories = async () => {
    try {
      const response = await DashboardService.getAllCategoriesActive();
      setCategoryOption(convertDataOption(response));
    } catch (error: any) {
      message.error(error.message || "Lỗi xảy ra");
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await BrandService.getBrandActive();
      setBrandOption(convertDataOption(response));
    } catch (error: any) {
      message.error(error.message || "Lỗi xảy ra");
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchBrands();
  }, []);
  return (
    <div className="basic-info">
      <h2>Thông tin cơ bản</h2>
      <Row gutter={[12, 12]}>
        <Col span={24}>
          <div className="input-container">
            <Text className="label">
              <span className="required">*</span> Tên sản phẩm
            </Text>
            <Input
              className="input"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Nhập tên sản phẩm"
              maxLength={maxLength}
            />
            <div className="character-count">
              {formData.name.length}/{maxLength}
            </div>
          </div>
        </Col>
      </Row>

      <Row gutter={[12, 12]}>
        <Col span={12}>
          <div className="input-container">
            <Text className="label">
              <span className="required">*</span> Danh mục
            </Text>
            <MSelect
              options={categoryOption}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, categoryId: value }))
              }
              value={formData.categoryId}
            />
          </div>
        </Col>
        <Col span={12}>
          <div className="input-container">
            <Text className="label">
              <span className="required">*</span> Thương hiệu
            </Text>
            <MSelect
              options={brandOption}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, brandId: value }))
              }
              value={formData.brandId}
            />
          </div>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <div className="input-container">
            <Text className="label">
              <span className="required">*</span> Thông tin sản phẩm
            </Text>
            <ReactQuill
              value={formData.infoProduct}
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  infoProduct: value,
                }))
              }
            />
          </div>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <div className="input-container">
            <Text className="label">
              <span className="required">*</span> Miêu tả sản phẩm
            </Text>
            <ReactQuill
              value={formData.description}
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  description: value,
                }))
              }
            />
          </div>
        </Col>
      </Row>
      {/* Thưởng Hiệu */}

      {/* Thêm hình ảnh */}
      <div className="input-container">
        <Text className="label">Ảnh sản phẩm</Text>
        <Upload
          listType="picture-card"
          onChange={handleImageUpload}
          maxCount={10}
        >
          <PlusOutlined />
        </Upload>
      </div>

      {/* Thêm ảnh Thumbnail */}
      <div className="input-container">
        <Text className="label">Ảnh Thumbnail</Text>
        <Upload
          listType="picture-card"
          onChange={handleThumbnailUpload}
          maxCount={1}
          multiple={false}
        >
          <PlusOutlined />
        </Upload>
      </div>
    </div>
  );
};

export default CreateProductComponent;

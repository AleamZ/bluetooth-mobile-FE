import React, { useState, useEffect } from "react";
import {
  Button,
  Checkbox,
  DatePicker,
  Input,
  Select,
  Spin,
  Table,
  Upload,
  message,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import "react-quill/dist/quill.snow.css";
import { CategoryService } from "@/services/category.service";
import { ProductService } from "@/services/product.service";
import { IPromotion } from "@/types/promotion/promotion.interface";
import axios from "axios";
import dayjs from "dayjs";
import { PromotionService } from "@/services/promotion.service";
import { handleError } from "@/utils/catch-error";
import { UploadService } from "@/services/upload.service";
const { Option } = Select;

const AddSale: React.FC = () => {
  const [formData, setFormData] = useState<IPromotion>({
    nameEvent: "",
    imageHeader: "",
    banner: "",
    background: "",
    colorNavigation: "",
    startDate: "",
    endDate: "",
    discountType: "",
    discountPercent: 0,
    discountMoney: 0,
    listProducts: [],
    listImageEvent: [],
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[][]>([]);
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [imageHeader, setImageHeader] = useState<any[]>([]);
  const [imageBanner, setImageBanner] = useState<any[]>([]);
  const [imageBackground, setImageBackground] = useState<any[]>([]);
  const [listImage, setListImage] = useState<any[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    selectedCategories.forEach((category, index) => {
      if (category) {
        fetchProducts(category, index);
      }
    });
  }, [selectedCategories]);

  const fetchCategories = async () => {
    try {
      const fetchedCategories = await CategoryService.getActive();
      setCategories(fetchedCategories);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const fetchProducts = async (categoryId: string, index: number) => {
    try {
      const fetchedProducts = await ProductService.getProductFilter({
        url: ""
      });
      const filteredProducts = fetchedProducts.filter(
        (product: any) => product.categoryId === categoryId
      );

      const transformedProducts = filteredProducts.map((product: any) => {
        let price = 0;
        let salePrice = 0;

        if (product.variants && product.variants.length > 0) {
          // Find variant with lowest price
          const lowestPriceVariant = product.variants.reduce(
            (lowest: any, current: any) => {
              const currentPrice = current.salePrice || current.price;
              const lowestPrice = lowest.salePrice || lowest.price;
              return currentPrice < lowestPrice ? current : lowest;
            },
            product.variants[0]
          );

          price = lowestPriceVariant.price || 0;
          salePrice = lowestPriceVariant.salePrice || price;
        } else {
          // No variants, use product's direct price
          price = product.price || 0;
          salePrice = product.salePrice || price;
        }

        // Calculate salePriceWithEvent based on discount details
        let salePriceWithEvent = salePrice;
        if (formData.discountType === "percentage") {
          salePriceWithEvent =
            salePrice - (salePrice * formData.discountPercent) / 100;
        } else if (formData.discountType === "amount") {
          salePriceWithEvent = salePrice - formData.discountMoney;
        }

        return {
          id: product._id,
          name: product.name || "Unnamed Product",
          price: price,
          salePrice: salePrice,
          salePriceWithEvent: salePriceWithEvent,
          thumbnail: product.imageThumbnailUrl || "",
          categoryId: product.categoryId,
          hasVariants: product.variants && product.variants.length > 0,
        };
      });

      console.log("Transformed products:", transformedProducts); // Debug log

      setProducts((prevProducts) => {
        const newProducts = [...prevProducts];
        newProducts[index] = transformedProducts;
        return newProducts;
      });
    } catch (error) {
      console.error("Failed to fetch products:", error);
      if (axios.isAxiosError(error)) {
        console.log("Raw API response:", error.response?.data); // Debug log
      } else {
        console.error("An unexpected error occurred:", error);
      }
      setProducts((prevProducts) => {
        const newProducts = [...prevProducts];
        newProducts[index] = [];
        return newProducts;
      });
    }
  };

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // const uploadImage = async (imageFiles: any, endpoint: any) => {
  //   if (!imageFiles || imageFiles.length === 0)
  //     return { data: { url: "" }, status: 200 };

  //   const formData = new FormData();
  //   imageFiles.forEach((file: any) =>
  //     formData.append("image", file.originFileObj)
  //   );

  //   try {
  //     return await axios.post(endpoint, formData, {
  //       headers: { "Content-Type": "multipart/form-data" },
  //     });
  //   } catch (error) {
  //     console.error("Image upload failed:", error);
  //     return { data: { url: "" }, status: 500 };
  //   }
  // };

  // const uploadMultipleImages = async (imageFiles: any, endpoint: any) => {
  //   if (!imageFiles || imageFiles.length === 0)
  //     return { status: 200, data: { urls: [] } };

  //   const formData = new FormData();
  //   imageFiles.forEach((file: any) =>
  //     formData.append("images", file.originFileObj)
  //   );

  //   try {
  //     return await axios.post(endpoint, formData, {
  //       headers: { "Content-Type": "multipart/form-data" },
  //     });
  //   } catch (error) {
  //     console.error("Multiple image upload failed:", error);
  //     return { status: 500, data: { urls: [] } };
  //   }
  // };

  const handleCreateSale = async () => {
    try {
      setIsLoading(true);
      const responseImageHeader = await UploadService.uploadSingle(imageHeader[0].originFileObj);
      const responseImageBanner = await UploadService.uploadSingle(imageBanner[0].originFileObj);
      const responseImageBackground = await UploadService.uploadSingle(imageBackground[0].originFileObj);
      const responseList = await UploadService.uploadMultiple(listImage.map(img => img.originFileObj));

      if (
        responseImageHeader.status === 200 &&
        responseImageBanner.status === 200 &&
        responseImageBackground.status === 200 &&
        responseList.status === 200
      ) {
        const payload = {
          nameEvent: formData.nameEvent,
          imageHeader: responseImageHeader.data?.url,
          banner: responseImageBanner.data?.url,
          background: responseImageBackground.data?.url,
          colorNavigation: formData.colorNavigation,
          startDate: dayjs(formData.startDate)
            .startOf("day")
            .format("YYYY-MM-DD HH:mm:ss"),
          endDate: dayjs(formData.endDate)
            .startOf("day")
            .format("YYYY-MM-DD HH:mm:ss"),
          discountType: formData.discountType,
          discountPercent: formData.discountPercent,
          discountMoney: formData.discountMoney,
          listProducts: selectedProducts,
          listImageEvent: responseList.data?.urls,
        };
        await PromotionService.createPromotion(payload);
        message.success("Chương trình đã được tạo thành công!");
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryChange = (value: string, index: number) => {
    setSelectedCategories((prevSelected) => {
      const newSelected = [...prevSelected];
      newSelected[index] = value;
      return newSelected;
    });
  };

  const columns = [
    {
      title: "Ảnh",
      dataIndex: "thumbnail",
      key: "thumbnail",
      render: (text: string) => (
        <img src={text} alt="thumbnail" style={{ width: 50, height: 50 }} />
      ),
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Giá Gốc",
      dataIndex: "price",
      key: "price",
      render: (price: number, record: any) =>
        `${formatPrice(price)}${record.hasVariants ? "" : ""}`,
    },
    {
      title: "Giá Giảm",
      dataIndex: "salePrice",
      key: "salePrice",
      render: (salePrice: number, record: any) =>
        `${formatPrice(salePrice)}${record.hasVariants ? "" : ""}`,
    },
    {
      title: "Giá Sự Kiện",
      dataIndex: "salePrice",
      key: "eventPrice",
      render: (salePrice: number) => {
        let eventPrice = salePrice;
        if (
          formData.discountType === "percentage" &&
          formData.discountPercent
        ) {
          eventPrice = salePrice - (salePrice * formData.discountPercent) / 100;
        } else if (
          formData.discountType === "amount" &&
          formData.discountMoney
        ) {
          eventPrice = salePrice - formData.discountMoney;
        }
        return formatPrice(Math.max(eventPrice, 0));
      },
    },
    {
      title: "Chọn",
      key: "select",
      render: (_: any, record: any) => (
        <Checkbox
          checked={selectedProducts.includes(record.id)}
          onChange={() => handleSelectProduct(record.id)}
        />
      ),
    },
  ];

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts((prevSelected) => {
      const newSelected = prevSelected.includes(productId)
        ? prevSelected.filter((id) => id !== productId)
        : [...prevSelected, productId];
      return newSelected;
    });
  };

  const handleImageHeaderUpload = ({ file, fileList }: any) => {
    console.log({ file });
    setImageHeader(fileList);
  };
  const handleImageBannerUpload = ({ file, fileList }: any) => {
    console.log({ file });

    setImageBanner(fileList);
  };
  const handleImageBackgroundUpload = ({ file, fileList }: any) => {
    console.log({ file });

    setImageBackground(fileList);
  };
  const handleListImageUpload = ({ file, fileList }: any) => {
    console.log({ file });

    setListImage(fileList);
  };

  return (
    <Spin spinning={isLoading}>
      <div className="add-event-container">
        <h1 className="add-event-title">Tạo Chương Trình Khuyến Mãi</h1>

        {/* Basic Information */}
        <div className="add-event-section">
          <h2 className="section-title">Thông tin cơ bản</h2>
          <div className="add-event-basic-info">
            <Input
              placeholder="Tên Chương trình"
              value={formData.nameEvent}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, nameEvent: e.target.value }))
              }
            />
          </div>

          <div className="image-upload-grid">
            <div className="add-event-description">
              <a>Chọn ảnh header</a>
              <Upload
                listType="picture-card"
                onChange={handleImageHeaderUpload}
                maxCount={1}
              >
                <PlusOutlined />
              </Upload>
            </div>
            <div className="add-event-description">
              <a>Chọn ảnh banner</a>
              <Upload
                listType="picture-card"
                onChange={handleImageBannerUpload}
                maxCount={1}
              >
                <PlusOutlined />
              </Upload>
            </div>
            <div className="add-event-description">
              <a>Chọn ảnh background</a>
              <Upload
                listType="picture-card"
                onChange={handleImageBackgroundUpload}
                maxCount={1}
              >
                <PlusOutlined />
              </Upload>
            </div>
            <div className="add-event-description">
              <a>Chọn danh sách ảnh miêu tả</a>
              <Upload
                listType="picture-card"
                onChange={handleListImageUpload}
                maxCount={10}
              >
                <PlusOutlined />
              </Upload>
            </div>
          </div>
          <div style={{ marginTop: "6px" }}>
            <input
              type="color"
              value={formData.colorNavigation}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  colorNavigation: e.target.value,
                }))
              }
            />
          </div>
        </div>

        {/* Time Period */}
        <div className="add-event-section">
          <h2 className="section-title">Thời gian áp dụng</h2>
          <div className="add-event-dates">
            <DatePicker
              placeholder="Thời gian bắt đầu"
              value={formData.startDate}
              onChange={(date) =>
                setFormData((prev) => ({ ...prev, startDate: date }))
              }
            />
            <DatePicker
              placeholder="Thời gian kết thúc"
              value={formData.endDate}
              onChange={(date) =>
                setFormData((prev) => ({ ...prev, endDate: date }))
              }
            />
          </div>
        </div>

        {/* Discount Details */}
        <div className="add-event-section">
          <h2 className="section-title">Chi tiết giảm giá</h2>
          <div className="add-event-discount-type">
            <a>Kiểu giảm giá</a>
            <Select
              placeholder="Chọn kiểu giảm giá"
              value={formData.discountType}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, discountType: value }))
              }
            >
              <Option value="percentage">Giảm theo %</Option>
              <Option value="amount">Giảm giá tiền</Option>
            </Select>
          </div>

          <div className="add-event-discount-value">
            <a>
              {formData.discountType === "percentage"
                ? "Giá trị giảm (%)"
                : "Giá trị giảm (VNĐ)"}
            </a>
            <Input
              type="number"
              placeholder={`Nhập giá trị giảm ${formData.discountType === "percentage" ? "theo %" : "theo VNĐ"
                }`}
              onChange={(e) => {
                if (formData.discountType === "percentage") {
                  return setFormData((prev) => ({
                    ...prev,
                    discountPercent: Number(e.target.value),
                    discountMoney: 0,
                  }));
                }
                if (formData.discountType === "amount") {
                  return setFormData((prev) => ({
                    ...prev,
                    discountPercent: 0,
                    discountMoney: Number(e.target.value),
                  }));
                }
              }}
            />
          </div>
        </div>

        {/* Category Quantity Selection */}
        <div className="add-event-section">
          <h2 className="section-title">Số lượng danh mục</h2>
          <div className="add-event-category-quantity">
            <a>Chọn số lượng danh mục</a>
            <Input
              type="number"
              min={1}
              max={categories.length}
              placeholder="Nhập số lượng danh mục"
              onChange={(e) => {
                const quantity = Number(e.target.value);
                setFormData((prev) => ({
                  ...prev,
                  categoryQuantity: quantity,
                }));
              }}
            />
          </div>
        </div>

        {/* Product Selection */}
        {Array.from({ length: formData.categoryQuantity || 1 }).map(
          (_, index) => (
            <div key={index} className="add-event-section">
              <h2 className="section-title">
                Sản phẩm áp dụng - Danh mục {index + 1}
              </h2>
              <div className="add-event-category">
                <a>Chọn danh mục</a>
                <Select
                  placeholder="Chọn danh mục"
                  value={selectedCategories[index]}
                  onChange={(value) => handleCategoryChange(value, index)}
                  style={{ width: "100%" }}
                >
                  {categories.map((cat) => (
                    <Option key={cat._id} value={cat._id}>
                      {cat.name}
                    </Option>
                  ))}
                </Select>
              </div>
              <div className="add-event-product-search">
                <a>Search Products</a>
                <Input
                  placeholder="Enter product name"
                  onChange={(e) => {
                    const searchValue = e.target.value.toLowerCase();
                    const categoryId = selectedCategories[index];

                    if (!categoryId) return;

                    // Re-fetch products if search is cleared
                    if (!searchValue) {
                      fetchProducts(categoryId, index);
                      return;
                    }

                    // Filter existing products by search term
                    setProducts((prevProducts) => {
                      const newProducts = [...prevProducts];
                      newProducts[index] = prevProducts[index]?.filter(
                        (product: any) =>
                          product.name.toLowerCase().includes(searchValue) &&
                          product.categoryId === categoryId
                      );
                      return newProducts;
                    });
                  }}
                />
              </div>
              {/* Fetching products for category: {selectedCategories[index]} */}
              {products[index]?.length > 0 ? (
                <div className="add-event-products">
                  <Table
                    dataSource={products[index]}
                    columns={columns}
                    rowKey="id"
                    pagination={{ pageSize: 5 }}
                  />
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "20px" }}>
                  {selectedCategories[index]
                    ? "Không có sản phẩm trong danh mục này"
                    : "Vui lòng chọn danh mục"}
                </div>
              )}
            </div>
          )
        )}

        {/* Actions */}
        <div className="add-event-actions">
          <Button type="default">Lưu bản nháp</Button>
          <Button type="primary" htmlType="submit" onClick={handleCreateSale}>
            Tạo chương trình
          </Button>
        </div>
      </div>
    </Spin>
  );
};

export default AddSale;

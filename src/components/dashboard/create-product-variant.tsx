import React, { useState, useEffect } from "react";
import { Button, Input, Table, Form, Space, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";

interface Variant {
  name: string;
  values: string[];
  hasImage?: boolean;
  images?: string[]; // Danh sách ảnh cho mỗi biến thể
}

interface DataSourceRow {
  key: string;
  [key: string]: string;
}

interface IVariantProduct {
  attributes: Record<string, string>;
  price: number;
  salePrice?: number;
  stock: number;
  images: string[];
  status: "available" | "unavailable";
}

interface CreateProductVariantProps {
  setVariantProduct: React.Dispatch<React.SetStateAction<IVariantProduct[]>>;
}

const CreateProductVariant: React.FC<CreateProductVariantProps> = ({
  setVariantProduct,
}) => {
  const [variants, setVariants] = useState<Variant[]>([]);

  // Cập nhật JSON mỗi khi variants thay đổi
  useEffect(() => {
    const newVariantProduct: IVariantProduct[] = [];

    // Nếu không có biến thể, không làm gì cả
    if (variants.length === 1) {
      setVariantProduct([]); // Đồng bộ hóa với component cha

      return;
    }

    // Tạo danh sách mới dựa trên các biến thể hiện tại
    (variants[0]?.values || [""]).forEach((value1) => {
      (variants[1]?.values || [""]).forEach((value2) => {
        const attributes: Record<string, string> = {};
        if (variants[0]?.name) attributes[variants[0].name] = value1;
        if (variants[1]?.name) attributes[variants[1].name] = value2;

        newVariantProduct.push({
          attributes,
          price: 0,
          salePrice: undefined,
          stock: 0,
          status: "available",
          images: [],
        });
      });
    });

    setVariantProduct(newVariantProduct); // Đồng bộ hóa với AddProduct
  }, [variants, setVariantProduct]);

  // Thêm biến thể mới
  const handleAddVariant = () => {
    if (variants.length >= 2) {
      alert("Bạn chỉ có thể tạo tối đa 2 loại biến thể.");
      return;
    }
    setVariants([...variants, { name: "", values: [], images: [] }]);
  };

  // Cập nhật thông tin biến thể
  const handleVariantChange = (
    index: number,
    key: "name" | "values" | "hasImage" | "images",
    value: any
  ) => {
    const updatedVariants = [...variants];
    if (key === "name") {
      updatedVariants[index].name = value;
    } else if (key === "values") {
      updatedVariants[index].values = value;
    } else if (key === "hasImage") {
      updatedVariants[index].hasImage = value;
    } else if (key === "images") {
      updatedVariants[index].images = value; // Cập nhật danh sách ảnh
    }
    setVariants(updatedVariants);
  };

  // Thêm giá trị cho biến thể
  const handleAddValue = (variantIndex: number) => {
    const updatedVariants = [...variants];
    if (updatedVariants[variantIndex].values.length >= 8) {
      alert("Bạn chỉ có thể thêm tối đa 8 giá trị cho mỗi biến thể.");
      return;
    }
    updatedVariants[variantIndex].values.push("");
    setVariants(updatedVariants);
  };

  // Cập nhật giá trị cho mỗi biến thể
  const handleValueChange = (
    variantIndex: number,
    valueIndex: number,
    value: string
  ) => {
    const updatedVariants = [...variants];
    updatedVariants[variantIndex].values[valueIndex] = value;
    setVariants(updatedVariants);
  };

  // Xóa giá trị của biến thể
  const handleRemoveValue = (variantIndex: number, valueIndex: number) => {
    const updatedVariants = [...variants];
    updatedVariants[variantIndex].values.splice(valueIndex, 1);
    setVariants(updatedVariants);
  };

  // Xóa biến thể
  const handleRemoveVariant = (variantIndex: number) => {
    const updatedVariants = [...variants];
    updatedVariants.splice(variantIndex, 1);
    setVariants(updatedVariants);
  };

  // Cập nhật giá trị trong variantProduct khi thay đổi price, salePrice, hoặc stock
  const handleInputChange = (value: any, record: any, fieldName: string) => {
    const { variant0, variant1 } = record;

    const attributes: Record<string, string> = {};
    if (variants[0]?.name) attributes[variants[0].name] = variant0;
    if (variants[1]?.name) attributes[variants[1].name] = variant1;

    // Convert the value to a number if it's price, salePrice, or stock
    const updatedValue =
      fieldName === "price" ||
        fieldName === "salePrice" ||
        fieldName === "stock"
        ? Number(value)
        : value;

    // Cập nhật giá trị trong variantProduct
    setVariantProduct((prev) => {
      const updated = [...prev];
      const index = updated.findIndex((item) =>
        Object.keys(attributes).every(
          (key) => item.attributes[key] === attributes[key]
        )
      );

      if (index >= 0) {
        // Nếu biến thể đã tồn tại, cập nhật giá trị
        updated[index] = {
          ...updated[index],
          [fieldName]: updatedValue,
        };
      } else {
        // Nếu biến thể chưa tồn tại, thêm mới
        updated.push({
          attributes,
          price: fieldName === "price" ? Number(value) : 0,
          salePrice: fieldName === "salePrice" ? Number(value) : undefined,
          stock: fieldName === "stock" ? Number(value) : 0,
          status: "available",
          images: [],
        });
      }

      return updated;
    });
  };

  // Cấu hình các cột của bảng
  const columns = [
    ...variants.map((variant, index) => ({
      title: variant.name || `Biến thể ${index + 1}`,
      dataIndex: `variant${index}`,
      key: `variant${index}`,
      render: (text: string) => <span>{text}</span>,
    })),
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (_: any, record: any) => (
        <Input
          placeholder="Nhập giá"
          onChange={(e) => handleInputChange(e.target.value, record, "price")}
        />
      ),
    },
    {
      title: "Giá Ưu Đãi",
      dataIndex: "salePrice",
      key: "salePrice",
      render: (_: any, record: any) => (
        <Input
          placeholder="Nhập giá ưu đãi"
          onChange={(e) =>
            handleInputChange(e.target.value, record, "salePrice")
          }
        />
      ),
    },
    {
      title: "Kho hàng",
      dataIndex: "stock",
      key: "stock",
      render: (_: any, record: any) => (
        <Input
          placeholder="Nhập kho hàng"
          onChange={(e) => handleInputChange(e.target.value, record, "stock")}
        />
      ),
    },
  ];

  // Tạo nguồn dữ liệu cho bảng
  const dataSource: DataSourceRow[] = [];
  (variants[0]?.values || [""]).forEach((value1, index1) => {
    (variants[1]?.values || [""]).forEach((value2, index2) => {
      const rowData: DataSourceRow = { key: `${index1}-${index2}` };
      rowData[`variant0`] = value1;
      if (variants[1]) rowData[`variant1`] = value2;
      dataSource.push(rowData);
    });
  });

  return (
    <div className="product-variant-container">
      <h2>Tạo Biến Thể</h2>
      <Button
        type="primary"
        onClick={handleAddVariant}
        className="add-variant-button"
      >
        Thêm biến thể
      </Button>

      {variants.map((variant, variantIndex) => (
        <div key={variantIndex} className="variant-card">
          <Space className="variant-header">
            <Form.Item
              label={`Tên biến thể ${variantIndex + 1}`}
              className="variant-name"
            >
              <Input
                value={variant.name}
                onChange={(e) =>
                  handleVariantChange(variantIndex, "name", e.target.value)
                }
              />
            </Form.Item>

            {/* Checkbox để lựa chọn biến thể có ảnh */}
            {/* {variantIndex === 0 && (
              <Form.Item label="Biến thể có ảnh" className="variant-image-checkbox">
                <Checkbox
                  checked={variant.hasImage}
                  onChange={(e) =>
                    handleVariantChange(variantIndex, "hasImage", e.target.checked)
                  }
                >
                  Có ảnh
                </Checkbox>
              </Form.Item>
            )} */}

            {/* Hiển thị trường input ảnh khi checkbox được chọn */}

            <Button danger onClick={() => handleRemoveVariant(variantIndex)}>
              Xóa biến thể
            </Button>
          </Space>

          <Form.Item label="Giá trị" className="variant-values">
            {variant.values.map((value, valueIndex) => (
              <Space key={valueIndex} className="value-item">
                <Input
                  value={value}
                  onChange={(e) =>
                    handleValueChange(variantIndex, valueIndex, e.target.value)
                  }
                />
                {variant.hasImage && (
                  <Form.Item label="Ảnh" className="variant-image">
                    <Upload listType="picture-card">
                      <div>
                        <UploadOutlined />
                        <div>Upload</div>
                      </div>
                    </Upload>
                  </Form.Item>
                )}
                <Button
                  danger
                  onClick={() => handleRemoveValue(variantIndex, valueIndex)}
                >
                  Xóa
                </Button>
              </Space>
            ))}
            <Button type="dashed" onClick={() => handleAddValue(variantIndex)}>
              Thêm giá trị
            </Button>
          </Form.Item>
        </div>
      ))}

      <h3>Bảng Điều Chỉnh</h3>
      <Table dataSource={dataSource} columns={columns} pagination={false} />
    </div>
  );
};

export default CreateProductVariant;

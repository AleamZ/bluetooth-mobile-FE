import React, { useState, useEffect } from "react";
import { Table, Tabs, Switch, Button, Checkbox, Input, Select, message, } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  ShoppingCartOutlined,
  LikeOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { DashboardService } from "../../services/dashboard.service";
import { handleError } from "@/utils/catch-error";
import { ProductService } from "@/services/product.service";
import { useNavigate } from "react-router-dom";

interface Variant {
  _id: string;
  key: string;
  name: string;
  sku: string;
  thumbnail: string;
  price: string;
  stock: number;
  isActive: boolean;
  productKey?: string;
}

interface Product {
  _id: string;
  key: string;
  name: string;
  price: string;
  stock: number;
  isDeleted: boolean;
  views: number;
  likes: number;
  purchases: number;
  imageThumbnailUrl: string;
  variants: Variant[];
}

const { TabPane } = Tabs;
const { Option } = Select;

const ProductList: React.FC = () => {
  const navigate = useNavigate();
  const [productData, setProductData] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortOption, setSortOption] = useState("");

  const toggleVariantActive = (
    productKey: string,
    variantKey: string,
    isActive: boolean
  ) => {
    setProductData((prevData) =>
      prevData.map((product) =>
        product._id === productKey
          ? {
            ...product,
            variants: product.variants.map(
              (
                variant: Variant // Specify the type of variant
              ) =>
                variant.key === variantKey
                  ? { ...variant, isActive }
                  : variant
            ),
          }
          : product
      )
    );
  };

  const asyncLoadDataProduct = async () => {
    try {
      const response = await DashboardService.getProducts();
      // Thêm key cho từng sản phẩm từ _id
      const productsWithKey: Product[] = response.map((product: Product) => ({
        ...product,
        key: product._id, // Gán _id làm key
      }));
      setProductData(productsWithKey);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  useEffect(() => {
    asyncLoadDataProduct();
  }, []);
  // Hàm hỗ trợ định dạng giá
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  // Hàm tạo khoảng giá từ các biến thể
  const getPriceRange = (product: any) => {
    if (product.variants?.length > 0) {
      const prices = product.variants.map((v: any) => v.price);
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      return `${formatPrice(min)} - ${formatPrice(max)}`;
    }
    return formatPrice(product.price);
  };

  // Hàm tạo tên biến thể từ attributes

  const handleToggleVariants = (record: Product) => {
    setExpandedRowKeys((prev) =>
      prev.includes(record.key)
        ? prev.filter((key) => key !== record.key)
        : [...prev, record.key]
    );
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value);
  };
  const handleSortChange = (value: string) => {
    setSortOption(value);
  };

  const filteredData = productData.filter((product: Product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter
      ? product._id === categoryFilter
      : true;
    return matchesSearch && matchesCategory;
  });

  const sortedData = filteredData.sort((a, b) => {
    if (sortOption === "price") {
      return (
        parseInt(a.price.split("-")[0].replace(/,/g, "")) -
        parseInt(b.price.split("-")[0].replace(/,/g, ""))
      );
    } else if (sortOption === "date") {
      return a.key.localeCompare(b.key);
    }
    return 0;
  });
  const handleCheckboxChange = (isChecked: boolean, key: string) => {
    if (isChecked) {
      setSelectedKeys([...selectedKeys, key]);
    } else {
      setSelectedKeys(
        selectedKeys.filter((selectedKey) => selectedKey !== key)
      );
    }
  };

  const handleActiveProduct = async (record: Product) => {
    setProductData((prevData) =>
      prevData.map((product) =>
        product.key === record.key
          ? { ...product, isDeleted: !product.isDeleted }
          : product
      )
    );
    try {
      await ProductService.deleteSoftProduct(record._id);
      message.success("Đã cập nhật trạng thái sản phẩm!");
    } catch (error) {
      handleError(error);
    }
  };
  const handleDeleteProduct = async (productId: string) => {
    try {
      await ProductService.deleteProduct(productId);
      asyncLoadDataProduct();
      message.success("Đã xóa sản phẩm!");
    } catch (error) {
      handleError(error);
    }
  };
  const columns: ColumnsType<any> = [
    {
      title: (
        <Checkbox
          onChange={(e) => {
            const allKeys = productData.map((product) => product._id);
            setSelectedKeys(e.target.checked ? allKeys : []);
          }}
          checked={
            selectedKeys.length === productData.length &&
            selectedKeys.length > 0
          }
          indeterminate={
            selectedKeys.length > 0 && selectedKeys.length < productData.length
          }
        />
      ),
      dataIndex: "checkbox",
      key: "checkbox",
      width: "5%",
      render: (_: any, record: any) => (
        <Checkbox
          onChange={(e) => handleCheckboxChange(e.target.checked, record.key)}
          checked={selectedKeys.includes(record.key)}
        />
      ),
    },
    {
      title: "Thông Tin Sản Phẩm",
      dataIndex: "name",
      key: "name",
      width: "45%",
      render: (_: any, record: Product) => (
        <div className="product-info">
          <img
            src={record.imageThumbnailUrl}
            className="thumbnail"
            alt={record.name}
          />
          <div>
            <strong>{record.name}</strong>
            <div className="product-stats">
              <ShoppingCartOutlined /> {record.purchases} lượt mua -
              <LikeOutlined /> {record.likes} lượt thích -
              <EyeOutlined /> {record.views} lượt xem
            </div>
            {record.variants?.length > 0 && (
              <Button type="link" onClick={() => handleToggleVariants(record)}>
                {expandedRowKeys.includes(record.key)
                  ? `Ẩn ${record.variants.length} biến thể`
                  : `Xem ${record.variants.length} biến thể`}
              </Button>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Giá Bán",
      dataIndex: "price",
      key: "price",
      width: "20%",
      render: (_: any, record: Product) => {
        return getPriceRange(record); // Gọi hàm getPriceRange để hiển thị giá
      },
    },
    {
      title: "Kho",
      dataIndex: "stock",
      key: "stock",
      width: "10%",
    },
    {
      title: "Đang Hoạt Động",
      dataIndex: "isDeleted",
      key: "isDeleted",
      width: "10%",
      render: (_, record: Product) => (
        <Switch
          onChange={() => handleActiveProduct(record)}
          value={!record.isDeleted}
        />
      ),
    },
    {
      title: "",
      key: "actions",
      width: "10%",
      render: (_: any, record: any) => (
        <div>
          <Button
            type="link"
            onClick={() => navigate(`/edit-product/${record._id}`)}
          >
            Chỉnh sửa
          </Button>
          <Button
            type="link"
            danger
            onClick={() => handleDeleteProduct(record._id)}
          >
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  interface VariantRecord {
    name: string;
    price: string;
    stock: number;
    isActive: boolean;
    attributes: {
      [key: string]: string | number;
    };
    productKey: string;
    _id: string;
    key: string;
  }

  const variantColumns: ColumnsType<VariantRecord> = [
    {
      dataIndex: "name",
      key: "name",
      width: "50%",

      render: (_: any, record: VariantRecord) => {
        const valuesArray = Object.values(record.attributes);
        return (
          <span style={{ display: "flex", justifyContent: "center" }}>
            {valuesArray?.[0]} - {valuesArray?.[1]}
          </span>
        );
      },
    },
    {
      title: "Giá Bán",
      dataIndex: "price",
      key: "price",
      width: "20%",
    },
    {
      title: "Kho",
      dataIndex: "stock",
      key: "stock",
      width: "10%",
    },
    {
      title: "Đang Hoạt Động",
      dataIndex: "isActive",
      key: "isActive",
      width: "10%",
      render: (isActive: boolean, record: VariantRecord) => (
        <Switch
          checked={isActive}
          onChange={(checked) =>
            toggleVariantActive(record.productKey, record._id, checked)
          }
        />
      ),
    },
    {
      key: "actions",
      width: "10%",
      render: (_: any, record: VariantRecord) => (
        <div>
          <Button
            type="link"
            onClick={() => console.log(`Edit variant ${record.key}`)}
          >
            Chỉnh sửa
          </Button>
          <Button
            type="link"
            danger
            onClick={() => console.log(`Delete variant ${record.key}`)}
          >
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="product-list">
      <Tabs defaultActiveKey="all">
        <TabPane tab="Tất cả" key="all"></TabPane>
        <TabPane tab="Đang hoạt động" key="active" />
        <TabPane tab="Ngưng hoạt động" key="inactive" />
      </Tabs>
      <div style={{ marginBottom: 16 }}>
        <Input
          placeholder="Tìm kiếm sản phẩm"
          style={{ width: 200, marginRight: 8 }}
          onChange={handleSearch}
        />
        <Select
          placeholder="Danh mục"
          style={{ width: 150, marginRight: 8 }}
          onChange={handleCategoryChange}
        >
          <Option value="">Tất cả</Option>
          <Option value="1">Danh mục 1</Option>
          <Option value="2">Danh mục 2</Option>
        </Select>
        <Select
          placeholder="Sắp xếp"
          style={{ width: 150 }}
          onChange={handleSortChange}
        >
          <Option value="">Không sắp xếp</Option>
          <Option value="price">Giá</Option>
          <Option value="date">Ngày đăng</Option>
        </Select>
        <Button
          type="primary"
          onClick={() =>
            console.log(`Deleting selected products: ${selectedKeys}`)
          }
          disabled={selectedKeys.length === 0}
          style={{ marginBottom: 16 }}
        >
          Xóa
        </Button>
      </div>

      <Table
        className="product-table"
        columns={columns}
        dataSource={sortedData}
        expandable={{
          expandedRowRender: (record) => (
            <Table
              columns={variantColumns}
              dataSource={record.variants.map((variant: Variant) => ({
                ...variant,
                productKey: record.key, // Sử dụng key thay vì _id
                key: variant._id, // Đảm bảo key cho từng biến thể
              }))}
              pagination={false}
              rowKey="key"
              showHeader={false} // Thêm dòng này để ẩn header
            />
          ),
          rowExpandable: (record) => (record.variants?.length || 0) > 0,
          expandedRowKeys,
          expandIcon: () => null,
        }}
        rowKey="key"
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: sortedData.length,
          onChange: setCurrentPage,
        }}
      />
    </div>
  );
};

export default ProductList;

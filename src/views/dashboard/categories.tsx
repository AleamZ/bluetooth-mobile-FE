import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Upload,
  Spin,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { DashboardService } from "../../services/dashboard.service";
import { Category } from "../../types/dashboard.interface";
import { handleError } from "@/utils/catch-error";
import { UploadService } from "@/services/upload.service";

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [form] = Form.useForm();
  const [image, setImage] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const fetchCategoriesWithParent = async () => {
    setLoading(true);
    try {
      const response = await DashboardService.getAllCategoriesActive();
      const categoriesWithParent = await Promise.all(
        response.map(async (category: Category) => {
          if (category.parentId) {
            try {
              const parentResponse = await DashboardService.getCategorybyId(
                category.parentId
              );
              return { ...category, parentName: parentResponse.name };
            } catch (error) {
              console.error("Không thể lấy danh mục cha:", error);
              return { ...category, parentName: "Không xác định" };
            }
          }
          return { ...category, parentName: "Không có" };
        })
      );
      setCategories(categoriesWithParent);
    } catch (error: any) {
      message.error("Có lỗi xảy ra khi tải danh sách danh mục!");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await DashboardService.getAllCategoriesActive();
      setCategories(response);
    } catch (error: any) {
      message.error("Có lỗi xảy ra khi tải danh sách danh mục!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchCategoriesWithParent();
  }, []);

  const showModal = (category: Category | null) => {
    setEditingCategory(category);
    if (category) {
      form.setFieldsValue({
        name: category.name,
        url: category.url || "",
        parent: category.parentId || null,
      });
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      setIsLoading(true);
      let responseThumbnail = { url: "" };
      if (image.length) {
        responseThumbnail = await UploadService.uploadSingle(image[0].originFileObj);
      }

      if (responseThumbnail.url) {
        const values = await form.validateFields();

        if (editingCategory) {
          // Cập nhật danh mục
          const payload = {
            categoryId: editingCategory._id,
            name: values.name,
            url: values.url,
            imageLogo: responseThumbnail.url,
          };
          await DashboardService.updateCategory(payload);
          if (values.parent) {
            await DashboardService.addSubCategory(values.parent, [
              editingCategory._id,
            ]);
          }
          message.success("Cập nhật thành công!");
        } else {
          // Thêm danh mục mới
          const payload = {
            name: values.name,
            url: values.url,
            imageLogo: responseThumbnail.url,
          };
          const newCategory = await DashboardService.createCategory(payload);
          if (values.parent) {
            await DashboardService.addSubCategory(values.parent, [
              newCategory._id,
            ]);
          }
          message.success("Thêm mới danh mục thành công!");
        }

        // Gọi hàm fetchCategoriesWithParent để cập nhật danh mục cha
        await fetchCategoriesWithParent();

        setIsModalVisible(false);
        form.resetFields();
      }
    } catch (error: any) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (categoryId: string) => {
    try {
      await DashboardService.deleteCategory({ categoryId });
      message.success("Xóa danh mục thành công!");
      fetchCategories();
    } catch (error: any) {
      message.error("Có lỗi xảy ra khi xóa danh mục!");
    }
  };

  const handleBatchDelete = async () => {
    try {
      await Promise.all(
        selectedRowKeys.map((id) =>
          DashboardService.deleteCategory({ categoryId: id as string })
        )
      );
      message.success("Xóa các danh mục được chọn thành công!");
      fetchCategories();
      setSelectedRowKeys([]);
    } catch (error: any) {
      message.error("Có lỗi xảy ra khi xóa các danh mục đã chọn!");
    }
  };

  const onSelectChange = (selectedKeys: React.Key[]) => {
    setSelectedRowKeys(selectedKeys);
  };

  const columns = [
    {
      title: "Tên danh mục",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "URL",
      dataIndex: "url",
      key: "url",
    },
    {
      title: "Danh mục cha",
      dataIndex: "parentName",
      key: "parentName",
      render: (text: string) => text || "Không có",
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_: any, record: Category) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Button icon={<EditOutlined />} onClick={() => showModal(record)}>
            Sửa
          </Button>
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDelete(record._id)}
          >
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  const handleImageUpload = ({ file, fileList }: any) => {
    setImage(fileList);
    console.log({ file });
  };

  return (
    <Spin spinning={isLoading}>
      <div style={{ padding: "16px", background: "#fff", borderRadius: "8px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "16px",
          }}
        >
          <h2>Quản lý danh mục</h2>
          <div style={{ display: "flex", gap: "8px" }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => showModal(null)}
            >
              Thêm danh mục
            </Button>
            <Button
              type="default"
              danger
              onClick={handleBatchDelete}
              disabled={selectedRowKeys.length === 0}
            >
              Xóa nhanh
            </Button>
          </div>
        </div>
        <Table
          rowSelection={{
            selectedRowKeys,
            onChange: onSelectChange,
          }}
          dataSource={categories}
          columns={columns}
          rowKey={(record) => record._id}
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
        <Modal
          title={editingCategory ? "Sửa danh mục" : "Thêm danh mục"}
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={() => setIsModalVisible(false)}
          okText={editingCategory ? "Cập nhật" : "Lưu"}
          cancelText="Hủy"
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="name"
              label="Tên danh mục"
              rules={[
                { required: true, message: "Vui lòng nhập tên danh mục!" },
              ]}
            >
              <Input placeholder="Nhập tên danh mục" />
            </Form.Item>
            <Form.Item name="url" label="URL" rules={[{ required: false }]}>
              <Input placeholder="Nhập URL" />
            </Form.Item>
            <Form.Item
              name="parent"
              label="Danh mục cha"
              rules={[{ required: false }]}
            >
              <Select placeholder="Chọn danh mục cha" allowClear>
                {categories.map((category) => (
                  <Select.Option key={category._id} value={category._id}>
                    {category.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Upload
              listType="picture-card"
              onChange={handleImageUpload}
              maxCount={1}
            >
              <PlusOutlined />
            </Upload>
          </Form>
        </Modal>
      </div>
    </Spin>
  );
};

export default Categories;

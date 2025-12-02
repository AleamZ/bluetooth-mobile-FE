import React, { useState, useEffect } from "react";
import { Menu, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { DashboardService } from "../../services/dashboard.service";
import { Category } from "../../types/dashboard.interface";
import ListBox, { EditButton } from "../basicUI/list-box";
import { UploadService } from "../../services/upload.service";



const ProductCategory: React.FC = () => {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [parentGroups, setParentGroups] = useState<Category[]>([]);
  const [loadingParentGroups, setLoadingParentGroups] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");

  const fetchCategories = async () => {
    try {
      const response = await DashboardService.getAllCategoriesActive();
      setCategories(response);
    } catch (error: any) {
      message.error(
        error.response?.data?.message ||
        "Có lỗi xảy ra khi tải danh sách nhóm hàng!"
      );
    }
  };

  const fetchParentGroups = async () => {
    setLoadingParentGroups(true);
    try {
      const response = await DashboardService.getAllCategoriesActive();
      setParentGroups(response);
    } catch (error: any) {
      message.error(
        error.response?.data?.message ||
        "Có lỗi xảy ra khi tải danh sách nhóm cha!"
      );
    } finally {
      setLoadingParentGroups(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchParentGroups();
  }, []);

  const handleSubmit = async (values: any) => {
    try {
      if (editingCategory) {
        const payload = {
          categoryId: editingCategory._id,
          name: values.name,
          url: values.url,
          order: values.order || editingCategory.order, // Preserve existing order when editing
        };
        await DashboardService.updateCategory(payload);
        if (values.parent) {
          await DashboardService.addSubCategory(values.parent, [
            editingCategory._id,
          ]);
        }
        message.success("Cập nhật thành công!");
      } else {
        const payload = {
          name: values.name,
          url: values.url,
          imageLogo: uploadedImageUrl,
          order: 1, // Default order for new categories
        };
        const newCategory = await DashboardService.createCategory(payload);
        if (values.parent) {
          await DashboardService.addSubCategory(values.parent, [
            newCategory._id,
          ]);
        }
        message.success("Tạo mới thành công!");
      }
      setUploadedImageUrl(""); // Reset uploaded image URL
      fetchCategories();
    } catch (error: any) {
      message.error(error.response?.data?.message || "Có lỗi xảy ra!");
    }
  };

  const handleDelete = async (category: Category) => {
    try {
      await DashboardService.deleteCategory({ categoryId: category._id });
      fetchCategories();
      message.success("Xóa thành công!");
    } catch (error: any) {
      message.error(
        error.response?.data?.message || "Có lỗi xảy ra khi xóa nhóm hàng!"
      );
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("image", file);
      const result = await UploadService.uploadSingle(file);
      setUploadedImageUrl(result.url);
      return false; // Prevent default upload behavior
    } catch (error) {
      message.error("Không thể tải lên hình ảnh!");
      return false;
    }
  };

  const renderCategories = (
    categories: Category[],
    parentId: string | null = null
  ) => {
    return categories
      .filter((category) => category.parentId === parentId)
      .map((category) => {
        const subCategories = categories.filter(
          (sub) => sub.parentId === category._id
        );

        if (subCategories.length > 0) {
          return (
            <Menu.SubMenu
              key={category._id}
              title={
                <div className="list-item-container">
                  <span>{category.name}</span>
                  <EditButton
                    item={category}
                    onEdit={setEditingCategory}
                    stopPropagation={true}
                  />
                </div>
              }
            >
              {renderCategories(categories, category._id)}
            </Menu.SubMenu>
          );
        }

        return (
          <Menu.Item key={category._id}>
            <div className="list-item-container">
              <span>{category.name}</span>
              <EditButton item={category} onEdit={setEditingCategory} />
            </div>
          </Menu.Item>
        );
      });
  };

  return (
    <ListBox
      title="Nhóm hàng"
      extra={<PlusOutlined style={{ fontSize: "16px", cursor: "pointer" }} />}
      isLoading={loadingParentGroups}
      modalTitle={editingCategory ? "Sửa nhóm hàng" : "Thêm nhóm hàng"}
      editingItem={editingCategory}
      onSubmit={handleSubmit}
      onDelete={handleDelete}
      onEdit={setEditingCategory}
      selectOptions={parentGroups.map((group) => ({
        value: group._id,
        label: group.name,
      }))}
      selectLoading={loadingParentGroups}
      onImageUpload={handleImageUpload}
    >
      {/* <Search
        placeholder="Tìm kiếm nhóm hàng"
        allowClear
        style={{ marginBottom: "10px" }}
      /> */}
      <Menu mode="inline" defaultSelectedKeys={[]}>
        {renderCategories(categories)}
      </Menu>
    </ListBox>
  );
};

export default ProductCategory;

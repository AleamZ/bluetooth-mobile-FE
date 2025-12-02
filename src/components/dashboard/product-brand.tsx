import React, { useState, useEffect } from "react";
import { Menu, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { BrandService } from "../../services/brand.service";
import { handleError } from "@/utils/catch-error";
import { DashboardService } from "@/services/dashboard.service";
import ListBox, { EditButton } from "../basicUI/list-box";

const { Search } = Input;

const BrandComponent: React.FC = () => {
    const [editingBrand, setEditingBrand] = useState<any | null>(null);
    const [brands, setBrands] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(false);

    const fetchBrands = async () => {
        try {
            const response = await BrandService.getBrandActive();
            setBrands(response);
        } catch (error) {
            handleError(error);
        }
    };

    const fetchCategories = async () => {
        setLoadingCategories(true);
        try {
            const response = await DashboardService.getAllCategoriesActive();
            const mappedCategories = response.map((item: any) => ({
                label: item.name,
                value: item._id
            }));
            setCategories(mappedCategories);
        } catch (error) {
            handleError(error);
        } finally {
            setLoadingCategories(false);
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchBrands();
    }, []);

    const handleSubmit = async (values: any) => {
        try {
            if (editingBrand) {
                const payload = {
                    brandId: editingBrand._id,
                    name: values.name,
                    categoryIds: values.categories || []
                };
                await BrandService.updateBrand(payload);
            } else {
                const payload = {
                    name: values.name,
                    categoryIds: values.categories || []
                };
                await BrandService.createBrand(payload);
            }
            fetchBrands();
        } catch (error) {
            handleError(error);
        }
    };

    const handleDelete = async (brand: any) => {
        try {
            await BrandService.deleteBrand(brand._id);
            fetchBrands();
        } catch (error) {
            handleError(error);
        }
    };

    return (
        <ListBox
            title="Thương hiệu"
            extra={<PlusOutlined style={{ fontSize: "16px", cursor: "pointer" }} />}
            modalTitle={editingBrand ? "Sửa thương hiệu" : "Thêm thương hiệu"}
            editingItem={editingBrand}
            onSubmit={handleSubmit}
            onDelete={handleDelete}
            onEdit={setEditingBrand}
            selectOptions={categories}
            selectLoading={loadingCategories}
            formConfig={{
                categories: {
                    label: "Danh mục",
                    type: "select",
                    mode: "multiple",
                    placeholder: "Chọn danh mục"
                }
            }}
        >
            <Search
                placeholder="Tìm kiếm thương hiệu"
                allowClear
                style={{ marginBottom: "10px" }}
            />
            <Menu
                mode="inline"
                items={brands.map((brand) => ({
                    key: brand._id,
                    label: (
                        <div className="list-item-container">
                            <span>{brand.name}</span>
                            <EditButton
                                item={brand}
                                onEdit={setEditingBrand}
                            />
                        </div>
                    ),
                }))}
            />
        </ListBox>
    );
};

export default BrandComponent;

import React, { useState, useEffect } from "react";
import {
  Select,
  Spin,
  message,
  Button,
  Input,
  Space,
  Row,
  Col,
  Checkbox,
} from "antd";
import { DashboardService } from "@/services/dashboard.service";
import { DeleteOutlined } from "@ant-design/icons";
import { handleError } from "@/utils/catch-error";
import { SpecificationService } from "@/services/specification.service";
import { useNavigate } from "react-router-dom";
import { IoIosAddCircleOutline } from "react-icons/io";

interface Category {
  value: string;
  label: string;
}

interface Specification {
  name: string;
  isFilter: boolean;
  id?: string; // Add id field
  checkedFilter?: boolean; // Add checkedFilter field
}

interface SpecificationGroup {
  groupName: string;
  specifications: Specification[];
}

const { Option } = Select;

const DataSpecification: React.FC = () => {
  const navigate = useNavigate();
  const [optionCategories, setOptionCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [specificationGroups, setSpecificationGroups] = useState<
    SpecificationGroup[]
  >([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await DashboardService.getAllCategoriesActive();
        console.log("Categories response:", response);
        const convertOption = response.map((item: any) => ({
          value: item._id,
          label: item.name,
        }));
        convertOption.unshift({
          value: "",
          label: "---- Chọn danh mục ----",
        });
        setOptionCategories(convertOption);
      } catch (error) {
        console.error("Error fetching categories:", error);
        message.error("Failed to load categories");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const asyncDataSpecification = async () => {
    try {
      setIsLoading(true);
      const response = await SpecificationService.getSpecifications(
        selectedCategory
      );
      console.log("Specifications response:", response);

      // Transform the response data to match your component's structure
      const transformedGroups: SpecificationGroup[] = response.type.map(
        (group: any) => ({
          groupName: group.groupName,
          specifications: group.specifications.map((spec: any) => ({
            name: spec.name,
            id: spec.id,
            isFilter: spec.checkedFilter || false, // Use checkedFilter from API for isFilter
          })),
        })
      );

      console.log("Transformed groups:", transformedGroups);
      setSpecificationGroups(transformedGroups);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCategory !== "") {
      asyncDataSpecification();
    }
  }, [selectedCategory]);

  const handleCreateSpecification = async () => {
    // Transform the data back to API format
    const transformedGroups = specificationGroups.map((group) => ({
      groupName: group.groupName,
      specifications: group.specifications.map((spec) => ({
        name: spec.name,
        id: spec.id,
        checkedFilter: spec.isFilter, // Convert isFilter back to checkedFilter
      })),
    }));

    const payload = {
      categoryId: selectedCategory,
      type: transformedGroups,
    };

    console.log("Update payload:", payload);

    try {
      setIsLoading(true);
      const response = await SpecificationService.createSpecification(payload);
      console.log("Create specification response:", response);
      message.success("Cập nhật thành công");
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  const updateGroupName = (groupIndex: number, newName: string) => {
    const updatedGroups = [...specificationGroups];
    updatedGroups[groupIndex].groupName = newName;
    setSpecificationGroups(updatedGroups);
  };

  const removeGroup = (groupIndex: number) => {
    const updatedGroups = specificationGroups.filter(
      (_, index) => index !== groupIndex
    );
    setSpecificationGroups(updatedGroups);
  };

  const updateSpecification = (
    groupIndex: number,
    specIndex: number,
    key: "name" | "isFilter",
    value: string | boolean
  ) => {
    const updatedGroups = [...specificationGroups];
    (updatedGroups[groupIndex].specifications[specIndex][
      key as keyof Specification
    ] as typeof value) = value;
    setSpecificationGroups(updatedGroups);
  };

  const removeSpecification = (groupIndex: number, specIndex: number) => {
    const updatedGroups = [...specificationGroups];
    updatedGroups[groupIndex].specifications = updatedGroups[
      groupIndex
    ].specifications.filter((_, index) => index !== specIndex);
    setSpecificationGroups(updatedGroups);
  };

  return (
    <div className="specifications-container">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <h1 className="specifications-title">Cập nhật Thông Số Kỹ Thuật</h1>
        <Button onClick={() => navigate("/specifications")}>
          <IoIosAddCircleOutline /> Tạo mới thông số kỹ thuật
        </Button>
      </div>

      <Spin spinning={isLoading}>
        <div className="specifications-select">
          <Select
            value={selectedCategory}
            onChange={handleCategoryChange}
            placeholder="---Chọn danh mục ---"
            style={{ width: "100%", maxWidth: 300 }}
            defaultValue={""}
          >
            {optionCategories.map((category, index) => (
              <Option key={index} value={category.value}>
                {category.label}
              </Option>
            ))}
          </Select>
        </div>

        <Space direction="vertical" style={{ width: "100%" }} size={24}>
          {specificationGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="specification-group">
              <Row align="middle" gutter={16}>
                <Col span={23}>
                  <Input
                    placeholder="Tên nhóm thông số"
                    value={group.groupName}
                    onChange={(e) =>
                      updateGroupName(groupIndex, e.target.value)
                    }
                    style={{ fontWeight: "bold" }}
                  />
                </Col>
                <Col span={1}>
                  <Button
                    type="text"
                    icon={<DeleteOutlined />}
                    onClick={() => removeGroup(groupIndex)}
                    danger
                  />
                </Col>
              </Row>
              <Space
                direction="vertical"
                style={{ width: "100%", marginTop: 16 }}
                size={16}
              >
                {group.specifications.map((spec, specIndex) => (
                  <Row key={specIndex} gutter={16} align="middle">
                    <Col>
                      <Input
                        placeholder="Tên thông số"
                        value={spec.name}
                        onChange={(e) =>
                          updateSpecification(
                            groupIndex,
                            specIndex,
                            "name",
                            e.target.value
                          )
                        }
                      />
                    </Col>
                    <Col>
                      <Checkbox
                        checked={spec.isFilter}
                        onChange={(e) =>
                          updateSpecification(
                            groupIndex,
                            specIndex,
                            "isFilter",
                            e.target.checked
                          )
                        }
                      >
                        isFilter
                      </Checkbox>
                    </Col>
                    <Col>
                      <Button
                        type="text"
                        icon={<DeleteOutlined />}
                        onClick={() =>
                          removeSpecification(groupIndex, specIndex)
                        }
                        danger
                      />
                    </Col>
                  </Row>
                ))}
              </Space>
            </div>
          ))}
        </Space>
      </Spin>
      <div style={{ marginTop: "20px" }}>
        <Button type="default" style={{ marginRight: "10px" }}>
          Lưu bản nháp
        </Button>
        <Button
          type="primary"
          htmlType="submit"
          onClick={handleCreateSpecification}
        >
          Cập nhật
        </Button>
      </div>
    </div>
  );
};

export default DataSpecification;

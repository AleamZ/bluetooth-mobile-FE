import React, { useState, useEffect } from "react";
import { Select, Spin, message, Button, Input, Space, Row, Col, Checkbox, Tooltip } from "antd";
import { DashboardService } from "@/services/dashboard.service";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { handleError } from "@/utils/catch-error";
import { SpecificationService } from "@/services/specification.service";
import { IoEyeSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
interface Category {
  value: string;
  label: string;
}

interface Specification {
  name: string;
  checkedFilter?: boolean;
}

interface SpecificationGroup {
  groupName: string;
  specifications: Specification[];
}

const { Option } = Select;

const Specifications: React.FC = () => {
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
  const handleCreateSpecification = async () => {
    if (!selectedCategory) {
      message.error("Vui lòng chọn danh mục");
      return;
    }

    // Transform the specification groups to include checkedFilter
    const transformedGroups = specificationGroups.map(group => ({
      groupName: group.groupName,
      specifications: group.specifications.map(spec => ({
        name: spec.name,
        checkedFilter: spec.checkedFilter || false
      }))
    }));

    // Log transformed groups
    console.log('Transformed Groups:', JSON.stringify(transformedGroups, null, 2));

    const payload = {
      categoryId: selectedCategory,
      type: transformedGroups
    };

    // Log final payload
    console.log('Final Payload:', JSON.stringify(payload, null, 2));

    try {
      setIsLoading(true);
      await SpecificationService.createSpecification(payload);
      message.success("Tạo thành công");
      setSpecificationGroups([]);
      setSelectedCategory("");
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };
  const addGroup = () => {
    setSpecificationGroups((prev) => [
      ...prev,
      { groupName: "", specifications: [] },
    ]);
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
    key: "name" | "checkedFilter",
    value: string | boolean
  ) => {
    const updatedGroups = [...specificationGroups];
    (updatedGroups[groupIndex].specifications[specIndex][key as keyof Specification] as typeof value) = value;
    setSpecificationGroups(updatedGroups);
  };

  const removeSpecification = (groupIndex: number, specIndex: number) => {
    const updatedGroups = [...specificationGroups];
    updatedGroups[groupIndex].specifications = updatedGroups[
      groupIndex
    ].specifications.filter((_, index) => index !== specIndex);
    setSpecificationGroups(updatedGroups);
  };

  const addSpecification = (groupIndex: number) => {
    const updatedGroups = [...specificationGroups];
    updatedGroups[groupIndex].specifications.push({ name: "" });
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
        <h1 className="specifications-title">Thông Số Kỹ Thuật </h1>
        <Button onClick={() => navigate("/view-specifications")}>
          <IoEyeSharp /> Xem thông số kỹ thuật
        </Button>
      </div>
      <Spin spinning={isLoading}>
        <div className="specifications-select">
          <Select
            value={selectedCategory}
            onChange={handleCategoryChange}
            placeholder="---Chọn danh mục ----"
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
                    <Col span={12}>
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
                    <Col span={1.5}>
                      <Checkbox
                        checked={spec.checkedFilter}
                        onChange={(e) =>
                          updateSpecification(
                            groupIndex,
                            specIndex,
                            "checkedFilter",
                            e.target.checked
                          )
                        }
                      >
                        <Tooltip title="Chọn để sử dụng thông số này làm bộ lọc">
                          Is Filter
                        </Tooltip>
                      </Checkbox>
                    </Col>
                    <Col span={4}>
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

              <Button
                type="default"
                onClick={() => addSpecification(groupIndex)}
                style={{ marginTop: 16, width: "100%" }}
                icon={<PlusOutlined />}
              >
                Thêm thông số
              </Button>
            </div>
          ))}

          <Button
            type="primary"
            onClick={addGroup}
            style={{ marginTop: 24, width: "100%" }}
            icon={<PlusOutlined />}
          >
            Thêm nhóm thông số
          </Button>
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
          Gửi đi
        </Button>
      </div>
    </div>
  );
};

export default Specifications;

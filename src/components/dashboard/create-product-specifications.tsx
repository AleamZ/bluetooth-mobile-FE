import React, { useEffect } from "react";
import { Input, Space, Row, Col } from "antd";
import { handleError } from "@/utils/catch-error";
import { SpecificationService } from "@/services/specification.service";
import TextArea from "antd/es/input/TextArea";

interface Specification {
  name: string;
  value: string;
}

interface SpecificationGroup {
  groupName: string;
  specifications: Specification[];
}

interface CreateProductSpecificationsProps {
  specificationGroups: SpecificationGroup[];
  setSpecificationGroups: React.Dispatch<
    React.SetStateAction<SpecificationGroup[]>
  >;
  selectedCategory: string; // Add this prop
}

const CreateProductSpecifications: React.FC<
  CreateProductSpecificationsProps
> = ({
  specificationGroups,
  setSpecificationGroups,
  selectedCategory, // Add this prop
}) => {
  // Remove these as they're no longer needed here
  // const [optionCategories, setOptionCategories] = useState<Category[]>([]);
  // const [selectedCategory, setSelectedCategory] = useState<string>("");

  // Remove fetchCategories and handleCategoryChange functions

  const asyncDataSpecification = async () => {
    try {
      const response = await SpecificationService.getSpecifications(
        selectedCategory
      );
      setSpecificationGroups(response.type);
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    if (selectedCategory !== "") {
      asyncDataSpecification();
    }
  }, [selectedCategory]);
  const updateSpecification = (
    groupIndex: number,
    specIndex: number,
    key: string,
    value: string
  ) => {
    const updatedGroups = [...specificationGroups];
    updatedGroups[groupIndex].specifications[specIndex] = {
      ...updatedGroups[groupIndex].specifications[specIndex],
      [key]: value,
    };
    setSpecificationGroups(updatedGroups);
  };

  return (
    <div className="specifications-container">
      <div style={{ marginBottom: 16 }}>
        <h2>Thông số kỹ thuật</h2>
      </div>

      <Space direction="vertical" style={{ width: "100%" }} size={24}>
        {specificationGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="specification-group">
            <Row align="middle" gutter={16}>
              <Col span={23}>
                <Input
                  placeholder="Tên nhóm thông số"
                  value={group.groupName}
                  style={{ fontWeight: "bold" }}
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
                    <Input placeholder="Tên thông số" value={spec.name} />
                  </Col>
                  <Col>
                    <TextArea
                      placeholder="Giá trị"
                      value={spec.value}
                      onChange={(e) =>
                        updateSpecification(
                          groupIndex,
                          specIndex,
                          "value",
                          e.target.value
                        )
                      }
                    />
                  </Col>
                </Row>
              ))}
            </Space>
          </div>
        ))}
      </Space>
    </div>
  );
};

export default CreateProductSpecifications;

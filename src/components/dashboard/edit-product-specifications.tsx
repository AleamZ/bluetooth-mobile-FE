import React, { useEffect, useState } from "react";
import { Input, Space, Row, Col, Spin } from "antd";
import { handleError } from "@/utils/catch-error";
import { SpecificationService } from "@/services/specification.service";
import TextArea from "antd/es/input/TextArea";

// Update interfaces to match API response
interface SpecificationItem {
    key: string;
    value: string;
    _id?: string;
}

interface SpecificationGroup {
    nameGroup: string;
    specificationsSub: SpecificationItem[];
    _id?: string;
}

interface EditProductSpecificationsProps {
    categoryId: string;
    existingSpecifications: SpecificationGroup[];
    onSpecificationsChange: (specs: SpecificationGroup[]) => void;
}

const EditProductSpecifications: React.FC<EditProductSpecificationsProps> = ({
    categoryId,
    existingSpecifications,
    onSpecificationsChange,
}) => {
    const [isLoading, setIsLoading] = useState(false);

    const fetchSpecificationTemplate = async () => {
        if (!categoryId) return;

        try {
            setIsLoading(true);
            const response = await SpecificationService.getSpecifications(categoryId);

            // Merge template with existing values
            const mergedSpecs = response.type.map((templateGroup: SpecificationGroup) => {
                const existingGroup = existingSpecifications.find(
                    (g) => g.nameGroup === templateGroup.nameGroup
                );

                return {
                    ...templateGroup,
                    specificationsSub: templateGroup.specificationsSub.map((templateSpec) => {
                        const existingSpec = existingGroup?.specificationsSub.find(
                            (s) => s.key === templateSpec.key
                        );
                        return {
                            ...templateSpec,
                            value: existingSpec?.value || "",
                        };
                    }),
                };
            });

            onSpecificationsChange(mergedSpecs);
        } catch (error) {
            handleError("alo");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSpecificationTemplate();
    }, [categoryId]);

    const updateSpecification = (
        groupIndex: number,
        specIndex: number,
        value: string
    ) => {
        const updatedSpecs = existingSpecifications.map((group, gIndex) => {
            if (gIndex !== groupIndex) return group;

            return {
                ...group,
                specificationsSub: group.specificationsSub.map((spec, sIndex) => {
                    if (sIndex !== specIndex) return spec;
                    return { ...spec, value };
                }),
            };
        });

        onSpecificationsChange(updatedSpecs);
    };

    return (
        <Spin spinning={isLoading}>
            <div className="specifications-container">
                <h2>Thông số kỹ thuật</h2>
                <Space direction="vertical" style={{ width: "100%" }} size={24}>
                    {existingSpecifications.map((group, groupIndex) => (
                        <div key={group._id || groupIndex} className="specification-group">
                            <Row align="middle" gutter={16}>
                                <Col span={24}>
                                    <Input
                                        value={group.nameGroup}
                                        readOnly
                                        style={{ fontWeight: "bold" }}
                                    />
                                </Col>
                            </Row>
                            {group.specificationsSub.length > 0 && (
                                <Space
                                    direction="vertical"
                                    style={{ width: "100%", marginTop: 16 }}
                                    size={16}
                                >
                                    {group.specificationsSub.map((spec, specIndex) => (
                                        <Row key={spec._id || specIndex} gutter={16} align="middle">
                                            <Col span={8}>
                                                <Input value={spec.key} readOnly />
                                            </Col>
                                            <Col span={16}>
                                                <TextArea
                                                    value={spec.value}
                                                    onChange={(e) =>
                                                        updateSpecification(
                                                            groupIndex,
                                                            specIndex,
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Nhập giá trị"
                                                />
                                            </Col>
                                        </Row>
                                    ))}
                                </Space>
                            )}
                        </div>
                    ))}
                </Space>
            </div>
        </Spin>
    );
};

export default EditProductSpecifications;

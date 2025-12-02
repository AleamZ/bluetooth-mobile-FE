import React, { useState, useEffect } from "react";
import { Button, Input, Table, Form, Space } from "antd";
import styles from './edit-product-variant.module.scss';

// interface Variant {
//     name: string;
//     values: string[];
// }

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

interface EditProductVariantProps {
    initialVariants: IVariantProduct[];
    onVariantsChange: (variants: IVariantProduct[]) => void;
}

interface VariantType {
    name: string;   // Ví dụ: "Màu Sắc"
    values: string[]; // Ví dụ: ["Trắng", "Đen", "Xanh"]
}

const EditProductVariant: React.FC<EditProductVariantProps> = ({
    initialVariants = [],
    onVariantsChange,
}) => {
    const [variantTypes, setVariantTypes] = useState<VariantType[]>([]);

    useEffect(() => {
        if (initialVariants.length > 0) {
            // Trích xuất các loại biến thể và giá trị
            const variantMap = new Map<string, Set<string>>();

            initialVariants.forEach(variant => {
                Object.entries(variant.attributes).forEach(([type, value]) => {
                    if (!variantMap.has(type)) {
                        variantMap.set(type, new Set());
                    }
                    variantMap.get(type)?.add(value);
                });
            });

            const types: VariantType[] = Array.from(variantMap.entries())
                .map(([name, values]) => ({
                    name,
                    values: Array.from(values)
                }));

            setVariantTypes(types);
            console.log('Variant Types Extracted:', types);
        }
    }, [initialVariants]);

    const handleVariantTypeChange = (index: number, name: string) => {
        const updated = [...variantTypes];
        updated[index].name = name;
        setVariantTypes(updated);
        generateVariantProducts(updated);
    };

    const generateVariantProducts = (types: VariantType[]) => {
        const newVariants: IVariantProduct[] = [];

        const generateCombinations = (current: Record<string, string>, level: number) => {
            if (level === types.length) {
                // Tìm variant cũ nếu có
                const existing = initialVariants.find(v =>
                    Object.entries(current).every(([k, val]) => v.attributes[k] === val)
                );

                newVariants.push(existing || {
                    attributes: { ...current },
                    price: 0,
                    salePrice: 0,
                    stock: 0,
                    status: "available",
                    images: []
                });
                return;
            }

            types[level].values.forEach(value => {
                generateCombinations(
                    { ...current, [types[level].name]: value },
                    level + 1
                );
            });
        };

        generateCombinations({}, 0);
        onVariantsChange(newVariants);
    };

    const handleAddVariant = () => {
        if (variantTypes.length >= 2) {
            alert("Bạn chỉ có thể tạo tối đa 2 loại biến thể.");
            return;
        }
        setVariantTypes([...variantTypes, { name: "", values: [] }]);
    };

    // const handleVariantChange = (
    //     index: number,
    //     key: "name" | "values",
    //     value: any
    // ) => {
    //     const updatedVariants = [...variantTypes];
    //     if (key === "name") {
    //         updatedVariants[index].name = value;
    //     } else if (key === "values") {
    //         updatedVariants[index].values = value;
    //     }
    //     setVariantTypes(updatedVariants);
    // };

    const handleInputChange = (value: string, record: any, fieldName: string) => {
        console.group('Variant Input Change');
        console.log('Changed Field:', fieldName);
        console.log('New Value:', value);
        console.log('Record:', record);
        console.groupEnd();

        const attributes: Record<string, string> = {};
        variantTypes.forEach((variant, index) => {
            attributes[variant.name] = record[`variant${index}`];
        });

        const newVariants = (prev: IVariantProduct[]) => {
            const updated = [...prev];
            const index = updated.findIndex(item =>
                Object.entries(item.attributes).every(([key, val]) =>
                    attributes[key] === val
                )
            );

            if (index >= 0) {
                updated[index] = {
                    ...updated[index],
                    [fieldName]: fieldName === 'status' ? value : Number(value)
                };
            }
            return updated;
        };
        onVariantsChange(newVariants(initialVariants));
    };

    const columns = [
        ...variantTypes.map((variant, index) => ({
            title: variant.name,
            dataIndex: `variant${index}`,
            key: `variant${index}`,
            render: (text: string) => <span>{text}</span>,
        })),
        {
            title: "Giá",
            dataIndex: "price",
            key: "price",
            render: (_: any, record: DataSourceRow) => {
                const variantProduct = findVariantProduct(record);
                return (
                    <Input
                        type="number"
                        defaultValue={variantProduct?.price}
                        placeholder="Nhập giá"
                        onChange={(e) => handleInputChange(e.target.value, record, "price")}
                    />
                );
            },
        },
        {
            title: "Giá Ưu Đãi",
            dataIndex: "salePrice",
            key: "salePrice",
            render: (_: any, record: DataSourceRow) => {
                const variantProduct = findVariantProduct(record);
                return (
                    <Input
                        type="number"
                        defaultValue={variantProduct?.salePrice}
                        placeholder="Nhập giá ưu đãi"
                        onChange={(e) => handleInputChange(e.target.value, record, "salePrice")}
                    />
                );
            },
        },
        {
            title: "Kho hàng",
            dataIndex: "stock",
            key: "stock",
            render: (_: any, record: DataSourceRow) => {
                const variantProduct = findVariantProduct(record);
                return (
                    <Input
                        type="number"
                        defaultValue={variantProduct?.stock}
                        placeholder="Nhập số lượng"
                        onChange={(e) => handleInputChange(e.target.value, record, "stock")}
                    />
                );
            },
        }
    ];

    const findVariantProduct = (record: DataSourceRow): IVariantProduct | undefined => {
        if (!initialVariants?.length) return undefined;

        const attributes: Record<string, string> = {};
        variantTypes.forEach((variant, index) => {
            if (record[`variant${index}`]) {
                attributes[variant.name] = record[`variant${index}`];
            }
        });

        return initialVariants.find(variant =>
            Object.entries(variant.attributes).every(
                ([key]) => variant.attributes[key] === attributes[key]
            )
        );
    };

    const dataSource = React.useMemo(() => {
        const result: DataSourceRow[] = [];
        if (!variantTypes.length) return result;

        const generateRows = (current: Record<string, string>, level: number) => {
            if (level === variantTypes.length) {
                result.push({
                    key: Object.values(current).join('-'),
                    ...current
                });
                return;
            }

            variantTypes[level].values.forEach(value => {
                generateRows(
                    { ...current, [`variant${level}`]: value },
                    level + 1
                );
            });
        };

        generateRows({}, 0);
        return result;
    }, [variantTypes]);

    // Thêm giá trị cho biến thể
    const handleAddValue = (variantTypeIndex: number) => {
        const updated = [...variantTypes];
        if (updated[variantTypeIndex].values.length >= 8) {
            alert("Bạn chỉ có thể thêm tối đa 8 giá trị cho mỗi biến thể.");
            return;
        }
        updated[variantTypeIndex].values.push("");
        setVariantTypes(updated);
        generateVariantProducts(updated);
    };

    // Cập nhật giá trị cho biến thể
    const handleValueChange = (typeIndex: number, valueIndex: number, newValue: string) => {
        const updated = [...variantTypes];
        updated[typeIndex].values[valueIndex] = newValue;
        setVariantTypes(updated);
        generateVariantProducts(updated);
    };

    // Xóa giá trị của biến thể
    const handleRemoveValue = (typeIndex: number, valueIndex: number) => {
        const updated = [...variantTypes];
        updated[typeIndex].values.splice(valueIndex, 1);
        setVariantTypes(updated);
        generateVariantProducts(updated);
    };

    return (
        <div className={styles['product-variant-container']}>
            <h2>Chỉnh sửa Biến Thể</h2>

            <div className={styles['variant-types-section']}>
                <Button
                    type="primary"
                    onClick={handleAddVariant}
                    className={styles['add-variant-button']}
                    disabled={variantTypes.length >= 2}
                >
                    Thêm loại biến thể
                </Button>

                {variantTypes.map((variantType, typeIndex) => (
                    <div key={typeIndex} className={styles['variant-type-card']}>
                        <Space className={styles['variant-header']} align="start">
                            <Form.Item label={`Tên loại biến thể ${typeIndex + 1}`}>
                                <Input
                                    value={variantType.name}
                                    onChange={(e) => handleVariantTypeChange(typeIndex, e.target.value)}
                                    placeholder="Nhập tên loại biến thể" />
                            </Form.Item>
                            <Button danger onClick={() => {
                                const updated = [...variantTypes];
                                updated.splice(typeIndex, 1);
                                setVariantTypes(updated);
                                generateVariantProducts(updated);
                            }}>
                                Xóa loại biến thể
                            </Button>
                        </Space>
                        <Form.Item label="Các giá trị">
                            {variantType.values.map((value, valueIndex) => (
                                <Space key={valueIndex} className={styles['value-item']}>
                                    <Input
                                        value={value}
                                        onChange={(e) => handleValueChange(typeIndex, valueIndex, e.target.value)}
                                        placeholder="Nhập giá trị" />
                                    <Button danger onClick={() => handleRemoveValue(typeIndex, valueIndex)}>
                                        Xóa
                                    </Button>
                                </Space>
                            ))}
                            <Button type="dashed" onClick={() => handleAddValue(typeIndex)}>
                                Thêm giá trị
                            </Button>
                        </Form.Item>
                    </div>
                ))}
            </div>

            <h3>Bảng Điều Chỉnh Giá và Số Lượng</h3>
            <Table
                dataSource={dataSource}
                columns={columns}
                pagination={false}
                rowKey="key"
            />
        </div>
    );
};

export default EditProductVariant;

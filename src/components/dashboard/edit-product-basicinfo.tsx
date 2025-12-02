import React, { useEffect, useState } from "react";
import { Input, Typography, Upload, message, Row, Col } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import MSelect from "../basicUI/m-select";
import { DashboardService } from "@/services/dashboard.service";
import { BrandService } from "@/services/brand.service";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";

const { Text } = Typography;

interface EditProductBasicInfoProps {
    setImageList: (fileList: any[]) => void;
    setThumbnail: (file: any) => void;
    formData: any;
    setFormData: (data: any) => void;
}

const EditProductBasicInfo: React.FC<EditProductBasicInfoProps> = ({
    setImageList: parentSetImageList,
    setThumbnail: parentSetThumbnail,
    formData,
    setFormData,
}) => {
    const [categoryOptions, setCategoryOptions] = useState<any[]>([]);
    const [brandOptions, setBrandOptions] = useState<any[]>([]);
    const [localImageList, setLocalImageList] = useState<any[]>([]);
    const [localThumbnail, setLocalThumbnail] = useState<any[]>([]);
    const maxLength = 255;

    // Xử lý upload ảnh sản phẩm
    const handleImageUpload = ({ fileList }: any) => {
        const newFileList = fileList.map((file: any, index: number) => ({
            ...file,
            uid: file.uid || `image-${index}`,
            status: 'done'
        }));
        setLocalImageList(newFileList);
        parentSetImageList(newFileList);
    };

    // Xử lý upload ảnh thumbnail
    const handleThumbnailUpload = ({ fileList }: any) => {
        const newThumbnail = fileList.map((file: any) => ({
            ...file,
            uid: 'thumbnail',
            status: 'done'
        }));
        setLocalThumbnail(newThumbnail);
        parentSetThumbnail(newThumbnail);
    };

    // Load initial images
    useEffect(() => {
        if (formData.imageThumbnailUrl && !localThumbnail.length) {
            const thumbnailFile = {
                uid: 'thumbnail',
                name: 'thumbnail.png',
                status: 'done',
                url: formData.imageThumbnailUrl
            };
            setLocalThumbnail([thumbnailFile]);
            parentSetThumbnail([thumbnailFile]);
        }

        if (formData.imageUrls?.length > 0 && !localImageList.length) {
            const mappedImages = formData.imageUrls.map((url: string, index: number) => ({
                uid: `existing-${index}`,
                name: `image-${index}.png`,
                status: 'done',
                url: url
            }));
            setLocalImageList(mappedImages);
            parentSetImageList(mappedImages);
        }
    }, [formData.imageThumbnailUrl, formData.imageUrls]);

    const fetchCategories = async () => {
        try {
            const response = await DashboardService.getAllCategoriesActive();
            setCategoryOptions(response.map((item: any) => ({
                label: item.name,
                value: item._id
            })));
        } catch (error: any) {
            message.error("Lỗi xảy ra khi tải danh mục");
        }
    };

    const fetchBrands = async () => {
        try {
            const response = await BrandService.getBrandActive();
            setBrandOptions(response.map((item: any) => ({
                label: item.name,
                value: item._id
            })));
        } catch (error: any) {
            message.error("Lỗi xảy ra khi tải thương hiệu");
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchBrands();
    }, []);

    return (
        <div className="basic-info">
            <h2>Thông tin cơ bản</h2>
            <Row gutter={[12, 12]}>
                <Col span={24}>
                    <div className="input-container">
                        <Text className="label">
                            <span className="required">*</span> Tên sản phẩm
                        </Text>
                        <Input
                            className="input"
                            value={formData.name || ''}
                            onChange={(e) =>
                                setFormData((prev: any) => ({ ...prev, name: e.target.value }))
                            }
                            placeholder="Nhập tên sản phẩm"
                            maxLength={maxLength}
                        />
                        <div className="character-count">
                            {(formData.name || '').length}/{maxLength}
                        </div>
                    </div>
                </Col>
            </Row>

            <Row gutter={[12, 12]}>
                <Col span={12}>
                    <div className="input-container">
                        <Text className="label">
                            <span className="required">*</span> Danh mục
                        </Text>
                        <MSelect
                            options={categoryOptions}
                            value={formData.categoryId}
                            onChange={(value) =>
                                setFormData((prev: any) => ({ ...prev, categoryId: value }))
                            }
                        />
                    </div>
                </Col>
                <Col span={12}>
                    <div className="input-container">
                        <Text className="label">
                            <span className="required">*</span> Thương hiệu
                        </Text>
                        <MSelect
                            options={brandOptions}
                            value={formData.brandId}
                            onChange={(value) =>
                                setFormData((prev: any) => ({ ...prev, brandId: value }))
                            }
                        />
                    </div>
                </Col>
            </Row>

            <Row>
                <Col span={24}>
                    <div className="input-container">
                        <Text className="label">
                            <span className="required">*</span> Thông tin sản phẩm
                        </Text>
                        <ReactQuill
                            value={formData.infoProduct || ''}
                            onChange={(value) =>
                                setFormData((prev: any) => ({ ...prev, infoProduct: value }))
                            }
                        />
                    </div>
                </Col>
            </Row>

            <Row>
                <Col span={24}>
                    <div className="input-container">
                        <Text className="label">
                            <span className="required">*</span> Miêu tả sản phẩm
                        </Text>
                        <ReactQuill
                            value={formData.description || ''}
                            onChange={(value) =>
                                setFormData((prev: any) => ({ ...prev, description: value }))
                            }
                        />
                    </div>
                </Col>
            </Row>

            <div className="input-container">
                <Text className="label">Ảnh sản phẩm</Text>
                <Upload
                    listType="picture-card"
                    fileList={localImageList}
                    onChange={handleImageUpload}
                    maxCount={10}
                    onRemove={(file) => {
                        const newFileList = localImageList.filter(item => item.uid !== file.uid);
                        handleImageUpload({ fileList: newFileList });
                        return true;
                    }}
                    beforeUpload={() => false} // Prevent auto upload
                >
                    {localImageList.length >= 10 ? null : (
                        <div>
                            <PlusOutlined />
                            <div style={{ marginTop: 8 }}>Upload</div>
                        </div>
                    )}
                </Upload>
            </div>

            <div className="input-container">
                <Text className="label">Ảnh Thumbnail</Text>
                <Upload
                    listType="picture-card"
                    fileList={localThumbnail}
                    onChange={handleThumbnailUpload}
                    maxCount={1}
                    onRemove={() => {
                        setLocalThumbnail([]);
                        parentSetThumbnail([]);
                        return true;
                    }}
                    beforeUpload={() => false} // Prevent auto upload
                >
                    {localThumbnail.length >= 1 ? null : (
                        <div>
                            <PlusOutlined />
                            <div style={{ marginTop: 8 }}>Upload</div>
                        </div>
                    )}
                </Upload>
            </div>
        </div>
    );
};

export default EditProductBasicInfo;

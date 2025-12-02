import React, { useState, useEffect } from 'react';
import { Spin, Modal, Button, Form, Input, Select, Upload } from 'antd';
import { EditOutlined, UploadOutlined } from "@ant-design/icons";
import type { UploadProps } from 'antd';
import '@/styles/components/list-box.scss';

interface ListBoxProps {
    children: React.ReactNode;
    isLoading?: boolean;
    className?: string;
    title?: string;
    extra?: React.ReactNode;
    modalTitle?: string;
    editingItem?: any;
    onSubmit?: (values: any) => Promise<void>;
    onDelete?: (item: any) => Promise<void>;
    onEdit?: (item: any) => void;
    selectOptions?: { value: string; label: string; }[];
    selectLoading?: boolean;
    formConfig?: {
        [key: string]: {
            label: string;
            type: 'input' | 'select';
            mode?: 'multiple' | 'tags';
            placeholder?: string;
            rules?: any[];
        };
    };
    onImageUpload?: (file: File) => Promise<boolean>;
}

export const EditButton: React.FC<{
    item: any;
    onEdit: (item: any) => void;
    stopPropagation?: boolean;
}> = ({ item, onEdit, stopPropagation }) => (
    <EditOutlined
        className="edit-icon"
        onClick={(e) => {
            if (stopPropagation) e.stopPropagation();
            onEdit(item);
        }}
    />
);

const ListBox: React.FC<ListBoxProps> = ({
    title,
    extra,
    children,
    isLoading = false,
    className = '',
    modalTitle,
    editingItem,
    onSubmit,
    onDelete,
    onEdit,
    selectOptions = [],
    selectLoading = false,
    formConfig,
    onImageUpload,
}) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        if (editingItem) {
            form.setFieldsValue({
                name: editingItem.name,
                url: editingItem.url,
                parent: editingItem.parentId
            });
            setIsModalVisible(true);
        }
    }, [editingItem, form]);

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            await onSubmit?.(values);
            setIsModalVisible(false);
            form.resetFields();
        } catch (error) {
            console.error("Validate Failed:", error);
        }
    };

    const handleDelete = async () => {
        if (editingItem && onDelete) {
            await onDelete(editingItem);
            setIsModalVisible(false);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        setIsModalVisible(false);
        if (onEdit) onEdit(null);
    };

    const handleExtraClick = () => {
        if (onEdit) onEdit(null);
        setIsModalVisible(true);
    };

    const uploadProps: UploadProps = {
        beforeUpload: async (file) => {
            if (onImageUpload) {
                return await onImageUpload(file);
            }
            return false;
        },
        showUploadList: false,
    };

    const renderFormItems = () => {
        return (
            <Form form={form} layout="vertical">
                <Form.Item
                    name="name"
                    label="Tên"
                    rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
                >
                    <Input placeholder="Nhập tên" />
                </Form.Item>

                {formConfig ? (
                    Object.entries(formConfig).map(([key, config]) => (
                        <Form.Item
                            key={key}
                            name={key}
                            label={config.label}
                            rules={config.rules}
                        >
                            {config.type === 'select' ? (
                                <Select
                                    mode={config.mode}
                                    placeholder={config.placeholder}
                                    loading={selectLoading}
                                    allowClear
                                    options={selectOptions}
                                />
                            ) : (
                                <Input placeholder={config.placeholder} />
                            )}
                        </Form.Item>
                    ))
                ) : (
                    <>
                        <Form.Item name="url" label="URL">
                            <Input placeholder="Nhập URL" />
                        </Form.Item>
                        <Form.Item name="parent" label="Nhóm Cha">
                            <Select
                                placeholder="Chọn nhóm cha"
                                loading={selectLoading}
                                allowClear
                                options={selectOptions}
                            />
                        </Form.Item>
                    </>
                )}

                {!editingItem && onImageUpload && (
                    <Form.Item label="Ảnh logo" name="image">
                        <Upload {...uploadProps}>
                            <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
                        </Upload>
                    </Form.Item>
                )}
            </Form>
        );
    };

    return (
        <Spin spinning={isLoading}>
            {title && (
                <div className="list-box-header">
                    <h2>{title}</h2>
                    <div onClick={handleExtraClick}>
                        {extra}
                    </div>
                </div>
            )}
            <div className={`page-container ${className}`}>
                <div className="page-sub-container">
                    {children}
                </div>
            </div>

            <Modal
                title={modalTitle}
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={(() => {
                    const buttons = [];
                    if (editingItem && onDelete) {
                        buttons.push(
                            <Button key="delete" type="default" danger onClick={handleDelete}>
                                Xóa
                            </Button>
                        );
                    }
                    buttons.push(
                        <Button key="cancel" onClick={handleCancel}>Bỏ qua</Button>
                    );
                    buttons.push(
                        <Button key="submit" type="primary" onClick={handleOk}>
                            {editingItem ? "Cập nhật" : "Lưu"}
                        </Button>
                    );
                    return buttons;
                })()}
            >
                {renderFormItems()}
            </Modal >
        </Spin >
    );
};

export default ListBox;

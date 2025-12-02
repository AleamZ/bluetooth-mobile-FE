import React, { useState } from "react";
import { Form, Input, Button, Row, Col } from "antd";

const ProductCharacteristics = () => {
    const [screenFeatures, setScreenFeatures] = useState<string[]>(["Dynamic Island", "Màn hình Luôn Bật"]);
    const [videoFormats, setVideoFormats] = useState<string[]>(["4K@24 fps", "4K@30 fps", "1080p@60 fps"]);
    const [cameraFeatures, setCameraFeatures] = useState<string[]>(["Flash True Tone", "Photonic Engine"]);

    const handleAddItem = (setFunction: React.Dispatch<React.SetStateAction<string[]>>) => {
        setFunction((prev) => [...prev, ""]); // Thêm phần tử rỗng
    };

    const handleRemoveItem = (setFunction: React.Dispatch<React.SetStateAction<string[]>>, index: number) => {
        setFunction((prev) => prev.filter((_, i) => i !== index)); // Xóa phần tử tại index
    };

    const handleChangeItem = (
        setFunction: React.Dispatch<React.SetStateAction<string[]>>,
        index: number,
        value: string
    ) => {
        setFunction((prev) => prev.map((item, i) => (i === index ? value : item))); // Cập nhật giá trị tại index
    };

    const handleSubmit = (values: any) => {
        const processedValues = {
            ...values,
            screenFeatures: screenFeatures.filter((item) => item.trim() !== ""),
            videoFormats: videoFormats.filter((item) => item.trim() !== ""),
            cameraFeatures: cameraFeatures.filter((item) => item.trim() !== ""),
        };
        console.log("Submitted values:", processedValues);
    };

    return (
        <div className="product-characteristics">
            <h2>Thông số kỹ thuật</h2>
            <Form layout="vertical" onFinish={handleSubmit}>
                <Row gutter={16}>
                    {/* 1. Màn hình */}
                    <Col span={12}>
                        <Form.Item
                            name="screenSize"
                            label="Kích thước màn hình"
                            rules={[{ required: true, message: "Vui lòng nhập kích thước màn hình!" }]}
                        >
                            <Input placeholder="6.9 inches" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="screenTechnology"
                            label="Công nghệ màn hình"
                            rules={[{ required: true, message: "Vui lòng nhập công nghệ màn hình!" }]}
                        >
                            <Input placeholder="Super Retina XDR OLED" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="screenResolution"
                            label="Độ phân giải màn hình"
                            rules={[{ required: true, message: "Vui lòng nhập độ phân giải màn hình!" }]}
                        >
                            <Input placeholder="2868 x 1320 pixels" />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <h3>Tính năng màn hình</h3>
                        {screenFeatures.map((feature, index) => (
                            <Row key={index} align="middle" gutter={8}>
                                <Col span={20}>
                                    <Input
                                        value={feature}
                                        onChange={(e) => handleChangeItem(setScreenFeatures, index, e.target.value)}
                                        placeholder="Nhập tính năng màn hình"
                                    />
                                </Col>
                                <Col span={4}>
                                    <Button danger onClick={() => handleRemoveItem(setScreenFeatures, index)}>
                                        Xóa
                                    </Button>
                                </Col>
                            </Row>
                        ))}
                        <Button type="dashed" block onClick={() => handleAddItem(setScreenFeatures)}>
                            Thêm tính năng
                        </Button>
                    </Col>



                    {/* 3. Quay video */}
                    <Col span={24}>
                        <h3>Định dạng quay video</h3>
                        {videoFormats.map((format, index) => (
                            <Row key={index} align="middle" gutter={8}>
                                <Col span={20}>
                                    <Input
                                        value={format}
                                        onChange={(e) => handleChangeItem(setVideoFormats, index, e.target.value)}
                                        placeholder="Nhập định dạng quay video"
                                    />
                                </Col>
                                <Col span={4}>
                                    <Button danger onClick={() => handleRemoveItem(setVideoFormats, index)}>
                                        Xóa
                                    </Button>
                                </Col>
                            </Row>
                        ))}
                        <Button type="dashed" block onClick={() => handleAddItem(setVideoFormats)}>
                            Thêm định dạng
                        </Button>
                    </Col>

                    {/* 4.  camera Trước*/}
                    <Col span={24}>
                        <h3>Camera Trước</h3>
                        {cameraFeatures.map((feature, index) => (
                            <Row key={index} align="middle" gutter={8}>
                                <Col span={23}>
                                    <Input
                                        value={feature}
                                        onChange={(e) => handleChangeItem(setCameraFeatures, index, e.target.value)}
                                        placeholder="Nhập tính năng camera"
                                    />
                                </Col>
                                <Col span={1}>
                                    <Button danger onClick={() => handleRemoveItem(setCameraFeatures, index)}>
                                        Xóa
                                    </Button>
                                </Col>
                            </Row>
                        ))}
                        <Button type="dashed" block onClick={() => handleAddItem(setCameraFeatures)}>
                            Thêm tính năng
                        </Button>
                        <h3>Camera Sau</h3>
                        {cameraFeatures.map((feature, index) => (
                            <Row key={index} align="middle" gutter={8}>
                                <Col span={23}>
                                    <Input
                                        value={feature}
                                        onChange={(e) => handleChangeItem(setCameraFeatures, index, e.target.value)}
                                        placeholder="Nhập tính năng camera"
                                    />
                                </Col>
                                <Col span={1}>
                                    <Button danger onClick={() => handleRemoveItem(setCameraFeatures, index)}>
                                        Xóa
                                    </Button>
                                </Col>
                            </Row>
                        ))}
                        <Button type="dashed" block onClick={() => handleAddItem(setCameraFeatures)}>
                            Thêm tính năng
                        </Button>


                    </Col>



                    <Col span={24}>
                        <h3>Thông số về thống kê</h3>
                        <Row gutter={16}>
                            {/* 6. Chipset */}
                            <Col span={12}>
                                <Form.Item
                                    name="chipset"
                                    label="Chipset"
                                    rules={[{ required: true, message: "Vui lòng nhập thông tin chipset!" }]}
                                >
                                    <Input placeholder="Apple A18 Pro" />
                                </Form.Item>
                            </Col>

                            {/* 7. Bộ nhớ trong */}
                            <Col span={12}>
                                <Form.Item
                                    name="storage"
                                    label="Bộ nhớ trong"
                                    rules={[{ required: true, message: "Vui lòng nhập bộ nhớ trong!" }]}
                                >
                                    <Input placeholder="256 GB" />
                                </Form.Item>
                            </Col>

                            {/* 8. NFC */}
                            <Col span={12}>
                                <Form.Item
                                    name="nfc"
                                    label="Công nghệ NFC"
                                    rules={[{ required: true, message: "Vui lòng nhập công nghệ NFC!" }]}
                                >
                                    <Input placeholder="Có hoặc Không" />
                                </Form.Item>
                            </Col>

                            {/* 9. Thẻ SIM */}
                            <Col span={12}>
                                <Form.Item
                                    name="sim"
                                    label="Thẻ SIM"
                                    rules={[{ required: true, message: "Vui lòng nhập thông tin thẻ SIM!" }]}
                                >
                                    <Input placeholder="Sim kép (nano-Sim và e-Sim)..." />
                                </Form.Item>
                            </Col>

                            {/* 10. Kích thước */}
                            <Col span={12}>
                                <Form.Item
                                    name="dimensions"
                                    label="Kích thước"
                                    rules={[{ required: true, message: "Vui lòng nhập kích thước!" }]}
                                >
                                    <Input placeholder="163 x 77,6 x 8,25 mm" />
                                </Form.Item>
                            </Col>

                            {/* 11. Trọng lượng */}
                            <Col span={12}>
                                <Form.Item
                                    name="weight"
                                    label="Trọng lượng"
                                    rules={[{ required: true, message: "Vui lòng nhập trọng lượng!" }]}
                                >
                                    <Input placeholder="227 gram" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>

                </Row>


            </Form >
        </div >
    );
};

export default ProductCharacteristics;

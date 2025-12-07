import { useEffect, useRef, useState } from "react";
import {
  Row,
  Col,
  Card,
  Input,
  Button,
  Upload,
  Modal,
  Checkbox,
  Spin,
  Empty,
  message,
  List,
  Space,
  Tag,
  Tooltip,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import MainMenu from "../../components/top-home/main-menu";
import SubBanner from "../../components/top-home/sub-banner";
import { handleError } from "@/utils/catch-error";
import { UploadService } from "@/services/upload.service";
import { Swiper, SwiperSlide } from "swiper/react";
import { IBanner } from "@/types/main-banner/main-banner.interface";
import { MainBannerService } from "@/services/main-banner.service";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
type ActionSubBanner = "edit" | "add";
const BannerDesign = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [imageList, setImageList] = useState<any[]>([]);
  const [dataBanners, setDataBanners] = useState<IBanner[]>([]);
  const [bannersIsShow, setBannersIsShow] = useState<IBanner[]>([]);
  const [editedPositions, setEditedPositions] = useState<{
    [key: string]: number;
  }>({});
  const [openModalMainBaner, setOpenModalMainBanner] = useState<boolean>(false);
  const [action, setAction] = useState<ActionSubBanner>("add");
  const [bannerCurrent, setBannerCurrent] = useState<{
    id: string;
    image: string;
    url: string;
    order: number;
    isShow: boolean;
    title: string;
    label: string;
  }>({
    id: "",
    image: "",
    url: "",
    order: 1,
    isShow: false,
    title: "",
    label: "",
  });

  const handleEditMainBanner = (id: string) => {
    setOpenModalMainBanner(true);
    setAction("edit");
    const filterMainBannerEdit: IBanner | undefined = dataBanners.find(
      (item) => item._id === id
    );
    if (!filterMainBannerEdit) {
      return message.error("hệ thống đang lỗi vui lòng thử lại sau");
    }
    setBannerCurrent({
      id: filterMainBannerEdit._id,
      image: filterMainBannerEdit.image,
      url: filterMainBannerEdit.url,
      order: filterMainBannerEdit.order,
      isShow: filterMainBannerEdit.isShow,
      title: filterMainBannerEdit.title,
      label: filterMainBannerEdit.label,
    });
  };

  const resetDataMainBanner = () => {
    setBannerCurrent({
      id: "",
      image: "",
      url: "",
      order: 1,
      isShow: false,
      title: "",
      label: "",
    });
    setImageList([]);
  };

  const handleSaveSubBanner = async (e?: React.MouseEvent<HTMLElement>) => {
    // Prevent modal from closing automatically
    if (e) {
      e.preventDefault();
    }

    console.log("handleSaveSubBanner called", {
      action,
      imageList: imageList.length,
      bannerCurrent,
      timestamp: new Date().toISOString()
    });

    // Validate: Phải có ảnh khi tạo mới
    if (action === "add" && !imageList.length) {
      message.error("Vui lòng chọn ảnh để tạo banner");
      return;
    }

    let imageUrl = "";

    if (imageList.length) {
      try {
        setIsLoading(true);
        const uploadResult = await UploadService.uploadSingle(imageList[0].originFileObj);
        console.log("Upload result:", uploadResult);
        console.log("Upload result type:", typeof uploadResult);
        console.log("Upload result keys:", Object.keys(uploadResult || {}));

        // Xử lý cả hai trường hợp: { url: ... } hoặc { data: { url: ... } }
        imageUrl = uploadResult?.url || uploadResult?.data?.url || "";
        console.log("Extracted imageUrl:", imageUrl);

        if (!imageUrl) {
          console.error("Image URL is empty after upload:", uploadResult);
          message.error("Upload ảnh thất bại, vui lòng thử lại");
          setIsLoading(false);
          return;
        }
        console.log("Upload successful, imageUrl:", imageUrl);
      } catch (error) {
        console.error("Upload error:", error);
        handleError(error);
        setIsLoading(false);
        return;
      }
    }

    console.log("After upload check - action:", action, "imageUrl:", imageUrl);

    if (action === "add") {
      console.log("Entering add action block");
      // Validate các trường bắt buộc
      if (!bannerCurrent.title || !bannerCurrent.label || !bannerCurrent.url) {
        console.log("Validation failed:", {
          title: bannerCurrent.title,
          label: bannerCurrent.label,
          url: bannerCurrent.url
        });
        message.error("Vui lòng điền đầy đủ thông tin (Title, Label, Url)");
        setIsLoading(false);
        return;
      }

      console.log("Validation passed, proceeding to create banner");

      const payload = {
        image: imageUrl,
        order: bannerCurrent.order || 1,
        url: bannerCurrent.url,
        title: bannerCurrent.title,
        label: bannerCurrent.label,
      };
      console.log("Creating banner with payload:", payload);
      try {
        const result = await MainBannerService.createMainBanner(payload);
        console.log("Create banner success:", result);
        message.success("Tạo thành công");
        asyncDataMainBanners();
        asyncDataMainBannersIsShow();
        setOpenModalMainBanner(false);
        resetDataMainBanner();
        setImageList([]);
      } catch (error: any) {
        console.error("Create banner error:", error);
        console.error("Error details:", {
          message: error?.message,
          response: error?.response,
          data: error?.data,
          errors: error?.errors
        });
        handleError(error);
      } finally {
        setIsLoading(false);
      }
    }

    if (action === "edit") {
      const payloadUpdate: any = {
        url: bannerCurrent.url,
        isShow: bannerCurrent.isShow,
        title: bannerCurrent.title,
        label: bannerCurrent.label,
      };
      // Nếu có ảnh mới được upload, thêm vào payload
      if (imageList.length && imageUrl) {
        payloadUpdate.image = imageUrl;
      }
      try {
        const result = await MainBannerService.updateMainBanner(
          bannerCurrent.id,
          payloadUpdate
        );
        console.log("Update banner success:", result);
        message.success("Cập nhật thành công");
        setOpenModalMainBanner(false);
        asyncDataMainBanners();
        asyncDataMainBannersIsShow();
        resetDataMainBanner();
        setImageList([]);
      } catch (error: any) {
        console.error("Update banner error:", error);
        console.error("Error details:", {
          message: error?.message,
          response: error?.response,
          data: error?.data,
          errors: error?.errors
        });
        handleError(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCancelEdit = () => {
    setOpenModalMainBanner(false);
    resetDataMainBanner();
  };

  const handleImageChange = ({ file, fileList }: any) => {
    setImageList(fileList);
    console.log({ file });
  };

  const handleDeleteSubBanner = async (id: string) => {
    try {
      await MainBannerService.deleteMainBanner(id);
      message.success("Xóa thành công");
      asyncDataMainBannersIsShow();
      asyncDataMainBanners();
    } catch (error) {
      handleError(error);
    }
  };
  const renderDemoSubBanner = () => (
    <Card title="Demo Banner" bordered={false}>
      <div className="main-top-home-container">
        <div className="main-top-home-sub-container">
          <MainMenu />
          <div className="main-banner">
            <Swiper
              className="main-banner-swiper-container"
              navigation
              pagination={{ clickable: true }}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
              onSwiper={(swiper) => (swiperRef.current = swiper)}
              modules={[Navigation, Autoplay, Pagination]}
            >
              {bannersIsShow.map((item, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="banner-image"
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            <div className="menu">
              {bannersIsShow.map((banner, index) => (
                <button
                  key={index}
                  className={`menu-item ${activeIndex === index ? "active" : ""
                    }`}
                  onClick={() => {
                    swiperRef.current?.slideTo(index);
                  }}
                >
                  {banner.title.toLocaleUpperCase()}
                  <br />
                  <span>{banner.label}</span>
                </button>
              ))}
            </div>
          </div>
          <SubBanner />
        </div>
      </div>
    </Card>
  );
  const renderBannerList = () => (
    <Row gutter={[16, 16]}>
      {dataBanners.map((subBanner, index) => (
        <Col span={8} key={index}>
          <Card
            hoverable
            cover={
              <img alt={`SubBanner ${subBanner._id}`} src={subBanner.image} />
            }
            actions={[
              <Button
                type="primary"
                onClick={() => handleEditMainBanner(subBanner._id)}
              >
                Chỉnh sửa
              </Button>,
              <Button
                type="dashed"
                onClick={() => handleDeleteSubBanner(subBanner._id)}
              >
                Xóa
              </Button>,
            ]}
          >
            <Tooltip placement="top" title={"Đường link url"}>
              <Tag style={{ marginTop: 15 }} color="success">
                {subBanner.url}
              </Tag>
            </Tooltip>
            <Tooltip placement="top" title={"Title"}>
              <Tag style={{ marginTop: 15 }} color="error">
                {subBanner.title}
              </Tag>{" "}
            </Tooltip>
            <Tooltip placement="top" title={"Label"}>
              <Tag style={{ marginTop: 15 }} color="warning">
                {subBanner.label}
              </Tag>{" "}
            </Tooltip>
            <Tooltip placement="top" title={"Trạng thái"}>
              <Tag style={{ marginTop: 15 }} color="processing">
                {" "}
                {subBanner.isShow ? "Hiển thị" : "Không hiển thị"}
              </Tag>
            </Tooltip>
          </Card>
        </Col>
      ))}
    </Row>
  );

  const renderEditBannerModal = () => (
    <Modal
      title={action === "add" ? "Thêm Sub Banner" : "Chỉnh sửa Sub Banner"}
      onOk={async (e) => {
        console.log("Modal onOk clicked, action:", action);
        e?.preventDefault();
        await handleSaveSubBanner(e);
      }}
      onCancel={handleCancelEdit}
      okText="Save"
      cancelText="Cancel"
      open={openModalMainBaner}
      confirmLoading={isLoading}
      okButtonProps={{ loading: isLoading }}
    >
      <div>
        <Upload name="image" maxCount={1} onChange={handleImageChange}>
          <Button icon={<UploadOutlined />}>Upload Image</Button>
        </Upload>
        <Input
          value={bannerCurrent.title}
          onChange={(e) =>
            setBannerCurrent({ ...bannerCurrent, title: e.target.value })
          }
          placeholder="Title"
          style={{ marginTop: 10 }}
        />
        <Input
          value={bannerCurrent.label}
          onChange={(e) =>
            setBannerCurrent({ ...bannerCurrent, label: e.target.value })
          }
          placeholder="Label"
          style={{ marginTop: 10 }}
        />
        <Input
          value={bannerCurrent.url}
          onChange={(e) =>
            setBannerCurrent({ ...bannerCurrent, url: e.target.value })
          }
          placeholder="Url"
          style={{ marginTop: 10 }}
        />
        {action === "add" && (
          <Input
            type="number"
            min={1}
            defaultValue={1}
            value={bannerCurrent.order}
            onChange={(e) =>
              setBannerCurrent({
                ...bannerCurrent,
                order: Number(e.target.value),
              })
            }
            placeholder="Order"
            style={{ marginTop: 10 }}
          />
        )}

        {action === "edit" && (
          <>
            <Checkbox
              checked={bannerCurrent.isShow}
              onChange={(e) =>
                setBannerCurrent({
                  ...bannerCurrent,
                  isShow: e.target.checked,
                })
              }
              style={{ marginTop: 10, marginRight: 6 }}
            />
            <span>Hiển thị</span>
          </>
        )}
      </div>
    </Modal>
  );

  const asyncDataMainBanners = async () => {
    try {
      setIsLoading(true);
      const response = await MainBannerService.getAllMainBanners();
      setDataBanners(response);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };
  const asyncDataMainBannersIsShow = async () => {
    try {
      setIsLoading(true);
      const response = await MainBannerService.getIsShowBanner();
      setBannersIsShow(response);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveOrder = async (id: string, newPosition: number) => {
    try {
      await MainBannerService.updateOrder(id, newPosition);
      message.success("Sắp xếp thành công");
      asyncDataMainBannersIsShow();
    } catch (error) {
      handleError(error);
    }
  };
  useEffect(() => {
    asyncDataMainBanners();
    asyncDataMainBannersIsShow();
  }, []);
  return (
    <Spin spinning={isLoading}>
      <div>
        <div
          style={{
            marginBottom: 30,
            textAlign: "center",
            justifyContent: "center",
            display: "flex",
          }}
        >
          {renderDemoSubBanner()}
        </div>
        <div style={{ marginBottom: 200 }}>
          <h2>Customize Banners</h2>

          <Button
            type="dashed"
            onClick={() => {
              setOpenModalMainBanner(true);
              setAction("add");
            }}
            style={{ marginTop: 20, marginBottom: 20 }}
          >
            Thêm Banner
          </Button>

          {dataBanners.length ? renderBannerList() : <Empty />}

          {renderEditBannerModal()}
        </div>
      </div>
      <div>
        <h2>Customize Order Banners</h2>
        <List
          className="menu-list-design"
          bordered
          dataSource={bannersIsShow}
          renderItem={(item) => (
            <List.Item key={item.url}>
              <Space style={{ width: "100%", justifyContent: "space-between" }}>
                <div>
                  <img
                    src={item.image}
                    style={{
                      width: "40px",
                      height: "40px",
                      marginRight: "10px",
                    }}
                  />
                  <strong>{item.url}</strong> - Order: {item.order}
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  {/* Nhập vị trí mới */}
                  <Input
                    type="number"
                    value={editedPositions[item._id] || ""}
                    onChange={(e) => {
                      setEditedPositions({
                        ...editedPositions,
                        [item._id]: parseInt(e.target.value, 10),
                      });
                    }}
                    style={{ width: "80px", marginRight: "10px" }}
                    placeholder="Enter position"
                  />
                  <Button
                    type="primary"
                    onClick={() =>
                      handleSaveOrder(
                        item._id,
                        editedPositions[item._id] || item.order
                      )
                    }
                  >
                    Lưu
                  </Button>
                </div>
              </Space>
            </List.Item>
          )}
        />
      </div>
    </Spin>
  );
};

export default BannerDesign;

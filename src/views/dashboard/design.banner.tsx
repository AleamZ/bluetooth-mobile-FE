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
import axios from "axios";
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
  };

  const handleSaveSubBanner = async () => {
    let responseUpload = { data: { url: "" }, status: 200 };
    if (imageList.length) {
      const payloadImage = new FormData();
      imageList.forEach((file: any) => {
        payloadImage.append("image", file.originFileObj);
      });
      responseUpload = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/upload/single`,
        payloadImage,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    }
    if (action === "add") {
      if (responseUpload.status === 200) {
        const payload = {
          image: responseUpload?.data.url,
          order: bannerCurrent.order,
          url: bannerCurrent.url,
          title: bannerCurrent.title,
          label: bannerCurrent.label,
        };
        try {
          await MainBannerService.createMainBanner(payload);
          message.success("Tạo thành công");
          asyncDataMainBanners();
          asyncDataMainBannersIsShow();
          setOpenModalMainBanner(false);
          resetDataMainBanner();
        } catch (error) {
          handleError(error);
        }
      }
    }

    if (action === "edit") {
      if (responseUpload.status === 200) {
        const payloadUpdate = {
          image: responseUpload?.data.url,
          url: bannerCurrent.url,
          isShow: bannerCurrent.isShow,
          title: bannerCurrent.title,
          label: bannerCurrent.label,
        };
        try {
          await MainBannerService.updateMainBanner(
            bannerCurrent.id,
            payloadUpdate
          );
          message.success("Cập nhật thành công");
          setOpenModalMainBanner(false);
          asyncDataMainBanners();
          asyncDataMainBannersIsShow();
          resetDataMainBanner();
        } catch (error) {
          handleError(error);
        }
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
      onOk={handleSaveSubBanner}
      onCancel={handleCancelEdit}
      okText="Save"
      cancelText="Cancel"
      open={openModalMainBaner}
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

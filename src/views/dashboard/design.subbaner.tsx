import { useEffect, useState } from "react";
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
import MainBanner from "../../components/top-home/main-banner";
import { SubBannerService } from "@/services/sub-banner.service";
import { handleError } from "@/utils/catch-error";
import axios from "axios";
import { ISubBanner } from "@/types/sub-banner/sub-banner.interface";
import SubBannerItem from "@/components/basicUI/sub-banner-item";

type ActionSubBanner = "edit" | "add";
const SubBannerDesign = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [imageList, setImageList] = useState<any[]>([]);
  const [dataSubBanners, setDataSubBanners] = useState<ISubBanner[]>([]);
  const [subBannersIsShow, setSubBannersIsShow] = useState<ISubBanner[]>([]);
  const [editedPositions, setEditedPositions] = useState<{
    [key: string]: number;
  }>({});
  const [openModalSubBaner, setOpenModalSubBanner] = useState<boolean>(false);
  const [action, setAction] = useState<ActionSubBanner>("add");
  const [subBannerCurrent, setSubbannerCurrent] = useState<{
    id: string;
    image: string;
    url: string;
    order: number;
    isShow: boolean;
  }>({
    id: "",
    image: "",
    url: "",
    order: 1,
    isShow: false,
  });

  const handleEditSubBanner = (id: string) => {
    setOpenModalSubBanner(true);
    setAction("edit");
    const filterSubBannerEdit: ISubBanner | undefined = dataSubBanners.find(
      (item) => item._id === id
    );
    if (!filterSubBannerEdit) {
      return message.error("hệ thống đang lỗi vui lòng thử lại sau");
    }
    setSubbannerCurrent({
      id: filterSubBannerEdit._id,
      image: filterSubBannerEdit.image,
      url: filterSubBannerEdit.url,
      order: filterSubBannerEdit.order,
      isShow: filterSubBannerEdit.isShow,
    });
  };

  const resetDataSubBanner = () => {
    setSubbannerCurrent({
      id: "",
      image: "",
      url: "",
      order: 1,
      isShow: false,
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
          order: subBannerCurrent.order,
          url: subBannerCurrent.url,
        };
        try {
          await SubBannerService.createSubBanner(payload);
          message.success("Tạo thành công");
          asyncDataSubBanners();
          asyncDataSubBannersIsShow();
          setOpenModalSubBanner(false);
          resetDataSubBanner();
        } catch (error) {
          handleError(error);
        }
      }
    }

    if (action === "edit") {
      if (responseUpload.status === 200) {
        const payloadUpdate = {
          order: subBannerCurrent.order,
          url: subBannerCurrent.url,
          isShow: subBannerCurrent.isShow,
        };
        try {
          await SubBannerService.updateSubBanner(
            subBannerCurrent.id,
            payloadUpdate
          );
          message.success("Cập nhật thành công");
          setOpenModalSubBanner(false);
          asyncDataSubBanners();
          asyncDataSubBannersIsShow();
          resetDataSubBanner();
        } catch (error) {
          handleError(error);
        }
      }
    }
  };

  const handleCancelEdit = () => {
    setOpenModalSubBanner(false);
    resetDataSubBanner();
  };

  const handleImageChange = ({ file, fileList }: any) => {
    setImageList(fileList);
    console.log({ file });
  };

  const handleDeleteSubBanner = async (id: string) => {
    try {
      await SubBannerService.deleteSubBanner(id);
      message.success("Xóa thành công");
      asyncDataSubBannersIsShow();
      asyncDataSubBanners();
    } catch (error) {
      handleError(error);
    }
  };
  const renderDemoSubBanner = () => (
    <Card title="Demo SubBanner" bordered={false}>
      <div className="main-top-home-container">
        <div className="main-top-home-sub-container">
          <MainMenu />
          <MainBanner />
          <div className="sub-banner-container">
            {subBannersIsShow.map((item, index) => (
              <div key={index}>
                <SubBannerItem banner={item.image} link={item.url} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
  const renderSubBannerList = () => (
    <Row gutter={[16, 16]}>
      {dataSubBanners.map((subBanner, index) => (
        <Col span={8} key={index}>
          <Card
            hoverable
            cover={
              <img alt={`SubBanner ${subBanner._id}`} src={subBanner.image} />
            }
            actions={[
              <Button
                type="primary"
                onClick={() => handleEditSubBanner(subBanner._id)}
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

  const renderEditSubBannerModal = () => (
    <Modal
      title={action === "add" ? "Thêm Sub Banner" : "Chỉnh sửa Sub Banner"}
      onOk={handleSaveSubBanner}
      onCancel={handleCancelEdit}
      okText="Save"
      cancelText="Cancel"
      open={openModalSubBaner}
    >
      <div>
        <Upload name="image" maxCount={1} onChange={handleImageChange}>
          <Button icon={<UploadOutlined />}>Upload Image</Button>
        </Upload>
        <Input
          value={subBannerCurrent.url}
          onChange={(e) =>
            setSubbannerCurrent({ ...subBannerCurrent, url: e.target.value })
          }
          placeholder="Url"
          style={{ marginTop: 10 }}
        />
        {action === "add" && (
          <Input
            type="number"
            min={1}
            defaultValue={1}
            value={subBannerCurrent.order}
            onChange={(e) =>
              setSubbannerCurrent({
                ...subBannerCurrent,
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
              checked={subBannerCurrent.isShow}
              onChange={(e) =>
                setSubbannerCurrent({
                  ...subBannerCurrent,
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

  const asyncDataSubBanners = async () => {
    try {
      setIsLoading(true);
      const response = await SubBannerService.getAllSubBanners();
      setDataSubBanners(response);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };
  const asyncDataSubBannersIsShow = async () => {
    try {
      setIsLoading(true);
      const response = await SubBannerService.getIsShowBanner();
      setSubBannersIsShow(response);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveOrder = async (id: string, newPosition: number) => {
    try {
      await SubBannerService.updateOrder(id, newPosition);
      message.success("Sắp xếp thành công");
      asyncDataSubBannersIsShow();
    } catch (error) {
      handleError(error);
    }
  };
  useEffect(() => {
    asyncDataSubBanners();
    asyncDataSubBannersIsShow();
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
          <h2>Customize SubBanners</h2>

          <Button
            type="dashed"
            onClick={() => {
              setOpenModalSubBanner(true);
              setAction("add");
            }}
            style={{ marginTop: 20, marginBottom: 20 }}
          >
            Thêm Sub Banner
          </Button>

          {dataSubBanners.length ? renderSubBannerList() : <Empty />}

          {renderEditSubBannerModal()}
        </div>
      </div>
      <div>
        <h2>Customize Order SubBanners</h2>
        <List
          className="menu-list-design"
          bordered
          dataSource={subBannersIsShow}
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

export default SubBannerDesign;

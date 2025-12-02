import { useEffect, useState } from "react";
import { Button, List, Space, message, Input, Card, Spin } from "antd";

import MainBanner from "../../components/top-home/main-banner";
import SubBanner from "../../components/top-home/sub-banner";
// Import dữ liệu từ menu.json

import { handleError } from "@/utils/catch-error";
import { MenuService } from "@/services/menu.service";
import MenuItem from "@/components/basicUI/menu-item";

interface SubCategory {
  name: string;
  url: string;
  subCategories: SubCategory[];
  order?: number;
}

interface MenuItem {
  name: string;
  url: string;
  imageLogo: string;
  subCategories: SubCategory[];
  order: number;
}

const MenuDesign = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]); // Sử dụng dữ liệu từ menu.json
  const [editedPositions, setEditedPositions] = useState<{
    [key: string]: number;
  }>({});
  const asyncFormatMenu = async () => {
    try {
      const response = await MenuService.getMenu();
      setMenuItems(response);
    } catch (error) {
      handleError(error);
    }
  };

  // Hàm xử lý lưu vị trí mới
  const handleSaveOrder = async (itemUrl: string) => {
    try {
      setIsLoading(true);
      await MenuService.updateMenuOrder(itemUrl, editedPositions[itemUrl]);
      message.success("Sắp xếp thành công");
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };
  const renderDemoBanner = () => (
    <Card title="Demo Banner" bordered={false}>
      <div className="main-top-home-container">
        <div className="main-top-home-sub-container">
          <div className="main-menu-container">
            {menuItems.map((item, index) => (
              <div key={index} className="menu-item-container">
                <MenuItem
                  title={item.name}
                  icon={item.imageLogo}
                  link={item.url}
                />
                {/* {hoveredMenu === index && RenderItemMenuModal(item.name, item.subCategories || [])} */}
              </div>
            ))}
          </div>
          <MainBanner />
          <SubBanner />
        </div>
      </div>
    </Card>
  );

  useEffect(() => {
    asyncFormatMenu();
    renderDemoBanner();
  }, [isLoading]);
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
          {renderDemoBanner()}
        </div>
        <List
          className="menu-list-design"
          bordered
          dataSource={menuItems}
          renderItem={(item) => (
            <List.Item key={item.url}>
              <Space style={{ width: "100%", justifyContent: "space-between" }}>
                <div>
                  <img
                    src={item.imageLogo}
                    alt={item.name}
                    style={{
                      width: "40px",
                      height: "40px",
                      marginRight: "10px",
                    }}
                  />
                  <strong>{item.name}</strong> - Order: {item.order}
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  {/* Nhập vị trí mới */}
                  <Input
                    type="number"
                    value={editedPositions[item.url] || ""}
                    onChange={(e) => {
                      setEditedPositions({
                        ...editedPositions,
                        [item.url]: parseInt(e.target.value, 10),
                      });
                    }}
                    style={{ width: "80px", marginRight: "10px" }}
                    placeholder="Enter position"
                  />
                  <Button
                    type="primary"
                    onClick={() => handleSaveOrder(item.url)}
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

export default MenuDesign;

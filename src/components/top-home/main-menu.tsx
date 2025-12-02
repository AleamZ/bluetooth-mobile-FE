import React, { useEffect, useState } from "react";
import MenuItem from "../basicUI/menu-item";
import { useNavigate } from "react-router-dom";
import { MenuService } from "@/services/menu.service";
import { handleError } from "@/utils/catch-error";

interface ItemMenuModal {
  title?: string;
  link?: string;
  url: string;
  name: string;
}

const MainMenu: React.FC = () => {
  const navigate = useNavigate();
  const [hoveredMenu, setHoveredMenu] = useState<number | null>(null);
  const [dataMenu, setDataMenu] = useState<any[]>([]);
  const asyncMenu = async () => {
    try {
      const response = await MenuService.getMenu();
      setDataMenu(response);
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    asyncMenu();
  }, []);
  const RenderItemMenuModal = (
    title: string,
    ListItemModal: ItemMenuModal[]
  ) => {
    return (
      <>
        {ListItemModal.length ? (
          <div className="Item-Modal-conatiner">
            <p className="Item-Modal-title">{title}</p>
            <ul className="Item-Modal-ul">
              {ListItemModal.map((item) => (
                <li
                  key={item.url}
                  className="Item-Modal-li"
                  onClick={() => navigate(`/category/${item.url}`)} // This is correct
                >
                  {item.name}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </>
    );
  };
  return (
    <div className="main-menu-container">
      {dataMenu.map((item, index) => (
        <div
          key={index}
          className="menu-item-container"
          onMouseEnter={() => setHoveredMenu(index)}
          onMouseLeave={() => setHoveredMenu(null)}
        >
          <MenuItem title={item.name} icon={item.imageLogo} link={item.url} />
          {hoveredMenu === index &&
            RenderItemMenuModal(item.name, item.subCategories || [])}
        </div>
      ))}
    </div>
  );
};

export default MainMenu;

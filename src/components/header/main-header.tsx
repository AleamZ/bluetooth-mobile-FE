import CartBlock from '../basicUI/cart-block'
import InputSearch from '../basicUI/input-search'
import LogoBlock from '../basicUI/logo-block'
import StoreLocation from '../basicUI/store-location'
import UserBlock from '../basicUI/user-block'
import { useScreenSize } from '../../hooks/useScreenSize'
import { useState, useEffect } from 'react'
import { IoMenu, IoClose } from 'react-icons/io5'
import { MenuService } from "@/services/menu.service"
import { handleError } from "@/utils/catch-error"
import MenuItem from "../basicUI/menu-item"
import { useNavigate, useLocation } from "react-router-dom"

const MainHeader = () => {
  const { isMobile } = useScreenSize()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [hoveredMenu, setHoveredMenu] = useState<number | null>(null);
  const [dataMenu, setDataMenu] = useState<any[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

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

  const handleMenuItemClick = async (url: string) => {
    console.log('Trying to navigate to:', url);
    if (!url) return;

    const formattedUrl = url.startsWith('/') ? url : `/${url}`;

    try {
      // Trước tiên navigate về homepage
      await navigate('/');

      // Sau đó đợi một chút và navigate đến trang đích
      setTimeout(() => {
        navigate(formattedUrl);
        setIsMenuOpen(false);
      }, 100);

      console.log('Navigation through homepage to:', formattedUrl);
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  useEffect(() => {
    console.log('Location changed to:', location.pathname);
  }, [location]);

  const RenderItemMenuModal = (title: string, subCategories: any[]) => {
    return (
      <>
        {subCategories?.length ? (
          <div className="Item-Modal-conatiner">
            <p className="Item-Modal-title">{title}</p>
            <ul className="Item-Modal-ul">
              {subCategories.map((item, idx) => (
                <li
                  key={idx}
                  className="Item-Modal-li"
                  onClick={() => handleMenuItemClick(item.url)}
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

  const MobileHeader = () => (
    <div className="main-header-mobile">
      <div className="main-header-mobile-top">
        <LogoBlock />
        <InputSearch />
        <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <IoClose size={32} /> : <IoMenu size={35} />}
        </button>
      </div>
      {isMenuOpen && (
        <div className="main-header-mobile-menu">
          <div className="main-menu-container">
            {dataMenu.map((item, index) => {
              console.log('Menu item:', item); // Debug menu item data
              return (
                <div
                  key={index}
                  className="menu-item-container"
                  onMouseEnter={() => setHoveredMenu(index)}
                  onMouseLeave={() => setHoveredMenu(null)}
                >
                  <div
                    onClick={() => {
                      console.log('Clicking menu item:', item.name, item.url);
                      handleMenuItemClick(item.url);
                    }}
                  >
                    <MenuItem title={item.name} icon={item.imageLogo} link={item.url} />
                  </div>
                  {hoveredMenu === index &&
                    RenderItemMenuModal(item.name, item.subCategories || [])}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  )

  const DesktopHeader = () => (
    <div className='main-header-subContainer'>
      <div className='main-header-fixed'>
        <LogoBlock />
        <StoreLocation />
      </div>
      <div className='main-header-not-fixed'>
        <InputSearch />
        <UserBlock />
        <CartBlock />
      </div>
    </div>
  )

  return (
    <div className="main-header-container">
      {isMobile ? <MobileHeader /> : <DesktopHeader />}
    </div >
  )
}

export default MainHeader
import React from "react";
import { Layout, Menu } from "antd";
import { Link, Outlet } from "react-router-dom";

const { Header, Content } = Layout;

const menuItems = [
  {
    key: "menu",
    label: <Link to="/design/menu">Menu</Link>,
  },
  {
    key: "banner",
    label: <Link to="/design/banner">Banner</Link>,
  },
  {
    key: "subbanner",
    label: <Link to="/design/subbanner">Subbanner</Link>,
  },
  {
    key: "homepageProduct",
    label: <Link to="/design/homepageProduct">Homepage Product</Link>,
  },
];

const Design: React.FC = () => {
  return (
    <Layout>
      <Header className="headerDesign">
        <div />
        <Menu
          className="menuDesign"
          theme="light"
          mode="horizontal"
          defaultSelectedKeys={["2"]}
          items={menuItems}
        />
      </Header>

      <Content className="contentDesign">
        <div className="content">
          <Outlet />
        </div>
      </Content>
    </Layout>
  );
};

export default Design;

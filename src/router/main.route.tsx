import AuthLayout from "@/layouts/auth.layout";
import LoginRegisterLayout from "@/layouts/login-register.layout";
import HomePage from "@/views/home/HomePage.view";
import DashboardLayout from "@/layouts/dashboard.layout";
import DashboardView from "@/views/dashboard/dashboard.view";
import Products from "@/views/dashboard/product";
import Orders from "@/views/dashboard/orders";
import BillOfLading from "@/views/dashboard/bill-of-lading";
import Customers from "@/views/dashboard/customers";
import Employees from "@/views/dashboard/employees";
import Design from "@/views/dashboard/design";
import Settings from "@/views/dashboard/settings";
import AddProduct from "@/views/dashboard/add-product";
import EditProduct from "@/views/dashboard/edit-product";
import Categories from "@/views/dashboard/categories";
import Login from "@/views/login_register/login.view";
import Register from "@/views/login_register/register.view";
import { Route, Routes } from "react-router-dom";
import ProductDetail from "@/views/product/product-detail";
import ProductDetailLayout from "@/layouts/product-detail.layout";
import MenuComponent from "@/views/dashboard/design.menu";
import BannerComponent from "@/views/dashboard/design.banner";
import HomepageProductComponent from "@/views/dashboard/design.homepageproduct";
import SubbannerComponent from "@/views/dashboard/design.subbaner";
import Blog from "@/views/dashboard/blog.view";
import Category from "@/layouts/category.layout";
import Brand from "@/layouts/brand.layout";
import Specifications from "@/views/dashboard/specifications.view";
import SalePage from "@/views/dashboard/sale.view";
import AddSale from "@/views/dashboard/add-event";
import DataSpecification from "@/views/dashboard/data-specifications";
import Promotion from "@/views/promotion/promotion.view";
import BlogView from "@/views/blog/blog";
import PrivateRoute from "./private.route";

const MainRoutes = () => {
  return (
    <>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/promotion" element={<Promotion />} />
          <Route path="/*" element={<Category />} />
          <Route path="/:category/:brand" element={<Brand />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/blog/:id" element={<BlogView />} />
          <Route
            path="/product-detail-layout/:name"
            element={<ProductDetailLayout />}
          />
        </Route>
        <Route element={<PrivateRoute />}>

          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardView />} />
            <Route path="/products" element={<Products />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/bill-of-lading" element={<BillOfLading />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/even" element={<SalePage />} />
            <Route path="/even/addEvent" element={<AddSale />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="specifications" element={<Specifications />} />
            <Route path="view-specifications" element={<DataSpecification />} />
            <Route element={<Design />}>
              <Route path="/design/menu" element={<MenuComponent />} />
              <Route path="/design/banner" element={<BannerComponent />} />
              <Route path="/design/homepageProduct" element={<HomepageProductComponent />} />
              <Route path="/design/subbanner" element={<SubbannerComponent />} />
            </Route>
            <Route path="/settings" element={<Settings />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/edit-product/:id" element={<EditProduct />} />
          </Route>
        </Route>

        <Route element={<LoginRegisterLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
      </Routes>
    </>
  );
};

export default MainRoutes;

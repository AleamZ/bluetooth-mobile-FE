import { Outlet } from "react-router-dom";
import "../styles/Scss-Layout/dashboard.layout.scss";
import MenuDashboard from "@/components/dashboard/menu-dashboard";
const DashboardLayout = () => {
    return (
        <div className="dashboard-layout">
            <MenuDashboard />
            <div className="content">
                <Outlet />
            </div>
        </div>
    );
};

export default DashboardLayout;

import DashboardAnalysis from "@/components/dashboard/dashboard-analysis";
import TopProducts from "@/components/dashboard/top-products";
import RevenueChart from "@/components/dashboard/revenue-chart";
import FormOverview from "@/components/dashboard/dashboard-overview";

const DashboardView = () => {


    return (
        <div >
            <h1 >Dashboard</h1>
            <div>
                <FormOverview></FormOverview>
            </div>
            {/* Bao bọc hai component trong một div sử dụng flexbox */}
            <div className="dashboard-analysis-container flex">
                <DashboardAnalysis /> {/* Component phân tích */}
                <TopProducts /> {/* Component top sản phẩm */}
            </div>
            <div className="revenue-chart">
                <RevenueChart />
            </div>

        </div>
    );
};

export default DashboardView;

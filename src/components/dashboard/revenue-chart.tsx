import { useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import dataRevenueChart from "../../data/data-revenue-chart.json";

// Định nghĩa kiểu dữ liệu
type TimePeriod = "day" | "month" | "quarter" | "year";
type DataItem = { time: string; revenue: number };
type DataStructure = {
    day: DataItem[];
    month: DataItem[];
    quarter: DataItem[];
    year: DataItem[];
};

const RevenueChart = () => {
    const [timePeriod, setTimePeriod] = useState<TimePeriod>("day");
    const data: DataStructure = dataRevenueChart; // Sử dụng dữ liệu từ JSON

    // Debug log
    console.log("Data imported from JSON:", dataRevenueChart);
    console.log("Data used for chart:", data[timePeriod]);

    // Kiểm tra dữ liệu
    if (!data[timePeriod] || data[timePeriod].length === 0) {
        console.error("No data available for the selected time period:", timePeriod);
        return <div>No data available for the selected time period.</div>;
    }

    return (
        <div className={"revenue-chart-container"}>
            {/* Hàng chứa tiêu đề và dropdown */}
            <div className={"header-row"}>
                <h1>Biểu Đồ Doanh Thu</h1>
                <div className={"time-period-selector"}>
                    <label htmlFor="time-period"></label>
                    <select
                        id="time-period"
                        value={timePeriod}
                        onChange={(e) => setTimePeriod(e.target.value as TimePeriod)}
                    >
                        <option value="day">Ngày</option>
                        <option value="month">Tháng</option>
                        <option value="quarter">Quý</option>
                        <option value="year">Năm</option>
                    </select>
                </div>
            </div>

            {/* Biểu đồ */}
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data[timePeriod]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis label={{ angle: -90, position: "insideLeft" }} />
                    <Tooltip formatter={(value) => `${value.toLocaleString()} VND`} />
                    <Legend />
                    <Bar dataKey="revenue" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>

        </div>
    );
};

export default RevenueChart;

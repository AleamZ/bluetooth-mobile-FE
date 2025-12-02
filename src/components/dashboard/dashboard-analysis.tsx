import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    InteractionMode
} from "chart.js";
import data from "@/data/data-phantich.json"; // Đường dẫn file JSON

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    {
        id: 'verticalLine',
        beforeDraw: (chart) => {
            if (chart.tooltip?.getActiveElements()?.length) {
                const ctx = chart.ctx;
                const activePoint = chart.tooltip.getActiveElements()[0];
                const x = activePoint.element.x;
                const topY = chart.scales.y.top;
                const bottomY = chart.scales.y.bottom;

                ctx.save();
                ctx.beginPath();
                ctx.moveTo(x, topY);
                ctx.lineTo(x, bottomY);
                ctx.lineWidth = 1;
                ctx.strokeStyle = '#5c94fc'; // Màu của đường kẻ dọc
                ctx.stroke();
                ctx.restore();
            }
        },
    }
);

// Khai báo kiểu dữ liệu cho metricMap
type MetricKey = "revenue" | "orders" | "visitors" | "conversion";

interface MetricData {
    name: string;
    unit: string;
    data: {
        today: number[];
        yesterday: number[];
    };
}

// Hàm định dạng số
const formatNumber = (value: number): string => {
    let formattedValue: string;
    if (value >= 1_000_000_000) {
        formattedValue = `${(value / 1_000_000_000).toFixed(1)}B`; // Tỉ
    } else if (value >= 1_000_000) {
        formattedValue = `${(value / 1_000_000).toFixed(1)}M`; // Triệu
    } else if (value >= 1_000) {
        formattedValue = `${(value / 1_000).toFixed(1)}K`; // Nghìn
    } else {
        formattedValue = value.toFixed(1); // Giá trị nhỏ hơn nghìn
    }

    // Đảm bảo tất cả giá trị đều có đúng 6 ký tự
    return formattedValue.padStart(6, " ");
};

const DashboardAnalysis: React.FC = () => {
    const [selectedMetric, setSelectedMetric] = useState<MetricKey>("visitors");

    // Định nghĩa metricMap với kiểu cụ thể
    const metricMap: Record<MetricKey, MetricData> = {
        revenue: { name: "Doanh thu (đ)", unit: "VND", data: data.revenue },
        orders: { name: "Đơn Hàng", unit: "Đơn", data: data.orders },
        visitors: { name: "Khách truy cập", unit: "Lượt", data: data.visitors },
        conversion: { name: "Tỷ lệ chuyển đổi", unit: "%", data: data.conversion },
    };

    const handleClick = (metric: MetricKey) => {
        setSelectedMetric(metric);
    };

    const fullLabels = Array.from({ length: 24 }, (_, i) => `${i}h`);

    // Lấy giá trị nhỏ nhất và lớn nhất từ dữ liệu được chọn


    const chartData = {
        labels: fullLabels,
        datasets: [
            {
                label: `${metricMap[selectedMetric].name} Hôm nay`,
                data: metricMap[selectedMetric].data.today,
                borderColor: "#5c94fc", // Màu đường line
                backgroundColor: "rgba(92, 148, 252, 0.3)", // Vệt sáng nhạt bên dưới
                fill: "origin", // Tạo vệt sáng từ đường line xuống trục hoành
                tension: 0.3, // Đường cong nhẹ
                pointRadius: 0, // Tắt điểm chấm trên line
                pointHoverRadius: 6, // Hiển thị chấm khi hover
            },
            {
                label: `${metricMap[selectedMetric].name} Hôm qua`,
                data: metricMap[selectedMetric].data.yesterday,
                borderColor: "#9e9e9e", // Màu đường line
                backgroundColor: "rgba(158, 158, 158, 0.3)", // Vệt sáng nhạt bên dưới
                fill: "origin", // Tạo vệt sáng từ đường line xuống trục hoành
                tension: 0.3,
                pointRadius: 0,
                pointHoverRadius: 6,
            },
        ],
    };




    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: "top" as const,
                labels: {
                    boxWidth: 12,
                    boxHeight: 12,
                    padding: 8,
                },
            },
            tooltip: {
                mode: 'index' as InteractionMode,
                intersect: false,
                callbacks: {
                    label: (context: any) => {
                        const value = context.raw;
                        return `${context.dataset.label}: ${formatNumber(value)} ${metricMap[selectedMetric].unit}`;
                    },
                    afterLabel: (context: any) => {
                        const todayValue = context.raw;
                        const yesterdayValue =
                            metricMap[selectedMetric].data.yesterday[context.dataIndex];
                        const difference = todayValue - yesterdayValue;
                        const percentageChange = yesterdayValue
                            ? ((difference / yesterdayValue) * 100).toFixed(1)
                            : '0.0';
                        return `So với hôm qua: ${difference > 0 ? '+' : ''}${formatNumber(
                            difference
                        )} (${percentageChange}%)`;
                    },
                },
            },
        },
        interaction: {
            mode: 'index' as InteractionMode,
            intersect: false,
        },
        layout: {
            padding: {
                top: 20,
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Thời gian (giờ)",
                },
                grid: {
                    drawOnChartArea: false, // Không hiển thị lưới ngang
                },
                ticks: {
                    callback: (value: string | number, index: number) => {
                        if (typeof value === "number" && [0, 6, 12, 18, 23].includes(index)) {
                            return fullLabels[index];
                        }
                        return null;
                    },
                },
            },
            y: {
                beginAtZero: false,
                grid: {
                    drawOnChartArea: true,
                },
                ticks: {
                    callback: (tickValue: string | number) => {
                        if (typeof tickValue === "number") {
                            return formatNumber(tickValue);
                        }
                        return tickValue;
                    },
                },
            },
        },
    } as const;



    return (
        <div className="dashboard-analysis">
            <div className="dashboard-analysis-header">
                <h1>Phân tích nâng cao</h1>
            </div>
            <div className="dashboard-analysis-content">
                <div className="dashboard-analysis-content-chart">
                    <Line data={chartData} options={chartOptions} />
                </div>
                <div className="dashboard-analysis-content-buttons">
                    {Object.keys(metricMap).map((key) => (
                        <button
                            key={key}
                            onClick={() => handleClick(key as MetricKey)}
                            className={`dashboard-analysis-button btn ${selectedMetric === key ? "active" : ""}`}
                        >
                            {metricMap[key as MetricKey].name}
                            <br />
                            <span>
                                {formatNumber(
                                    metricMap[key as MetricKey].data.today[
                                    metricMap[key as MetricKey].data.today.length - 1
                                    ] || 0
                                )}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DashboardAnalysis;
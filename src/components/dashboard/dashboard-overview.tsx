import React, { useEffect, useState } from 'react';
import { DashboardService } from '../../services/dashboard.service';
import MOverview from '../basicUI/m-overview';

interface IFormOverviewData {
    totalOrders: number;
    totalCart: number;
    totalPending: number;
    totalApproved: number;
    totalDelivered: number;
    totalCanceled: number;
}

const FormOverview: React.FC = () => {
    const [overviewData, setOverviewData] = useState<IFormOverviewData>({
        totalOrders: 0,
        totalCart: 0,
        totalPending: 0,
        totalApproved: 0,
        totalDelivered: 0,
        totalCanceled: 0,
    });
    const fetchOverview = async () => {
        try {
            const data = await DashboardService.getOverview();

            setOverviewData({
                totalOrders: data.totalOrders ?? 2,
                totalCart: data.totalCart ?? 2,
                totalPending: data.totalPending ?? 2,
                totalApproved: data.totalApproved ?? 2,
                totalDelivered: data.totalDelivered ?? 2,
                totalCanceled: data.totalCanceled ?? 2,
            });
        } catch (error) {
            console.error("Error fetching overview data:", error);
        }
    };

    const {
        totalOrders,
        totalCart,
        totalPending,
        totalApproved,
        totalDelivered,
        totalCanceled,
    } = overviewData;


    useEffect(() => {
        fetchOverview();
    }, []);
    return (
        <div className="dashboard-overview">
            <MOverview label="Tổng đơn hàng" value={totalOrders} />
            <MOverview label="Tổng giỏ hàng" value={totalCart} />
            <MOverview label="Đơn hàng chờ xử lý" value={totalPending} />
            <MOverview label="Đơn hàng đã duyệt" value={totalApproved} />
            <MOverview label="Đơn hàng đã giao" value={totalDelivered} />
            <MOverview label="Đơn hàng đã hủy" value={totalCanceled} />
        </div>
    );
};

export default FormOverview;

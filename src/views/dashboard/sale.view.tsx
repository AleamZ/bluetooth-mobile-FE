import React, { useState, useEffect } from "react";
import { Table, Button, Spin, message } from "antd";
import axios from "axios";
import fakedata from "@/data/sale-fake-data.json";
import { useNavigate } from "react-router-dom";

interface IEvent {
  id: string;
  name: string;
  info: string;
  description: string;
  startTime: string;
  endTime: string;
}

const SalePage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [events, setSales] = useState<IEvent[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchSales = async () => {
      setIsLoading(true);
      try {
        // Simulate fetching data from fakedata
        setSales(
          fakedata.map((item) => ({
            id: item._id,
            name: item.name,
            info: item.url,
            description: item.description,
            startTime: item.timeStart,
            endTime: item.timeEnd,
          }))
        );
      } catch (error) {
        message.error("Failed to fetch events data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSales();
  }, []);

  const handleDelete = async (eventId: string) => {
    setIsLoading(true);
    try {
      await axios.delete(
        `${import.meta.env.VITE_APP_API_URL}/events/${eventId}`
      );
      setSales(events.filter((event) => event.id !== eventId));
      message.success("Sale deleted successfully");
    } catch (error) {
      message.error("Failed to delete event");
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    {
      title: "Tên Sale",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Thời gian áp dụng",
      dataIndex: "startTime",
      key: "startTime",
      render: (record: IEvent) => (
        <span>{`${record.startTime} - ${record.endTime}`}</span>
      ),
    },
    {
      title: "Tương tác",
      key: "action",
      render: (record: IEvent) => (
        <div>
          <Button type="link">Edit</Button>
          <Button type="link" onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Spin spinning={isLoading}>
      <div className="event-page-container">
        <h1 className="event-page-title">Even Page</h1>
        <Button
          type="primary"
          onClick={() => navigate("/even/addEvent")}
          style={{ marginBottom: 16 }}
        >
          Thêm Chương Trình
        </Button>
        <Table columns={columns} dataSource={events} rowKey="id" />
      </div>
    </Spin>
  );
};

export default SalePage;

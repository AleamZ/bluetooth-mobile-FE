import { PromotionService } from "@/services/promotion.service";
import { IPromotion } from "@/types/promotion/promotion.interface";
import { handleError } from "@/utils/catch-error";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const EventReminder = () => {
  const navigate = useNavigate();
  const [dataEvent, setDataEvent] = useState<IPromotion>();
  const asyncDataEvent = async () => {
    try {
      const response = await PromotionService.getPromotionActive();
      setDataEvent(response);
    } catch (error) {
      handleError(error);
    }
  };
  useEffect(() => {
    asyncDataEvent();
  }, []);
  return (
    <>
      <div
        className="event-remider-container"
        style={{ backgroundColor: `${dataEvent?.colorNavigation}` }}
        onClick={() => navigate("/promotion")}
      >
        <p className="event-reminder-content">{dataEvent?.nameEvent}</p>
      </div>
    </>
  );
};

export default EventReminder;

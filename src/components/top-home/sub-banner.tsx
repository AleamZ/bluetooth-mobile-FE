import React, { useEffect, useState } from "react";
import SubBannerItem from "../basicUI/sub-banner-item";
import { ISubBanner } from "@/types/sub-banner/sub-banner.interface";
import { handleError } from "@/utils/catch-error";
import { SubBannerService } from "@/services/sub-banner.service";

const SubBanner: React.FC = () => {
  const [subBanner, setSubBanner] = useState<ISubBanner[]>([]);
  const asyncDataSubBannersIsShow = async () => {
    try {
      const response = await SubBannerService.getIsShowBanner();
      setSubBanner(response);
    } catch (error) {
      handleError(error);
    }
  };
  useEffect(() => {
    asyncDataSubBannersIsShow();
  }, []);
  return (
    <div className="sub-banner-container">
      {subBanner.map((item, index) => (
        <div key={index}>
          <SubBannerItem banner={item.image} link={item.url} />
        </div>
      ))}
    </div>
  );
};

export default SubBanner;

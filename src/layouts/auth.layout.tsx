import EventReminder from "@/components/header/event-reminder";
import MainHeader from "@/components/header/main-header";
import QuickPolicy from "@/components/header/quick-policy";
import SubHeader from "@/components/header/sub-header";
import { Outlet } from "react-router-dom";
import InformationAndPolicy from "@/components/footer/information-and-policy";
import InformationPolicyData from "@/data/information-and-policy.json";
import ServicesAndOtherInformationData from "@/data/services-and-other-information.json";
import Copyright from "@/components/footer/copyright";
import HotlineSupport from "@/components/footer/hotline-support";
import ContactChannels from "@/components/footer/contact-channels";
import ContactChannelsData from "@/data/contact-channels.json";
import PaymentMethodData from "@/data/payment-method.json";
import MBtnBackToTop from '@/components/basicUI/m-btn-backtotop';

const AuthLayout = () => {
  return (
    <div>
      <div className="auth-header">
        <EventReminder />
        <QuickPolicy />
        <MainHeader />
      </div>
      <SubHeader />
      <div className="content-wrapper">
        <Outlet />
      </div>
      <div className="footer-box-shadow">
        <div className="auth-footer">
          <div className="footer-box HotlineSupport">
            <HotlineSupport />
          </div>
          <div className="footer-box InformationAndPolicy">
            <InformationAndPolicy
              title={InformationPolicyData.title}
              content={InformationPolicyData.content}
            />
          </div>
          <div className="footer-box InformationAndPolicy">
            <InformationAndPolicy
              title={ServicesAndOtherInformationData.title}
              content={ServicesAndOtherInformationData.content}
            />
          </div>
          <div className="footer-box ">
            <ContactChannels
              title={ContactChannelsData.title}
              iconItems={ContactChannelsData.icons}
            />
            <ContactChannels
              title={PaymentMethodData.title}
              iconItems={PaymentMethodData.icons}
            />
          </div>
        </div>
      </div>
      <Copyright />
      <MBtnBackToTop />
    </div>
  );
};

export default AuthLayout;

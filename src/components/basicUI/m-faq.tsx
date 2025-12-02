import { Collapse } from "antd";
import { CaretRightOutlined } from "@ant-design/icons";

const { Panel } = Collapse;

interface FAQItem {
  question: string;
  answer?: string;
}

interface FAQProps {
  faqs: FAQItem[];
}

const MFAQ: React.FC<FAQProps> = ({ faqs }) => {
  return (
    <div className="faq-container">
      <h2 className="faq-title">CÂU HỎI THƯỜNG GẶP</h2>
      <Collapse
        bordered={false}
        expandIcon={({ isActive }) => (
          <CaretRightOutlined rotate={isActive ? 90 : 0} />
        )}
        className="faq-collapse"
      >
        {faqs.map((faq, index) => (
          <Panel header={faq.question} key={index} className="faq-panel">
            {faq.answer && <p className="faq-answer">{faq.answer}</p>}
          </Panel>
        ))}
      </Collapse>
    </div>
  );
};

export default MFAQ;

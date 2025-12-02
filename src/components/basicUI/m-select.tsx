import { Select } from "antd";
import { Option } from "antd/es/mentions";
import React from "react";

type Option = {
  value: string;
  label: string;
};
interface ISelectProps {
  options: Option[];
  onChange?: (value: any) => void;
  value?: any;
}
const MSelect: React.FC<ISelectProps> = ({ options, onChange, value }) => {
  return (
    <>
      <Select
        className="select"
        placeholder="Chọn thương hiệu"
        value={value}
        onChange={onChange}
      >
        {options.map((item: any) => (
          <Option value={item.value}>{item.label}</Option>
        ))}
      </Select>
    </>
  );
};

export default MSelect;

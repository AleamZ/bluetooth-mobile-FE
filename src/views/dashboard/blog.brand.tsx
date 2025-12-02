import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useState } from "react";
import { Button } from "antd";

const BlogBrand = () => {
  const [content, setContent] = useState("");

  const handleChange = (value: string) => {
    setContent(value);
  };

  const handleSubmit = () => {
    // Logic để submit nội dung
    console.log("Nội dung đã được đăng:", content);
  };

  return (
    <div>
      <div
        style={{
          background: "white",
          padding: "20px",
          border: "1px solid #dfdfdf",
          borderRadius: "20px",
        }}
      >
        <ReactQuill value={content} onChange={handleChange} />
      </div>
      <Button onClick={handleSubmit}>Đăng Bài</Button>
    </div>
  );
};

export default BlogBrand;

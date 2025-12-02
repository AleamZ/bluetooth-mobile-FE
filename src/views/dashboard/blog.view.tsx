import React, { useState, useEffect, useRef, useCallback } from "react";
import ReactQuill from "react-quill";
import { Button, message, Spin, Upload } from "antd";
import { TagService } from "@/services/tag.service";
import debounce from "lodash.debounce";
import { CategoryNewService } from "@/services/category-new.service";
import { BlogService } from "@/services/blog.service";
import { handleError } from "@/utils/catch-error";
import { UploadService } from "../../services/upload.service";

import { UploadOutlined } from "@ant-design/icons";

interface IFormDataBlog {
  title: string;
  content: string;
  categoryNewId: string;
  tags: string[];
  image: string;
}
interface IMockTags {
  name: string;
  id: string;
}
const Blog: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dataCategoriesNew, setDataCategoriesNew] = useState([]);
  const [mockTags, setMockTags] = useState<IMockTags[]>([
    {
      name: "",
      id: "",
    },
  ]);
  const [tagInput, setTagInput] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [formDataBlog, setFormDataBlog] = useState<IFormDataBlog>({
    title: "",
    content: "",
    categoryNewId: "",
    tags: [],
    image: "",
  });
  const wrapperRef = useRef<HTMLDivElement>(null);
  const handleChange = (value: string) => {
    setFormDataBlog((prev) => ({
      ...prev,
      content: value,
    }));
  };
  //Get category new
  const asyncDataCategoriesNew = async () => {
    try {
      setIsLoading(true);
      const response = await CategoryNewService.getCategoriesNewActive();
      const mapData = response.map((item: any) => ({
        value: item._id,
        label: item.name,
      }));
      mapData.unshift({ label: "Chọn danh mục", value: "" });
      setDataCategoriesNew(mapData);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  //get propose tag and handle debounce
  const asyncProposeTag = async (input: string) => {
    if (!input.trim()) {
      setMockTags([]);
      return;
    }
    try {
      const response = await TagService.getProposeTag(input);
      const mapData = response.map((item: any) => ({
        id: item._id,
        name: item.name,
      }));
      setMockTags(mapData);
    } catch (error) {
      console.log(error);
    }
  };
  const debouncedFetchTags = useCallback(debounce(asyncProposeTag, 600), []);
  useEffect(() => {
    debouncedFetchTags(tagInput);
    return () => debouncedFetchTags.cancel();
  }, [tagInput, debouncedFetchTags]);
  useEffect(() => {
    asyncDataCategoriesNew();
  }, []);
  const handleSubmit = async () => {
    const payloadBlog = {
      title: formDataBlog.title,
      content: formDataBlog.content,
      categoryNewId: formDataBlog.categoryNewId,
      tags: selectedTags,
      image: formDataBlog.image,
    };
    try {
      setIsLoading(true);

      await TagService.createTag({ tags: selectedTags });
      await BlogService.createBlog(payloadBlog);
      message.success("Tạo bài viết thành công");
      setFormDataBlog({
        title: "",
        content: "",
        categoryNewId: "",
        tags: [],
        image: "",
      });
      setSelectedTags([]);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle tag input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTagInput(value);
    setShowSuggestions(true);
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault();
      addTag(tagInput.trim());
    }
  };
  // Add tag
  const addTag = (tagName: string) => {
    if (!selectedTags.includes(tagName)) {
      setSelectedTags([...selectedTags, tagName]);
    }
    setTagInput("");
    setShowSuggestions(false);
  };

  // Remove tag
  const removeTag = (tagName: string) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== tagName));
  };

  // Filter suggestions
  const suggestions = mockTags
    .filter((tag) => tag?.name?.toLowerCase().includes(tagInput.toLowerCase()))
    .filter((tag) => !selectedTags.includes(tag?.name));

  // Modify image upload handler
  const handleImageUpload = async ({ file, fileList }: any) => {
    console.log({ fileList });
    try {
      const response = await UploadService.uploadSingle(file.originFileObj);
      if (response && response[0]) {
        setFormDataBlog((prev) => ({
          ...prev,
          image: response[0],
        }));
        message.success("Upload ảnh thành công");
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Spin spinning={isLoading}>
      <div>
        <h1>Blog</h1>
        <div>
          <h3>Tiêu đề Blog</h3>
          <input
            type="text"
            placeholder="Nhập tiêu đề blog"
            value={formDataBlog.title}
            onChange={(e) =>
              setFormDataBlog((prev) => ({ ...prev, title: e.target.value }))
            }
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: "16px",
              borderRadius: "4px",
              border: "1px solid #d9d9d9",
            }}
          />
        </div>
      </div>
      <div
        ref={wrapperRef}
        className="tag-input-container"
        style={{ width: "100%", position: "relative" }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            marginBottom: "10px",
          }}
        >
          {selectedTags.map((tag) => (
            <div
              key={tag}
              style={{
                background: "#e6f4ff",
                padding: "4px 8px",
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <span>{tag}</span>
              <button
                onClick={() => removeTag(tag)}
                style={{
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  padding: "0 4px",
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {/* Tag Input */}
        <input
          type="text"
          value={tagInput}
          onChange={handleInputChange}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          placeholder="Nhập tag (bắt đầu với #)"
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #d9d9d9",
          }}
        />

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              width: "100%",
              maxHeight: "200px",
              overflowY: "auto",
              background: "white",
              border: "1px solid #d9d9d9",
              borderRadius: "4px",
              zIndex: 1000,
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            {suggestions.map((tag, index) => (
              <div
                key={index}
                onClick={() => addTag(tag.name)}
                style={{
                  padding: "8px",
                  cursor: "pointer",
                }}
              >
                {tag.name}
              </div>
            ))}
          </div>
        )}
      </div>
      <div>
        <h3>Danh mục</h3>
        <select
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "16px",
            borderRadius: "4px",
            border: "1px solid #d9d9d9",
          }}
          value={formDataBlog.categoryNewId}
          onChange={(e) =>
            setFormDataBlog((prev) => ({
              ...prev,
              categoryNewId: e.target.value,
            }))
          }
        >
          {dataCategoriesNew.map((categoryNew: any) => (
            <option value={categoryNew.value}>{categoryNew.label}</option>
          ))}
        </select>
      </div>
      <div>
        <h3>Ảnh bài viết</h3>
        <Upload onChange={handleImageUpload}>
          <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
        </Upload>
        {formDataBlog.image && (
          <div style={{ marginTop: 16, marginBottom: 16 }}>
            <img
              src={formDataBlog.image}
              alt="Preview"
              style={{
                maxWidth: "200px",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            />
          </div>
        )}
      </div>
      <div>
        <div
          style={{
            background: "white",
            padding: "20px",
            border: "1px solid #dfdfdf",
            borderRadius: "6px",
          }}
        >
          <ReactQuill value={formDataBlog.content} onChange={handleChange} />
        </div>
        <Button style={{ marginTop: 12 }} onClick={handleSubmit}>
          Đăng Bài
        </Button>
      </div>
    </Spin>
  );
};

export default Blog;

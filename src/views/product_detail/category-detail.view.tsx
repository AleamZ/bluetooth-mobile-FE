import React, { useState } from "react";
import MSwiper from "@/components/basicUI/m-swiper";
import {
  AiFillTruck,
  AiFillCaretDown,
  AiOutlinePercentage,
} from "react-icons/ai";
import { CiMoneyBill } from "react-icons/ci";
import { FaSortAmountDown, FaSortAmountDownAlt, FaEye } from "react-icons/fa";
import { HiOutlineChevronRight } from "react-icons/hi";
import { FaNewspaper, FaFilter } from "react-icons/fa6";
import { ImCompass } from "react-icons/im";
import Card from "@/components/basicUI/card";
import { Button, Col, Input, Row, Slider, Spin } from "antd";
import MBtn from "@/components/basicUI/m-btn";
import { useNavigate } from "react-router-dom";
import { handleError } from "@/utils/catch-error";
import { ProductService } from "@/services/product.service";
import { IProduct, IVariant } from "@/types/product/product.interface";

const { TextArea } = Input;

interface ButtonFilterProps {
  icon: React.ReactElement;
  title: string;
  render?: () => React.ReactNode;
  isShow?: boolean;
  onClick?: () => void;
  key: string;
}
interface Article {
  image: string;
  title: string;
  link: string;
}

interface NormalQuestion {
  question: string;
  answer: string;
}

const imageList = [
  "https://cdn2.cellphones.com.vn/insecure/rs:fill:595:100/q:80/plain/https://dashboard.cellphones.com.vn/storage/samsung-pha-19-2-cate.png",
  "https://cdn2.cellphones.com.vn/insecure/rs:fill:595:100/q:80/plain/https://dashboard.cellphones.com.vn/storage/samsung-a16-4g-cate.png",
  "https://cdn2.cellphones.com.vn/insecure/rs:fill:595:100/q:80/plain/https://dashboard.cellphones.com.vn/storage/cate-GALAXY-A16-5G-8GB-128GB-t11.png",
];

const sortList: ButtonFilterProps[] = [
  {
    icon: <FaSortAmountDown />,
    title: "Giá Cao - Thấp",
    key: "sort-descending",
  },
  {
    icon: <FaSortAmountDownAlt />,
    title: "Giá Thấp - Cao",
    key: "sort-ascending",
  },
  {
    icon: <AiOutlinePercentage />,
    title: "Khuyến Mãi Hot",
    key: "sale",
  },
  {
    icon: <FaEye />,
    title: "Xem nhiều",
    key: "view",
  },
];

const articleList: Article[] = [
  {
    image:
      "https://cdn-media.sforum.vn/storage/app/media/wp-content/uploads/2023/06/top-5-smartphone-ban-chay-nhat-tai-cellphones-1-2-1.jpg",
    title: "Trên tay Xiaomi Pad 6S Pro: Màn hình lớn 12.4 inch...",
    link: "https://example.com/xiaomi-pad-6s-pro",
  },
  {
    image:
      "https://cdn-media.sforum.vn/storage/app/media/wp-content/uploads/2023/06/top-5-smartphone-ban-chay-nhat-tai-cellphones-1-2-1.jpg",
    title: "Trên tay Xiaomi Pad 6S Pro: Màn hình lớn 12.4 inch...",
    link: "https://example.com/xiaomi-pad-6s-pro",
  },
  {
    image:
      "https://cdn-media.sforum.vn/storage/app/media/wp-content/uploads/2023/06/top-5-smartphone-ban-chay-nhat-tai-cellphones-1-2-1.jpg",
    title: "Trên tay Xiaomi Pad 6S Pro: Màn hình lớn 12.4 inch...",
    link: "https://example.com/xiaomi-pad-6s-pro",
  },
  {
    image:
      "https://cdn-media.sforum.vn/storage/app/media/wp-content/uploads/2023/06/top-5-smartphone-ban-chay-nhat-tai-cellphones-1-2-1.jpg",
    title: "Trên tay Xiaomi Pad 6S Pro: Màn hình lớn 12.4 inch...",
    link: "https://example.com/xiaomi-pad-6s-pro",
  },
];

const normalQuestionList: NormalQuestion[] = [
  {
    question: "Điện thoại thông minh là gì?",
    answer:
      "Điện thoại thông minh là thiết bị di động có hệ điều hành, cho phép cài đặt ứng dụng và kết nối internet.",
  },
  {
    question: "Sự khác biệt giữa Android và iOS là gì?",
    answer:
      "Android là hệ điều hành mã nguồn mở của Google, trong khi iOS là hệ điều hành độc quyền của Apple.",
  },
  {
    question: "Những yếu tố nào quan trọng khi chọn mua điện thoại?",
    answer:
      "Các yếu tố quan trọng bao gồm hiệu năng, dung lượng pin, camera, màn hình và hệ điều hành.",
  },
  {
    question: "Làm thế nào để kéo dài tuổi thọ pin điện thoại?",
    answer:
      "Có thể kéo dài tuổi thọ pin bằng cách giảm độ sáng màn hình, tắt ứng dụng không cần thiết và sử dụng chế độ tiết kiệm pin.",
  },
  {
    question: "Công nghệ sạc nhanh hoạt động như thế nào?",
    answer:
      "Công nghệ sạc nhanh tăng công suất sạc giúp nạp pin nhanh hơn bằng cách điều chỉnh điện áp và cường độ dòng điện phù hợp.",
  },
];

interface IPropsCategoryDetail {
  setProducts: React.Dispatch<React.SetStateAction<IProduct[]>>;
  products: IProduct[];
  specifications?: any[];
}

const CategoryDetail: React.FC<IPropsCategoryDetail> = ({
  setProducts,
  products,
  specifications,
}) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpenPrice, setIsOpenPrice] = useState(false);
  const [isOpenIn, setIsOpenIn] = useState(false);
  const [moocOne, setMoocOne] = useState(0);
  const [moocTwo, setMoocTwo] = useState(10000000);
  const [showAll, setShowAll] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<any[]>([]);
  const renderArticle = ({ image, title, link }: Article) => {
    return (
      <div className="category-article-item">
        <img className="category-article-img" src={image} alt="img-news" />
        <a style={{ textDecoration: "none" }} href={link}>
          <p className="category-article-p">{title}</p>
        </a>
      </div>
    );
  };
  const renderNormalQuestion = ({ question, answer }: NormalQuestion) => {
    const [showAns, setShowAns] = useState(false);
    const handleClick = () => {
      setShowAns(!showAns);
    };
    return (
      <div className="category-infor-QA-box">
        <div className="category-infor-question" onClick={handleClick}>
          {question} <HiOutlineChevronRight />
        </div>
        {showAns && <div className="category-infor-answer">{answer}</div>}
      </div>
    );
  };
  const handleSliderChange = (values: any) => {
    setMoocTwo(values[1]);
    setMoocOne(values[0]);
  };
  const modalFilterPrice = () => {
    return (
      <div className="price-filter-modal">
        <div className="price-filter-modal-price">
          <p className="price-filter-modal-p">
            {moocOne.toLocaleString("vi-VN")}đ
          </p>
          <p className="price-filter-modal-p">
            {moocTwo.toLocaleString("vi-VN")}đ
          </p>
        </div>
        <Slider
          range
          defaultValue={[moocOne, moocTwo]}
          disabled={false}
          max={40000000}
          onChange={handleSliderChange}
          tooltip={{ formatter: null }}
        />
        <div className="price-filter-modal-button">
          <Button
            className="price-filter-modal-btn"
            onClick={() => setIsOpenPrice(!isOpenPrice)}
          >
            Đóng
          </Button>
          <Button className="price-filter-modal-btn">Xem kết quả</Button>
        </div>
      </div>
    );
  };

  const modalFilterOption = (data: any[]) => {
    return (
      <div className="filter-option-container">
        {data.map((item) => (
          <div
            className={
              selectedFilter.includes(item)
                ? `active filter-option-name`
                : "filter-option-name"
            }
            onClick={() =>
              setSelectedFilter((prev) => {
                if (selectedFilter.includes(item)) {
                  return prev.filter((value) => value !== item);
                } else {
                  return [...prev, item];
                }
              })
            }
          >
            {item}
          </div>
        ))}
      </div>
    );
  };
  const renderModalFilter = (data: any[]) => {
    return (
      <div className="filter-modal-container">
        <Row gutter={[20, 20]} className="filter-container">
          {data.map((item) => (
            <Col span={8}>
              <p className="filter-title">{item.nameFilter}</p>
              {modalFilterOption(item.values)}
            </Col>
          ))}
          <Row justify={"center"} className="filter-btn-container">
            <Col span={12}>
              <Button className="filter-btn" onClick={() => setIsOpenIn(false)}>
                Đóng
              </Button>
            </Col>
            <Col span={12}>
              <Button
                className="filter-btn view-result"
                onClick={() => filterProductSpec()}
              >
                Xem kết quả
              </Button>
            </Col>
          </Row>
        </Row>
      </div>
    );
  };

  const filterList: ButtonFilterProps[] = [
    {
      icon: <FaFilter />,
      title: "Lọc",
      isShow: isOpenIn,
      render: () => renderModalFilter(specifications ?? []),
      onClick: () => setIsOpenIn(!isOpenIn),
      key: "filter",
    },
    {
      icon: <AiFillTruck />,
      title: "Có sẵn",
      key: "availble",
    },
    {
      icon: <CiMoneyBill />,
      title: "Giá",
      isShow: isOpenPrice,
      render: () => modalFilterPrice(),
      onClick: () => setIsOpenPrice(!isOpenPrice),
      key: "price",
    },
  ];
  const getLowestVariantPrice = (
    variants: IVariant[] | undefined,
    defaultPrice: number | undefined
  ): number => {
    if (variants && variants.length > 0) {
      // Nếu sản phẩm có biến thể, tìm giá thấp nhất
      const variantPrices = variants.map((variant) =>
        parseFloat(variant.price.toString())
      );
      const lowestVariantPrice = Math.min(...variantPrices);
      return lowestVariantPrice;
    }
    // Nếu không có biến thể, trả về giá mặc định
    return defaultPrice !== undefined ? parseFloat(defaultPrice.toString()) : 0;
  };

  const filterProductSpec = async () => {
    const payload = {
      categoryUrl: location.pathname.split("/")[1],
      values: selectedFilter,
    };
    try {
      setIsLoading(true);
      const response = await ProductService.getProductFilterSpec(payload);
      setProducts(response);
      setIsOpenIn(false);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleSort = (key: string) => {
    const sortedProducts = [...products] // Tạo bản sao để tránh thay đổi mảng gốc
      .map((item) => ({
        ...item,
        lowestPrice: getLowestVariantPrice(item.variants, item.price),
      }))
      .sort((a, b) =>
        key === "sort-ascending"
          ? a.lowestPrice - b.lowestPrice
          : b.lowestPrice - a.lowestPrice
      );

    setProducts(sortedProducts);
  };
  return (
    <Spin spinning={isLoading}>
      <div className="category-detail-container">
        <div className="category-banner-container">
          <div className="category-banner-detail isMenudesktop">
            <MSwiper data={imageList} isMenu={false} />
          </div>
          <div className="category-banner-detail isMenudesktop">
            <MSwiper data={imageList} isMenu={false} />
          </div>
        </div>
        <div className="isMenudesktop">
          <p className="category-filter-p ">Chọn theo tiêu chí</p>
          <div className="category-filter-container ">
            {filterList.map((item) => (
              <MBtn
                icon={item.icon}
                title={item.title}
                isShow={item.isShow}
                render={item.render}
                onClick={item.onClick}
              />
            ))}
          </div>
        </div>

        <div className="isMenudesktop">
          <p className="category-filter-p">Sắp xếp theo</p>
          <div className="category-filter-container">
            {sortList.map((item) => (
              <MBtn
                icon={item.icon}
                title={item.title}
                onClick={() => {
                  if (
                    item.key === "sort-ascending" ||
                    item.key === "sort-descending"
                  ) {
                    handleSort(item.key);
                  }
                }}
              />
            ))}
          </div>
        </div>

        <div className="category-filter-list-item">
          {products.map((item) => (
            <Card
              onClick={() => navigate(`/product-detail-layout/${item._id}`)}
              cardImg={item.imageThumbnailUrl}
              cardTitle={item.name}
              cardPrice={getLowestVariantPrice(item.variants, item.price)}
              cardOriginalPrice={getLowestVariantPrice(
                item.variants,
                item.salePrice
              )}
            />
          ))}
        </div>

        <div className="category-filter-list-item">
          {!showAll && (
            <Button
              onClick={() => setShowAll(true)}
              className="category-show-more-btn"
            >
              Xem thêm
            </Button>
          )}
        </div>

        <div className="category-infor-news">
          <div className="category-infor">
            <div style={{ backgroundColor: "red", height: "500px" }}>
              Thong tin thuong hieu
            </div>
            <div className="category-infor-QA">
              <p className="category-infor-QA-title">Câu hỏi thường gặp</p>
              {normalQuestionList.map((item) => renderNormalQuestion(item))}
            </div>
            <div className="category-infor-feedback">
              <p className="category-infor-feedback-title">Hỏi và đáp</p>
              <div className="category-infor-feedback-cmt">
                <TextArea
                  rows={4}
                  placeholder="Chúng tôi sẽ phản hồi bình luận của bạn trong thời gian sớm nhất"
                />
                <Button
                  className="category-infor-feedback-btn"
                  icon={<ImCompass />}
                >
                  Gửi
                </Button>
              </div>
            </div>
          </div>
          <div className="category-news">
            <div className="category-border">
              <p className="category-news-p">
                <FaNewspaper />
                Tin tức về sản phẩm
              </p>
              {articleList.map((item) => renderArticle(item))}
              <a href="#" style={{ textDecoration: "none" }}>
                <div className="category-btn-more-acticle">
                  xem tất cả bài viết <AiFillCaretDown />
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </Spin>
  );
};

export default CategoryDetail;

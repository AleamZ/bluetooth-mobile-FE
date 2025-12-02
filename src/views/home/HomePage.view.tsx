import React, { useEffect, useState } from "react";
import Card from "@/components/basicUI/card";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import MainTopHome from "@/components/top-home/main-top-home";
import { Link, useNavigate } from "react-router-dom";
import { ProductService } from "@/services/product.service";
import { handleError } from "@/utils/catch-error";
import OrtherProduct from "@/components/basicUI/orther-product";
import { Button } from "antd";
import { BlogService } from "@/services/blog.service";
import { CategoryService } from "@/services/category.service";

// Định nghĩa kiểu cho Product (Product Interface)
interface Variant {
  size: string;
  color: string;
  price: string; // Giả sử mỗi biến thể có giá riêng
}

interface Product {
  _id: string;
  key: string;
  name: string;
  price: string; // Giá mặc định của sản phẩm nếu không có biến thể
  stock: number;
  isActive: boolean;
  views: number;
  likes: number;
  purchases: number;
  imageThumbnailUrl: string;
  variants: Variant[]; // Mảng các biến thể
}

// Định nghĩa kiểu cho CardInfor
interface CardInfor {
  cardImg?: string;
  cardTitle?: string;
  cardPrice?: number;
  cardOriginalPrice?: number;

  cardDetail?: string;
  cardStar?: boolean;
  cardFavorite?: boolean;
  cardInstallment?: string;
  cardDiscountZeroPercent?: boolean; // Boolean
  onClick?: () => void;
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [, setProducts] = useState<Product[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [optionListData, setOptionListData] = useState<any[]>([]);
  const [productHome, setProductHome] = useState<any[]>([]);
  const asyncDataProductHome = async () => {
    try {
      const response = await ProductService.getProductSpecial();
      console.log('Product Special Response:', response); // Add this to inspect the data
      setProductHome(response);
    } catch (error) {
      handleError(error);
    }
  };
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productList = await ProductService.getProducts();
        setProducts(productList);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    asyncDataProductHome();
    fetchProducts();
  }, []);

  // Hàm tính giá của sản phẩm (trả về cả price và salePrice)
  const getProductPrice = (
    variants: any[],
    defaultPrice: string,
    defaultSalePrice: number
  ): { price: number | null; salePrice: number | null } => {
    // Trường hợp 1: Sản phẩm không có biến thể
    if (!variants || variants.length === 0) {
      const parsedPrice = parseFloat(defaultPrice);
      return {
        price: isNaN(parsedPrice) ? null : parsedPrice,
        salePrice:
          defaultSalePrice && !isNaN(defaultSalePrice)
            ? defaultSalePrice
            : null,
      };
    }

    // Trường hợp 2: Sản phẩm có biến thể
    const variantWithLowestPrice = variants.reduce(
      (lowest: any, current: any) => {
        const currentPrice = parseFloat(current.price);
        const currentSalePrice = current.salePrice;

        // Skip invalid prices
        if (isNaN(currentPrice)) return lowest;

        if (
          !lowest ||
          (currentSalePrice > 0 && currentSalePrice < lowest.effectivePrice)
        ) {
          return {
            price: currentPrice,
            salePrice: currentSalePrice,
            effectivePrice:
              currentSalePrice > 0 ? currentSalePrice : currentPrice,
          };
        }
        return lowest;
      },
      null
    );

    if (!variantWithLowestPrice) return { price: null, salePrice: null };

    return {
      price: variantWithLowestPrice.price,
      salePrice:
        variantWithLowestPrice.salePrice > 0
          ? variantWithLowestPrice.salePrice
          : null,
    };
  };

  const asyncDataBlog = async () => {
    try {
      const response = await BlogService.getBlogsByCategoryNews();
      setBlogs(response);
    } catch (error) {
      handleError(error);
    }
  };
  const asyncDataAccessory = async () => {
    try {
      const responseAccessory = await CategoryService.getCategoryByUrl(
        "phukien"
      );
      const responseProOld = await CategoryService.getCategoryByUrl("hangcu");
      const mapDataAccessory = {
        title: responseAccessory.name,
        listItem: responseAccessory.subCategories.map((subItem: any) => ({
          name: subItem.name,
          img: subItem.imageLogo,
          color: "white",
          link: `/${subItem.url}`,
        })),
      };
      const mapDataProOld = {
        title: responseProOld.name,
        listItem: responseProOld.subCategories.map((subItem: any) => ({
          name: subItem.name,
          img: subItem.imageLogo,
          color: "red",
          link: `/${subItem.url}`,
        })),
      };
      setOptionListData([mapDataAccessory, mapDataProOld]);
    } catch (error) {
      handleError(error);
    }
  };
  useEffect(() => {
    asyncDataBlog();
    asyncDataAccessory();
  }, []);

  const handleBrandClick = async (brandName: string, categoryId: string) => {
    try {
      const response = await CategoryService.getCategoryUrl(categoryId);
      console.log('Category URL:', response.url);
      console.log('Brand Name:', brandName);
      navigate(`/${response.url}/${brandName}`);
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div className="homepage-container">
      <MainTopHome />
      <div className="Render-HightLight-Pd">
        {productHome.map((item) =>
          item.products.length ? (
            <>
              <div className="Render-HightLight-Pd-cpn">
                <p className="Render-HightLight-Pd-title">
                  {item.categoryName.toUpperCase()} NỔI BẬT
                </p>
                <div className="Render-HightLight-Pd-list-tag">
                  {item.brands.map(
                    (brand: { name: string }) => {
                      console.log('Brand data:', brand); // Add this to inspect individual brand data
                      console.log('Category data:', item); // Add this to inspect category data
                      console.log('Category id:', item.categoryId); // Add this to inspect category ID
                      return (
                        <div
                          className="Render-HightLight-Pd-tag"
                          onClick={() => handleBrandClick(brand.name, item.categoryId)}
                          style={{ cursor: 'pointer' }}
                        >
                          {brand.name}
                        </div>
                      );
                    }
                  )}
                  <div className="render-view-all">Xem thêm tất cả</div>
                </div>
              </div>
              <Swiper
                className="homepage-swiper"
                navigation={true}
                slidesPerGroup={2}
                spaceBetween={8}
                breakpoints={{
                  1024: {
                    slidesPerView: 6,
                    slidesPerGroup: 6,
                    spaceBetween: 10,
                  },
                  768: {
                    slidesPerView: 4,
                    slidesPerGroup: 4,
                    spaceBetween: 6,
                  },
                  480: {
                    slidesPerView: 2,
                    slidesPerGroup: 2,
                    spaceBetween: 4,
                  },
                  0: {
                    slidesPerView: 2,
                    slidesPerGroup: 2,
                    spaceBetween: 3,
                  }
                }}
                modules={[Navigation]}
              >
                {item.products.map((product: any, index: any) => {
                  const { price, salePrice } = getProductPrice(
                    product.variants,
                    product.price,
                    product.salePrice
                  );

                  // Skip rendering card if no valid price
                  if (!price && !salePrice) return null;

                  const cardData: CardInfor = {
                    cardImg: product.imageThumbnailUrl,
                    cardTitle: product.name,
                    cardOriginalPrice: salePrice || price || undefined, // Hiển thị salePrice nếu có, không thì hiển thị price
                    cardPrice: salePrice
                      ? price ?? undefined
                      : undefined, // Chỉ hiển thị giá gốc nếu có salePrice

                    cardDetail: `Stock: ${product.stock}`,
                    cardStar: Math.random() < 0.5, // Ngẫu nhiên, trả về true hoặc false
                    cardFavorite: product.likes > 100, // Giả sử thích nếu likes > 100
                    cardInstallment: product.isActive
                      ? "Available"
                      : "Not Available",
                    cardDiscountZeroPercent:
                      salePrice !== null &&
                      salePrice < parseFloat(product.price), // Kiểm tra nếu có giảm giá
                  };

                  return (
                    <SwiperSlide key={index}>
                      <Link
                        to={`/product-detail-layout/${product._id}`}
                        className="homepage-card-link"
                      >
                        <Card {...cardData} />
                      </Link>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </>
          ) : null
        )}
      </div>
      {optionListData.map((item, index) => (
        <OrtherProduct
          key={index}
          title={item.title}
          listItem={item.listItem}
          linkMore={item.linkMore}
        />
      ))}
      <div className="homepage-blog">
        <h2>Bài tin</h2>
        <div className="tag-wrapper">
          <div className="category-new">Bảng tin công nghệ</div>
          <Button>Hỏi đáp</Button>
        </div>
        <div className="list-news">
          {blogs.map((blog) => (
            <div
              className="item-news"
              onClick={() => navigate(`/blog/${blog._id}`)}
            >
              <img
                className="image"
                src={
                  blog.image
                    ? blog.image
                    : "https://cdnv2.tgdd.vn/mwg-static/common/News/Thumb/1557448/1BHYT-post%20web-kt1200x628-toanquoc638760970339336166.jpg"
                }
              />
              <p>{blog.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;

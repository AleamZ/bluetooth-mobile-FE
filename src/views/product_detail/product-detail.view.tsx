import React, { useEffect, useState } from "react";
import { Spin } from "antd";
import { useParams } from "react-router-dom";
import { ProductService } from "@/services/product.service";
import { handleError } from "@/utils/catch-error";
import BtnVariant from "@/components/basicUI/btn-variant";
import ThumbnailSlider from "@/components/detail-product/thumbnail-slider";
import ProductInfo from "@/components/detail-product/product-info";
import { ShoppingCartOutlined } from '@ant-design/icons';

const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " đ";
};

const ProductDetail: React.FC = () => {
    const params = useParams();
    const [productDetail, setProductDetail] = useState<any>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedAttributes, setSelectedAttributes] = useState<{
        [key: string]: string;
    }>({});

    const asyncDataDetailProduct = async () => {
        try {
            setIsLoading(true);
            const response = await ProductService.getProductById(params?.name || "");
            setProductDetail(response);
        } catch (error) {
            handleError(error);
        } finally {
            setIsLoading(false);
        }
    };

    // Initial data fetch
    useEffect(() => {
        asyncDataDetailProduct();
    }, []);

    // Auto-select first variant for each attribute
    useEffect(() => {
        if (productDetail?.product?.variants) {
            const initialAttributes: { [key: string]: string } = {};
            const attributes = productDetail.product.variants[0]?.attributes;

            Object.keys(attributes || {}).forEach((attributeName) => {
                const firstValue =
                    productDetail.product.variants[0]?.attributes[attributeName];
                initialAttributes[attributeName] = firstValue;
            });

            setSelectedAttributes(initialAttributes);
        }
    }, [productDetail]);

    const handleAttributeChange = (attributeName: string, value: string) => {
        setSelectedAttributes((prev) => ({ ...prev, [attributeName]: value }));
    };

    const getFilteredVariant = () => {
        if (!productDetail?.product?.variants) return null;
        return productDetail.product.variants.find((variant: any) => {
            return Object.entries(selectedAttributes).every(
                ([key, value]) => variant.attributes[key] === value
            );
        });
    };

    const getPriceForAttributes = (attributes: { [key: string]: string }) => {
        const variant = productDetail?.product?.variants.find((variant: any) => {
            return Object.entries(attributes).every(
                ([key, value]) => variant.attributes[key] === value
            );
        });
        return variant ? variant.salePrice : 0;
    };

    const filteredVariant = getFilteredVariant();

    return (
        <Spin spinning={isLoading}>
            <div className="product-detail-container">
                <div className="product-detail-sub-container">
                    <div className="mobile-only-slider">
                        <ThumbnailSlider
                            images={productDetail?.product?.imageUrls || []}
                        />
                    </div>
                    <div className="product-detail-title">
                        <h3 className="product-detail-name">
                            {productDetail?.product?.name}
                        </h3>
                        <div className="rating-reviews-wrapper">
                            <div className="product-detail-star">{"⭐".repeat(5)}</div>
                            <p className="product-detail-number-of-reviews">9 đánh giá</p>
                        </div>
                    </div>
                    <div className="product-detail-body">
                        <div className="product-detail-body-left">
                            <div className="desktop-only-slider">
                                <ThumbnailSlider
                                    images={productDetail?.product?.imageUrls || []}
                                />
                            </div>
                            <ProductInfo productDetail={productDetail?.product} />
                        </div>
                        <div className="product-detail-body-right">
                            {productDetail?.product?.variants &&
                                Object.keys(productDetail.product.variants[0]?.attributes || {}).map(
                                    (attributeName) => (
                                        <div key={attributeName} className="variant-group">
                                            <h4>{attributeName}</h4>
                                            <div className="variant-options">
                                                {Array.from(
                                                    new Set(
                                                        productDetail.product.variants.map(
                                                            (variant: any) =>
                                                                variant.attributes[attributeName]
                                                        )
                                                    )
                                                ).map((value) => (
                                                    <BtnVariant
                                                        key={`${attributeName}-${value}`}
                                                        value={value as string}
                                                        price={formatPrice(
                                                            getPriceForAttributes({
                                                                ...selectedAttributes,
                                                                [attributeName]: value as string,
                                                            })
                                                        )}
                                                        onClick={() =>
                                                            handleAttributeChange(
                                                                attributeName,
                                                                value as string
                                                            )
                                                        }
                                                        isSelected={
                                                            selectedAttributes[attributeName] === value
                                                        }
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )
                                )}
                            <div className="selected-variant-price">
                                {productDetail?.product?.variants?.length ? (
                                    <>
                                        {/* Nếu sản phẩn có biến thể */}
                                        <div className="old-autumn-price">
                                            <img
                                                src="https://res.cloudinary.com/dues86hho/image/upload/v1739939184/WEBBLUETOOTH/xsvrneebj6vlj2ptjjr1.png"
                                                alt="Additional Image"
                                                className="icon"
                                            />
                                            <div className="price-text-container">
                                                {filteredVariant && (
                                                    <a className="old-price">
                                                        {formatPrice(
                                                            Math.round(filteredVariant.salePrice / 1.1 / 10000) *
                                                            10000
                                                        )}
                                                    </a>
                                                )}
                                                <p>Khi thu cũ lên đời</p>
                                            </div>
                                        </div>
                                        <div className="price-container">
                                            <div className="sale-price">
                                                {filteredVariant ? formatPrice(filteredVariant.salePrice) : "N/A"}
                                            </div>
                                            <div className="price">
                                                {filteredVariant ? formatPrice(filteredVariant.price) : "N/A"}
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {/* Nếu sản phẩn KHÔNG có biến thể */}
                                        <div className="old-autumn-price">
                                            <img
                                                src="https://res.cloudinary.com/dues86hho/image/upload/v1739939184/WEBBLUETOOTH/xsvrneebj6vlj2ptjjr1.png"
                                                alt="Additional Image"
                                                className="icon"
                                            />
                                            <div className="price-text-container">
                                                {filteredVariant && (
                                                    <a className="old-price">
                                                        {formatPrice(
                                                            Math.round(filteredVariant.salePrice / 1.1 / 10000) *
                                                            10000
                                                        )}
                                                    </a>
                                                )}
                                                <p>Khi thu cũ lên đời</p>
                                            </div>
                                        </div>
                                        <div className="price-container">
                                            <div className="sale-price">
                                                {formatPrice(productDetail?.product?.salePrice || 0)}
                                            </div>
                                            <div className="price">
                                                {formatPrice(productDetail?.product?.price || 0)}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="buttons-container">
                                <button
                                    className="buy-now-button"
                                    onClick={() => {
                                        console.log('Buy Now clicked', filteredVariant || productDetail?.product);
                                    }}
                                >
                                    Mua Ngay
                                    <div className="shipping-text">(Free ship 2h nội thành Hồ Chí Minh)</div>
                                </button>
                                <button
                                    className="add-to-cart-button"
                                    onClick={() => {
                                        console.log('Add to cart clicked', filteredVariant || productDetail?.product);
                                    }}
                                >
                                    <ShoppingCartOutlined className="cart-icon" />
                                    <span>Thêm vào giỏ</span>
                                </button>
                            </div>
                            <div className="credit-buttons">
                                <button className="credit-button zero-percent">
                                    Trả góp 0%
                                </button>
                                <button className="credit-button card-credit">
                                    Trả góp 0% qua thẻ
                                </button>
                            </div>
                        </div>
                    </div >
                </div >
            </div >
        </Spin >
    );
};

export default ProductDetail;

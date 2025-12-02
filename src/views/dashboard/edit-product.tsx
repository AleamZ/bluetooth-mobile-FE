import React, { useState, useEffect } from "react";
import { Button, message, Spin } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import EditProductBasicInfo from "@/components/dashboard/edit-product-basicinfo";
import EditProductVariant from "@/components/dashboard/edit-product-variant";
import { ProductService } from "@/services/product.service";
import { UploadService } from "@/services/upload.service";
import EditProductSpecifications from "@/components/dashboard/edit-product-specifications";

interface SpecificationItem {
    key: string;
    value: string;
    _id?: string;
}

interface SpecificationGroup {
    nameGroup: string;
    specificationsSub: SpecificationItem[];
    _id?: string;
}

interface IFormData {
    name: string;
    categoryId: string;
    brandId: string;
    description: string;
    infoProduct: string;
    imageThumbnailUrl: string;
    imageUrls: string[];
    specifications: SpecificationGroup[];
}

interface IVariantProduct {
    attributes: Record<string, string>;
    price: number;
    salePrice?: number;
    stock: number;
    images: string[];
    status: "available" | "unavailable";
}

interface IProductData extends IFormData {
    variants: IVariantProduct[];
    salePrice: number;
    price: number;
    stock: number;
    status: string;
}

const EditProduct: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [thumbnail, setThumbnail] = useState<any[]>([]);
    const [imageList, setImageList] = useState<any[]>([]);
    const [formData, setFormData] = useState<IFormData>({
        name: "",
        categoryId: "",
        brandId: "",
        description: "",
        infoProduct: "",
        imageThumbnailUrl: "",
        imageUrls: [],
        specifications: [],
    });
    const [originalData, setOriginalData] = useState<any>(null);
    const [variantProducts, setVariantProducts] = useState<IVariantProduct[]>([]);
    const [specificationGroups, setSpecificationGroups] = useState<SpecificationGroup[]>([]);

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                setIsLoading(true);
                const response = await ProductService.getProductById(id || "");

                if (!response?.product) {
                    message.error('Dữ liệu sản phẩm không hợp lệ');
                    return;
                }

                const { product } = response;
                console.group('Product Variant Debug');
                console.log('Original Variants:', product.variants);
                console.log('Variant Structure:', {
                    count: product.variants?.length,
                    firstVariant: product.variants?.[0],
                    variantTypes: product.variants?.[0]?.attributes ? Object.keys(product.variants[0].attributes) : []
                });
                console.groupEnd();

                setOriginalData(product);
                setVariantProducts(product.variants || []);

                if (product.imageThumbnailUrl) {
                    setThumbnail([{
                        uid: '-1',
                        name: 'thumbnail.png',
                        status: 'done',
                        url: product.imageThumbnailUrl
                    }]);
                }

                const imageUrls = product.imageUrls || [];
                if (imageUrls.length > 0) {
                    setImageList(imageUrls.map((url: string, index: number) => ({
                        uid: `-${index}`,
                        name: `image-${index}.png`,
                        status: 'done',
                        url: url
                    })));
                }

                console.log('Product Specifications:', product.specifications);
                setSpecificationGroups(product.specifications || []);

                setFormData({
                    name: product.name || '',
                    categoryId: product.categoryId || '',
                    brandId: product.brandId || '',
                    description: product.description || '',
                    infoProduct: product.infoProduct || '',
                    imageThumbnailUrl: product.imageThumbnailUrl || '',
                    imageUrls: product.imageUrls || [],
                    specifications: product.specifications || [],
                });

            } catch (error) {
                console.group('Product Data Error');
                console.error('Error details:', error);
                console.error('Error type:', typeof error);
                console.error('Error stack:', (error as Error).stack);
                console.groupEnd();
                message.error('Không thể tải thông tin sản phẩm');
                navigate('/products');
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            console.log('Fetching product with ID:', id);
            fetchProductData();
        }
    }, [id, navigate]);

    const handleSubmit = async () => {
        try {
            setIsLoading(true);

            // Create debug object for logging
            const debugData = {
                requestPayload: {
                    basicInfo: {
                        name: formData.name,
                        categoryId: formData.categoryId,
                        brandId: formData.brandId,
                        description: formData.description,
                        infoProduct: formData.infoProduct,
                    },
                    specifications: specificationGroups.map(group => ({
                        nameGroup: group.nameGroup,
                        specificationsSub: group.specificationsSub
                            .filter(spec => spec.value.trim() !== '')
                            .map(spec => ({
                                key: spec.key,
                                value: spec.value
                            }))
                    })).filter(group => group.specificationsSub.length > 0),
                    images: {
                        thumbnail: thumbnail[0]?.originFileObj ? 'New thumbnail to upload' : thumbnail[0]?.url,
                        productImages: imageList.map(img => img.originFileObj ? 'New image to upload' : img.url)
                    },
                    variants: variantProducts.map(variant => ({
                        attributes: variant.attributes,
                        price: Number(variant.price),
                        salePrice: variant.salePrice ? Number(variant.salePrice) : undefined,
                        stock: Number(variant.stock),
                        status: variant.status,
                        images: variant.images || []
                    }))
                },
                originalData: {
                    specifications: originalData?.specifications || [],
                    variants: originalData?.variants || [],
                    images: {
                        thumbnail: originalData?.imageThumbnailUrl,
                        productImages: originalData?.imageUrls || []
                    }
                }
            };

            // Log formatted JSON for debugging
            console.group('Submit Update Product Debug');
            console.log('Debug Data:', JSON.stringify(debugData, null, 2));
            console.groupEnd();

            // Create actual payload for API
            const payload: Partial<IProductData> = {
                name: formData.name,
                categoryId: formData.categoryId,
                brandId: formData.brandId,
                description: formData.description,
                infoProduct: formData.infoProduct,
                specifications: debugData.requestPayload.specifications,
                variants: debugData.requestPayload.variants
            };

            // Handle image uploads
            if (thumbnail[0]?.originFileObj) {
                const responseThumbnail = await UploadService.uploadSingle(thumbnail[0].originFileObj);
                payload.imageThumbnailUrl = responseThumbnail.url;
            }

            if (imageList.length > 0) {
                const newImages = imageList.filter(img => img.originFileObj);
                if (newImages.length > 0) {
                    const files = newImages.map(file => file.originFileObj);
                    const responseList = await UploadService.uploadMultiple(files);
                    payload.imageUrls = [
                        ...imageList.filter(img => !img.originFileObj).map(img => img.url),
                        ...responseList.urls
                    ];
                } else {
                    payload.imageUrls = imageList.map(img => img.url);
                }
            }

            // Send update request and log response
            const response = await ProductService.updateProduct(id!, payload);
            console.log('API Response:', JSON.stringify(response, null, 2));

            message.success("Cập nhật sản phẩm thành công!");
            navigate('/products');
        } catch (error: any) {
            console.error('Update Error:', error);
            message.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật sản phẩm!');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Spin spinning={isLoading}>
            <div className="edit-product-container">
                <h1 className="edit-product-title">Chỉnh sửa Sản phẩm</h1>
                <div className="edit-product-basic-info">
                    <EditProductBasicInfo
                        setImageList={setImageList}
                        setThumbnail={setThumbnail}
                        formData={formData}
                        setFormData={setFormData}
                    />
                </div>
                <div className="edit-product-variants">
                    <EditProductVariant
                        initialVariants={variantProducts}
                        onVariantsChange={setVariantProducts}
                    />
                </div>
                <div className="edit-product-specifications">
                    <EditProductSpecifications
                        categoryId={formData.categoryId}
                        existingSpecifications={specificationGroups}
                        onSpecificationsChange={setSpecificationGroups}
                    />
                </div>
            </div>
            <div style={{ marginTop: "20px" }}>
                <Button type="default" style={{ marginRight: "10px" }} onClick={() => navigate('/products')}>
                    Hủy
                </Button>
                <Button type="primary" onClick={handleSubmit}>
                    Lưu thay đổi
                </Button>
            </div>

        </Spin >
    );
};

export default EditProduct;

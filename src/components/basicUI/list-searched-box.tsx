import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ISearchedProduct } from '@/types/product';
import { Spin } from 'antd';

interface ListSearchedBoxProps {
    products: ISearchedProduct[];
    isLoading: boolean;
    onItemClick?: () => void;
}

const ListSearchedBox: React.FC<ListSearchedBoxProps> = ({
    products,
    isLoading,
    onItemClick
}) => {
    const navigate = useNavigate();

    const formatPrice = (price: number) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " đ";
    };

    const handleClick = (id: string) => {
        navigate(`/product-detail-layout/${id}`);
        if (onItemClick) onItemClick();
    };

    return (
        <div className="list-searched-box">
            <div className='title'>Sản phẩm tìm kiếm</div>
            <Spin spinning={isLoading}>
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="search-result-item"
                        onClick={() => handleClick(product.id)}
                    >
                        <img
                            src={product.imageThumbnailUrl}
                            alt={product.name}
                            className="product-thumbnail"
                        />
                        <div className="product-info">
                            <div className="product-name">{product.name}</div>
                            <div className="product-prices">
                                <span className="original-price">{formatPrice(product.price)}</span>
                                <span className="sale-price">{formatPrice(product.salePrice)}</span>
                            </div>
                        </div>
                    </div>
                ))}
                {!isLoading && products.length === 0 && (
                    <div className="no-results">No products found</div>
                )}
            </Spin>
        </div>
    );
};

export default ListSearchedBox;

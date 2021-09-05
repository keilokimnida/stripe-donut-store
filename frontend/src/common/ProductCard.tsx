import React from 'react'

interface ProductCardInterface {
    productID: number;
    productTitle: string;
    price: number;
    productImg?: any;
};

const ProductCard: React.FC<ProductCardInterface> = ({ productID, productTitle, price, productImg }) => {
    return (
        <div className="c-Products-card">
            <div className="c-Products-card__Img">
                <img src={productImg} alt="Product"/>
            </div>
            <div className="c-Products-card__Details">
                <h1>{productTitle}</h1>
                <h2>S${price.toFixed(2)}</h2>
            </div>
        </div>
    )
}

export default ProductCard;
import React, { useState, useEffect } from 'react';
import donutImg from '../assets/images/donut.jpg';
import ProductQty from '../common/ProductQty';

interface Props {
    name: string,
    unitPrice: number,
    totalPrice: number,
    quantity: number,
    productID: string
}

const CartItem: React.FC<Props> = ({ name, unitPrice, totalPrice, quantity, productID }) => {

    // State declarations
    const [qty, setQty] = useState<number | null>(null);

    useEffect(() => {
        setQty(() => quantity);
    }, []);

    return (
        <div className="c-Cart-items">
            {/* Image */}
            <div className="c-Cart-items__Img">
                <img src={donutImg} alt="Product" />
            </div>
            {/* Info */}
            <div className="c-Cart-items__Info">
                <h1>{name}</h1>
                <h3>Unit Price: S${unitPrice.toFixed(2)}</h3>
                <h2>Total Price: S${totalPrice.toFixed(2)}</h2>
                <div className="c-Cart-items__Qty">
                    <ProductQty qty={qty} setQty={setQty} variation="cart" productID={productID} />
                </div>
            </div>
        </div>
    )
}

export default CartItem;
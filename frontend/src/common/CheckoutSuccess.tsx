import React from 'react';
import { NavLink } from 'react-router-dom';

interface Props {
    receiptURL: string
}

const CheckoutSuccess: React.FC<Props> = ({ receiptURL }) => {
    return (
            <div className="c-Checkout-success">
                <span>
                    <svg viewBox="0 0 24 24">
                        <path strokeWidth="2" fill="none" stroke="#ffffff" d="M 3,12 l 6,6 l 12, -12" />
                    </svg>
                </span>
                <h1>Checkout was Successful!</h1>
                <a href={receiptURL}>Go to Receipt</a>
                <NavLink to = "/products">Back to Products</NavLink>
            </div>
    )
}

export default CheckoutSuccess;
import React from 'react';
import { NavLink } from 'react-router-dom';


const CheckoutSuccess: React.FC = () => {
    return (
        <div className="c-Checkout-success">
            <span>
                <svg viewBox="0 0 24 24">
                    <path strokeWidth="2" fill="none" stroke="#ffffff" d="M 3,12 l 6,6 l 12, -12" />
                </svg>
            </span>
            <h1>Checkout was Successful!</h1>
            <p>We have sent you a receipt through your email</p>
            <p>List of Receipts can be Found in <NavLink to="/accounts">My Account</NavLink></p>
        </div>
    )
}

export default CheckoutSuccess;
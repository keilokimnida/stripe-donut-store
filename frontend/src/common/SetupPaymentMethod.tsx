import React from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';

interface Props {
    show: boolean,
    handleClose: Function
}

const SetupPaymentMethod: React.FC<Props> = ({ show, handleClose }) => {

    const stripe = useStripe();
    const elements = useElements();

    const showHideClassName = show ? "l-Setup-payment-method l-Setup-payment-method--show" : "l-Setup-payment-method l-Setup-payment-method--hidden";

    const CARD_ELEMENT_OPTIONS = {
        hidePostalCode: true,
        style: {
            base: {
                color: "#32325d",
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSmoothing: "antialiased",
                fontSize: "16px",
                "::placeholder": {
                    color: "#32325d",
                },
            },
            invalid: {
                color: "#fa755a",
                iconColor: "#fa755a"
            }
        },
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();
    };

    const handleBtn = () => {
        // Clear stripe element before closing
        elements!.getElement(CardElement)!.clear();
        handleClose();
    }

    return (
        <form className={showHideClassName} onSubmit={(event) => handleSubmit(event)}>
            <div className="c-Setup-payment-method">
                <h1>Add Payment Method</h1>
                <div className="l-Setup-payment-method__Card-element">
                    <div className="c-Setup-payment-method__Card-element">
                        {/* Card input is rendered here */}
                        <CardElement options={CARD_ELEMENT_OPTIONS} />
                    </div>
                </div>
                <div className="c-Setup-payment-method__Btn">
                    <button type="button" className="c-Btn" onClick={() => handleBtn()}>Save</button>
                    <button type="button" className="c-Btn c-Btn--link" onClick={() => handleBtn()}>Cancel</button>
                </div>
            </div>
        </form>
    )
}

export default SetupPaymentMethod;
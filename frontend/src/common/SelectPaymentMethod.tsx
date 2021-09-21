import React from 'react';
import MCSVG from "../assets/svg/MC.svg";
import visaSVG from "../assets/svg/Visa_2021.svg";
import amexSVG from "../assets/svg/Amex.svg";
import { ReactSVG } from 'react-svg';

interface Props {
    cardBrand: string;
    last4: string;
    expDate: string;
    stripePaymentMethodID: string;
    selectedPaymentMethod: number | null;
    key: number;
    handleSelectPaymentMethod: Function;
}

const SelectPaymentMethod: React.FC<Props> = ({ cardBrand, last4, expDate, stripePaymentMethodID, selectedPaymentMethod, key, handleSelectPaymentMethod }) => {
    const renderPaymentMethod = () => {
        if (cardBrand === "visa") {
            return <ReactSVG
                src={visaSVG}
                className="c-SVG__Visa"
            />
        } else if (cardBrand === "mastercard") {
            return <ReactSVG
                src={MCSVG}
                className="c-SVG__Master"
            />
        } else if (cardBrand === "amex") {
            return <ReactSVG
                src={amexSVG}
                className="c-SVG__Amex"
            />
        } else {
            return cardBrand;
        }
    };

    const selectedMainClassName = selectedPaymentMethod === key ? "c-Select-payment-method c-Select-payment-method--selected" : "c-Select-payment-method";
    const selectedBannerClassName = selectedPaymentMethod === key ? "c-Select-payment-method__Banner c-Select-payment-method__Banner--selected" : "c-Select-payment-method__Banner";

    return (
        <div className={selectedMainClassName} onClick={() => handleSelectPaymentMethod(key)}>
            <span className = {selectedBannerClassName}>Selected</span>
            <div className="c-Select-payment-method__Left">
                <div className="c-Select-payment-method__SVG c-SVG">
                    {renderPaymentMethod()}
                </div>
                <p>●●●● {last4}</p>
            </div>
            <div className="c-Select-payment-method__Right">
                <p>Exp. {expDate}</p>
            </div>
        </div>
    )
}

export default SelectPaymentMethod;
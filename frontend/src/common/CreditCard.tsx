import React from 'react';
import * as FcIcons from 'react-icons/fc';
import { IconContext } from 'react-icons';
import MCSVG from "../assets/svg/MC.svg";
import visaSVG from "../assets/svg/Visa_2021.svg";
import amexSVG from "../assets/svg/Amex.svg";
import visaWhite from "../assets/images/visa-white.png";
import amexWhite from "../assets/images/amex-white.png";
import { ReactSVG } from 'react-svg';

interface Props {
    last4: string
    expDate: string
    type: string
}

const CreditCard: React.FC<Props> = ({ last4, expDate, type }) => {

    const renderLogo = () => {
        if (type === "visa") {
            return <div className="c-Credit-card__IMG c-IMG__Visa">
                <img src={visaWhite} alt="Credit Card Brand" />
            </div>

        } else if (type === "mastercard") {
            return <ReactSVG
                src={MCSVG}
                className="c-Credit-card__SVG c-SVG__Master"
            />
        } else if (type === "amex") {
            return <div className="c-Credit-card__IMG c-IMG__Amex">
            <img src={amexWhite} alt="Credit Card Brand" />
        </div>
        } else {
            return type;
        }
    };

    const handleCreditCardHover = () => {

    }

    return (
        <div className="c-Credit-card c-Credit-card--bg-var-8" onMouseEnter={() => handleCreditCardHover()} onMouseLeave={() => handleCreditCardHover()}>
            <div className="c-Credit-card__Logo">
                {renderLogo()}
            </div>
            <div className="c-Credit-card__Chip">
                <IconContext.Provider value={{ color: "#a41c4e", size: "34px" }}>
                    <FcIcons.FcSimCardChip />
                </IconContext.Provider>
            </div>
            <div className="c-Credit-card__Num">
                <p>●●●● ●●●● ●●●● {last4}</p>
            </div>
            <div className="c-Credit-card__Bottom">
                <h1>VALID<br />THRU</h1>
                <p>{expDate ? expDate : "Error"}</p>
            </div>
        </div>
    )
}

export default CreditCard;
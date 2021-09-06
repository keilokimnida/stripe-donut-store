import React, { useState, useEffect } from 'react';
import * as RiIcons from 'react-icons/ri';
import { IconContext } from 'react-icons';
import axios from 'axios';
import config from '../config/config';
import { getToken } from '../utilities/localStorageUtils';

interface Props {
    qty: number | null,
    setQty: Function,
    variation: string,
    productID: string
}

const ProductQty: React.FC<Props> = ({qty, setQty, variation, productID}) => {

    const token: string | null = getToken();


    useEffect(() => {

    }, []);

    // Handlers
    const handleQtyBtn = (type: string) => {
        if (variation === "productDetails") {
            if (type === "minus") {
                setQty((prevState: number) => prevState - 1);
            } else {
                setQty((prevState: number) => prevState + 1);
            }
        } else {
            let axiosQtyData;
            if (type === "minus") {
                axiosQtyData = qty! - 1;
            } else {
                axiosQtyData = qty! + 1;
            }
            axios.put(`${config.baseUrl}/cart`, {
                productID,
                quantity: axiosQtyData
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then((res) => {
                console.log(res);
                if (type === "minus") {
                    setQty((prevState: number) => prevState - 1);
                } else {
                    setQty((prevState: number) => prevState + 1);
                }
            })
            .catch((err) => {
                console.log(err);
            });

        }

    };

    return (
        <div className="c-Product-qty">
            {
                qty === 1 ?
                    <button disabled type="button" className="c-Btn c-Product-qty__Minus" onClick={() => handleQtyBtn("minus")}>
                        <IconContext.Provider value={{ color: "#9e9e9e", size: "21px" }}>
                            <RiIcons.RiSubtractLine />
                        </IconContext.Provider>
                    </button>
                    :
                    <button type="button" className="c-Btn c-Product-qty__Minus" onClick={() => handleQtyBtn("minus")}>
                        <IconContext.Provider value={{ color: "black", size: "21px" }}>
                            <RiIcons.RiSubtractLine />
                        </IconContext.Provider>
                    </button>
            }
            <p className="c-Product-qty__Number">{qty}</p>
            <button type="button" className="c-Btn c-Product-qty__Plus" onClick={() => handleQtyBtn("add")}>
                <IconContext.Provider value={{ color: "black", size: "21px" }}>
                    <RiIcons.RiAddLine />
                </IconContext.Provider>
            </button>
        </div>
    )
}

export default ProductQty;
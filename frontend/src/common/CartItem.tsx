import React, { useState, useEffect } from 'react';
import donutImg from '../assets/images/donut.jpg';
import ProductQty from '../common/ProductQty';
import * as RiIcons from 'react-icons/ri';
import { IconContext } from 'react-icons';
import config from '../config/config';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getToken } from '../utilities/localStorageUtils';
import Tooltip from '@material-ui/core/Tooltip';

interface Props {
    name: string,
    unitPrice: number,
    totalPrice: number,
    quantity: number,
    productID: string,
    setRerender: Function
}

const CartItem: React.FC<Props> = ({ name, unitPrice, totalPrice, quantity, productID, setRerender }) => {

    const token: string | null = getToken();

    // State declarations
    const [qty, setQty] = useState<number | null>(null);

    useEffect(() => {
        setQty(() => quantity);
    }, []);

    // Handler
    const handleDeleteCartItem = () => {
        axios.delete(`${config.baseUrl}/cart/${productID}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((res) => {
                console.log(res);
                setRerender((prevState: boolean) => !prevState);
            })
            .catch((err) => {
                console.log(err);
                let errCode = "Error!";
                let errMsg = "Error!"
                if (err.response !== undefined) {
                    errCode = err.response.status;
                    errMsg = err.response.data.message;
                }

                toast.error(<>Error Code: <b>{errCode}</b><br />Message: <b>{errMsg}</b></>);
            });
    };

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
                    <ProductQty qty={qty} setQty={setQty} variation="cart" productID={productID} setRerender={setRerender} />
                </div>
            </div>
            {/* Delete button */}
            <div className="c-Cart-items__Delete">
                <Tooltip title="Remove Product" arrow>
                    <div className = "l-Delete">
                    <IconContext.Provider value={{ color: "#a41c4e", size: "21px" }}>
                        <RiIcons.RiDeleteBin5Fill onClick={handleDeleteCartItem} />
                    </IconContext.Provider>
                    </div>
                </Tooltip>
            </div>
        </div>
    )
}

export default CartItem;
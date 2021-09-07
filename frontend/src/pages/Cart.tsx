import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { getToken } from '../utilities/localStorageUtils';
import config from '../config/config';
import jwt_decode from "jwt-decode";
import Title from '../common/Title';
import Header from '../layout/Header';
import { NavLink, useHistory } from 'react-router-dom';
import LoggedOut from '../common/LoggedOut';
import CartItem from '../common/CartItem';
import Skeleton from '@material-ui/lab/Skeleton';


const Cart: React.FC = () => {

    interface LooseObject {
        [key: string]: any
    }
    interface OrderSummaryInterface {
        grandTotal: number | null;
        subTotal: number | null;
    }

    const history = useHistory();
    const toastTiming = config.toastTiming;
    const token: string | null = getToken();
    let accountID: string;
    if (token) {
        const decodedToken: LooseObject = jwt_decode(token!);
        accountID = decodedToken.account_id;
    }

    // State declarations
    const [cartArr, setCartArr] = useState<[]>([]);
    const [orderSummary, setOrderSummary] = useState<OrderSummaryInterface>({
        grandTotal: null,
        subTotal: null
    });
    const [rerender, setRerender] = useState<boolean>(false);

    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        let componentMounted = true;

        axios.get(`${config.baseUrl}/cart`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((res) => {
                console.log(res);
                const data = res.data;
                if (componentMounted) {
                    if (data.cart.length !== 0) {
                        let subTotal = 0, grandTotal = 0;

                        // set cart array here
                        setCartArr(() => {
                            return data.cart.map((cartData: LooseObject, mapIndex: number) => {
                                subTotal += cartData.quantity * parseFloat(cartData.product.product_price);
                                return {
                                    quantity: cartData.quantity,
                                    name: cartData.product.product_name,
                                    unitPrice: parseFloat(cartData.product.product_price),
                                    totalPrice: (() => {
                                        return cartData.quantity * parseFloat(cartData.product.product_price);
                                    })(),
                                    productID: cartData.product.product_id
                                }
                            });
                        });

                        setOrderSummary(() => {
                            grandTotal = subTotal;
                            return {
                                grandTotal,
                                subTotal
                            }
                        })

                    } else {
                        setCartArr(() => []);
                    }
                    setTimeout(() => {
                        setLoading(() => false);
                    }, 300);
                }
            })
            .catch((err) => {
                console.log(err);
                if (componentMounted) {
                    setTimeout(() => {
                        setLoading(() => false);
                    }, 300);
                }
            });

        return (() => {
            componentMounted = false;
        });

    }, [rerender]);

    return (
        <>
            <div className="l-Main">
                <ToastContainer
                    position="top-center"
                    autoClose={toastTiming}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />
                <Title title="Cart" />
                <Header rerender={rerender} />
                <div className="c-Cart">
                    {
                        token ?
                            cartArr.length === 0 ?
                                <div className="c-Cart__Empty">
                                    <h1>Your cart is empty!</h1>
                                    <NavLink to="/products">Start adding products!</NavLink>
                                </div>
                                :
                                loading ?
                                    <>
                                        <div className="c-Cart__Left">
                                            <h1>Your Items</h1>
                                            <div className="l-Cart__Items">
                                                <div className="c-Cart-items">
                                                    {/* Image */}
                                                    <div className="c-Cart-items__Img">
                                                        <Skeleton variant="rect" width={150} height={150} />
                                                    </div>
                                                    {/* Info */}
                                                    <div className="c-Cart-items__Info">
                                                        <h1><Skeleton variant="text" width={70} /></h1>
                                                        <h3><Skeleton variant="text" width={45} /></h3>
                                                        <h2><Skeleton variant="text" width={30} /></h2>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="c-Cart__Right">
                                            <h1>Summary</h1>
                                            <div className="l-Cart__Checkout-card">
                                                <div className="c-Checkout-card">
                                                    <div className="c-Checkout-card__Info">

                                                        <div className="c-Checkout-card__Item-sub-total">
                                                            <p><Skeleton variant="text" width={100} /></p>
                                                            <h2><Skeleton variant="text" width={40} /></h2>
                                                        </div>
                                                        <hr />

                                                        <div className="c-Checkout-card__Sub-total">
                                                            <h1><Skeleton variant="text" width={100}/></h1>
                                                            <h2><Skeleton variant="text" width={40} /></h2>
                                                        </div>
                                                        <div className="c-Checkout-card__Grand-total">
                                                            <h1><Skeleton variant="text" width={100}/></h1>
                                                            <h2><Skeleton variant="text" width={40} /></h2>
                                                        </div>
                                                    </div>
                                                    <Skeleton variant="rect" height = {42} width={"100%"} />
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                    :
                                    <>
                                        <div className="c-Cart__Left">
                                            <h1>Your Items</h1>
                                            <div className="l-Cart__Items">
                                                {
                                                    cartArr.map((data: LooseObject, index: number) => (
                                                        <div key={index}>
                                                            <CartItem
                                                                name={data.name}
                                                                unitPrice={data.unitPrice}
                                                                totalPrice={data.totalPrice}
                                                                quantity={data.quantity}
                                                                productID={data.productID}
                                                                key={index}
                                                                setRerender={setRerender}
                                                            />
                                                            <hr />
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                        <div className="c-Cart__Right">
                                            <h1>Summary</h1>
                                            <div className="l-Cart__Checkout-card">
                                                <div className="c-Checkout-card">
                                                    <div className="c-Checkout-card__Info">
                                                        {
                                                            cartArr.map((data: LooseObject, index: number) => (
                                                                <div key={index}>
                                                                    <div className="c-Checkout-card__Item-sub-total">
                                                                        <p>{data.quantity} x {data.name}</p>
                                                                        <h2>S${data.totalPrice.toFixed(2)}</h2>
                                                                    </div>
                                                                    <hr />
                                                                </div>
                                                            ))
                                                        }
                                                        <div className="c-Checkout-card__Sub-total">
                                                            <h1>Sub Total</h1>
                                                            <h2>S${orderSummary.subTotal ? orderSummary.subTotal!.toFixed(2) : "Error!"}</h2>
                                                        </div>
                                                        <div className="c-Checkout-card__Grand-total">
                                                            <h1>Grand Total</h1>
                                                            <h2>S${orderSummary.grandTotal ? orderSummary.grandTotal!.toFixed(2) : "Error!"}</h2>
                                                        </div>
                                                    </div>
                                                    <button type="button" className="c-Btn" onClick={() => history.push("/cart/checkout")}>Checkout</button>
                                                </div>
                                            </div>
                                        </div>

                                    </>
                            :
                            <LoggedOut type="Cart" />
                    }
                </div>
            </div>
        </>
    
    );
}

export default Cart;
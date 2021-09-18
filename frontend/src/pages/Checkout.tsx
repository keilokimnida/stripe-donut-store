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
import Spinner from 'react-bootstrap/Spinner'
import Error from "../common/Error";
import {
    CardElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import { PaymentIntentConfirmParams } from "@stripe/stripe-js";
import { PageStatusEnum } from '../config/enums';
import ContentLoader from "react-content-loader"
import CheckoutSuccess from '../common/CheckoutSuccess';


const Checkout: React.FC = () => {
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

    // State declarations
    const [cartArr, setCartArr] = useState<[]>([]);
    const [orderSummary, setOrderSummary] = useState<OrderSummaryInterface>({
        grandTotal: null,
        subTotal: null
    });
    const [rerender, setRerender] = useState<boolean>(false);
    const [pageStatus, setPageStatus] = useState<PageStatusEnum>(PageStatusEnum.LOADING);
    const [saveCard, setSaveCard] = useState<boolean>(false);
    const [paymentMethods, setPaymentMethods] = useState<[]>([]);

    // Stripe
    const [paymentError, setPaymentError] = useState<string | null>(null);
    const [paymentProcessing, setPaymentProcessing] = useState(false);
    const [paymentDisabled, setPaymentDisabled] = useState(true);
    const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
    const [paymentIntentID, setPaymentIntentID] = useState<string | null>(null);
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const stripe = useStripe();
    const elements = useElements();

    useEffect(() => {
        let componentMounted = true;

        (async () => {
            try {

                // Get cart data based on account ID
                const cartResponse = await axios.get(`${config.baseUrl}/cart`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const cartData = cartResponse.data;
                if (componentMounted) {
                    if (cartData.cart.length !== 0) {
                        let subTotal = 0, grandTotal = 0;
                        // set cart array here
                        setCartArr(() => {
                            return cartData.cart.map((cartDataObj: LooseObject, mapIndex: number) => {
                                subTotal += cartDataObj.quantity * parseFloat(cartDataObj.product.product_price);
                                return {
                                    quantity: cartDataObj.quantity,
                                    name: cartDataObj.product.product_name,
                                    unitPrice: parseFloat(cartDataObj.product.product_price),
                                    totalPrice: (() => {
                                        return cartDataObj.quantity * parseFloat(cartDataObj.product.product_price);
                                    })(),
                                    productID: cartDataObj.product.product_id
                                }
                            });
                        });
                        setOrderSummary(() => {
                            grandTotal = subTotal;
                            return {
                                grandTotal,
                                subTotal
                            }
                        });

                        // Check if user has any payment types stored already

                        // If there's payment methods set up already
                        if (cartData.account.payment_accounts.length > 0) {
                            console.log("there are already existing payment methods!");
                            console.log(cartData.account.payment_accounts);
                        } else {
                            // This else block can be removed
                            console.log("there are no existing payment methods!");
                        }

                        // If there are no payment intent
                        if (cartData.account.stripe_payment_intent_id === null) {

                            // Retrieve client secret here
                            // Set payment intent initial amount
                            const paymentIntent: LooseObject | null = await axios.post(`${config.baseUrl}/stripe/payment_intents`, {}, {
                                headers: {
                                    'Authorization': `Bearer ${token}`
                                }
                            });
                            console.log("paymentIntent");
                            console.log(paymentIntent);
                            setClientSecret(() => paymentIntent!.data.clientSecret);
                            console.log(paymentIntent!.data.paymentIntentID);
                            setPaymentIntentID(() => paymentIntent!.data.paymentIntentID);
                        } else {
                            console.log(cartData.account.stripe_payment_intent_client_secret)
                            setClientSecret(() => (cartData.account.stripe_payment_intent_client_secret));
                            console.log(cartData.account.stripe_payment_intent_id);
                            setPaymentIntentID(() => cartData.account.stripe_payment_intent_id);
                        }

                    } else {
                        setCartArr(() => []);
                    }

                    setTimeout(() => {
                        setPageStatus(() => PageStatusEnum.ACTIVE) // set page status to active
                    }, 300);
                }
            } catch (error) {
                console.log(error);
                if (componentMounted) {
                    setTimeout(() => {
                        setPageStatus(() => PageStatusEnum.ERROR) // set page status to error
                    }, 300);
                }
            }
        })();

        return (() => {
            componentMounted = false;
        });

    }, [rerender]);
    console.log(paymentIntentID);

    const cardStyle = {
        hidePostalCode: true,
        style: {
            base: {
                color: "#32325d",
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSmoothing: "antialiased",
                fontSize: "16px",
                "::placeholder": {
                    color: "#32325d"
                }
            },
            invalid: {
                color: "#fa755a",
                iconColor: "#fa755a"
            },
            complete: {
                color: '#45bc42',
                iconColor: '#45bc42'
            }
        }
    };

    // Handlers
    const handleCardInputChange = async (event: any) => {
        // Listen for changes in the CardElement
        // and display any errors as the customer types their card details
        if (event.complete) {
            setPaymentDisabled(false);
        } else {
            setPaymentDisabled(true);
        }

        setPaymentError(event.error ? event.error.message : "");
    };

    const handleFormSubmit = async (event: any) => {
        event.preventDefault();
        setPaymentProcessing(() => true);

        let paymentIntentUpdateSuccess = false;
        console.log(paymentIntentID);
        // Do final update for price before confirming payment
        try {
            await axios.put(`${config.baseUrl}/stripe/payment_intents`, {
                paymentIntentID
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            paymentIntentUpdateSuccess = true;
        } catch (error) {
            console.log(error);
            paymentIntentUpdateSuccess = false;
            setPaymentError(() => `Payment failed! Server encountered error!`);
            setPaymentProcessing(() => false);
        }

        // Only confirm payment if price update is successful
        if (paymentIntentUpdateSuccess) {
            console.log(paymentIntentID);
            let setup_future_usage: PaymentIntentConfirmParams.SetupFutureUsage | null | undefined = null;

            if (saveCard) {
                setup_future_usage = "off_session";
            }

            // Confirm card payment
            const payload: any = await stripe!.confirmCardPayment(clientSecret!, {
                payment_method: {
                    card: elements!.getElement(CardElement)!
                },
                setup_future_usage
            });

            if (payload.error) {
                setPaymentError(() => `Payment failed! ${payload.error.message}`);
                setPaymentProcessing(() => false);
            } else {
                setPaymentError(() => null);
                setPaymentProcessing(false);
                setPaymentSuccess(() => true);
            }
        }
    };

    const handleInputChange = () => {

    };

    const handleCheckboxChange = () => {
        setSaveCard((prevState) => !prevState);
    };

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
                <Title title="Checkout" />
                <Header rerender={rerender} />
                <div className="c-Checkout">
                    {
                        pageStatus === PageStatusEnum.ERROR ?
                            <Error />
                            :
                            pageStatus === PageStatusEnum.LOADING ?
                                <div className="c-Checkout__Skeleton">
                                    <ContentLoader viewBox="0 0 340 84">
                                        <rect x="0" y="0" width="67" height="10px" rx="3" />
                                        <rect x="76" y="0" width="140" height="10" rx="3" />
                                        <rect x="127" y="48" width="53" height="10" rx="3" />
                                        <rect x="187" y="48" width="72" height="10" rx="3" />
                                        <rect x="18" y="48" width="100" height="10" rx="3" />
                                        <rect x="0" y="71" width="37" height="10" rx="3" />
                                        <rect x="18" y="23" width="140" height="10" rx="3" />
                                        <rect x="166" y="23" width="173" height="10" rx="3" />
                                    </ContentLoader>
                                </div>

                                // to do skeleton loading here
                                :
                                cartArr.length === 0 ?
                                    // Cart is empty
                                    <div className="c-Checkout__Empty">
                                        <h1>Your cart is empty!</h1>
                                        <NavLink to="/products">Start adding products!</NavLink>
                                    </div>
                                    :
                                    paymentSuccess ?
                                        <CheckoutSuccess />
                                        :
                                        // Checkout
                                        <>
                                            {/* Checkout Form */}
                                            <form className="c-Checkout__Left" onSubmit={handleFormSubmit}>
                                                <h1>Checkout Details</h1>

                                                <div className="c-Left__Billing-info">
                                                    <h2>Shipping & Billing Information</h2>
                                                    <p>Not available.</p>
                                                </div>
                                                <div className="c-Left__Card-info">
                                                    <h2>Payment Information</h2>
                                                    <div className="l-Card-info__Card-element">
                                                        <div className="c-Card-info__Card-element">
                                                            {/* Card input is rendered here */}
                                                            <CardElement options={cardStyle} onChange={handleCardInputChange} />
                                                        </div>
                                                    </div>
                                                    {/* Show any error that happens when processing the payment */}
                                                    {paymentError && (
                                                        <div className="card-error" role="alert">
                                                            {paymentError}
                                                        </div>
                                                    )}
                                                    <div className="c-Card-info__Save-card">
                                                        <input name="saveCard" type="checkbox" onChange={handleCheckboxChange} checked={saveCard} value="saveCard" />
                                                        <label htmlFor="saveCard">Save Card for Future Payments</label>
                                                    </div>

                                                </div>
                                                <button
                                                    disabled={paymentProcessing || paymentDisabled}
                                                    className="c-Btn"
                                                    type="submit"
                                                >
                                                    {paymentProcessing ? (
                                                        <>
                                                            <span> Processing Payment...</span>
                                                            <Spinner animation="border" role="status" />
                                                        </>
                                                    ) : (
                                                        <>
                                                            Pay S${orderSummary.grandTotal ? orderSummary.grandTotal.toFixed(2) : "Error"}
                                                        </>
                                                    )}
                                                </button>
                                                <button
                                                    disabled={paymentProcessing}
                                                    className="c-Btn"
                                                    onClick={() => history.push("/cart")}
                                                    type="button"
                                                >Back to Cart
                                                </button>
                                            </form>
                                            {/* Summary */}
                                            <div className="c-Checkout__Right">
                                                <h1>Summary</h1>
                                                <div className="l-Checkout__Checkout-card">
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
                                                    </div>
                                                </div>
                                            </div>
                                        </>


                    }
                </div>
            </div>
        </>

    )
}

export default Checkout;
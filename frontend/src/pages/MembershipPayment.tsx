import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Title from '../common/Title';
import Header from '../layout/Header';
import config from '../config/config';
import { toast, ToastContainer } from 'react-toastify';
import { getToken } from '../utilities/localStorageUtils';
import { RouteComponentProps, useHistory } from 'react-router';
import LoggedOut from '../common/LoggedOut';
import Spinner from 'react-bootstrap/Spinner'
import Error from "../common/Error";
import {
    CardElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import SetupPaymentMethod from '../common/SetupPaymentMethod';
import SelectPaymentMethod from '../common/SelectPaymentMethod';
import { PageStatusEnum } from '../config/enums';
import * as BiIcons from 'react-icons/bi';
import { IconContext } from 'react-icons';
import jwt_decode from "jwt-decode";

interface MatchParams {
    name: string;
    type: string;
}
interface LooseObject {
    [key: string]: any
};

interface OrderSummaryInterface {
    grandTotal: number | null;
    subTotal: number | null;
}

interface Props extends RouteComponentProps<MatchParams> {
}

const MembershipPayment: React.FC<Props> = ({ match }) => {
    // state declarations
    const toastTiming = config.toastTiming;
    const history = useHistory();
    const token: string | null = getToken();
    let accountID: string;
    if (token) {
        const decodedToken: LooseObject = jwt_decode(token!);
        accountID = decodedToken.account_id;
    }

    const [rerender, setRerender] = useState<boolean>(false);
    const [pageStatus, setPageStatus] = useState<PageStatusEnum>(PageStatusEnum.LOADING);
    const [price, setPrice] = useState<string | null>(null);
    const [paymentMethods, setPaymentMethods] = useState<[]>([]);
    const [showSetupPaymentMethod, setShowSetupPaymentMethod] = useState<boolean>(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
    const [orderSummary, setOrderSummary] = useState<OrderSummaryInterface>({
        grandTotal: null,
        subTotal: null
    });

    // Stripe
    const [paymentError, setPaymentError] = useState<string | null>(null);
    const [paymentProcessing, setPaymentProcessing] = useState(false);
    const [paymentDisabled, setPaymentDisabled] = useState(true);
    const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
    const [paymentIntentID, setPaymentIntentID] = useState<string | null>(null);
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const stripe = useStripe();

    let displayType;

    if (match.params.type !== "standard") {
        history.push("/page-not-found");
    } else {
        // Uppercase first letter of the string
        displayType = match.params.type.charAt(0).toUpperCase() + match.params.type.slice(1);
    }

    useEffect(() => {
        let componentMounted = true;

        if (!paymentSuccess) {
            (async () => {
                try {
                    // Get membership price
                    const membershipResponse = await axios.get(`${config.baseUrl}/membership/${match.params.type}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    const membershipData = membershipResponse.data;

                    // Get account info
                    const accountResponse = await axios.get(`${config.baseUrl}/account/${accountID}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    const accountData = accountResponse.data;

                    if (componentMounted) {
                        if (membershipData) {
                            let subTotal = 0, grandTotal = 0;
                            setPrice(() => membershipData.price);
                            subTotal = parseFloat(membershipData.price);
                            setOrderSummary(() => {
                                grandTotal = subTotal;
                                return {
                                    grandTotal,
                                    subTotal
                                }
                            });
                        }

                        if (accountData) {
                            console.log(accountData);
                            const paymentMethods = accountData.account.payment_accounts;
                            setPaymentMethods(() => paymentMethods.map((paymentMethod: LooseObject) => ({
                                cardBrand: paymentMethod.stripe_card_type,
                                last4: paymentMethod.stripe_card_last_four_digit,
                                expDate: paymentMethod.stripe_card_exp_date,
                                stripePaymentMethodID: paymentMethod.stripe_payment_method_id
                            })));
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
        }

        return (() => {
            componentMounted = false;
        });


    }, [rerender]);

    useEffect(() => {
        let componentMounted = true;
        if (componentMounted) {
            if (selectedPaymentMethod !== null) {
                setPaymentDisabled(() => false);
            } else {
                setPaymentDisabled(() => true);
            }
        }
        return (() => {
            componentMounted = false;
        });
    }, [selectedPaymentMethod]);

    // Handlers
    const handleShowSetupPaymentMethod = () => {
        setShowSetupPaymentMethod((prevState) => !prevState);
        setSelectedPaymentMethod(() => null);
    };

    const handleSelectPaymentMethod = (stripePaymentMethodID: string) => {
        if (stripePaymentMethodID === selectedPaymentMethod) {
            setSelectedPaymentMethod(() => null);
        } else {
            setSelectedPaymentMethod(() => stripePaymentMethodID);
        }
    };

    const handleFormSubmit = async (event: any) => {
        event.preventDefault();
        setPaymentProcessing(() => true);

        let paymentIntentUpdateSuccess = false;

        // Do final update for price before confirming payment
        // try {
        //     await axios.put(`${config.baseUrl}/stripe/payment_intents`, {
        //         paymentIntentID
        //     }, {
        //         headers: {
        //             'Authorization': `Bearer ${token}`
        //         }
        //     });
        //     paymentIntentUpdateSuccess = true;
        // } catch (error) {
        //     console.log(error);
        //     paymentIntentUpdateSuccess = false;
        //     setPaymentError(() => `Payment failed! Server encountered error!`);
        //     setPaymentProcessing(() => false);
        // }

        // // Only confirm payment if price update is successful
        // if (paymentIntentUpdateSuccess) {
        //     if (selectedPaymentMethod) {
        //         const payload: any = await stripe!.confirmCardPayment(clientSecret!, {
        //             payment_method: selectedPaymentMethod
        //         });

        //         if (payload.error) {
        //             setPaymentError(() => `Payment failed! ${payload.error.message}`);
        //             setPaymentProcessing(() => false);
        //         } else {
        //             setPaymentError(() => null);
        //             setPaymentProcessing(false);
        //             setPaymentSuccess(() => true);
        //             setRerender((prevState) => !prevState);
        //         }
        //     }
        // }
    };

    return (
        <>
            <SetupPaymentMethod show={showSetupPaymentMethod} handleClose={handleShowSetupPaymentMethod} setRerender={setRerender} />
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
            <Title title="Membership Payment" />
            <main className="l-Main">
                <Header />
                <div className="l-Membership-payment">
                    {
                        token ?
                            <div className="c-Membership-payment">
                                {/* Left */}
                                <form className="c-Membership-payment__Left" onSubmit={handleFormSubmit}>
                                    <h1>Payment Details</h1>
                                    <div className="c-Membership-payment__Billing-info">
                                        <h2>Shipping & Billing Information</h2>
                                        <p>Not available.</p>
                                    </div>
                                    <div className="c-Membership-payment__Card-info">
                                        <h2>Payment Mode</h2>
                                        {
                                            paymentMethods.length > 0 ?
                                                paymentMethods.map((paymentMethod: any, index) => (
                                                    <div className="c-Card-info__Payment-methods" key={index}>
                                                        <SelectPaymentMethod index={index} cardBrand={paymentMethod.cardBrand} last4={paymentMethod.last4} expDate={paymentMethod.expDate} stripePaymentMethodID={paymentMethod.stripePaymentMethodID} selectedPaymentMethod={selectedPaymentMethod} handleSelectPaymentMethod={handleSelectPaymentMethod} disabled={paymentProcessing} />
                                                    </div>
                                                ))
                                                :
                                                <p>No payment methods found.</p>
                                        }

                                        <div className={paymentProcessing ? "l-Card-info__Add-card l-Card-info__Add-card--disabled" : "l-Card-info__Add-card"}>
                                            <div className={paymentProcessing ? "c-Card-info__Add-card c-Card-info__Add-card--disabled" : "c-Card-info__Add-card"} onClick={handleShowSetupPaymentMethod}>
                                                <p>
                                                    <IconContext.Provider value={{ color: "#172b4d", size: "21px" }}>
                                                        <BiIcons.BiCreditCard className="c-Add-card__Icon" />
                                                    </IconContext.Provider>
                                                    Add Credit / Debit Card
                                                </p>
                                            </div>
                                        </div>

                                        {/* Show any error that happens when processing the payment */}
                                        {paymentError && (
                                            <div className="card-error" role="alert">
                                                {paymentError}
                                            </div>
                                        )}
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
                                        onClick={() => history.push("/membership")}
                                        type="button"
                                    >Back to Memberships
                                    </button>
                                </form>
                                {/* Right */}
                                <div className="c-Membership-payment__Right">
                                    <h1>Summary</h1>
                                    <div className="c-Membership-payment__Summary">
                                        <h2>{displayType} Subscription</h2>
                                        <h3>{price ? `S$${price} per month.` : "Error"}</h3>
                                    </div>
                                    <hr />
                                    <div className="c-Membership-payment__Sub-total">
                                        <h2>Sub Total</h2>
                                        <h3>S${orderSummary.subTotal ? orderSummary.subTotal!.toFixed(2) : "Error!"}</h3>
                                    </div>
                                    <div className="c-Membership-payment__Grand-total">
                                        <h2>Grand Total</h2>
                                        <h3>S${orderSummary.grandTotal ? orderSummary.grandTotal!.toFixed(2) : "Error!"}</h3>
                                    </div>

                                </div>

                            </div>
                            :
                            <LoggedOut />
                    }
                </div>
            </main>
        </>
    )
}

export default MembershipPayment;
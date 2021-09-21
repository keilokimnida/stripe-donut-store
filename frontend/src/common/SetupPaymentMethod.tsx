import React, { useState, useEffect } from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { toast } from 'react-toastify';
import { getToken } from '../utilities/localStorageUtils';
import axios from 'axios';
import jwt_decode from "jwt-decode";
import config from '../config/config';

interface Props {
    show: boolean,
    handleClose: Function
}

interface LooseObject {
    [key: string]: any
}

const SetupPaymentMethod: React.FC<Props> = ({ show, handleClose }) => {

    const [cardSetupError, setCardSetupError] = useState<string | null>(null);
    const [setupIntentID, setSetupIntentID] = useState<string | null>(null);
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const token: string | null = getToken();
    let accountID: string;
    if (token) {
        const decodedToken: LooseObject = jwt_decode(token!);
        accountID = decodedToken.account_id;
    }


    useEffect(() => {
        let componentMounted = true;

        (async () => {
            try {
                if (componentMounted) {
                    // Retrieve client secret here
                    const setupIntent: LooseObject | null = await axios.post(`${config.baseUrl}/stripe/setup_intents`, {}, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    setClientSecret(() => setupIntent!.data.clientSecret);
                    setSetupIntentID(() => setupIntent!.data.paymentIntentID);
                }
            } catch (error) {
                console.log(error);
            }
        })()

        return (() => {
            componentMounted = false;
        });
    }, [show]);

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

    const handleSubmit = async (event: any) => {
        event.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }

        const result = await stripe.confirmCardSetup(clientSecret!, {
            payment_method: {
                card: elements.getElement(CardElement)!
            },
        });

        if (result.error) {
            setCardSetupError(() => result.error.message as string | null);
            // Display result.error.message in your UI.
        } else {
            // The setup has succeeded. Display a success message and send
            // result.setupIntent.payment_method to your server to save the
            // card to a Customer

            // Obtain payment method id
            const stripePaymentMethodID = result.setupIntent.payment_method;

            // Verify stripePaymentMethod fingerprint doesn't already exist
            try {
                const verifyPaymentMethodDuplicate = await axios.post(`${config.baseUrl}/stripe/verify_payment_method_setup`, {
                    stripePaymentMethodID
                }, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
    
                if (verifyPaymentMethodDuplicate.data.duplicate) {
                    setCardSetupError(() => "Error! Card already exists!");
                } else {
                    toast.success('Successfully added payment method!');
                    elements!.getElement(CardElement)!.clear();
                    handleClose();
                }
            } catch (error) {
                console.log(error);
                setCardSetupError(() => "Error! Please try again later!");
            }

        }
    };

    const handleBtn = () => {
        // Clear stripe element before closing
        elements!.getElement(CardElement)!.clear();
        handleClose();
    };

    const handleCardInputChange = async (event: any) => {
        // Listen for changes in the CardElement
        // and display any errors as the customer types their card details

        setCardSetupError(event.error ? event.error.message : "");
    };

    return (
        <form className={showHideClassName} onSubmit={(event) => handleSubmit(event)}>
            <div className="c-Setup-payment-method">
                <h1>Add Payment Method</h1>
                <div className="l-Setup-payment-method__Card-element">
                    <div className="c-Setup-payment-method__Card-element">
                        {/* Card input is rendered here */}
                        <CardElement options={CARD_ELEMENT_OPTIONS} onChange={handleCardInputChange} />
                    </div>
                </div>
                {/* Show any error that happens when setting up the payment method */}
                {cardSetupError && (
                    <div className="card-error" role="alert">
                        {cardSetupError}
                    </div>
                )}
                <div className="c-Setup-payment-method__Btn">
                    <button type="button" className="c-Btn" onClick={(event) => handleSubmit(event)}>Save</button>
                    <button type="button" className="c-Btn c-Btn--link" onClick={() => handleBtn()}>Cancel</button>
                </div>
            </div>
        </form>
    )
}

export default SetupPaymentMethod;
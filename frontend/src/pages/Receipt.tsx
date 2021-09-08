import React, { useEffect, useState } from 'react';
import Header from '../layout/Header';
import config from '../config/config';
import Title from '../common/Title';
import { toast, ToastContainer } from 'react-toastify';
import { getToken } from '../utilities/localStorageUtils';
import { RouteComponentProps, useHistory, NavLink } from 'react-router-dom';
import CheckoutSuccess from '../common/CheckoutSuccess'; // for testing oni

interface MatchParams {
    name: string;
    receiptID: string;
}

interface Props extends RouteComponentProps<MatchParams> {
}

interface LooseObject {
    [key: string]: any
};

const Receipt: React.FC<Props> = ({ match }) => {
    const toastTiming = config.toastTiming;
    const history = useHistory();
    const token = getToken();

    const receiptID = match.params.receiptID;

    return (
        <>
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
            <Title title="Receipt" />
            <div className="l-Main">
                <Header />
                <CheckoutSuccess 
                    receiptURL="https://dashboard.stripe.com/emails/receipts/pmtrc_1JWIXkK7vevnRCV2LzmgoxVV"
                />
            </div>
        </>
    )
}

export default Receipt;
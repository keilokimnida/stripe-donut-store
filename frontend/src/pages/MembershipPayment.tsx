import React from 'react';
import Title from '../common/Title';
import Header from '../layout/Header';
import config from '../config/config';
import { toast, ToastContainer } from 'react-toastify';
import { getToken } from '../utilities/localStorageUtils';
import { RouteComponentProps, useHistory } from 'react-router';

interface MatchParams {
    name: string;
    type: string;
}

interface Props extends RouteComponentProps<MatchParams> {
}

const MembershipPayment: React.FC<Props> = ({ match }) => {
    const toastTiming = config.toastTiming;
    const history = useHistory();

    if (match.params.type !== "standard") {
        history.push("/page-not-found");
    }

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
            <Title title="Membership Payment" />
            <main className="l-Main">
                <Header />
                <div className="c-Membership-payment">
                    <h1>Choose the Plan that's Right for You</h1>
                </div>
            </main>
        </>
    )
}

export default MembershipPayment;
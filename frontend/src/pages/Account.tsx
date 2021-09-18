import React, { useState, useEffect } from 'react';
import Title from '../common/Title';
import Header from '../layout/Header';
import config from '../config/config';
import { toast, ToastContainer } from 'react-toastify';
import { Formik, Form } from 'formik';
import jwt_decode from "jwt-decode";
import { getToken } from '../utilities/localStorageUtils';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import LoggedOut from '../common/LoggedOut';
import Skeleton from '@material-ui/lab/Skeleton';
import BootstrapTable from 'react-bootstrap-table-next';
import dayjs from 'dayjs';
import MCSVG from "../assets/svg/MC.svg";
import visaSVG from "../assets/svg/Visa_2021.svg";
import amexSVG from "../assets/svg/Amex.svg";
import { ReactSVG } from 'react-svg'

const Account: React.FC = () => {

    interface LooseObject {
        [key: string]: any
    }

    interface accountDataInterface {
        firstName: string | null;
        lastName: string | null;
        email: string | null;
        username: string | null;
    }

    const toastTiming: number = config.toastTiming;
    const token: string | null = getToken();
    let accountID: string;
    if (token) {
        const decodedToken: LooseObject = jwt_decode(token!);
        accountID = decodedToken.account_id;
    }

    // State declarations
    const [profileData, setProfileData] = useState<accountDataInterface>({
        firstName: null,
        lastName: null,
        email: null,
        username: null
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [paymentHistory, setPaymentHistory] = useState<[]>([]);
    const [paymentMethods, setPaymentMethods] = useState<[]>([]);

    useEffect(() => {
        let componentMounted = true;

        // Get account data by ID
        axios.get(`${config.baseUrl}/account/${accountID}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((res) => {
                console.log(res);
                const data = res.data;
                if (componentMounted) {

                    if (data.account && data.orders) {
                        setProfileData(() => ({
                            firstName: data.account.firstname,
                            lastName: data.account.lastname,
                            email: data.account.email,
                            username: data.account.username
                        }));
                        setPaymentHistory(() => data.orders.map((order: any, index: number) => ({
                            serialNo: index + 1,
                            orderID: order.order_id,
                            amount: "S$" + order.amount,
                            cardType: order.stripe_payment_method_type,
                            cardLastFourDigit: "●●●● " + order.stripe_payment_method_last_four_digit,
                            createdAt: dayjs(new Date(order.created_at)).format("MMMM D, YYYY h:mm A"),
                        })));
                        setPaymentMethods(() => data.account.payment_accounts.map((paymentAccount: any, index: number) => ({
                            serialNo: index + 1,
                            paymentMethodID: paymentAccount.payment_methods_id,
                            cardType: paymentAccount.stripe_card_type,
                            cardLastFourDigit: "●●●● " + paymentAccount.stripe_card_last_four_digit,
                            createdAt: dayjs(new Date(paymentAccount.created_at)).format("MMMM D, YYYY h:mm A")
                        })));

                    }
                    setTimeout(() => {
                        setLoading(() => false);
                    }, 300);
                }
            })
            .catch((err) => {
                console.log(err);
                if (componentMounted) {
                    setProfileData(() => ({
                        firstName: "Error",
                        lastName: "Error",
                        email: "Error",
                        username: "Error"
                    }));
                    setTimeout(() => {
                        setLoading(() => false);
                    }, 300);
                }
            });

        return (() => {
            componentMounted = false;
        });
    }, []);

    const paymentHistoryColumn = [
        {
            dataField: 'orderID',
            text: 'Id',
            hidden: true
        },
        {
            dataField: 'serialNo',
            text: '#',
        },
        {
            dataField: 'amount',
            text: 'Amount',
        },
        {
            dataField: 'cardType',
            text: 'Card Type',
            formatter: (cell: any, row: any) => {
                if (cell === "visa") {
                    return <ReactSVG
                        src={visaSVG}
                        className="c-Payment-history__SVG c-SVG__Visa"
                    />
                } else if (cell === "mastercard") {
                    return <ReactSVG
                        src={MCSVG}
                        className="c-Payment-history__SVG c-SVG__Master"
                    />
                } else if (cell === "amex") {
                    return <ReactSVG
                        src={amexSVG}
                        className="c-Payment-history__SVG c-SVG__Amex"
                    />
                } else {
                    return cell;
                }
            }
        },
        {
            dataField: 'cardLastFourDigit',
            text: 'Last 4 Digit',
        },
        {
            dataField: 'createdAt',
            text: 'Paid on'
        }
    ];
    const paymentMethodsColumn = [
        {
            dataField: 'paymentMethodID',
            text: 'Id',
            hidden: true
        },
        {
            dataField: 'serialNo',
            text: '#',
        },
        {
            dataField: 'cardType',
            text: 'Card Type',
            formatter: (cell: any, row: any) => {
                if (cell === "visa") {
                    return <ReactSVG
                        src={visaSVG}
                        className="c-Payment-history__SVG c-SVG__Visa"
                    />
                } else if (cell === "mastercard") {
                    return <ReactSVG
                        src={MCSVG}
                        className="c-Payment-history__SVG c-SVG__Master"
                    />
                } else if (cell === "amex") {
                    return <ReactSVG
                        src={amexSVG}
                        className="c-Payment-history__SVG c-SVG__Amex"
                    />
                } else {
                    return cell;
                }
            }
        },
        {
            dataField: 'cardLastFourDigit',
            text: 'Last 4 Digit',
        },
        {
            dataField: 'createdAt',
            text: 'Added on'
        }
    ];

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
                <Title title="Account" />
                <Header />
                <div className="c-Account">
                    {
                        token ?
                            loading ?
                                <div className="c-Account__Profile">
                                    <h1>Profile</h1>
                                    <hr />
                                    <div className="c-Profile__Details">
                                        <div className="c-Profile__Labels">
                                            <label htmlFor="email"><Skeleton variant="text" width={100} /></label>
                                            <label htmlFor="username"><Skeleton variant="text" width={80} /></label>
                                            <label htmlFor="firstname"><Skeleton variant="text" width={120} /></label>
                                            <label htmlFor="lastname"><Skeleton variant="text" width={110} /></label>
                                        </div>
                                        <div className="c-Profile__Info">
                                            <p><Skeleton variant="text" width={200} /></p>
                                            <p><Skeleton variant="text" width={120} /></p>
                                            <p><Skeleton variant="text" width={50} /></p>
                                            <p><Skeleton variant="text" width={40} /></p>
                                        </div>
                                    </div>
                                </div>
                                :
                                <>
                                    {/* Profile */}
                                    <div className="c-Account__Profile">
                                        <div className="c-Account__Heading">
                                            <h1>Profile</h1>
                                            <div className="c-Heading__Btn">
                                                <button type="button" className="c-Btn">Edit</button>
                                            </div>
                                        </div>
                                        <hr />
                                        <div className="c-Profile__Details">
                                            <div className="c-Profile__Labels">
                                                <label htmlFor="email">Email</label>
                                                <label htmlFor="username">Username</label>
                                                <label htmlFor="firstname">First Name</label>
                                                <label htmlFor="lastname">Last Name</label>
                                            </div>
                                            <div className="c-Profile__Info">
                                                <p>{profileData.email || "Error"}</p>
                                                <p>{profileData.username || "Error"}</p>
                                                <p>{profileData.firstName || "Error"}</p>
                                                <p>{profileData.lastName || "Error"}</p>
                                            </div>
                                        </div>
                                        {/* <Formik
                            initialValues={{
                                email: '',
                                firstname: '',
                                lastname: '',
                                username: '',
                                password: ''
                            }}
                            onSubmit={(values, actions) => {
                                console.log({ values, actions });
                            }}
                        >
                            {formik => (
                                <Form>
                                    <button type="submit">Submit</button>
                                </Form>
                            )
                            }
                        </Formik> */}
                                    </div>
                                    {/* Payment methods */}
                                    <div className="c-Account__Payment-method">
                                        <div className="c-Account__Heading">
                                            <div className="c-Heading__Text">
                                                <h1>Payment Methods</h1>
                                                <p>Add a payment method to save time during checkout!</p>
                                            </div>
                                            <div className="c-Heading__Btn">
                                                <button type="button" className="c-Btn">Add</button>
                                            </div>
                                        </div>
                                        <hr />
                                        {
                                            paymentMethods.length === 0 ?
                                                <p>No Payment Methods Found!</p>
                                                :
                                                <BootstrapTable
                                                    bordered={false}
                                                    keyField="payment"
                                                    data={paymentMethods}
                                                    columns={paymentMethodsColumn}
                                                />
                                        }

                                    </div>
                                    {/* Payment history */}
                                    <div className="c-Account__Payment-history">
                                        <div className="c-Account__Heading">
                                          
                                            <div className="c-Heading__Text">
                                            <h1>Payment History</h1>
                                            <p>Payment history for membership and products. Receipt is sent to billing email.</p>
                                        </div>
                                        </div>
                                        
                                        <hr />
                                        <div className="c-Payment-history__Details">
                                            {
                                                paymentHistory.length === 0 ?
                                                    <p>No Payment History Found!</p>
                                                    :
                                                    <BootstrapTable
                                                        bordered={false}
                                                        keyField="receiptID"
                                                        data={paymentHistory}
                                                        columns={paymentHistoryColumn}
                                                    />
                                            }
                                        </div>
                                    </div>
                                    {/* Membership */}
                                    <div className="c-Account__Membership">
                                        <h1>Membership</h1>
                                        <hr />
                                        <p>No Records Found!</p>
                                    </div>
                                </>
                            :
                            <LoggedOut type="Manage Account" />
                    }
                    {/* Profile */}

                    {/* Purchase history */}
                </div>
            </div>
        </>
    )
}

export default Account;
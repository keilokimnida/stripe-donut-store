import React, { useState, useEffect } from 'react';
import Title from '../common/Title';
import Header from '../layout/Header';
import config from '../config/config';
import { toast, ToastContainer } from 'react-toastify';
import { Formik, Form } from 'formik';
import jwt_decode from "jwt-decode";
import { getToken } from '../utilities/localStorageUtils';
import axios from 'axios';

const Account: React.FC = () => {

    interface LooseObject {
        [key: string]: any
    }

    interface accountDataInterface {
        firstName: string;
        lastName: string;
        email: string;
        username: string;
    }

    const toastTiming: number = config.toastTiming;
    const token: string | null = getToken();
    const decodedToken: LooseObject = jwt_decode(token!);
    const accountID = decodedToken.account_id;

    // State declarations
    const [accountData, setAccountData] = useState<accountDataInterface>({
        firstName: "",
        lastName: "",
        email: "",
        username: ""
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [editMode, setEditMode] = useState<boolean>(false);

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
                setAccountData(() => ({
                    firstName: data.firstname,
                    lastName: data.lastname,
                    email: data.email,
                    username: data.username
                }));
            }
        })
        .catch((err) => {
            console.log(err);
            if (componentMounted) {
                setAccountData(() => ({
                    firstName: "Error",
                    lastName: "Error",
                    email: "Error",
                    username: "Error"
                }));
            }
        });

        return (() => {
            componentMounted = false;
        });
    }, []);

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
                    {/* Profile */}
                    <div className="c-Account__Profile">
                        <h1>Profile</h1>
                        <hr/>
                        <div className = "c-Profile__Details">
                            <div className = "c-Profile__Labels">
                                <label htmlFor="email">Email</label>
                                <label htmlFor="username">Username</label>
                                <label htmlFor="firstname">First Name</label>
                                <label htmlFor="lastname">Last Name</label>
                            </div>
                            <div className = "c-Profile__Info">
                                <p>{accountData.email}</p>
                                <p>{accountData.username}</p>
                                <p>{accountData.firstName}</p>
                                <p>{accountData.lastName}</p>
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
                </div>
            </div>
        </>
    )
}

export default Account;
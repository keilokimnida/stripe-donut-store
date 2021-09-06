import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { getToken } from '../utilities/localStorageUtils';
import config from '../config/config';
import jwt_decode from "jwt-decode";
import Title from '../common/Title';
import Header from '../layout/Header';
import { NavLink } from 'react-router-dom';
import LoggedOut from '../common/LoggedOut';

const Cart: React.FC = () => {

    interface LooseObject {
        [key: string]: any
    }

    const toastTiming = config.toastTiming;
    const token: string | null = getToken();
    let accountID: string;
    if (token) {
        const decodedToken: LooseObject = jwt_decode(token!);
        accountID = decodedToken.account_id;
    }

    // State declarations
    const [cartArr, setCartArr] = useState<[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        let componentMounted = true;

        axios.get(`${config.baseUrl}/cart/${accountID}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((res) => {
                console.log(res);
                const data = res.data;
                if (componentMounted) {
                    if (data.length !== 0) {
                        // set cart array here
                    }
                    setLoading(() => false);
                }
            })
            .catch((err) => {
                console.log(err);
                if (componentMounted) {
                    setLoading(() => false);
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
                <Title title="Cart" />
                <Header />
                <div className="c-Cart">
                    {
                        token ?
                            cartArr.length === 0 ?
                                <div className="c-Cart__Empty">
                                    <h1>Your cart is empty!</h1>
                                    <NavLink to="/products">Start adding products!</NavLink>
                                </div>
                                :
                                null
                            :
                            <LoggedOut type="Cart"/>
                    }
                </div>
            </div>
        </>
    )
}

export default Cart;
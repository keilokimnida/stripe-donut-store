import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';

import Title from '../common/Title';
import Header from '../layout/Header';
import config from '../config/config';
import axios from 'axios';


const Membership: React.FC = () => {
    const toastTiming = config.toastTiming;

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
            <Title title="Membership" />
            <main className="l-Main">
                <Header />
                <div className="c-Membership">
                    <h1>Choose the Plan that's Right for You</h1>
                    <div className="c-Membership__Card">
                        <div className="c-Card__Title">
                            <h1>Standard</h1>
                        </div>
                        <div className="c-Card__Price">
                            <h1>S$9.90</h1>
                            <p>per month</p>
                        </div>
                        <div className="c-Card__Description">
                            <p>It's now or never, sign up now to get exclusive deals for Stripe Donuts!</p>
                        </div>
                        <div className="c-Card__Btn">
                            <button type = "button">Get Started</button>
                        </div>

                    </div>
                </div>
            </main>
        </>
    )
}

export default Membership;
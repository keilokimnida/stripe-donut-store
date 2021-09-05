import React, { useState } from 'react';
import  { toast, ToastContainer } from 'react-toastify';

import Title from '../common/Title';
import Header from '../common/Header';
import config from '../config/config';

const Products: React.FC = () => {
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
            <Title title="Products" />
            <main className = "l-Main">
                <Header />
            </main>
        </>
    )
}

export default Products;
import React, { useState } from 'react';
import  { toast, ToastContainer } from 'react-toastify';

import Title from '../common/Title';
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
        </>
    )
}

export default Products;
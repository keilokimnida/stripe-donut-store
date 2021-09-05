import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import donutImg from '../assets/images/donut.jpg';

import Title from '../common/Title';
import Header from '../layout/Header';
import config from '../config/config';
import ProductCard from '../common/ProductCard';
import axios from 'axios';

const Products: React.FC = () => {
    const toastTiming = config.toastTiming;

    // State declarations
    const [productArr, setProductArr] = useState<[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {

        let componentMounted = true;

        axios.get(`${config.baseUrl}/products`)
        .then((res) => {
            console.log(res);
            const data = res.data;
            if (componentMounted) {
                setProductArr(() => {
                    return data.map((productData: {[key: string]: any}) => ({
                        productID: productData.product_id,
                        productTitle: productData.product_name,
                        price: parseFloat(productData.product_price),
                    }));
                });
            }
        })
        .catch((err) => {
            console.log(err);
        });

        // Clean up to prevent memory leak
        // Boolean flag method
        // https://medium.com/wesionary-team/how-to-fix-memory-leak-issue-in-react-js-using-hook-a5ecbf9becf8
        return (() => {
            componentMounted = false;
        });
    }, []);

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
            <main className="l-Main">
                <Header />
                <div className="c-Products">
                    {
                        productArr.map((data : {[key: string]: any}, index : number) : JSX.Element => {
                            return <ProductCard 
                                        key={index} 
                                        productID = {data.productID} 
                                        productTitle={data.productTitle} 
                                        price={data.price} 
                                        productImg={donutImg}
                                    />
                        })
                    }
                </div>
            </main>
        </>
    )
}

export default Products;
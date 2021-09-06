import React, { useEffect, useState } from 'react';
import donutImg from '../assets/images/donut.jpg';
import Title from '../common/Title';
import Header from '../layout/Header';
import config from '../config/config';
import { toast, ToastContainer } from 'react-toastify';
import { getToken } from '../utilities/localStorageUtils';
import { RouteComponentProps, useHistory, NavLink } from 'react-router-dom';
import axios from 'axios';

interface MatchParams {
    name: string;
    productID: string;
}

interface Props extends RouteComponentProps<MatchParams> {
}

interface LooseObject {
    [key: string]: any
};

const ProductDetails: React.FC<Props> = ({ match }) => {

    const toastTiming = config.toastTiming;
    const history = useHistory();
    const token = getToken();

    if (isNaN(parseInt(match.params.productID))) {
        history.push("/page-not-found");
    }
    const productID = match.params.productID;

    // State declaration
    const [productInfo, setProductInfo] = useState<LooseObject>({
        productID: null,
        productTitle: null,
        price: null,
        description: null
    });

    useEffect(() => {
        let componentMounted = true;
        axios.get(`${config.baseUrl}/product/${productID}`)
            .then((res) => {
                console.log(res);
                const data = res.data;
                if (componentMounted) {
                    setProductInfo(() => ({
                        productID: data.product_id,
                        productTitle: data.product_name,
                        price: parseFloat(data.product_price),
                        description: data.description
                    }));
                }
            })

            .catch((err) => {
                console.log(err);
            });
        return (() => {
            componentMounted = false;
        });
    }, []);

    // Handlers
    const handleAddToCartBtn = () => {

    };

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
            <Title title="Product Details" />
            <main className="l-Main">
                <Header />
                <div className="c-Product-details">
                    <div className="c-Product-details__Img">
                        <img src={donutImg} alt="Product" />
                    </div>
                    <div className="c-Product-details__Info">
                        <h1>{productInfo.productTitle ? productInfo.productTitle : "Error"}</h1>
                        <h2>S${productInfo.price ? productInfo.price.toFixed(2) : "Error"}</h2>
                        <p>{productInfo.description ? productInfo.description : "Error"}</p>
                        {
                            token ?
                                <button type="button" className="c-Btn" onClick={() => handleAddToCartBtn()}>Add to Cart</button>
                                :
                                <>
                                    <h3>Please Login to Add Product to Cart!</h3>
                                    <NavLink to="/login">Go to Login</NavLink>
                                </>
                        }
                    </div>
                </div>
            </main>

        </>
    )
}

export default ProductDetails;
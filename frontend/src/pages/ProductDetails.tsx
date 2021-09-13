import React, { useEffect, useState } from 'react';
import donutImg from '../assets/images/donut.jpg';
import Title from '../common/Title';
import ProductQty from '../common/ProductQty';
import Header from '../layout/Header';
import config from '../config/config';
import { toast, ToastContainer } from 'react-toastify';
import { getToken } from '../utilities/localStorageUtils';
import { RouteComponentProps, useHistory, NavLink } from 'react-router-dom';
import axios from 'axios';
import jwt_decode from "jwt-decode";
import Skeleton from '@material-ui/lab/Skeleton';
import { PageStatusEnum } from '../config/enums';
import Error from "../common/Error";

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
    let accountID: string;
    if (token) {
        const decodedToken: LooseObject = jwt_decode(token!);
        accountID = decodedToken.account_id;
    }

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
    const [pageStatus, setPageStatus] = useState<PageStatusEnum>(PageStatusEnum.LOADING);
    const [qty, setQty] = useState<number>(1);
    const [rerender, setRerender] = useState<boolean>(false);
    const [inCartAlready, setInCartAlready] = useState<boolean>(false);

    useEffect(() => {
        let componentMounted = true;
        // get product info
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
        // check if user has added it in cart already
        axios.get(`${config.baseUrl}/cart/${productID}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((res) => {
                console.log(res);
                if (componentMounted) {
                    if (res.data === "") {
                        setInCartAlready(() => false);
                    } else {
                        setInCartAlready(() => true);
                    }
                    setTimeout(() => {
                        setPageStatus(() => PageStatusEnum.ACTIVE); // set page status to active

                    }, 300);
                }
            })
            .catch((err) => {
                console.log(err);
                if (componentMounted) {
                    setTimeout(() => {
                        setPageStatus(() => PageStatusEnum.ERROR); // set page status to error
                    }, 300);
                }
            });
        return (() => {
            componentMounted = false;
        });
    }, [rerender]);

    // Handlers
    const handleAddToCartBtn = () => {
        axios.post(`${config.baseUrl}/cart`, {
            productID,
            quantity: qty
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((res) => {
                console.log(res);
                setRerender((prevState) => !prevState);
                toast.success('Successfully Added Item to Cart!');
            })
            .catch((err) => {
                console.log(err);
                let errCode = "Error!";
                let errMsg = "Error!"
                if (err.response !== undefined) {
                    errCode = err.response.status;
                    errMsg = err.response.data.message;
                }
                toast.error(<>Error Code: <b>{errCode}</b><br />Message: <b>{errMsg}</b></>);
            });
    };

    const handleRemoveFromCart = () => {
        axios.delete(`${config.baseUrl}/cart/${productID}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((res) => {
                console.log(res);
                setRerender((prevState) => !prevState);
                toast.success('Successfully Removed Item from Cart!');
            })
            .catch((err) => {
                console.log(err);
                let errCode = "Error!";
                let errMsg = "Error!"
                if (err.response !== undefined) {
                    errCode = err.response.status;
                    errMsg = err.response.data.message;
                }
                toast.error(<>Error Code: <b>{errCode}</b><br />Message: <b>{errMsg}</b></>);
            });
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
                <Header rerender={rerender} />
                <div className="c-Product-details">
                    {
                        pageStatus === PageStatusEnum.ERROR ?
                            <Error />
                            :
                            pageStatus === PageStatusEnum.LOADING ?
                                <>
                                    <div className="c-Product-details__Img">
                                        <Skeleton variant="rect" width={500} height={500} />
                                    </div>
                                    <div className="c-Product-details__Info">
                                        <h1><Skeleton variant="text" width={"50%"} /></h1>
                                        <h2><Skeleton variant="text" width={"25%"} /></h2>
                                        <article>
                                            <Skeleton variant="text" width={"75%"} />
                                            <Skeleton variant="text" width={"80%"} />
                                            <Skeleton variant="text" width={"77"} />
                                            <Skeleton variant="text" width={"50%"} />
                                        </article>
                                        <div className="c-Product-details__Btns ">
                                            <Skeleton variant="rect" height={42} width={"100%"} />
                                        </div>
                                    </div>
                                </>
                                :
                                <>
                                    <div className="c-Product-details__Img">
                                        <img src={donutImg} alt="Product" />
                                    </div>
                                    <div className="c-Product-details__Info">
                                        <h1>{productInfo.productTitle ? productInfo.productTitle : "Error"}</h1>
                                        <h2>S${productInfo.price ? productInfo.price.toFixed(2) : "Error"}</h2>
                                        <article>{productInfo.description ? productInfo.description : "Error"}</article>
                                        {
                                            token ?
                                                inCartAlready ?
                                                    <div className="c-Product-details__Btns ">
                                                        <div className="c-Btns__Added-to-cart">
                                                            <button type="button" className="c-Btn c-Btn__View" onClick={() => history.push("/cart")}>View in Cart</button>
                                                            <button type="button" className="c-Btn c-Btn__Remove" onClick={() => handleRemoveFromCart()}>Remove from Cart</button>
                                                        </div>
                                                    </div>
                                                    :
                                                    <div className="c-Product-details__Btns">
                                                        <ProductQty qty={qty} setQty={setQty} variation="productDetails" productID={productID} />
                                                        <div className="c-Btns__Add-to-cart">
                                                            <button type="button" className="c-Btn" onClick={() => handleAddToCartBtn()}>Add to Cart</button>
                                                        </div>
                                                    </div>
                                                :
                                                <>
                                                    <h3>Please Login to Add Product to Cart!</h3>
                                                    <NavLink to="/login">Go to Login</NavLink>
                                                </>
                                        }
                                    </div>

                                </>
                    }

                </div>
            </main>

        </>
    )
}

export default ProductDetails;
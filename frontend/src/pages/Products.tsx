import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { Container, Row, Col } from 'react-bootstrap'
import donutImg from '../assets/images/donut.jpg';

import Title from '../common/Title';
import Header from '../layout/Header';
import config from '../config/config';
import ProductCard from '../common/ProductCard';
import axios from 'axios';
import Skeleton from '@material-ui/lab/Skeleton';
import { NavLink } from 'react-router-dom';
import { PageStatusEnum } from '../config/enums';
import Error from "../common/Error";

const Products: React.FC = () => {
    const toastTiming = config.toastTiming;

    // State declarations
    const [productArr, setProductArr] = useState<[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [pageStatus, setPageStatus] = useState<PageStatusEnum>(PageStatusEnum.LOADING);

    useEffect(() => {
        console.log(Math.floor((Math.random()) * 10) + 1);
        let componentMounted = true;
        window.scrollTo(0, 0)
        axios.get(`${config.baseUrl}/products`)
            .then((res) => {
                console.log(res);
                const data = res.data;
                if (componentMounted) {
                    setProductArr(() => {
                        return data.map((productData: { [key: string]: any }) => ({
                            productID: productData.product_id,
                            productTitle: productData.product_name,
                            price: parseFloat(productData.product_price),
                        }));
                    });
                    setTimeout(() => {
                        setPageStatus(() => PageStatusEnum.ACTIVE); // set page status to active
                    }, 300);
                }
            })
            .catch((err) => {
                console.log(err);
                setPageStatus(() => PageStatusEnum.ERROR); // set page status to error
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
            <Container fluid className="l-Main">
                <Header />
                <Row className="c-Products">
                    {
                        pageStatus === PageStatusEnum.ERROR ?
                            <Error />
                            :
                            pageStatus === PageStatusEnum.LOADING ?
                                <>
                                    {
                                        [{}, {}, {}].map((data, index) => (
                                            <Col xs={12} md={6} lg={4} xl={3} className="c-Products-card" key={index}>
                                                <NavLink to="#">
                                                    <Skeleton variant="rect" className="c-Products-card__Img" />
                                                    <div className="c-Products-card__Details">
                                                        <Skeleton variant="text" width={"50%"} />
                                                        <Skeleton variant="text" width={"25%"} />
                                                    </div>
                                                </NavLink>
                                            </Col>
                                        ))

                                    }
                                </>
                                :
                                productArr.length !== 0 ?
                                    productArr.map((data: { [key: string]: any }, index: number): JSX.Element => {
                                        return <ProductCard
                                            key={index}
                                            productID={data.productID}
                                            productTitle={data.productTitle}
                                            price={data.price}
                                            productImg={donutImg}
                                        />
                                    })
                                    :
                                    "Cannot find products"
                    }
                </Row>
            </Container>
        </>
    )
}

export default Products;
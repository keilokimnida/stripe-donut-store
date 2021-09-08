import React from 'react';
import { Route, BrowserRouter as Router, Switch, Redirect } from 'react-router-dom';

import Login from './pages/Login';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Account from './pages/Account';
import Membership from './pages/Membership';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Receipt from './pages/Receipt';
import MembershipPayment from './pages/MembershipPayment';

// Other imports
import { getToken } from './utilities/localStorageUtils';


// Guard to check if user has token
const authGuard = (Component: React.FC<any>) => (props : any) => {
    const token = getToken();
    if (!token) {
        return (<Redirect to="/login" {...props} />);
    } else {
        return (<Component {...props} />);
    }
}

const Routes: React.FC = () => {
    return (
        <Router>
            <Switch>
                <Route path ="/login" render={() => <Login />}/>
                <Route exact path="/">
                    <Redirect to="/products" />
                </Route>
                <Route exact path = "/products" render={() => <Products />}/>
                <Route path = "/products/:productID" render={(props: any) => <ProductDetails {...props} />}/>
                <Route exact path = "/membership" render={() => <Membership />}/>
                <Route path = "/membership/payment/:type" render={(props: any) => <MembershipPayment {...props} />}/>
                <Route exact path = "/cart" render={() => <Cart />}/>
                <Route path = "/cart/checkout" render={() => <Checkout />}/>
                <Route path = "/receipt/:receiptID" render={(props: any) => <Receipt {...props} />}/>
                <Route path = "/account" render={(props: any) => <Account {...props} />}/>
            </Switch>
        </Router>
    )
}

export default Routes;
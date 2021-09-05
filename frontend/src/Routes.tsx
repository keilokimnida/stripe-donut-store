import React from 'react';
import { Route, BrowserRouter as Router, Switch, Redirect } from 'react-router-dom';

import Login from './pages/Login';
import Products from './pages/Products';

// Other imports
import { getToken } from './utilities/localStorageUtils';

// Guard to check if user has token
const authGuard = (Component: React.FC) => (props : any) => {
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
                <Route path ="/login" render={() => <Login/>}/>
                <Route exact path="/">
                    <Redirect to="/products" />
                </Route>
                <Route path = "/products" render = {(props) => authGuard(Products)(props)}/>
            </Switch>
        </Router>
    )
}

export default Routes;
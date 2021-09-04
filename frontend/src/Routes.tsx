import React from 'react';
import { Route, BrowserRouter as Router, Switch, Redirect } from 'react-router-dom';

import Login from './pages/Login';
import Products from './pages/Products';

const Routes = () => {
    return (
        <Router>
            <Switch>
                <Route path ="/login" render={() => <Login/>}/>
                <Route exact path="/">
                    <Redirect to="/login" />
                </Route>
                <Route path = "/products" render = {() => <Products />}/>
            </Switch>
        </Router>
    )
}

export default Routes;
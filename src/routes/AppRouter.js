import React from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import history from "./history";
import Option from '../components/Option';
import Contract from '../components/Contract';
import NoMatch from '../pages/404';
import BadRequest from '../pages/400'
import { withRouter } from "react-router";
import Header from '../components/Header';

export const AppRouter = () => (
    <Router history={history}>
        <div className="bg-gray-900">
            <Header/>
            <Switch>
                <Route exact path="/">
                    <Redirect to="/options/SPY"/>
                </Route>
                <Route path="/options/:ticker" component={Option} exact={true}/>
                <Route path="/options/:ticker/:contract" component={Contract} exact={true}/>
                <Route path="/404" component={BadRequest} />
                <Route component={NoMatch} />
            </Switch>
        </div>
    </Router>
);

export default AppRouter;
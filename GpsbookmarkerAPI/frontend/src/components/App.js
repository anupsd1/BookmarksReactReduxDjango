import React, { Component, Fragment } from 'react'
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { HashRouter as Router, Route,  Switch, Redirect } from 'react-router-dom';

import Header from './layout/Header'
import Dashboard from './leads/Dashboard';
import Alerts from './layout/Alerts';
import Login from './accounts/Login';
import Register from './accounts/Register';
import PrivateRoute from './common/PrivateRoute';
import store from '../store';

import { loadUser } from '../actions/auth'

//Because there is already a provider from react-redux
import { Provider as AlertProvider, useAlert } from 'react-alert';
import AlertTemplate from 'react-alert-template-basic'

//Alert options
const alertOptions = {
    timeout: 3000,
    position: 'top center'
}

class App extends Component{

    componentDidMount(){
        store.dispatch(loadUser());
    }

    render(){
        return (
            <Provider store={store}>
            <AlertProvider
                template={AlertTemplate}
                {...alertOptions}
            >
                <Router>
                    <Fragment>
                        <Header />
                        <Alerts />
                        <div className="container">
                            <Switch>
                                <PrivateRoute exact path="/" component={Dashboard} />
                                <Route exact path="/register" component={Register} />
                                <Route exact path='/login' component={Login} />
                            </Switch>
                        </div>
                    </Fragment>
                </Router>
            </AlertProvider>
            </Provider>
        )
    }
}
ReactDOM.render(<App />, document.getElementById('app'));

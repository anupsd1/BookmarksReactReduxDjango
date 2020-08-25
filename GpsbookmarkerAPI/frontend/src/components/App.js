import React, { Component, Fragment } from 'react'
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { HashRouter as Router, Route,  Switch, Redirect } from 'react-router-dom';

import Header from './layout/Header'
import Dashboard from './leads/Dashboard';
import Alerts from './layout/Alerts';
import Login from './accounts/Login';
import Register from './accounts/Register';
import MyProfile from './layout/MyProfile'
import PasswordReset from './accounts/PasswordReset'

import PrivateRoute from './common/PrivateRoute';
import store from '../store';

import { loadUser } from '../actions/auth'

//Because there is already a provider from react-redux
import { Provider as AlertProvider, useAlert } from 'react-alert';
import AlertTemplate from 'react-alert-template-basic'
import  Changepassword  from './layout/Changepassword';


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
        console.log("From app js = "+JSON.stringify({store}))
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
                                
                                <PrivateRoute exact path="/" component={Dashboard} {...this.props}/>
                                <PrivateRoute exact path="/myprofile" component={MyProfile} {...this.props}/>
                                <PrivateRoute exact path="/changepassword" component={Changepassword}  {...this.props}/>
                                <PrivateRoute exact path="/password-reset/token" component={PasswordReset} {...this.props}/>

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

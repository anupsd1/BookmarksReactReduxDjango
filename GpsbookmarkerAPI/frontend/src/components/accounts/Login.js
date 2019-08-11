import React, { Component, Fragment } from 'react';
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login, gmaillogin } from '../../actions/auth'

import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';

export class Login extends Component{
    state = {
        username: '',
        password: '',
        provider: '',
        accessToken: ''
    };

    static propTypes = {
        login: PropTypes.func.isRequired,
        isLoading: PropTypes.bool,
        isAuthenticated: PropTypes.bool
    }

    onSubmit = e => {
        e.preventDefault();
        this.props.login(this.state.username, this.state.password);
    }

    onChange = e => this.setState({
        [e.target.name]: e.target.value
    })

    fbClicked = (e) => {
        //e.preventDefault()
        console.log("Butonclicked")
    }

    responseFacebook = (response) => {
        console.log(
            response.name+ " " +
            response.email+ " "+
            response.username
            
            )

            console.log(response);
    }



    responseGoogle = (googleUser) => {
        console.log(googleUser);
        if(! googleUser.error)
        {    
            // var id_token = googleUser.getAuthResponse().id_token;
            var access_token = googleUser.getAuthResponse().access_token;
            // console.log(access_token)
            var googleId = googleUser.getId();
            var gemail = googleUser.profileObj.email;
            var fullname = googleUser.profileObj.name;
            console.log(fullname + " "+gemail)
            // console.log(googleUser.getAuthResponse())
            // console.log(gemail)

            // console.log(googleUser)
            // console.log({googleId});
            // console.log({accessToken: id_token});
            this.setState({
                provider: 'google-oauth2',
                accessToken: access_token,
                
            })
            
            // this.props.gmaillogin(this.state.provider, this.state.accessToken)
            
        }
    }
    

    render(){

        let fbContent = (
            // in the following autoload={true} was written which was causing the button to load on its own when the page was loaded
            <FacebookLogin
                    appId="455060218662230"
                    
                    fields="name,email,picture"
                    onClick={this.fbClicked}
                    callback={this.responseFacebook} />
        )

        let googleContent = (
            <GoogleLogin 
                clientId="177417284910-d4d0bqon86reqfveubkk3r9gopld9gfh.apps.googleusercontent.com"
                onSuccess={this.responseGoogle}
                onFailure={this.responseGoogle}
                buttonText="Login with google" />
        )


        if(this.props.isAuthenticated) 
        {
            return <Redirect to='/' />;
        }
        
        const isLoading = this.props.isLoading;

        const loadingContent = (
                                    <div className='card card-body mt-5'>
                                        <h2 className="text-center">
                                            Loading...
                                        </h2>
                                    </div>
                                )


        const loginForm = (
            <div className='card card-body mt-5'>
                    <h2 className="text-center">
                        Login
                    </h2>
                {googleContent}

                    {fbContent}

                    <form onSubmit={this.onSubmit}>
                        <div className="form-group">
                            <label>Username</label>
                            <input 
                                type="text"
                                className="form-control"
                                name="username"
                                onChange={this.onChange}
                                value={username}
                            />
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <input 
                                type="password"
                                className="form-control"
                                name="password"
                                onChange={this.onChange}
                                value={password}
                            />
                        </div>

                        <div className="form-group">
                            <button type="submit" className="btn btn-primary">
                                Login
                            </button>
                        </div>
                        <p>
                            Don't have an account? 
                            <Link to="/register">
                                Register
                            </Link>
                        </p>

                    </form>
                </div>
        )
        const { username, password } = this.state;
        return(
            <Fragment>
            
            <div className="col-md-6 m-auto">
                
            { isLoading ? loadingContent : loginForm }
                    
            </div>
            </Fragment>
        )
    }
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    isLoading: state.auth.isLoading,
    isPremium: state.auth.isPremium
})

export default connect(mapStateToProps, { login, gmaillogin })(Login);
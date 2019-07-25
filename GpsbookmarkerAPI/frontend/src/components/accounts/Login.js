import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../actions/auth'

import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';

export class Login extends Component{
    state = {
        username: '',
        password: '',
    };

    static propTypes = {
        login: PropTypes.func.isRequired,
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
        
        if(! googleUser.error)
        {    
            var id_token = googleUser.getAuthResponse().id_token;
            var googleId = googleUser.getId();
            console.log({googleId});
            console.log({accessToken: id_token});
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


        if(this.props.isAuthenticated) {
            return <Redirect to='/' />;
        }

        const { username, password } = this.state;
        this.state;
        return(
            <div className="col-md-6 m-auto">
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
            </div>
        )
    }
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, { login })(Login);
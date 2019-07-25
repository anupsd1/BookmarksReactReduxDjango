import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { register } from '../../actions/auth';
import { createMessage } from '../../actions/messages';

import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';

export class Register extends Component{
    state = {
        username: '',
        email: '',
        password: '',
        password2: ''
    };

    static propTypes = {
        register: PropTypes.func.isRequired,
        isAuthenticated: PropTypes.bool
    }

    onSubmit = e => {
        e.preventDefault();
        const { username, email, password, password2 } = this.state;
        if(password != password2){
            console.log(password)
            console.log(password2)
            this.props.createMessage({
                passwordNotMatch: 'Passwords do not match'
            })
        } else {
            const newUser = {
                username, 
                email, 
                password
            }
            this.props.register(newUser);
        }
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
        // console.log(googleUser)
        var id_token = googleUser.getAuthResponse().id_token;
        var googleId = googleUser.getId();
        console.log({googleId});
        console.log({accessToken: id_token});
    }


    render(){

       // console.log(this.state);
        let fbContent;

        if(this.props.isAuthenticated){
            return <Redirect to="/" />
        }

        fbContent = (
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

        const { username, email, password, password2 } = this.state;
        this.state;
        return(
            <div className="col-md-6 m-auto">
                <div className='card card-body mt-5'>
                    <h2 className="text-center">
                        Register
                    </h2>
                    {googleContent}
                    <form onSubmit={this.onSubmit}>
                        {fbContent}

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
                            <label>Email</label>
                            <input 
                                type="text"
                                className="form-control"
                                name="email"
                                onChange={this.onChange}
                                value={email}
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
                            <label>Password Confirm</label>
                            <input 
                                type="password"
                                className="form-control"
                                name="password2"
                                onChange={this.onChange}
                                value={password2}
                            />
                        </div>
                        <div className="form-group">
                            <button type="submit" className="btn btn-primary">
                                Register
                            </button>
                        </div>
                        <p>
                            Already have an account? 
                            <Link to="/login">
                                Login
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

export default connect(mapStateToProps, { register, createMessage })(Register);
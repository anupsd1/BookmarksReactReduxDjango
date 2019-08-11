import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { register, gmaillogin } from '../../actions/auth';
import { createMessage } from '../../actions/messages';

import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';

export class Register extends Component{
    state = {
        username: '',
        email: '',
        password: '',
        password2: '',
        first_name: '',
        last_name: ''
    };

    static propTypes = {
        register: PropTypes.func.isRequired,
        isAuthenticated: PropTypes.bool
    }

    onSubmit = e => {
        e.preventDefault();
        const { username, email, password, password2, first_name, last_name } = this.state;
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
                password,
                first_name,
                last_name
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
        console.log(googleUser);
        if(! googleUser.error)
        {    
            // var id_token = googleUser.getAuthResponse().id_token;
            var access_token = googleUser.getAuthResponse().access_token;
            // console.log(access_token)
            // var googleId = googleUser.getId();
            // var gemail = googleUser.profileObj.email;
            // var fullname = googleUser.profileObj.name;
            // console.log(fullname + " "+gemail)
            // console.log("Google id is = "+googleId)
            
            var first_name = googleUser.profileObj.givenName;
            var last_name = googleUser.profileObj.familyName;
            var email = googleUser.profileObj.email;
            var user_id = googleUser.getId();



            this.setState({
                first_name: first_name,
                last_name: last_name,
                email: email,
                user_id: user_id,
                provider: 'google-oauth2',
                accessToken: access_token,
                
            })
            // console.log(this.state.first_name, this.state.last_name, this.state.email, this.state.user_id, this.state.provider, this.state.accessToken);
            this.props.gmaillogin(this.state.first_name, this.state.last_name, this.state.email, this.state.user_id, this.state.provider, this.state.accessToken)
        }
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
                buttonText="Register via google" />
        )

        const { username, email, password, password2, first_name, last_name } = this.state;
        
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
                            <label>First Name</label>
                            <input 
                                type="text"
                                className="form-control"
                                name="first_name"
                                onChange={this.onChange}
                                value={first_name}
                            />
                        </div>

                        <div className="form-group">
                        
                            <label>Last Name</label>
                            <input 
                                type="text"
                                className="form-control"
                                name="last_name"
                                onChange={this.onChange}
                                value={last_name}
                            />
                        </div>

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

export default connect(mapStateToProps, { register, createMessage, gmaillogin })(Register);
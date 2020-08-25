import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom';
import { logout, changingPassword } from '../../actions/auth';
import Changepassword from './Changepassword'

export class Header extends Component{

    state = {
        changepassword: false,
    }

    static propTypes = {
        auth: PropTypes.object.isRequired,
        logout: PropTypes.func.isRequired
    }

    btnClicked = e => {
        e.preventDefault();        
    }

    

    render(){
        
        const { isAuthenticated } = this.props.auth;

        const guestLinks = (
            <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
                        <li className="nav-item">
                            <Link to="/register" className="nav-link">
                                Register
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/login" className="nav-link">
                                Login
                            </Link>
                        </li>
            </ul>
        )

        const authLinks = (
            
            <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
                        <li className="nav-item">
                            <button 
                                onClick={this.props.logout} 
                                className="nav-link btn btn-info btn-sm text-light">
                                    Logout
                            </button>
                        </li>
                        &emsp;
                        <li className="nav-item">
                            <Link to="/changepassword" >
                                <button 
                                        //onClick={this.btnClicked} 
                                        className="nav-link btn btn-info btn-sm text-light">
                                            
                                        Change Password
                                </button>
                            </Link>
                        </li>
                        &emsp;
                        <li className="nav-item">
                            <Link to="/myprofile" >
                                <button 
                                        //onClick={this.btnClicked} 
                                        className="nav-link btn btn-info btn-sm text-light">
                                            
                                        MY Profile
                                </button>
                            </Link>
                        </li>
            </ul>
            

        )
        const currentStatus = this.state.changepassword;
        return(
            
            <nav className="navbar navbar-expand-sm navbar-light bg-light">
            <div className="container">
                {/* { currentStatus ? <Changepassword /> : ''} */}
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
                    <a className="navbar-brand" href="#">FootBUYS</a>
                    
                    { (isAuthenticated ? authLinks : guestLinks)}
                    
                </div>
            </div>
            </nav>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps, { logout, changingPassword })(Header)
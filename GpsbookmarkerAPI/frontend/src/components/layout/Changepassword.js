import React, { Component, Fragment } from 'react';
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { changePassword, changingPassword } from '../../actions/auth'

export class Changepassword extends Component {
    constructor(props){
        super(props)
    }
    state = {
        old_password: '',
        new_password: ''
    }

    // componentDidMount(){
    //     console.log("is authenticated from changepassword??? "+JSON.stringify(this.props.rest))
    // }

    // componentWillReceiveProps(nextProps){
    //     // console.log("FROM WILL RECEIEVE"+nextProps.status)
    // }
    onChange = (e) => this.setState({
        [e.target.name]: e.target.value
    })

    onSubmit = (e) => {
        e.preventDefault();
        const { old_password, new_password } = this.state;
        // console.log(old_password + " "+new_password)
        this.props.changePassword(old_password, new_password)
        this.setState({
            old_password: '',
            new_password: ''
        })

    }


    render(){
       // console.log(this.props)
    //    console.log("Now are you getting props??? "+JSON.stringify(this.props.mystate))
        const isAuthenticated = this.props.isAuthenticated;
        const authContent = (
        <div className="card card-body mt-5">
        <h2 className="text-center">
                Password Change
        </h2>
        <form onSubmit={this.onSubmit}>
        <div className="form-group">
                    <label>Password</label>
                    <input 
                        type="password"
                        className="form-control"
                        name="old_password"
                        onChange={this.onChange}
                        value={this.state.old_password}
                    />
        </div>

        <div className="form-group">
                    <label>New Confirm</label>
                    <input 
                        type="password"
                        className="form-control"
                        name="new_password"
                        onChange={this.onChange}
                        value={this.state.new_password}
                    />
        </div>
        <div className="form-group">
                    <button type="submit" className="btn btn-primary">
                        Submit 
                    </button>
        </div>

        </form>

    </div>)

    const nonauthContent = (
        <div>
            <h1>Not allowed</h1>
        </div>
    )
        return(
            <Fragment>
                { isAuthenticated ? authContent : nonauthContent}
            </Fragment>
        )
    }
}

const mapStateToProps = state => ({
    mystate: state,
    isAuthenticated: state.auth.isAuthenticated      
})

export default connect(mapStateToProps, { changePassword, changingPassword})(Changepassword);
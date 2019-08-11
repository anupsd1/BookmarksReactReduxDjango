import React, { Component, Fragment } from 'react';
import Form from './Form'
import Leads from './Leads';
import { connect } from 'react-redux';
import { changingPassword, makePremium } from '../../actions/auth';
import { getLeads } from '../../actions/leads';
import Changepassword  from '../layout/Changepassword';
import { Route, Redirect } from 'react-router-dom';

export class Dashboard extends Component{
    state = {
        isPremium: this.props.isPremium
    }

    // componentDidMount(){
    //     console.log("DID IT RECEIVE STATE = "+JSON.stringify(this.props.state))
    //     console.log("FROM MOUNT="+this.props.isPremium)
    // }

    // componentDidUpdate(){
    //     console.log("From dashboard = "+this.props.isPremium)
    // }

    // THIS WAS VERY IMPORTANT!! OTHERWISE THE USER HAD TO REFRESH THE PAGE FOR THE PREMIUM CONTENT
    componentDidUpdate(prevProps){
        const isPremium = this.state.isPremium;
        if(isPremium != prevProps.isPremium)
        {
            this.setState({
                isPremium: isPremium
            })
        }
    }

    upgradepremium = () =>{
        console.log("Btn clicked")
        const email = (this.props.email)
        const newemail = email.email
        const premium = true
        
        this.props.makePremium(newemail, premium);
        // this.setState({
        //     isPremium: this.props.isPremium
        // })
        // console.log("NOW THE STATE OF PREMIUM"+this.props.isPremium)
        
    }

    render(){
        const isPremium = this.props.isPremium;
        const changePassword = this.props.changePassword;
        // console.log(isPremium)
        // console.log(this.props.token)
        

        const loadingContent = (
                                    <div className="container">
                                        <h1>Loading...</h1>
                                    </div>
                                )
        const premiumContent = (
                                <div className="container">
                                        <Form /> 
                                        <Leads /> 
                                </div>
                                )
        const nonpremiumContent = (
                              
                                  <div className="container">
                                        <h1>This is the only page you can access as a non-premium user! </h1> <br />
                                        <button 
                                            onClick = {this.upgradepremium}
                                            className="nav-link btn btn-info btn-sm text-light">
                                                Upgradate to premium
                                        </button>
                                    </div>
                                    
                                )

        return(
            <Fragment>
                
                { isPremium ? premiumContent : nonpremiumContent }
            </Fragment>
        )
    }
}

const mapStateToProps = state => ({
    // state: state,
    email: state.auth.user,
    isPremium: state.auth.isPremium,
    token: state.auth.token,
    changePassword: state.auth.changePassword
})

export default connect(mapStateToProps, { makePremium })(Dashboard)
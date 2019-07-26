import React, { Component, Fragment } from 'react';
import Form from './Form'
import Leads from './Leads';
import { connect } from 'react-redux';

export class Dashboard extends Component{

    render(){
        const isPremium = this.props.isPremium;
        const premiumContent = (
                                <div className="container">
                                        <Form /> 
                                        <Leads /> 
                                </div>
                                )
        const nonpremiumContent = (
                              
                                  <div className="container">
                                        <h1>This is the only page you can access as a non-premium user! </h1>
                                        
                                    </div>
                                    
                                )

        return(
            <Fragment>
                {isPremium ? premiumContent : nonpremiumContent}
            </Fragment>
        )
    }
}

const mapStateToProps = state => ({
    isPremium: state.auth.isPremium
})

export default connect(mapStateToProps, null)(Dashboard)
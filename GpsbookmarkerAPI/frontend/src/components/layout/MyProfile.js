import React, { Component } from 'react';
import { connect } from 'react-redux';

export class MyProfile extends Component {
    constructor(props){
        super(props);
    }

    render(){
        console.log("PROFILE = "+JSON.stringify(this.props.mystate))
        return(
            <div className="col-md-6 m-auto">
                <div className='card card-body mt-5'>
                    <h2 className="text-center">
                        Profile Information
                    </h2>
                    <h2 className="text-center">
                       <b> First Name </b>:  {this.props.first_name}
                    </h2>
                    <h2 className="text-center">
                        <b> Last Name </b>: {this.props.last_name}
                    </h2>
                    <h2 className="text-center">
                        <b> Email </b>: {this.props.email}
                    </h2>
                    <h2 className="text-center">
                        <b> Premium </b>: {this.props.premium ? "YESS!!!": "NOOO"} 
                    </h2>
                    <h2 className="text-center">
                        <b> Logged in from social media </b>: {this.props.social ? "YESS!!!": "NOOO"}
                    </h2>
                    
                </div>
                <div className='card card-body mt-5'>
                    <h2 className="text-center">
                        {this.props.auth}
                    </h2>
                </div>
            </div>

        )
    }
}

const mapStateToProps = (state) => ({
    mystate: state,
    first_name: state.auth.user.first_name,
    last_name: state.auth.user.last_name,
    email: state.auth.user.email,
    premium: state.auth.isPremium,
    social: state.auth.social
})

export default connect(mapStateToProps, null)(MyProfile);
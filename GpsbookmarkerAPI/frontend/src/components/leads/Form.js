import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addLead } from '../../actions/leads'
import { loadUser } from '../../actions/auth';
import store from '../../store';


export class Form extends Component {
    constructor(props){
        super(props);
        this.state = {
            lat: '',
            lon: '',
            user: ""+ this.props.user + ""
        }
    }

    

    

    // static propTypes = {
    //     addLead: PropTypes.func.isRequired
    // }
    componentDidMount(){
        console.log("USER===="+this.state.user)
    }

    

    onChange = e => this.setState({
        [e.target.name]: e.target.value
    })

    onSubmit = e => {
        e.preventDefault();
        // console.log(this.props.user)
        console.log("THE STATE IS "+JSON.stringify(this.props.mystate))
        // const user = ""+ this.props.user + "";
        // console.log("THE USER IS "+user)
        //console.log(myuser)
        // console.log(this.state.user)
        
        
        // const { lat, lon, user } = this.state;
        const { lat, lon, user } = this.state;
        
        
        // const lead = { lat, lon, user };
        const lead = { lat, lon, user };
        
        //console.log(lead)

        this.props.addLead(lead);
        this.setState({
            lat: '',
            lon: '',
            // user: ''
        })
    }

    render(){
        
        //without the following line {lat}, {lon} and {user} give an error as undefined
        // const {lat, lon, user}=this.state;
        const {lat, lon, user }=this.state;
        return(
            <div className="card card-body mt-4 mb-4"> 
                <h2>Add Bookmarks Form </h2>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Latitude </label>
                        <input 
                            className="form-control"
                            type="text"
                            name="lat"
                            onChange={this.onChange}
                            value={lat}
                        />
                    </div>
                    <div className="form-group">
                        <label>Longitutde </label>
                        <input 
                            className="form-control"
                            type="text"
                            name="lon"
                            onChange={this.onChange}
                            value={lon}
                        />
                    </div>
                    {/* <div className="form-group">
                        <label>User </label>
                        <input 
                            className="form-control"
                            type="text"
                            name="user"
                            onChange={this.onChange}
                            value={user}
                        />
                    </div> */}
                    <div className="form-group">
                        <button type="submit">Submit</button>
                    </div>
                </form>
            </div>
        )
    }
}


//REMEMBER TO USE ROUND BRACKETS FIRST AND THEN THE CURLY BRACES!!!
const mapStateToProps = state => ({
     mystate: state.auth.user,
     user: state.auth.user.id
})

//Write why null is used-Listen to the video. addLead is passed as an object thats why written inside { }
export default connect(mapStateToProps, { addLead })(Form);
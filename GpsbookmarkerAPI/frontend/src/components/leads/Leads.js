import React, { Component, Fragment } from 'react';
import Form from './Form';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getLeads, deleteLead, addLead } from '../../actions/leads';

export class Leads extends Component {
    constructor(props){
        super(props);
       
    }
    
    //Everything works fine even without the propTypes. They are just written because they are useful
    static propTypes = {
        leads: PropTypes.array.isRequired,
        getLeads: PropTypes.func.isRequired,
        deleteLead: PropTypes.func.isRequired
    }

    componentDidMount(){
        //Automatically called which sets to state to all the items from API
        this.props.getLeads();
    }
    
    render(){
        return (
            <Fragment>
                <h2>Bookmarks</h2>
                <table className="table table-stripped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Lat</th>
                            <th>Long</th>
                            <th>User </th>
                            <th> </th>
                        </tr>
                    </thead>
                    <tbody>
                        
                        { this.props.leads.map(bookmark =>(
                            <tr key={bookmark.id}>
                                <td>{ bookmark.id }</td>
                                <td>{ bookmark.lat }</td>
                                <td>{ bookmark.lon }</td>
                                <td>{ bookmark.user }</td>
                                <td><button 
                                        className="btn btn-danger btn-sm"
                                        onClick={this.props.deleteLead.bind(this, bookmark.id)}
                                    >Delete</button></td>
                            </tr>

                        ))}
                    </tbody>
                </table>
            </Fragment>                            
        )
    }
}

//mapStateToProps gets the state from the object from reducer
const mapStateToProps = state => ({
    //props: state.reducer.object(or array) which returns whatever is described according to the action
    leads: state.leads.leads,
})

export default connect(mapStateToProps, { addLead, getLeads, deleteLead })(Leads);
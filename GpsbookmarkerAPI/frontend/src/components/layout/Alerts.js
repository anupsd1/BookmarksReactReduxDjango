import React, { Component, Fragment } from 'react';
import { withAlert } from 'react-alert';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom'

export class Alerts extends Component {
    static propTypes = {
        error: PropTypes.object.isRequired,
        message: PropTypes.object.isRequired
    }

    /*
        According to me the prev props logic is that whenever a component is updated, the reducers are not really called again. 
        It is called only when an action is performed. And that time the new props are passed via state
    */ 
    componentDidUpdate(prevProps){
        //When error was misspelled as errrors the component was updating in an infinite loop because it could not receive the "error" prop.
        //So the condition given below was not receiving the proper error prop
        //The "error" prop was set in mapStateToProps
        const { error, alert, message } = this.props;
        if(error !== prevProps.error){
            //join() is used to convert the error object to string
            if(error.msg.lat)
                alert.error(`Latitude: ${error.msg.lat.join()}`);
            if(error.msg.lon)
                alert.error(`Logitude: ${error.msg.lon.join()}`);
            if(error.msg.user)
                alert.error(`User: ${error.msg.user.join()}`);
            if(error.msg.non_field_errors)
                // join() is used here because an array with one error is returned
                alert.error(error.msg.non_field_errors.join())
            if(error.msg.detail){
                // join() cannot be used here because an array is not returned
                
                alert.error(`${error.msg.detail}`)
                // return <Redirect to='/login' />;
                // this.forceUpdate();
            }
            // else if(error.msg)
            // {
            //     var newerr = ""+error.msg+""
            //     if(newerr === ("UNIQUE constraint failed: LocalUser_userprofile.email"))
            //             alert.error(`User with with the email already exists`)
            // }
            if(error.msg.email){
                console.log("ERROR RECEIVED")
                alert.error((error.msg.email))
            }
            if(error.msg.username){
                alert.error(error.msg.username)
            }
        }

        if(message !== prevProps.message){
            //message.deleteBookmark is referring to to deleteBookmark dispatched in actions/leads.js
            if(message.deleteBookmark)
                alert.success(message.deleteBookmark)
            if(message.addBookmark)
                alert.success(message.addBookmark)
            if(message.passwordNotMatch)
                alert.error(message.passwordNotMatch)
            if(message.passwordChanged)
                alert.error(message.passwordChanged)
        }
    }

    // componentDidMount(){
    //     this.props.alert.show("hey")
    // }

    render(){
        
        return  <Fragment /> ;
    }
}

const mapStateToProps = state => ({
    error: state.errors,
    message: state.messages
})

/*
    In traversy media the following line was written has export default withAlert(Alerts); and it worked.
    According to me that was exporting a constant because of which at that time we had to use { Alerts } in App.js when importing this class.
    But when we did that Alerts class receiving nothing in props. It took more than two hours to figure out the following solution.
    To use with withAlert() and then the classname was found in react documentation
*/
export default connect(mapStateToProps)(withAlert()(Alerts));
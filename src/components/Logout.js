import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button} from 'react-bootstrap';
import { logoutUser } from './../redux/actions/actions';

const mapStateToProps = state => {
        return {
		      loading: state.login.loading,
		      user: state.login.user
		  }
    }

class Logout extends Component {

	handleLogout = async (e) => {
		e.preventDefault();
	    //DO LOGOUT
	    await this.props.logoutUser();
	}


    render() {

        return (
        	<div className="logout ">
        		<span>Bienvenido {this.props.user.name} </span>
				<Button onClick={this.handleLogout}>Salir</Button>
			</div>

        );
    }
}

export default connect(mapStateToProps, {logoutUser})(Logout);
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Col,Form,FormGroup,ControlLabel,FormControl,Button,Checkbox } from 'react-bootstrap';
import { loginUser } from './../redux/actions/actions';
import { Redirect } from 'react-router-dom';



const mapStateToProps = state => {
        return {
		      isAuth: state.login.isAuth,
		      error: state.login.error,
		  }
    }

class Login extends Component {

	constructor (props) {
	    super(props)
	    this.state = {
	      password: null,
	      user:null,
	    }
	    this.handleLogin = this.handleLogin.bind(this)
	    this.handleChange = this.handleChange.bind(this)

	  }

	handleLogin (e) {
		e.preventDefault();
		//Check required fields
		var lenght = this.state.password ? this.state.password.length : 0
		if (lenght <= 0){
			this.setState({error:"Debe ingresar una contraseña"})
			return
		}

		var lenght = this.state.user ? this.state.user.length : 0
		if (lenght <= 0){
			this.setState({error:"Debe ingresar un nombre de usuario"})
			return
		}

	    //DO LOGIN
	    this.props.loginUser(this.state.user,this.state.password);
	}

	handleChange(e) {
	    this.setState({[e.target.name]: e.target.value})
	}

    render() {
    	const { from } = this.props.location.state || { from: { pathname: "/profile" } };

    	if (this.props.isAuth) {
	      return <Redirect to={from} />;
	    }

        return (
        	<div className="login ">
        		<div className="col-md-6 col-xs-10 col-center">
		          	<Form horizontal id="login-form">
					  <FormGroup controlId="formHorizontalUser" >
					    <Col componentClass={ControlLabel} sm={2}>
					      Usuario
					    </Col>
					    <Col sm={10}>
					      <FormControl type="text" name="user" placeholder="Usuario" onChange={this.handleChange}/>
					    </Col>
					  </FormGroup>

					  <FormGroup controlId="formHorizontalPassword">
					    <Col componentClass={ControlLabel} sm={2}>
					      Contraseña
					    </Col>
					    <Col sm={10}>
					      <FormControl type="password" name="password" placeholder="Contraseña" onChange={this.handleChange}/>
					    </Col>
					  </FormGroup>

					  <FormGroup>
					    <Col smOffset={2} sm={10}>
					      <Checkbox>Recordar contraseña</Checkbox>
					    </Col>
					  </FormGroup>

					  <FormGroup>
					    <Col smOffset={2} sm={10}>
					      <Button type="submit" onClick={this.handleLogin}>Ingresar</Button>
					    </Col>
					  </FormGroup>
					  {this.props.error ? <div className='alert alert-warning'>{ this.props.error }</div> : null}
					</Form>
					
		        </div>
			</div>

        );
    }
}

export default connect(mapStateToProps, {loginUser})(Login);
import React, { Component } from 'react';
import { connect } from 'react-redux'
import { loadConfigurations } from './../redux/actions/actions';
import { Col,Form,FormGroup,ControlLabel,FormControl,Button,HelpBlock } from 'react-bootstrap';


const mapStateToProps = state => {
	console.log(state);
    return {
        configurations: state.configuration.configurations,
        error: state.configuration.error
    }
}

class Configuration extends Component {

	componentDidMount() {
        this.props.loadConfigurations()
    }

	constructor (props) {
	    super(props)
	    this.state = {
	      error: props.error
	    }
	    this.handleSubmit = this.handleSubmit.bind(this)
	    this.handleChange = this.handleChange.bind(this)
	 }

	handleSubmit (e) {
		e.preventDefault();
		console.log('Submit!',this.state)
	}

	handleChange(e) {
	    //DO LOGIN
	    this.setState(
	    	this.setState({[e.target.name]: e.target.value})
	    )
	}

    render() {

    	const configurations = this.props.configurations.map( (configuration)=>

            <FormGroup controlId="formHorizontal{configuration.key}" >
			    <Col componentClass={ControlLabel} md={3}>
			      {configuration.name}
			    </Col>
			    <Col md={9} sm={12}>
			      <FormControl type="text" name={configuration.key} placeholder={configuration.name} onChange={this.handleChange}/>
			    </Col>
			    <Col md={9} mdOffset={3} sm={12}>
			    	<HelpBlock>configuration.description</HelpBlock>
			    </Col>


			</FormGroup>
        )

        return (
        	<div className="page configuration ">
        		<fieldset className="col-md-8 col-xs-10 col-center">
    				<legend>Configuraciones</legend>
		          	<Form horizontal id="config-form">
					  {configurations}
					  {this.state.error ? <div className='alert alert-warning'>{ this.state.error }</div> : null}
					  <FormGroup>
					    <Col smOffset={2} sm={10}>
					      <Button type="submit" onClick={this.handleSubmit}>Guardar</Button>
					    </Col>
					  </FormGroup>
					</Form>
		        </fieldset>
			</div>
        );
    }
}

export default connect(mapStateToProps, {loadConfigurations})(Configuration);
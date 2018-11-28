import React, { Component } from 'react';
import { connect } from 'react-redux'
import { loadConfigurations,saveConfigurations } from './../redux/actions/actions';
import { Col,Form,FormGroup,ControlLabel,FormControl,Button,HelpBlock } from 'react-bootstrap';

const mapStateToProps = state => {
    return {
        configurations: state.configuration.configurations,
        error: state.configuration.error
    }
}

class Configuration extends Component {

	componentDidMount() {
        this.props.loadConfigurations()
    }

	constructor () {
	    super()
	    this.state = {
	    	configurations:{}
	    }
	    this.handleSubmit = this.handleSubmit.bind(this)
	    this.handleChange = this.handleChange.bind(this)
	 }

	handleSubmit (e) {
		e.preventDefault();
		this.props.saveConfigurations(this.state.configurations);
	}

	handleChange(e) {
		var configurations = this.state.configurations;
		configurations[e.target.name] = e.target.value;
		this.setState({configurations:configurations})
	}

    render() {

    	const configurations = this.props.configurations.map( (configuration,index)=>

            <FormGroup key={configuration.key} controlId={"formHorizontal"+configuration.key} >
			    <Col componentClass={ControlLabel} md={3}>
			      {configuration.name}
			    </Col>
			    <Col md={9} sm={12}>
			      <FormControl data-index={index} type="text" defaultValue={configuration.value} name={configuration.key} placeholder={configuration.name} onChange={this.handleChange}/>
			    </Col>
			    <Col md={9} mdOffset={3} sm={12}>
			    	<HelpBlock>{configuration.description}</HelpBlock>
			    </Col>


			</FormGroup>
        )

        return (
        	<div className="page configuration ">
        		<fieldset className="col-md-8 col-xs-10 col-center">
    				<legend>Configuraciones</legend>
		          	<Form horizontal id="config-form">
					  {configurations}
					  {this.props.error ? <div className='alert alert-warning'>{ this.props.error }</div> : null}
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

export default connect(mapStateToProps, {loadConfigurations,saveConfigurations})(Configuration);
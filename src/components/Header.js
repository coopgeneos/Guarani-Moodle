import React, { Component } from 'react';
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { Navbar,Nav,NavItem} from 'react-bootstrap';
import Logout from './Logout'

const mapStateToProps = state => {
    return {
    	location:state.router.location.pathname
    }
}

const ActiveNavItem = props => {
	return (
		<li role="presentation" className={props.href === props.location ? 'active' : ''}>
			<NavLink to={props.href}>{props.text}</NavLink>
		</li>
		)
}

class Header extends Component {


    render() {
        return ( 
        	<Navbar collapseOnSelect className="app-header">
			  <Navbar.Header>
			    <Navbar.Brand>
			      <span>Intefaz Guarani - Moodle</span>
			    </Navbar.Brand>
			    <Navbar.Toggle />
			  </Navbar.Header>
			  <Navbar.Collapse>
			    <Nav>
			    	<ActiveNavItem text="Perfil" href="/profile" location={this.props.location} />
			    	<ActiveNavItem text="Configuracion" href="/configuration" location={this.props.location} />
			    	<ActiveNavItem text="Actividades" href="/activities" location={this.props.location} />
			    	<ActiveNavItem text="Sincronizacion" href="/synchronizations" location={this.props.location} />
			    </Nav>

			    <Nav pullRight>
			      <Logout />
			    </Nav>

			  </Navbar.Collapse>
			</Navbar>
        );
    }
}

/*
 * mapState,
 *    mapDispatch,
 *    mergeProps,
 *    Object.assign(options, {
 *     pure: false
 *   })
 * pure:false -> this param on false force reload
 */
    export default connect(mapStateToProps,null,null, {pure: false})(Header);
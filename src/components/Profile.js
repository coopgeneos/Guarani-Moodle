import React, { Component } from 'react';
import { connect } from 'react-redux'

const mapStateToProps = state => {
        return {}
    }

class Profile extends Component {

    render() {
        return ( 
            <div>
            	Profile page!
            </div>
        );
    }
}

export default connect(mapStateToProps, {})(Profile);
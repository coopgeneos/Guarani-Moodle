import React, { Component } from 'react';
import { connect } from 'react-redux'

const mapStateToProps = state => {
        return {}
    }

class Synchronizations extends Component {

    render() {
        return ( 
            <div>
            	Synchronizations page!
            </div>
        );
    }
}

export default connect(mapStateToProps, {})(Synchronizations);
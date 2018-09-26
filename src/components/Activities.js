import React, { Component } from 'react';
import { connect } from 'react-redux'

const mapStateToProps = state => {
        return {}
    }

class Activities extends Component {

    render() {
        return ( 
            <div>
            	Activities page!
            </div>
        );
    }
}

export default connect(mapStateToProps, {})(Activities);
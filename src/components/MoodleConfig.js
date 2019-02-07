import React, { Component } from 'react';
import Categories from './Categories'
import Cohorts from './Cohorts'


class MoodleConfig extends Component {


    render() {
        return ( 
        	 <div className="page clearfix">
		    	<Categories />
		    	<hr className="divider"/>
		    	<Cohorts />
			</div>
        );
    }
}

export default MoodleConfig;
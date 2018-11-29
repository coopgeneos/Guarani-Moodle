import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loadCategories,loadActivities,refreshActivities,createSync } from './../redux/actions/actions';
import { Col,FormGroup,ControlLabel,FormControl,Button } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';


const mapStateToProps = state => {
    return {
        activities: state.activity.activities,
        error: state.activity.error,
        categories: state.category.categories
    }
}
	
class Activities extends Component {

	componentDidMount() {
        this.props.loadActivities()
        this.props.loadCategories()
    }


	expandRow = {
		renderer: row => (
			<div>
				<BootstrapTable 
		        		keyField='siu_assignment_code' 
		        		data={ row.C_SIU_Assignments } 
		        		columns={ this.assignmentsColumns } 
		        		bordered={ false }
		        		striped
						hover
						selectRow={ {mode: 'checkbox', clickToSelect: true, onSelect: this.handleOnSelect, selected: this.state.selectedAssignments} }
						noDataIndication="No hay ninguna comision."/>
			</div>
		)
	};

	handleOnSelect = (row, isSelect) => {
	    if (isSelect) {
	      this.setState(() => ({
	        selectedAssignments: [...this.state.selectedAssignments, row.siu_assignment_code]
	      }));
	    } else {
	      this.setState(() => ({
	        selectedAssignments: this.state.selectedAssignments.filter(x => x !== row.siu_assignment_code)
	      }));
	    }
	}

	constructor () {
	    super()
	    this.state = {
	    	selectedAssignments:[]
	    }
	    
	    this.activitiesColumns = [
	    {
		    dataField: 'number',
		    isDummyField: true,
		    text: '#',
		    formatter: (cellContent, row, rowIndex, formatExtraData) => {
		        return (
		          <span>{rowIndex}</span>
		        );
		    }
		  },{
			dataField: 'siu_activity_code',
			text: 'Codigo',
			filter: textFilter()
		}, {
			dataField: 'name',
			text: 'Actividad',
			filter: textFilter()
		},{
		    dataField: 'comisiones',
		    text: '# Comisiones',
		    width: '100',
		    formatter: (cellContent, row) => (
		      <div className="checkbox disabled">
		        <label>
		           {row.C_SIU_Assignments.length}
		        </label>
		      </div>
		    )
		  },{
		    dataField: 'state',
		    isDummyField: true,
		    text: 'Sincronizacion',
		    formatter: (cellContent, row) => {
		      if (false) {
		        return (
		          <h5>
		            <span className="label label-success">Completa</span>
		          </h5>
		        );
		      }
		      return (
		        <h5>
		          <span className="label label-danger">Sin configurar</span>
		        </h5>
		      );
		    }
		  }];

		this.assignmentsColumns = [{
			dataField: 'siu_assignment_code',
			text: 'ID'
		}, {
			dataField: 'name',
			text: 'Comision'
		},{
		    dataField: 'c_siu_school_period_id',
		    text: 'Periodo'
		},{
		    dataField: 'state',
		    isDummyField: true,
		    text: 'Sincronizacion',
		    formatter: (cellContent, row) => {
		      if (false) {
		        return (
		          <h5>
		            <span className="label label-success">Completa</span>
		          </h5>
		        );
		      }
		      return (
		        <h5>
		          <span className="label label-danger">Sin configurar</span>
		        </h5>
		      );
		    }
		  }];

		this.paginationOptions = {
		  //paginationSize: 2,
		  pageStartIndex: 1,
		  // alwaysShowAllBtns: true, // Always show next and previous button
		  // withFirstAndLast: false, // Hide the going to First and Last page button
		  // hideSizePerPage: true, // Hide the sizePerPage dropdown always
		  // hidePageListOnlyOnePage: true, // Hide the pagination list when only one page
		  // firstPageText: 'First',
		  //prePageText: 'Back',
		  //nextPageText: 'Next',
		  //lastPageText: 'Last',
		  //nextPageTitle: 'First page',
		  //prePageTitle: 'Pre page',
		  //firstPageTitle: 'Next page',
		  //lastPageTitle: 'Last page',
		  //showTotal: true,
		  //paginationTotalRenderer: customTotal,
		  withFirstAndLast: false,
		  noDataText: 'No hay ninguna actividad. Intente refrescando la información desde el menú de administración.',
		  sizePerPageList: [{
		    text: '10', value: 10
		  }, {
		    text: '20', value: 20
		  }, {
		    text: '50', value: 50
		  }] // A numeric array is also available. the purpose of above example is custom the text
		}

	    /*this.options = {
	      defaultSortName: 'siu_activity_code',  // default sort column name
	      defaultSortOrder: 'asc',  // default sort order
	     
	    };*/

	   	this.handleRefresh = this.handleRefresh.bind(this)
	    this.handleCreateSync = this.handleCreateSync.bind(this)
	   	this.handleName = this.handleName.bind(this)
	   	this.handleCategory = this.handleCategory.bind(this)

	 }

	handleCreateSync(e) {
		e.preventDefault();
		this.props.createSync(this.state.selectedAssignments,this.state.syncCategory, 14, this.state.syncName); //Moodle Category ID, SIU_School_Period_ID
	}

	handleRefresh(e) {
		e.preventDefault();
		this.props.refreshActivities();
	}

	handleName(e) {
		this.setState({syncName:e.target.value})
	}

	handleCategory(e) {
		console.log(e);
		this.setState({syncCategory:e.target.value})
	}

    render() {


    	const categories = this.props.categories.map( (category,index)=>
            <option key={category.I_SyncCategory_id} value={category.mdl_category_id}>{category.name}</option>
        )

        return ( 
            <div className="page activities clearfix">
        		<fieldset className="col-md-12">
    				<legend>Actividades</legend>
    					<form id="newCategory">
	    					<FormGroup key="activities" controlId={"formHorizontal"+"activities"} >
							    <Col md={2} sm={2}>
							    	<Button onClick={this.handleRefresh}>Refresh</Button>
							    </Col>
							    <Col md={4} sm={4}>
								    <FormControl componentClass="select" placeholder="Categoria Moodle" onChange={this.handleCategory}>
            							<option key="select" value="-1">- Categoria Moodle -</option>
								        {categories}
								    </FormControl>
							    </Col>
							    <Col md={4} sm={4}>
							    	<FormControl type="text" name="syncName" placeholder="Nombre de la Sincronizacion" onChange={this.handleName}/>
							    </Col>
							    <Col md={2} sm={2}>
						    		<Button onClick={this.handleCreateSync}>Crear</Button>
							    </Col>
							</FormGroup>
						</form>

					   
		        		<BootstrapTable 
		        		keyField='siu_activity_code' 
		        		data={ this.props.activities } 
		        		columns={ this.activitiesColumns } 
		        		striped
						hover
						condensed
						expandRow={ this.expandRow }
						filter={ filterFactory() }
						noDataIndication="No hay ninguna actividad, por favor pruebe refrescando la cache de actividades desde el menu administracion."
		        		pagination={ paginationFactory(this.paginationOptions) }
		        		/>
		        </fieldset>
			</div>
        );
    }
}

export default connect(mapStateToProps, {loadCategories,loadActivities,refreshActivities,createSync})(Activities);
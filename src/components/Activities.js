import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loadCategories,loadActivities,loadCohorts,loadPeriods,refreshActivities,createSync } from './../redux/actions/actions';
import { Col,Form,FormGroup,ControlLabel,FormControl,Button } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { defaultTablePagination } from './../utils/commons';
import Popup from 'reactjs-popup';



const mapStateToProps = state => {
    return {
        activities: state.activity.activities,
        categories: state.category.categories,
        cohorts: state.cohort.cohorts,
        AddSyncOpen: state.activity.popup,
        periods: state.common.periods,
    }
}

const AddSyncronization =  ({handleCloseAddSync, handleCreateSync, AddSyncOpenState, handleChange, categories, cohorts}) => (
		
		<Popup
          open={AddSyncOpenState}
          closeOnDocumentClick
          onClose={handleCloseAddSync}
        >
          <div>
            <a className="close" onClick={handleCloseAddSync}>
              &times;
            </a>
            <fieldset className="col-md-12">
				<legend>{'Agregar sincronización'}</legend>
	        		<Form id="newSync" horizontal>
						<FormGroup key="newSync" controlId={"formHorizontal"+"newSync"} >
						    <Col md={4} sm={4}>
						      <FormControl type="text" name="syncName" placeholder="Nombre de Sincronización" onChange={handleChange}/>
						    </Col>
						    <Col md={4} sm={4}>
						     	<FormControl componentClass="select" name="syncCategory" placeholder="Categoria Moodle" onChange={handleChange}>
           							<option key="select" value="-1">- Categoria Moodle -</option>
								        {categories}								    
								</FormControl>
						    </Col>
						    <Col md={4} sm={4}>
						     	<FormControl componentClass="select" name="syncCohort" placeholder="Cohorte Moodle" onChange={handleChange}>
           							<option key="select" value="-1">- Cohorte Moodle -</option>
								        {cohorts}								    
								</FormControl>
						    </Col>
						</FormGroup>
						<FormGroup key="newCategoryButton" controlId={"formHorizontal"+"newCategory"} >
							<Col md={2} sm={6}>
								<Button onClick={handleCloseAddSync} >Cancelar</Button>
							</Col>
							<Col md={2} sm={6}>
								<Button onClick={handleCreateSync} >Guardar</Button>
							</Col>
						</FormGroup>
					</Form>
	        </fieldset>

           
          </div>
         
	    </Popup>
	    
	)
	
class Activities extends Component {

	componentDidMount() {
        //this.props.loadActivities(16)
        this.props.loadPeriods()
        this.props.loadCategories()
        this.props.loadCohorts()
    }

    /*
    	Esta funcion me permite tener actualizado el estado del popup a travez de las propiedades
    	que recibo del reducer.
    */
    componentWillReceiveProps(newProps){
     	if(newProps.AddSyncOpen !== this.state.AddSyncOpen){
        	this.setState({AddSyncOpen: newProps.AddSyncOpen })
     	}
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
						selectRow={ {mode: 'checkbox', clickToSelect: true, onSelect: this.handleOnSelect, onSelectAll: this.handleOnSelectAll, selected: this.state.selectedAssignments} }
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

	handleOnSelectAll = (isSelect, rows) => {
		const ids = rows.map(r => r.siu_assignment_code);
		let selectedAssignments = this.state.selectedAssignments.slice().filter((assigment) =>
				ids.indexOf(assigment) == -1 );
		
		if (isSelect) {
			this.setState(() => ({
		    	selectedAssignments: selectedAssignments.concat(ids)
		 	}));
		} else {
		  this.setState(() => ({
		    	selectedAssignments: selectedAssignments
		 	}));
		}
	}

	

	constructor () {
	    super()
	    this.state = {
	    	selectedAssignments:[],
	    	newSync:{},
	    	C_SIU_School_Period_id:null
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

	   	this.handleRefresh = this.handleRefresh.bind(this)
	    this.handleCreateSync = this.handleCreateSync.bind(this)
	   	this.handleChange = this.handleChange.bind(this)
	   	this.handleChangePeriod = this.handleChangePeriod.bind(this)
	   	this.handleCloseAddSync = this.handleCloseAddSync.bind(this)
	   	this.handleOpenAddSync = this.handleOpenAddSync.bind(this)
	 }

	handleCreateSync(e) {
		e.preventDefault();
		this.props.createSync(this.state.selectedAssignments,this.state.newSync.syncCategory, this.state.newSync.syncCohort, this.state.newSync.syncName, this.state.C_SIU_School_Period_id); 
	}

	handleRefresh(e) {
		e.preventDefault();
		this.props.refreshActivities(this.state.C_SIU_School_Period_id);
	}

	handleChangePeriod(e) {
		e.preventDefault();
		this.setState({C_SIU_School_Period_id:e.target.value})
		this.props.loadActivities(e.target.value);
	}

	handleChange(e) {
		var newSync = this.state.newSync;
		newSync[e.target.name] = e.target.value;
		this.setState({newSync:newSync})
	}

	handleCloseAddSync (e) {
	    this.setState({ AddSyncOpen: false })
	}

	handleOpenAddSync(e) {
		e.preventDefault();
		let newSync = {};
		this.setState({ AddSyncOpen: true , newSync:newSync})
	}

    render() {


    	const categories = this.props.categories.map( (category,index)=>
            <option key={category.I_SyncCategory_id} value={category.I_SyncCategory_id}>{category.name}</option>
        )

        const cohorts = this.props.cohorts.map( (cohort,index)=>
            <option key={cohort.I_SyncCohort_id} value={cohort.I_SyncCohort_id}>{cohort.name}</option>
        )

        const periods = this.props.periods.map( (period,index)=>
            <option key={period.C_SIU_School_Period_id} value={period.C_SIU_School_Period_id}>{period.name}</option>
        )

        const AddSyncronizationProps = {
	      handleCloseAddSync: this.handleCloseAddSync,
	      handleCreateSync: this.handleCreateSync,
	      AddSyncOpenState: this.state.AddSyncOpen,
	      handleChange: this.handleChange,
	      categories: categories,
	      cohorts: cohorts,
	    };

        return ( 
            <div className="page activities clearfix">
        		<fieldset className="col-md-12">
        			<Col md={2} sm={4}>
    					<legend>Actividades</legend>
    				</Col>
    				<Col md={4} sm={4}>
    					<Button onClick={this.handleRefresh}>Refresh</Button>
				    </Col>
				    <Col md={4} sm={4}>
				     	<FormControl componentClass="select" name="periodoLectivo" placeholder="Periodo Lectivo" onChange={this.handleChangePeriod}>
   							<option key="select" value="-1">- Periodo Lectivo -</option>
						        {periods}								    
						</FormControl>
				    </Col>
				    <Col md={2} sm={4} mdOffset={0} smOffset={8}>
    					<Button onClick={(e) => this.handleOpenAddSync(e)} >Crear Sincronización</Button>
				    </Col>
					   
	        		<BootstrapTable 
	        		keyField='siu_activity_code' 
	        		data={ this.props.activities } 
	        		columns={ this.activitiesColumns } 
	        		striped
					hover
					condensed
					expandRow={ this.expandRow }
					filter={ filterFactory() }
					noDataIndication="No hay ninguna actividad, por favor pruebe refrescando la cache de actividades desde el menu administración o seleccionando un periodo lectivo."
					pagination={ paginationFactory(defaultTablePagination) }	        		
					/>
				    <Col md={2} sm={4} mdOffset={10} smOffset={8}>
    					<Button  onClick={(e) => this.handleOpenAddSync(e)} >Crear Sincronización</Button>
				    </Col>
		        </fieldset>
		        <AddSyncronization {...AddSyncronizationProps} />
			</div>
        );
    }
}

export default connect(mapStateToProps, {loadCategories,loadActivities,loadCohorts,loadPeriods,refreshActivities,createSync})(Activities);
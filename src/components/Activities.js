import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loadCategories,loadActivities,loadCohorts,loadPeriods,refreshActivities,createSync, addAssignments, loadSyncs } from './../redux/actions/actions';
import { Col,Form,FormGroup,ControlLabel,FormControl,Button } from 'react-bootstrap';
import ReactTooltip from 'react-tooltip'
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
        AddAssignmentsOpen: state.activity.popupAssignments,
        periods: state.common.periods,
        syncs: state.sync.syncs,
    }
}

const AddSyncronization =  ({handleCloseAddSync, handleCreateSync, AddSyncOpenState, handleChange, categories, cohorts, newSync}) => (
		
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
						    	<FormControl type="text" name="syncName" placeholder="Nombre de Sincronización" onChange={handleChange} defaultValue={newSync.syncName}/>
						    </Col>
						    <Col md={4} sm={4}>
						    	<FormControl type="text" name="syncCode" placeholder="Codigo de Sincronización" onChange={handleChange} defaultValue={newSync.syncCode}/>
						    </Col>
						    <Col md={4} sm={4}>
						     	<FormControl componentClass="select" name="syncCategory" placeholder="Categoria Moodle" onChange={handleChange}>
           							<option key="select" value="-1">- Categoria Moodle -</option>
								        {categories}								    
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

const AddAssignmentsPopup =  ({handleCloseAddAssignments, handleAddAssignments, AddAssignmentsOpenState, handleChangeSync, syncs}) => (
		
		<Popup
          open={AddAssignmentsOpenState}
          closeOnDocumentClick
          onClose={handleCloseAddAssignments}
        >
          <div>
            <a className="close" onClick={handleCloseAddAssignments}>
              &times;
            </a>
            <fieldset className="col-md-12">
				<legend>{'Agregar comisiones'}</legend>
	        		<Form id="AddAssignments" horizontal>
						<FormGroup key="AddAssignments" controlId={"formHorizontal"+"AddAssignments"} >
						    <Col md={12} sm={12}>
						     	<FormControl componentClass="select" name="syncCategory" placeholder="Categoria Moodle" onChange={handleChangeSync}>
           							<option key="select" value="-1">- Seleccionar Sincronización -</option>
								        {syncs}								    
								</FormControl>
						    </Col>
						</FormGroup>
						<FormGroup key="AddAssignmentsButton" controlId={"formHorizontal"+"AddAssignmentsButton"} >
							<Col md={2} sm={6}>
								<Button onClick={handleCloseAddAssignments} >Cancelar</Button>
							</Col>
							<Col md={2} sm={6}>
								<Button onClick={handleAddAssignments} >Guardar</Button>
							</Col>
						</FormGroup>
					</Form>
	        </fieldset>

           
          </div>
         
	    </Popup>
	    
	)
	
class Activities extends Component {

	componentDidMount() {
        this.props.loadActivities(-1)
        this.props.loadPeriods()
        this.props.loadCategories()
        this.props.loadCohorts()
        this.props.loadSyncs()
    }

    /*
    	Esta funcion me permite tener actualizado el estado del popup a travez de las propiedades
    	que recibo del reducer.
    */
    componentWillReceiveProps(newProps){
     	if(newProps.AddSyncOpen !== this.state.AddSyncOpen){
        	this.setState({AddSyncOpen: newProps.AddSyncOpen })
     	}

     	if(newProps.AddAssignmentsOpen !== this.state.AddAssignmentsOpen){
        	this.setState({AddAssignmentsOpen: newProps.AddAssignmentsOpen })
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

	// 0 => No existe , 1 => Parcial, 2 => Completa
	getActivityStatus = (C_SIU_Activity) => {
		var notFoundOne = false;
		var foundOne = false;

		for (let i = 0 ; i < C_SIU_Activity.C_SIU_Assignments.length ; i ++) {
			if (C_SIU_Activity.C_SIU_Assignments[i].I_SyncDetails.length == 0)
				notFoundOne = true;
			else
				foundOne = true;

		}
		if (notFoundOne && foundOne)
			return 1
		if (!foundOne )
			return 0
		if (!notFoundOne)
			return 2
	}

	

	constructor () {
	    super()
	    this.state = {
	    	selectedAssignments:[],
	    	newSync:{},
	    	C_SIU_School_Period_id:-1,
	    	activities:[],
	    	AddAssignmentsOpen: false
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
			dataField: 'name',
			text: 'Actividad',
			filter: textFilter()
		},{
			dataField: 'siu_activity_code',
			text: 'Codigo',
			filter: textFilter()
		},{
		    dataField: 'comisiones',
		    text: '# Comisiones',
		    width: '100',
		    formatter: (cellContent, row) => (
		      <div>
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
		      if (this.getActivityStatus(row) == 2) {
		        return (
		          <h5>
		            <a data-tip="Existen sincronizaciónes configuradas para todas las comisiones de esta actividad" className="label label-success">Completa</a>
		          	<ReactTooltip place="top" type="dark" effect="float"/>
		          </h5>
		        );
		      }
		      if (this.getActivityStatus(row) == 1) {
			      return (
			        <h5>
			          <span data-tip="No exste ninguna sincronización configurada con comisiones de esta actividad" className="label label-warning">Parcial</span>
			          <ReactTooltip place="top" type="dark" effect="float"/>
			        </h5>
			      );
		  	  }
		  	  return (
		        <h5>
		          <span data-tip="Existen sincronizaciónes configuradas con solo algunas comisiones de esta actividad" className="label label-danger">Sin configurar</span>
		          <ReactTooltip place="top" type="dark" effect="float"/>
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
		      if (row.I_SyncDetails.length > 0) {
		        return (
		          <h5>
		            <span data-tip={"Existen "+row.I_SyncDetails.length+" sincronizaciones configuradas para esta comisíon"} className="label label-success">Configurada ({row.I_SyncDetails.length})</span>
		          	<ReactTooltip place="top" type="dark" effect="float"/>
		          </h5>
		        );
		      }
		      return (
		        <h5>
		          <span data-tip="No existe ninguna sincronización configurada con esta comisión" className="label label-danger">Sin configurar</span>
		          <ReactTooltip place="top" type="dark" effect="float"/>
		        </h5>
		      );
		    }
		  }];

	   	this.handleRefresh = this.handleRefresh.bind(this)
	    this.handleCreateSync = this.handleCreateSync.bind(this)
	    this.handleAddAssignments = this.handleAddAssignments.bind(this)
	   	this.handleChange = this.handleChange.bind(this)
	   	this.handleChangePeriod = this.handleChangePeriod.bind(this)
	   	this.handleChangeSync = this.handleChangeSync.bind(this)
	   	this.handleCloseAddSync = this.handleCloseAddSync.bind(this)
	   	this.handleOpenAddSync = this.handleOpenAddSync.bind(this)
	   	this.handleCloseAddAssignments = this.handleCloseAddAssignments.bind(this)
	   	this.handleOpenAddAssignments = this.handleOpenAddAssignments.bind(this)
	 }

	handleCreateSync(e) {
		e.preventDefault();
		this.props.createSync(this.state.selectedAssignments,this.state.newSync, this.state.C_SIU_School_Period_id); 
	}

	handleRefresh(e) {
		e.preventDefault();
		this.props.refreshActivities(this.state.C_SIU_School_Period_id);
	}

	handleAddAssignments(e) {
		e.preventDefault();
		this.props.addAssignments(this.state.selectedAssignments,this.state.selectedSync); 
	}

	handleChangePeriod(e) {
		e.preventDefault();
		
		let index = e.target.selectedIndex;

		this.setState({C_SIU_School_Period_id:e.target.value})
		this.setState({C_SIU_School_Period_name:e.target[index].text})
		this.props.loadActivities(e.target.value);
	}

	handleChangeSync(e) {
		e.preventDefault();
		this.setState({selectedSync:e.target.value})
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
		newSync.syncName = this.getSuggestedSyncName();
		newSync.syncCode = this.getSuggestedSyncCode();
		this.setState({ AddSyncOpen: true , newSync:newSync})
	}

	handleCloseAddAssignments (e) {
	    this.setState({ AddAssignmentsOpen: false })
	}

	handleOpenAddAssignments(e) {
		e.preventDefault();
		this.setState({ AddAssignmentsOpen: true , selectedSync:null})
	}

	getSuggestedSyncName() {
		if (this.state.selectedAssignments.length > 0) {
			let assignmentCode = this.state.selectedAssignments[0];
			for (var i = 0 ; i < this.props.activities.length ; i++) {
				for (var j = 0 ; j < this.props.activities[i].C_SIU_Assignments.length ; j++){
					if (this.props.activities[i].C_SIU_Assignments[j].siu_assignment_code == assignmentCode){
						return this.props.activities[i].name +" | "+this.state.C_SIU_School_Period_name;
					}
				}
			}
		}
		return "";
	}

	getSuggestedSyncCode() {
		if (this.state.selectedAssignments.length > 0) {
			let assignmentCode = this.state.selectedAssignments[0];
			for (var i = 0 ; i < this.props.activities.length ; i++) {
				for (var j = 0 ; j < this.props.activities[i].C_SIU_Assignments.length ; j++){
					if (this.props.activities[i].C_SIU_Assignments[j].siu_assignment_code == assignmentCode){
						return this.props.activities[i].siu_activity_code +"_"+this.state.C_SIU_School_Period_id;
					}
				}
			}
		}
		return "";
	}

    render() {


    	const categories = this.props.categories.map( (category,index)=>
            <option key={category.I_SyncCategory_id} value={category.I_SyncCategory_id}>{category.name}</option>
        )

        const cohorts = this.props.cohorts.map( (cohort,index)=>
            <option key={cohort.I_SyncCohort_id} value={cohort.I_SyncCohort_id}>{cohort.name}</option>
        )

        const periods = this.props.periods.map( (period,index)=>
            <option key={period.C_SIU_School_Period_id} text={period.name} value={period.C_SIU_School_Period_id}>{period.name}</option>
        )

        const syncs = this.props.syncs.map( (sync,index)=>
            <option key={sync.I_Sync_id} value={sync.I_Sync_id}>{sync.name}</option>
        )

        const AddSyncronizationProps = {
	      handleCloseAddSync: this.handleCloseAddSync,
	      handleCreateSync: this.handleCreateSync,
	      AddSyncOpenState: this.state.AddSyncOpen,
	      handleChange: this.handleChange,
	      categories: categories,
	      cohorts: cohorts,
	      newSync: this.state.newSync,
	    };

	    const AddAssignmentsPopupProps = {
	      handleCloseAddAssignments: this.handleCloseAddAssignments,
	      handleAddAssignments: this.handleAddAssignments,
	      AddAssignmentsOpenState: this.state.AddAssignmentsOpen,
	      handleChangeSync: this.handleChangeSync,
	      syncs: syncs,
	    };

        return ( 
            <div className="page activities clearfix">
        		<fieldset className="col-md-12">
        			<Col md={2} sm={4}>
    					<legend>Actividades</legend>
    				</Col>
    				<Col md={2} sm={4}>
    					<Button onClick={this.handleRefresh}>Refresh</Button>
				    </Col>
				    <Col md={3} sm={4} >
    					<Button onClick={(e) => this.handleOpenAddAssignments(e)} >Agregar a sincronización existente</Button>
				    </Col>
				    <Col md={3} sm={4}>
				     	<FormControl componentClass="select" name="periodoLectivo" placeholder="Periodo Lectivo" defaultValue={this.state.C_SIU_School_Period_id} onChange={this.handleChangePeriod}>
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
					noDataIndication={'No hay ninguna actividad, por favor pruebe refrescando la cache de actividades con el boton "Refresh" o seleccionando un periodo lectivo.'}
					pagination={ paginationFactory(defaultTablePagination) }	        		
					/>
				    <Col md={2} sm={4} mdOffset={10} smOffset={8}>
    					<Button  onClick={(e) => this.handleOpenAddSync(e)} >Crear Sincronización</Button>
				    </Col>
		        </fieldset>
		        <AddSyncronization {...AddSyncronizationProps} />
		        <AddAssignmentsPopup {...AddAssignmentsPopupProps}/>
			</div>
        );
    }
}

export default connect(mapStateToProps, {loadCategories,loadActivities,loadCohorts,loadPeriods,refreshActivities,createSync,addAssignments,loadSyncs})(Activities);
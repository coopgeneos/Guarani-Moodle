import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loadSyncs,doSyncUp,saveSyncConfig } from './../redux/actions/actions';
import { Button,Form,FormGroup,FormControl,Checkbox,Col, ControlLabel} from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { registerLocale, setDefaultLocale } from 'react-datepicker';
import es from 'date-fns/locale/es'
import "react-datepicker/dist/react-datepicker.css";

import Popup from 'reactjs-popup'

import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';


const mapStateToProps = state => {
    return {
        syncs: state.sync.syncs,
		SyncUpConfigurationOpen: state.sync.popupConfig,    
	}
}

const SyncUpConfiguration =  ({handleCloseSyncUpConfiguration, handleSaveSyncUpConfiguration, SyncUpConfigurationOpenState, SyncUpConfigurationPeriodicity, handleChange, handleChangeCheckBox, SyncUpConfigurationTeachers,SyncUpConfigurationStudents,SyncUpConfigurationDateFrom, SyncUpConfigurationDateTo,handleChangeDateFrom,handleChangeDateTo}) => (
		
		<Popup
          open={SyncUpConfigurationOpenState}
          closeOnDocumentClick
          onClose={handleCloseSyncUpConfiguration}
        >
          <div>
            <a className="close" onClick={handleCloseSyncUpConfiguration}>
              &times;
            </a>
            <fieldset className="col-md-12">
				<legend>Datos a sincronizar</legend>
				<Form id="syncUpConfigData" horizontal>
					<FormGroup key="syncUpConfigData1" controlId={"formHorizontal"+"syncUpConfigData1"} >
					    <Col sm={6}>
					    	<Checkbox name="task_teacher" checked={SyncUpConfigurationTeachers} onChange={handleChangeCheckBox} >¿Sincronizar docentes?</Checkbox>
						</Col>
					</FormGroup>
					<FormGroup key="syncUpConfigData2" controlId={"formHorizontal"+"syncUpConfigData2"} >
						<Col sm={6}>
					    	<Checkbox sm={6} name="task_student" checked={SyncUpConfigurationStudents} onChange={handleChangeCheckBox} >¿Sincronizar estudiantes?</Checkbox>
						</Col>
					</FormGroup>
				</Form>

	        </fieldset>
            <fieldset className="col-md-12">
				<legend>Sincronizacion automatica</legend>
				<Form id="syncUpConfigAuto" horizontal>
					<FormGroup key="syncUpConfigAuto1" controlId={"formHorizontal"+"syncUpConfigAuto1"} >
					    <Col sm={2}>
					    	<ControlLabel>F. desde: </ControlLabel>
						</Col>
						<Col md={4} sm={4}>
							<DatePicker
								className="form-control"
							    onChange={handleChangeDateFrom}
							    locale='es'
							    selected={SyncUpConfigurationDateFrom}
							/>
						</Col>
					</FormGroup>
					<FormGroup key="syncUpConfigAuto2" controlId={"formHorizontal"+"syncUpConfigAuto2"} >
						<Col sm={2}>
					    	<ControlLabel>F. Hasta: </ControlLabel>
						</Col>
						<Col md={4} sm={4}>
							<DatePicker
								className="form-control"
							    onChange={handleChangeDateTo}
							    locale='es'
							    selected={SyncUpConfigurationDateTo}
							/>
						</Col>
					</FormGroup>
					<FormGroup key="syncUpConfigAuto3" controlId={"formHorizontal"+"syncUpConfigAuto3"} >
						<Col  sm={2}>
					    	<ControlLabel>Periodicidad: </ControlLabel>
						</Col>
						<Col sm={2}>
      						<FormControl type="number" name="task_periodicity"  value={SyncUpConfigurationPeriodicity} onChange={handleChange} />
						</Col>
					</FormGroup>
					<FormGroup key="newCategoryButton" controlId={"formHorizontal"+"newCategory"} >
						<Col md={2} sm={6}>
							<Button onClick={handleCloseSyncUpConfiguration} >Cancelar</Button>
						</Col>
						<Col md={2} sm={6}>
							<Button onClick={handleSaveSyncUpConfiguration} >Guardar</Button>
						</Col>
					</FormGroup>
				</Form>
	        </fieldset>
          </div>
         
	    </Popup>
	    
	)

const SyncUpLogs =  ({handleCloseSyncUpLogs, SyncUpLogsOpenState}) => (
		
		<Popup
          open={SyncUpLogsOpenState}
          closeOnDocumentClick
          onClose={handleCloseSyncUpLogs}
        >
          <div>
            <a className="close" onClick={handleCloseSyncUpLogs}>
              &times;
            </a>
            <fieldset className="col-md-12">
				<legend>Logs</legend>

	        </fieldset>
            <Button onClick={handleCloseSyncUpLogs} >OK</Button>
          </div>
         
	    </Popup>
	    
	)

class Synchronizations extends Component {

	componentDidMount() {
        this.props.loadSyncs()
    }

    /*
	Esta funcion me permite tener actualizado el estado del popup a travez de las propiedades
	que recibo del reducer.
    */
    componentWillReceiveProps(newProps){
     	if(newProps.SyncUpConfigurationOpen !== this.state.SyncUpConfigurationOpen){
        	this.setState({SyncUpConfigurationOpen: newProps.SyncUpConfigurationOpen })
     	}
    }

    expandRow = {
		renderer: row => (
			<div>
				<BootstrapTable 
		        		keyField='I_SyncDetail_id' 
		        		data={ row.Details } 
		        		columns={ this.syncDetailsColumns } 
		        		bordered={ false }
		        		striped
						hover
						/>
			</div>
		),
		expandByColumnOnly: true,
		showExpandColumn: true,
	};

    constructor () {
	    super()
	    registerLocale('es', es);

	    this.syncsColumns = [
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
			dataField: 'I_Sync_id',
			text: 'ID'
		}, {
			dataField: 'name',
			text: 'Sincronizacion',
			filter: textFilter()
		},{
		    dataField: 'c_siu_school_period_id',
		    text: 'Periodo',
		    formatter: (cellContent, row) => (
		        <span>
		           {row.C_SIU_School_Period.name}
		        </span>
		    )
		},{
		    dataField: 'i_syncCategory_id',
		    text: 'Categoria Moodle',
		    formatter: (cellContent, row) => (
		        <span>
		           {row.I_SyncCategory.name}
		        </span>
		    )
		},{
		    dataField: 'i_syncCohort_id',
		    text: 'Cohorte',
		    formatter: (cellContent, row) => (
		        <span>
		           {row.I_SyncCohort.name}
		        </span>
		    )
		},{
		    dataField: 'state',
		    isDummyField: true,
		    text: 'Estado',
		    formatter: (cellContent, row) => {
		      if (false) {
		        return (
		          <h5>
		            <span className="label label-success">Realizada # veces</span>
		          </h5>
		        );
		      }
		      if (false) {
		        return (
		          <h5>
		            <span className="label label-info">Ejecutando...</span>
		          </h5>
		        );
		      }
		      if (true) {
		        return (
		          <h5>
		            <span className="label label-warning">Nunca ejecutada</span>
		          </h5>
		        );
		      }
		      return (
		        <h5>
		          <span className="label label-danger">Error</span>
		        </h5>
		      );
		    },
		},{
		    dataField: 'actions',
		    isDummyField: true,
		    text: 'Acciones',
		    formatter: (cellContent, row) => {
		        return (
		        	<div>
			         <Button onClick={(e) => this.handleDoSyncUp(row, e)}>Ejecutar</Button>
					 <Button onClick={(e) => this.handleOpenSyncUpConfiguration(row, e)} >Configurar</Button>
					 <Button >Logs</Button>
				 	</div>
		        );
		      }
		}];

		this.syncDetailsColumns = [{
			dataField: 'I_SyncDetail_id',
			text: 'ID'
		}, {
			dataField: 'siu_assignment_code',
			text: 'Codigo Comision'
		},{
			dataField: 'mdl_course_id',
			text: 'Curso Moodle',
			formatter: (cellContent, row) => {
		    	if (row.mdl_course_id && row.mdl_course_id != null)
			        return (
			        	<a href={"http://moodle-test.unahur.edu.ar/course/view.php?id="+row.mdl_course_id}>
			        		ir al curso
			        	</a>

			        );
			    else
			    	return (
			    		<label> -- </label>
			    	)
		      }
		}];

		this.paginationOptions = {
		  pageStartIndex: 1,
		  withFirstAndLast: false,
		  sizePerPageList: [{
		    text: '10', value: 10
		  }, {
		    text: '20', value: 20
		  }, {
		    text: '50', value: 50
		  }] // A numeric array is also available. the purpose of above example is custom the text
		}

	   	this.handleDoSyncUp = this.handleDoSyncUp.bind(this)
	   	this.handleOpenSyncUpConfiguration = this.handleOpenSyncUpConfiguration.bind(this)
	   	this.handleCloseSyncUpConfiguration = this.handleCloseSyncUpConfiguration.bind(this)
	   	this.handleSaveSyncUpConfiguration = this.handleSaveSyncUpConfiguration.bind(this)
	   	this.handleChange = this.handleChange.bind(this)
	   	this.handleChangeDateTo = this.handleChangeDateTo.bind(this)
	   	this.handleChangeDateFrom = this.handleChangeDateFrom.bind(this)
	   	this.handleChangeCheckBox = this.handleChangeCheckBox.bind(this)

	   	
	   	this.state = {
	    	SyncUpConfigurationOpen:false,
	    	currSync:{task_student:false,task_teacher:false},
	    }

	 }

	handleDoSyncUp(row,e) {
		e.preventDefault();
		this.props.doSyncUp(row.I_Sync_id);
	}

	handleOpenSyncUpConfiguration(row,e) {
		e.preventDefault();
		var currSync = row;
		currSync.task_teacher = currSync.task_teacher == null ? false : currSync.task_teacher;
		currSync.task_student = currSync.task_student == null ? false : currSync.task_student;

		currSync.task_from = currSync.task_from != null ? new Date(currSync.task_from) : null;
		currSync.task_to = currSync.task_to != null ? new Date(currSync.task_to) : null;


		this.setState({ SyncUpConfigurationOpen: true , currSync:currSync})
	}

	handleCloseSyncUpConfiguration (e) {
	    this.setState({ SyncUpConfigurationOpen: false })
	}

	handleSaveSyncUpConfiguration () {
		console.log(this.state.currSync);
		this.props.saveSyncConfig(this.state.currSync);
	}

	handleChange(e) {
		var currSync = this.state.currSync;
		currSync[e.target.name] = e.target.value;
		this.setState({currSync:currSync})
	}

	handleChangeCheckBox(e) {
		var currSync = this.state.currSync;
		currSync[e.target.name] = e.target.checked;
		this.setState({currSync:currSync})
	}

	handleChangeDateFrom(date) {
		var currSync = this.state.currSync;
		currSync.task_from = date;
		this.setState({currSync:currSync})
	}

	handleChangeDateTo(date) {
		var currSync = this.state.currSync;
		currSync.task_to = date;
		this.setState({currSync:currSync})
		console.log(currSync);
	}

    render() {
    	const SyncUpConfigurationProps = {
	      handleCloseSyncUpConfiguration: this.handleCloseSyncUpConfiguration,
	      handleSaveSyncUpConfiguration: this.handleSaveSyncUpConfiguration,
	      SyncUpConfigurationOpenState: this.state.SyncUpConfigurationOpen,
	      SyncUpConfigurationPeriodicity: this.state.currSync.task_periodicity,
	      handleChange: this.handleChange,
	      SyncUpConfigurationTeachers: this.state.currSync.task_teacher,
	      SyncUpConfigurationStudents: this.state.currSync.task_student,
	      handleChangeCheckBox: this.handleChangeCheckBox,
	      SyncUpConfigurationDateFrom: this.state.currSync.task_from,
	      SyncUpConfigurationDateTo: this.state.currSync.task_to,
	      handleChangeDateFrom: this.handleChangeDateFrom,
	      handleChangeDateTo: this.handleChangeDateTo,
	    };

        return ( 
            <div className="page activities clearfix">
        		<fieldset className="col-md-12">
    				<legend>Sincronizaciones</legend>
		        		<BootstrapTable 
		        		keyField='I_Sync_id' 
		        		data={ this.props.syncs } 
		        		columns={ this.syncsColumns } 
		        		striped
						hover
						condensed
						expandRow={ this.expandRow }
						filter={ filterFactory() }
						noDataIndication="No hay ninguna Sincronizacion. Cree sincronizaciones desde la seccion actividades."
		        		pagination={ paginationFactory(this.paginationOptions) }
		        		/>
		        </fieldset>
		        <SyncUpConfiguration {...SyncUpConfigurationProps}/>
			</div>
        );
    }
}

export default connect(mapStateToProps, {loadSyncs,doSyncUp,saveSyncConfig})(Synchronizations);
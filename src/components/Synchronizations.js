import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loadSyncs,doSyncUp,saveSyncConfig,loadSyncLogs, loadConfigurations, loadSyncDetailSIU, deleteAssigment} from './../redux/actions/actions';
import { Button,Form,FormGroup,FormControl,Checkbox,Col, ControlLabel} from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { registerLocale, setDefaultLocale } from 'react-datepicker';
import { defaultTablePagination } from './../utils/commons';

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
		GetDetailsSIUOpen: state.sync.popupDetail,
		detail: state.sync.syncDetail,
		SyncUpLogsOpen: state.sync.popupLogs,  
		logs: state.sync.logs,  
		configs: state.configuration.configurations,
		urlmoodle : state.configuration.configurations.find(x => x.key === "MOODLE_URL")
	}
}

const SyncUpConfigurationPopup =  ({handleCloseSyncUpConfiguration, handleSaveSyncUpConfiguration, SyncUpConfigurationOpenState, SyncUpConfigurationPeriodicity, handleChange, handleChangeCheckBox, SyncUpConfigurationTeachers,SyncUpConfigurationStudents,SyncUpConfigurationDateFrom, SyncUpConfigurationDateTo,handleChangeDateFrom,handleChangeDateTo}) => (
		
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

const SyncUpLogsPopup =  ({handleCloseSyncUpLogs, SyncUpLogsOpenState, syncUpData, syncUpColumns, expandLogRow, paginationOptions}) => (
		
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
	        		<BootstrapTable 
	        		keyField='I_SyncUp_id' 
	        		data={ syncUpData } 
	        		columns={ syncUpColumns } 
	        		striped
					hover
					condensed
					expandRow={ expandLogRow }
					filter={ filterFactory() }
	        		pagination={ paginationFactory(paginationOptions) }
	        		/>
	        </fieldset>
            <Button onClick={handleCloseSyncUpLogs} >OK</Button>
          </div>
         
	    </Popup>
	    
	)

const DetailsSIUPopup =  ({handleCloseGetDetailsSIU, GetDetailsSIUOpenState, docentes, alumnos, paginationOptions, detailsSIUColumns}) => (
		
		<Popup
          open={GetDetailsSIUOpenState}
          closeOnDocumentClick
          onClose={handleCloseGetDetailsSIU}
        >
          <div>
            <a className="close" onClick={handleCloseGetDetailsSIU}>
              &times;
            </a>

             <fieldset className="col-md-12">
				<legend>Docentes: {docentes.length}</legend>
	        		<BootstrapTable 
	        		keyField='docente' 
	        		data={ docentes } 
	        		columns={ detailsSIUColumns } 
	        		striped
					hover
					condensed
					filter={ filterFactory() }
	        		pagination={ paginationFactory(paginationOptions) }
	        		/>
	        </fieldset>
            
	        <fieldset className="col-md-12">
				<legend>Alumnos: {alumnos.length}</legend>
	        		<BootstrapTable 
	        		keyField='alumno' 
	        		data={ alumnos } 
	        		columns={ detailsSIUColumns } 
	        		striped
					hover
					condensed
					filter={ filterFactory() }
	        		pagination={ paginationFactory(paginationOptions) }
	        		/>
	        </fieldset>
            <Button onClick={handleCloseGetDetailsSIU} >OK</Button>
          </div>
         
	    </Popup>
	    
	)

class Synchronizations extends Component {

	componentDidMount() {
        this.props.loadSyncs()
        this.props.loadConfigurations()
    }

    /*
	Esta funcion me permite tener actualizado el estado del popup a travez de las propiedades
	que recibo del reducer.
    */
    componentWillReceiveProps(newProps){
     	if(newProps.SyncUpConfigurationOpen !== this.state.SyncUpConfigurationOpen){
        	this.setState({SyncUpConfigurationOpen: newProps.SyncUpConfigurationOpen })
     	}

     	if(newProps.SyncUpLogsOpen !== this.state.SyncUpLogsOpen){
        	this.setState({SyncUpLogsOpen: newProps.SyncUpLogsOpen })
     	}

     	if(newProps.GetDetailsSIUOpen !== this.state.GetDetailsSIUOpen){
        	this.setState({GetDetailsSIUOpen: newProps.GetDetailsSIUOpen })
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

	expandLogRow = {
		renderer: row => (
			<div>
				<BootstrapTable 
		        		keyField='I_Log_id' 
		        		data={ row.I_Logs } 
		        		columns={ this.logsColumns } 
		        		bordered={ false }
		        		striped
						hover
						pagination={ paginationFactory(this.paginationOptions) }
						/>
			</div>
		),
	};

	// 0 => Sin Ejecutar , 1 => Ejecucion sin finalizar , 2 => Ejecutada correctamente (con errores),  3 => Ejecutada correctamente
	getSincronizationStatus = (I_Sync) => {

		if (I_Sync.I_SyncUps.length == 0)
			return 0;

		if (!I_Sync.I_SyncUps[0].completed)
			return 1;

		for (let i = 0 ; i < I_Sync.I_SyncUps[0].I_Logs.length ; i ++) {
			if (I_Sync.I_SyncUps[0].I_Logs[i].level == 0)
				return 2
		}

		return 3;
	}

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
			dataField: 'code',
			text: 'Codigo',
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
		    dataField: 'state',
		    isDummyField: true,
		    text: 'Estado',
		    formatter: (cellContent, row) => {
		      if (this.getSincronizationStatus(row) == 0) {
		        return (
		          <h5>
		            <span className="label label-danger">Nunca ejecutada</span>
		          </h5>
		        );
		      }
		      if (this.getSincronizationStatus(row) == 1) {
		        return (
		          <h5>
		            <span className="label label-warning">Ejecución sin finalizar</span>
		          </h5>
		        );
		      }
		      if (this.getSincronizationStatus(row) == 2) {
		        return (
		          <h5>
		            <span className="label label-info">Ejecutada correctamente (Con errores)</span>
		          </h5>
		        );
		      }
		      
		      if (this.getSincronizationStatus(row) == 3) {
		      	return (
		          <h5>
		            <span className="label label-success">Ejecutada correctamente</span>
		          </h5>
		        );
		      }
		  	}
		},{
		    dataField: 'actions',
		    isDummyField: true,
		    text: 'Acciones',
		    formatter: (cellContent, row) => {
		        return (
		        	<div>
			         <Button onClick={(e) => this.handleDoSyncUp(row, e)}>Ejecutar</Button>
					 <Button onClick={(e) => this.handleOpenSyncUpConfiguration(row, e)} >Configurar</Button>
					 <Button onClick={(e) => this.handleOpenSyncUpLogs(row, e)} >Logs</Button>
				 	</div>
		        );
		      }
		}];

		this.syncDetailsColumns = [{
			dataField: 'I_SyncDetail_id',
			text: 'ID'
		},{
			dataField: 'siu_assignment_code',
			text: 'Codigo Comision'
		},{
			dataField: 'actions',
			isDummyField: true,
			text: 'Acciones',
			formatter: (cellContent, row) => {
		        return (
		        	<div>
			         <Button onClick={(e) => this.handleLoadSyncDetailSIU(row, e)}>Datos SIU</Button>
			         <Button onClick={(e) => this.handleDeleteAssingment(row, e)}>Eliminar</Button>
				 	</div>
		        );
		    }
		},{
			dataField: 'mdl_course_id',
			text: 'Curso Moodle',
			formatter: (cellContent, row) => {
		    	if (row.mdl_course_id && row.mdl_course_id != null)
			        return (
			        	<a target="_blank" href={this.props.urlmoodle.value+"/course/view.php?id="+row.mdl_course_id}>
			        		ir al curso
			        	</a>

			        );
			    else
			    	return (
			    		<label> -- </label>
			    	)
		      }
		}];

		this.syncUpColumns = [
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
			dataField: 'I_SyncUp_id',
			text: 'ID'
		},{
			dataField: 'createdAt',
			text: 'Fecha de sincronización',
		},{
			dataField: 'completed',
			isDummyField: true,
			text: 'Completa',
			formatter: (cellContent, row) => (
		        <span>
		           {row.completed ? 'Si' : 'No'}
		        </span>
		    )
		},{
		    dataField: 'logs',
		    text: '# Logs',
		    formatter: (cellContent, row) => (
		        <span>
		           {row.I_Logs.length}
		        </span>
		    )
		}];

		this.logsColumns = [
	    {
			dataField: 'level',
			text: 'Nivel',
			filter: textFilter()
		},{
			dataField: 'message',
			text: 'Mensaje',
		}];

		this.detailsSIUColumns = [
		{
			dataField: 'apellido',
			text: 'Apellido'
		}, {
			dataField: 'nombres',
			text: 'Nombres',
		},{
			dataField: 'email',
			text: 'Email',
		},{
			dataField: 'usuario',
			text: 'Usuario',
		}];

		this.paginationOptions = {
		  pageStartIndex: 1,
		  currSizePerPage: 5,
		  paginationSize: 5,
		  withFirstAndLast: false,
		  sizePerPageList: [{
	        text: '5', value: 5
	      }]
		}


	   	this.handleDoSyncUp = this.handleDoSyncUp.bind(this)
	   	this.handleOpenSyncUpConfiguration = this.handleOpenSyncUpConfiguration.bind(this)
	   	this.handleCloseSyncUpConfiguration = this.handleCloseSyncUpConfiguration.bind(this)
	   	this.handleSaveSyncUpConfiguration = this.handleSaveSyncUpConfiguration.bind(this)
	   	this.handleChange = this.handleChange.bind(this)
	   	this.handleChangeDateTo = this.handleChangeDateTo.bind(this)
	   	this.handleChangeDateFrom = this.handleChangeDateFrom.bind(this)
	   	this.handleChangeCheckBox = this.handleChangeCheckBox.bind(this)

	   	this.handleOpenSyncUpLogs = this.handleOpenSyncUpLogs.bind(this)
	   	this.handleCloseSyncUpLogs = this.handleCloseSyncUpLogs.bind(this)
	   	this.handleCloseGetDetailsSIU = this.handleCloseGetDetailsSIU.bind(this)
	   	this.handleLoadSyncDetailSIU = this.handleLoadSyncDetailSIU.bind(this)
	   	this.handleDeleteAssingment = this.handleDeleteAssingment.bind(this)

	   	
	   	this.state = {
	    	SyncUpConfigurationOpen:false,
	    	SyncUpLogsOpen:false,
	    	GetDetailsSIUOpen:false,
	    	currSync:{task_student:false,task_teacher:false},
	    }

	 }

	handleLoadSyncDetailSIU(row,e) {
		e.preventDefault();
		this.props.loadSyncDetailSIU(row.I_SyncDetail_id);
	}

	handleDeleteAssingment(row,e) {
		e.preventDefault();
		this.props.deleteAssigment(row.I_SyncDetail_id);
	}

	handleDoSyncUp(row,e) {
		e.preventDefault();
		this.props.doSyncUp(row.I_Sync_id, this.props.configs.find(x => x.key === "ASSIGNMENT_SYNC_TIMEOUT").value);
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
	}

	handleOpenSyncUpLogs(row,e) {
		e.preventDefault();
		this.props.loadSyncLogs(row.I_Sync_id)
	}

	handleCloseSyncUpLogs (e) {
	    this.setState({ SyncUpLogsOpen: false })
	}


	handleCloseGetDetailsSIU (e) {
	    this.setState({ GetDetailsSIUOpen: false })
	}

    render() {
    	const SyncUpConfigurationPopupProps = {
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

	    const SyncUpLogsPopupProps = {
	    	handleCloseSyncUpLogs:this.handleCloseSyncUpLogs,
	    	SyncUpLogsOpenState: this.state.SyncUpLogsOpen,
	    	syncUpData: this.props.logs,
	    	syncUpColumns: this.syncUpColumns,
	    	expandLogRow: this.expandLogRow,
	    	paginationOptions: this.paginationOptions}

	    const DetailsSIUPopupProps = {
	    	handleCloseGetDetailsSIU:this.handleCloseGetDetailsSIU,
	    	GetDetailsSIUOpenState: this.state.GetDetailsSIUOpen,
	    	docentes: this.props.detail.docentes,
	    	alumnos: this.props.detail.alumnos,
	    	paginationOptions: this.paginationOptions,
	    	detailsSIUColumns:this.detailsSIUColumns
	    }
	    
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
		        		pagination={ paginationFactory(defaultTablePagination) }
		        		/>
		        </fieldset>
		        <SyncUpConfigurationPopup {...SyncUpConfigurationPopupProps}/>
		        <SyncUpLogsPopup {...SyncUpLogsPopupProps}/>
		        <DetailsSIUPopup {...DetailsSIUPopupProps}/>
			</div>
        );
    }
}

export default connect(mapStateToProps, {loadSyncs,doSyncUp,saveSyncConfig,loadSyncLogs, loadConfigurations,loadSyncDetailSIU, deleteAssigment})(Synchronizations);
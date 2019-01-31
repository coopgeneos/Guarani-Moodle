import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loadSyncs,doSyncUp } from './../redux/actions/actions';
import { Button } from 'react-bootstrap';
import Popup from 'reactjs-popup'

import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';

const mapStateToProps = state => {
    return {
        syncs: state.sync.syncs,
        error: state.sync.error
    }
}

const SyncUpConfiguration =  ({handleCloseSyncUpConfiguration, handleSaveSyncUpConfiguration, SyncUpConfigurationOpenState}) => (
		
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
				<legend>Sincronizacion automatica</legend>
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
            <Button onClick={handleSaveSyncUpConfiguration} >Guardar</Button>
          </div>
         
	    </Popup>
	    
	)

class Synchronizations extends Component {

	componentDidMount() {
        this.props.loadSyncs()
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
		    filter: textFilter()
		},{
		    dataField: 'mdl_category_id',
		    text: 'Categoria Moodle',
		    filter: textFilter()
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
	   	
	   	this.state = {
	    	SyncUpConfigurationOpen:false
	    }

	 }

	handleDoSyncUp(row,e) {
		e.preventDefault();
		this.props.doSyncUp(row.I_Sync_id);
	}

	handleOpenSyncUpConfiguration(row,e) {
		e.preventDefault();
		console.log(row);
		this.setState({ SyncUpConfigurationOpen: true })
	}

	handleCloseSyncUpConfiguration (e) {
	    this.setState({ SyncUpConfigurationOpen: false })
	}

	handleSaveSyncUpConfiguration () {
		console.log('Save Configuration!');
		this.handleCloseSyncUpConfiguration();
	}

    render() {
    	const SyncUpConfigurationProps = {
	      handleCloseSyncUpConfiguration: this.handleCloseSyncUpConfiguration,
	      handleSaveSyncUpConfiguration: this.handleSaveSyncUpConfiguration,
	      SyncUpConfigurationOpenState: this.state.SyncUpConfigurationOpen
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

export default connect(mapStateToProps, {loadSyncs,doSyncUp})(Synchronizations);
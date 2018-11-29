import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loadSyncs,doSyncUp } from './../redux/actions/actions';
import { Button } from 'react-bootstrap';

import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';

const mapStateToProps = state => {
    return {
        syncs: state.sync.syncs,
        error: state.sync.error
    }
}

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
			         <Button data-id={row.I_Sync_id} onClick={(e) => this.handleDoSyncUp(row, e)}>Ejecutar</Button>
					 <Button >Configurar</Button>
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
	 }

	handleDoSyncUp(row,e) {
		e.preventDefault();
		this.props.doSyncUp(row.I_Sync_id);
	}

    render() {
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
			</div>
        );
    }
}

export default connect(mapStateToProps, {loadSyncs,doSyncUp})(Synchronizations);
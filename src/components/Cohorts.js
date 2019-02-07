import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loadCohorts,createCohort } from './../redux/actions/actions';
import { Col,Form,FormGroup,FormControl,Button } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import Popup from 'reactjs-popup';
import { defaultTablePagination } from './../utils/commons';



const mapStateToProps = state => {
    return {
        cohorts: state.cohort.cohorts,
        AddCohortOpen: state.cohort.popup,
    }
}


const AddCohort =  ({handleCloseAddCohort, handleCreateCohort, AddCohortOpenState, handleChange, newCohort_name, newCohort_id, I_SyncCohort_id}) => (
		
		<Popup
          open={AddCohortOpenState}
          closeOnDocumentClick
          onClose={handleCloseAddCohort}
        >
          <div>
            <a className="close" onClick={handleCloseAddCohort}>
              &times;
            </a>
            <fieldset className="col-md-12">
				<legend>{ I_SyncCohort_id ? 'Editar cohorte' : 'Agregar cohorte'}</legend>
	        		<Form id="newCohort" horizontal>
						<FormGroup key="newCohort" controlId={"formHorizontal"+"newCohort"} >
						    <Col md={4} sm={4}>
						      <FormControl type="text" name="newCohort_name" placeholder="Nombre de Cohorte" onChange={handleChange} defaultValue={newCohort_name}/>
						    </Col>
						    <Col md={4} sm={4}>
						      <FormControl type="text" name="newCohort_id" placeholder="ID de Cohorte en Moodle" onChange={handleChange} defaultValue={newCohort_id}/>
						    </Col>
						</FormGroup>
						<FormGroup key="newCohortButton" controlId={"formHorizontal"+"newCohort"} >
							<Col md={2} sm={6}>
								<Button onClick={handleCloseAddCohort} >Cancelar</Button>
							</Col>
							<Col md={2} sm={6}>
								<Button onClick={handleCreateCohort} >Guardar</Button>
							</Col>
						</FormGroup>
					</Form>
	        </fieldset>

           
          </div>
         
	    </Popup>
	    
	)
	
class Cohorts extends Component {

	componentDidMount() {
        this.props.loadCohorts();
    }

    /*
    	Esta funcion me permite tener actualizado el estado del popup a travez de las propiedades
    	que recibo del reducer.
    */
    componentWillReceiveProps(newProps){
     	if(newProps.AddCohortOpen !== this.state.AddCohortOpen){
        	this.setState({AddCohortOpen: newProps.AddCohortOpen })
     	}
    }

	constructor () {
	    super()
	    
	    this.cohortsColumns = [
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
			text: 'Nombre',
			filter: textFilter()
		}, {
			dataField: 'mdl_cohort_id',
			text: 'ID en moodle',
			filter: textFilter()
		}, {
		    dataField: 'actions',
		    isDummyField: true,
		    text: 'Acciones',
		    formatter: (cellContent, row) => {
		        return (
		        	<div>
			         <Button onClick={(e) => this.handleOpenAddCohort(row, e)}>Editar</Button>
				 	</div>
		        );
		    }    
		}];

		this.state = {
	    	newCohort:{},
	    }

	    this.handleCreateCohort = this.handleCreateCohort.bind(this)
	    this.handleCloseAddCohort = this.handleCloseAddCohort.bind(this)
	    this.handleOpenAddCohort = this.handleOpenAddCohort.bind(this)
	    this.handleChange = this.handleChange.bind(this)
	 }

	handleCreateCohort(e) {
		e.preventDefault();
		this.props.createCohort(this.state.newCohort);
	}

	handleChange(e) {
		var newCohort = this.state.newCohort;
		newCohort[e.target.name] = e.target.value;
		this.setState({newCohort:newCohort})
	}

	handleCloseAddCohort (e) {
	    this.setState({ AddCohortOpen: false })
	}

	handleOpenAddCohort(cohortRow,e) {
		e.preventDefault();
		let newCohort = {};
		if (cohortRow != null) {
			newCohort = { newCohort_name:cohortRow.name ,
		    				newCohort_id: cohortRow.mdl_cohort_id,
		    				I_SyncCohort_id: cohortRow.I_SyncCohort_id
		    			  }
		}

		this.setState({ AddCohortOpen: true , newCohort:newCohort})
	}

    render() {

    	const AddCohortProps = {
	      handleCloseAddCohort: this.handleCloseAddCohort,
	      handleCreateCohort: this.handleCreateCohort,
	      AddCohortOpenState: this.state.AddCohortOpen,
	      handleChange: this.handleChange,
	      newCohort_name: this.state.newCohort.newCohort_name,
	      newCohort_id: this.state.newCohort.newCohort_id,
	      I_SyncCohort_id: this.state.newCohort.I_SyncCohort_id
	    };
	    
        return ( 
            <div className="page cohorts clearfix">
        		<fieldset className="col-md-12">
    				<Col md={8} sm={6}>
    					<legend>Cohortes</legend>
    				</Col>
    				<Col md={4} sm={6}>
				    	<Button onClick={(e) => this.handleOpenAddCohort(null,e)}>Agregar cohorte</Button>
				    </Col>
	        		<BootstrapTable 
	        		keyField='I_SyncCohort_id' 
	        		data={ this.props.cohorts } 
	        		columns={ this.cohortsColumns } 
	        		striped
					hover
					condensed
					filter={ filterFactory() }
	        		pagination={ paginationFactory(defaultTablePagination) }
	        		noDataIndicacion={'No hay ningun Cohorte. Por favor cree cohortes desde el boton "Agregar cohorte".'}
	        		/>
		        </fieldset> 
		        <AddCohort {...AddCohortProps} />
			</div>


        );
    }
}

export default connect(mapStateToProps, {loadCohorts,createCohort})(Cohorts);
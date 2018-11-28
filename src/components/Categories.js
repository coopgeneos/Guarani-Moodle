import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loadCategories,createCategory } from './../redux/actions/actions';
import { Col,FormGroup,ControlLabel,FormControl,Button } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';


const mapStateToProps = state => {
    return {
        categories: state.category.categories,
        error: state.category.error,
    }
}
	
class Categories extends Component {

	componentDidMount() {
        this.props.loadCategories();
    }

	constructor () {
	    super()
	    
	    this.categoriesColumns = [
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
			dataField: 'mdl_category_id',
			text: 'ID en moodle',
			filter: textFilter()
		}];

		this.paginationOptions = {
		  pageStartIndex: 1,
		  withFirstAndLast: false,
		  noDataText: 'No hay ninguna Categoria. Por favor cree categorias desde el boton "Agregar categoria".',
		  sizePerPageList: [{
		    text: '10', value: 10
		  }, {
		    text: '20', value: 20
		  }, {
		    text: '50', value: 50
		  }] 
		}

		this.state = {
	    	newCategory:{}
	    }

	    this.handleCreateCategory = this.handleCreateCategory.bind(this)
	    this.handleChange = this.handleChange.bind(this)
	 }

	handleCreateCategory(e) {
		e.preventDefault();
		//Take data from input
		console.log(this.state.newCategory);
		this.props.createCategory(this.state.newCategory);
	}

	handleChange(e) {
		var newCategory = this.state.newCategory;
		newCategory[e.target.name] = e.target.value;
		this.setState({newCategory:newCategory})
	}

    render() {
        return ( 
            <div className="page activities clearfix">
        		<fieldset className="col-md-12">
    				<legend>Categorias</legend>
    					<form id="newCategory">
    					 <FormGroup key="newCategory" controlId={"formHorizontal"+"newCategory"} >
						    <Col md={4} sm={4}>
						      <FormControl type="text" name="newCategory_name" placeholder="Nombre de Categoria" onChange={this.handleChange}/>
						    </Col>
						    <Col md={4} sm={4}>
						      <FormControl type="text" name="newCategory_id" placeholder="ID de Categoria en Moodle" onChange={this.handleChange}/>
						    </Col>
						    <Col md={4} sm={4}>
						    	<Button onClick={this.handleCreateCategory}>Agregar categoria</Button>
						    </Col>
						</FormGroup>
						</form>
		        		<BootstrapTable 
		        		keyField='I_SyncCategory_id' 
		        		data={ this.props.categories } 
		        		columns={ this.categoriesColumns } 
		        		striped
						hover
						condensed
						filter={ filterFactory() }
		        		pagination={ paginationFactory(this.paginationOptions) }
		        		/>
		        </fieldset>
			</div>
        );
    }
}

export default connect(mapStateToProps, {loadCategories,createCategory})(Categories);
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loadCategories,createCategory } from './../redux/actions/actions';
import { Col,Form,FormGroup,FormControl,Button } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import Popup from 'reactjs-popup';
import { defaultTablePagination } from './../utils/commons';



const mapStateToProps = state => {
    return {
        categories: state.category.categories,
        AddCategoryOpen: state.category.popup,
    }
}


const AddCategory =  ({handleCloseAddCategory, handleCreateCategory, AddCategoryOpenState, handleChange, newCategory_name, newCategory_id, I_SyncCategory_id}) => (
		
		<Popup
          open={AddCategoryOpenState}
          closeOnDocumentClick
          onClose={handleCloseAddCategory}
        >
          <div>
            <a className="close" onClick={handleCloseAddCategory}>
              &times;
            </a>
            <fieldset className="col-md-12">
				<legend>{ I_SyncCategory_id ? 'Editar categoría' : 'Agregar categoría'}</legend>
	        		<Form id="newCategory" horizontal>
						<FormGroup key="newCategory" controlId={"formHorizontal"+"newCategory"} >
						    <Col md={4} sm={4}>
						      <FormControl type="text" name="newCategory_name" placeholder="Nombre de Categoria" onChange={handleChange} defaultValue={newCategory_name}/>
						    </Col>
						    <Col md={4} sm={4}>
						      <FormControl type="text" name="newCategory_id" placeholder="ID de Categoria en Moodle" onChange={handleChange} defaultValue={newCategory_id}/>
						    </Col>
						</FormGroup>
						<FormGroup key="newCategoryButton" controlId={"formHorizontal"+"newCategory"} >
							<Col md={2} sm={6}>
								<Button onClick={handleCloseAddCategory} >Cancelar</Button>
							</Col>
							<Col md={2} sm={6}>
								<Button onClick={handleCreateCategory} >Guardar</Button>
							</Col>
						</FormGroup>
					</Form>
	        </fieldset>

           
          </div>
         
	    </Popup>
	    
	)
	
class Categories extends Component {

	componentDidMount() {
        this.props.loadCategories();
    }

    /*
    	Esta funcion me permite tener actualizado el estado del popup a travez de las propiedades
    	que recibo del reducer.
    */
    componentWillReceiveProps(newProps){
     	if(newProps.AddCategoryOpen !== this.state.AddCategoryOpen){
        	this.setState({AddCategoryOpen: newProps.AddCategoryOpen })
     	}
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
		}, {
		    dataField: 'actions',
		    isDummyField: true,
		    text: 'Acciones',
		    formatter: (cellContent, row) => {
		        return (
		        	<div>
			         <Button onClick={(e) => this.handleOpenAddCategory(row, e)}>Editar</Button>
				 	</div>
		        );
		    }    
		}];

		this.state = {
	    	newCategory:{},
	    }

	    this.handleCreateCategory = this.handleCreateCategory.bind(this)
	    this.handleCloseAddCategory = this.handleCloseAddCategory.bind(this)
	    this.handleOpenAddCategory = this.handleOpenAddCategory.bind(this)
	    this.handleChange = this.handleChange.bind(this)
	 }

	handleCreateCategory(e) {
		e.preventDefault();
		this.props.createCategory(this.state.newCategory);
	}

	handleChange(e) {
		var newCategory = this.state.newCategory;
		newCategory[e.target.name] = e.target.value;
		this.setState({newCategory:newCategory})
	}

	handleCloseAddCategory (e) {
	    this.setState({ AddCategoryOpen: false })
	}

	handleOpenAddCategory(categoryRow,e) {
		e.preventDefault();
		let newCategory = {};
		if (categoryRow != null) {
			newCategory = { newCategory_name:categoryRow.name ,
		    				newCategory_id: categoryRow.mdl_category_id,
		    				I_SyncCategory_id: categoryRow.I_SyncCategory_id
		    			  }
		}

		this.setState({ AddCategoryOpen: true , newCategory:newCategory})
	}

    render() {

    	const AddCategoryProps = {
	      handleCloseAddCategory: this.handleCloseAddCategory,
	      handleCreateCategory: this.handleCreateCategory,
	      AddCategoryOpenState: this.state.AddCategoryOpen,
	      handleChange: this.handleChange,
	      newCategory_name: this.state.newCategory.newCategory_name,
	      newCategory_id: this.state.newCategory.newCategory_id,
	      I_SyncCategory_id: this.state.newCategory.I_SyncCategory_id
	    };
	    
        return ( 
            <div className="page categories clearfix">
        		<fieldset className="col-md-12">
    				<Col md={8} sm={6}>
    					<legend>Categorias</legend>
    				</Col>
    				<Col md={4} sm={6}>
				    	<Button onClick={(e) => this.handleOpenAddCategory(null,e)}>Agregar categoria</Button>
				    </Col>
	        		<BootstrapTable 
	        		keyField='I_SyncCategory_id' 
	        		data={ this.props.categories } 
	        		columns={ this.categoriesColumns } 
	        		striped
					hover
					condensed
					filter={ filterFactory() }
	        		pagination={ paginationFactory(defaultTablePagination) }
	        		noDataIndicacion={'No hay ninguna Categoria. Por favor cree categorias desde el boton "Agregar categoria".'}
	        		/>
		        </fieldset>
		        <AddCategory {...AddCategoryProps} />
			</div>


        );
    }
}

export default connect(mapStateToProps, {loadCategories,createCategory})(Categories);
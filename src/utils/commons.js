
export function defaultTablePagination(data = null) {
  return {
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
        text: '25', value: 25
      }, {
        text: '50', value: 50
      }, {
        text: '100', value: 100
      },{
        text: 'Todos', value: data && data != null && data.length > 0 ? data.length : 1
      }] 
    };
  }

export function defaultTablePagination() {
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
        text: '10', value: 10
      }, {
        text: '20', value: 20
      }, {
        text: '50', value: 50
      }] // A numeric array is also available. the purpose of above example is custom the text
    };
  }

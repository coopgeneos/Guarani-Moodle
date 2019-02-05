
export function defaultTablePagination() {

  return {
        pageStartIndex: 1,
        withFirstAndLast: false,
        sizePerPageList: [{
          text: '10', value: 10
        }, {
          text: '20', value: 20
        }, {
          text: '50', value: 50
        }] 
      };
  }

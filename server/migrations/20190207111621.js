'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.removeColumn('I_Sync', 'mdl_category_id');
    queryInterface.addColumn('I_Sync', 'i_syncCategory_id', {type: Sequelize.INTEGER});
    return;
  },
  
  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn('I_Sync', 'i_syncCategory_id');
    queryInterface.addColumn('I_Sync', 'mdl_category_id', {type: Sequelize.INTEGER});
    return;
  }
};
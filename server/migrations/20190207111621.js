'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.removeColumn('I_Sync', 'mdl_category_id');
    queryInterface.addColumn('I_Sync', 'i_syncCategory_id', {type: Sequelize.INTEGER});
    queryInterface.addColumn('I_SyncUp', 'completed', {type: Sequelize.BOOLEAN});
    return;
  },
  
  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn('I_Sync', 'i_syncCategory_id');
    queryInterface.addColumn('I_Sync', 'mdl_category_id', {type: Sequelize.INTEGER});
    queryInterface.removeColumn('I_SyncUp', 'completed');
    return;
  }
};
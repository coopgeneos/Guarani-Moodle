'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.createTable('C_MDL_SIU_Processed', {
      C_MDL_SIU_Processed_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      i_sync_id: {
        type: Sequelize.INTEGER
      },
      siu_assignment_code: {
        type: Sequelize.INTEGER
      }, 
      siu_user_id: {
        type: Sequelize.INTEGER
      },
      mdl_group_id: {
        type: Sequelize.INTEGER
      },
      mdl_user_id: {
        type: Sequelize.INTEGER
      },     
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    return;
  },
  
  down: (queryInterface, Sequelize) => {
    queryInterface.dropTable('C_MDL_SIU_Processed');
    return;
  }
};
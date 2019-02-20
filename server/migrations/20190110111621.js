'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn('I_Sync', 'task_from', {type: Sequelize.DATE});
    queryInterface.addColumn('I_Sync', 'task_to', {type: Sequelize.DATE});
    queryInterface.addColumn('I_Sync', 'task_periodicity', {type: Sequelize.INTEGER});
    queryInterface.addColumn('I_Sync', 'task_next', {type: Sequelize.INTEGER});
    queryInterface.addColumn('I_Sync', 'task_teacher', {type: Sequelize.BOOLEAN, default:true});
    queryInterface.addColumn('I_Sync', 'task_student', {type: Sequelize.BOOLEAN, default:true});
    queryInterface.addColumn('I_Sync', 'i_syncCohort_id', {type: Sequelize.INTEGER});

    queryInterface.createTable('I_SyncCohort', {
      I_SyncCohort_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING
      },
      mdl_cohort_id: {
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
    queryInterface.removeColumn('I_Sync', 'task_from');
    queryInterface.removeColumn('I_Sync', 'task_to');
    queryInterface.removeColumn('I_Sync', 'task_periodicity');
    queryInterface.removeColumn('I_Sync', 'task_next');
    queryInterface.removeColumn('I_Sync', 'task_teacher');
    queryInterface.removeColumn('I_Sync', 'task_student');
    queryInterface.removeColumn('I_Sync', 'i_syncCohort_id');
    queryInterface.dropTable('I_SyncCohort');
    return;
  }
};
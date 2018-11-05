'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn('I_SyncDetail', 'doSync', {type: Sequelize.BOOLEAN});
        
    queryInterface.createTable('C_SIU_School_Period', {
      C_SIU_School_Period_id: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING
      },
      year: {
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
    
    queryInterface.createTable('C_SIU_Activity', {
      siu_activity_code: {
        type: Sequelize.STRING,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING
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

    queryInterface.createTable('C_SIU_Assignment', {
      siu_assignment_code: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      siu_activity_code: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'C_SIU_Activity',
          key: 'siu_activity_code',
          deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
        }
      },
      c_siu_school_period_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'C_SIU_School_Period',
          key: 'C_SIU_School_Period_id',
          deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
        }
      },
      name: {
        type: Sequelize.STRING
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

    queryInterface.createTable('I_SyncCategory', {
      I_SyncCategory_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING
      },
      mdl_category_id: {
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

    queryInterface.createTable('C_MDL_SIU_User', {
      C_MDL_SIU_User_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      mdl_user_id: {
        type: Sequelize.INTEGER
      },
      siu_user_id: {
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

    queryInterface.createTable('I_SyncUp', {
      I_SyncUp_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      i_sync_id: {
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

    queryInterface.addColumn('I_Log', 'i_syncUp_id', {type: Sequelize.INTEGER});

    queryInterface.addColumn('I_Sync', 'name', {type: Sequelize.STRING});

    return;
  },
  
  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn('I_SyncDetail', 'doSync');
    queryInterface.dropTable('C_SIU_Assignment');
    queryInterface.dropTable('C_SIU_School_Period');
    queryInterface.dropTable('C_SIU_Activity');
    queryInterface.dropTable('I_SyncCategory');
    queryInterface.dropTable('C_MDL_SIU_User');
    queryInterface.dropTable('I_SyncUp');
    queryInterface.removeColumn('I_Log', 'I_SyncUp');
    queryInterface.removeColumn('I_Sync', 'name');
    return;
  }
};
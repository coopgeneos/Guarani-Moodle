'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.createTable('I_User', {      
      I_User_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING       
      },
      surname: {
        type: Sequelize.STRING     
      },
      username: {
        type: Sequelize.STRING,
        unique: true,    
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      role: {
          type: Sequelize.ENUM,
          values: ['0', '1', '2']
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        type: Sequelize.DATE
      }
    });

    queryInterface.createTable('I_Config', {
      key: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING
      },
      value: {
        type: Sequelize.STRING
      },
      description: {
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

    queryInterface.createTable('I_Sync', {
      I_Sync_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      siu_activity_code: {
        type: Sequelize.STRING
      },
      siu_school_period: {
        type: Sequelize.STRING
      },
      mdl_category_id: {
        type: Sequelize.INTEGER
      },
      sync_type: {
        type: Sequelize.ENUM,
        values: ['0', '1', '2']
      },
      status: {
          type: Sequelize.ENUM,
          values: ['PE', 'AP', 'AR']
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

    queryInterface.createTable('I_SyncDetail', {
      I_SyncDetail_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      i_sync_id: {
        type: Sequelize.INTEGER
      },
      siu_assignment_code: {
        type: Sequelize.STRING
      },
      mdl_course_id: {
        type: Sequelize.INTEGER
      },
      mdl_group_id: {
        type: Sequelize.INTEGER
      },
      dateLastSync: {
        type: Sequelize.DATE
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

    queryInterface.createTable('I_Log', {
      I_Log_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      i_syncDetail_id: {
        type: Sequelize.INTEGER
      },
      message: {
        type: Sequelize.STRING(512)
      },
      level: {
        type: Sequelize.ENUM, 
        values: ['0', '1', '2']
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
    queryInterface.dropTable('I_User');
    queryInterface.dropTable('I_Config');
    queryInterface.dropTable('I_Sync');
    queryInterface.dropTable('I_SyncDetail');
    queryInterface.dropTable('I_Log');
    return;
  }
};
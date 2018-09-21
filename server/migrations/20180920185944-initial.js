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
        type: Sequelize.STRING    
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      state: {
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

    queryInterface.createTable('I_Config', {
      key: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING
      },
      value: {
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
      siu_actividad_codigo: {
        type: Sequelize.STRING
      },
        siu_periodo_lectivo: {
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
      siu_comision: {
        type: Sequelize.STRING
      },
      mdl_course_id: {
        type: Sequelize.INTEGER
      },
      mdl_group_id: {
        type: Sequelize.STRING
      },
      dateLastSync: {
        type: Sequelize.DATE
      },
      groupNo: {
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

    queryInterface.createTable('I_Log', {
      I_Log_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      message: {
        type: Sequelize.STRING(512)
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
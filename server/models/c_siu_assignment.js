'use strict';
module.exports = (sequelize, DataTypes) => {
	let C_SIU_Assignment = sequelize.define('C_SIU_Assignment', {
		siu_assignment_code: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
		name: {
			type: DataTypes.STRING
		}    
	},
	{
		tableName: 'C_SIU_Assignment'
	})

	C_SIU_Assignment.associate = function (models) {
    models.C_SIU_Assignment.belongsTo(models.C_SIU_Activity, {
			foreignKey: {
				name: 'siu_activity_code',
			}
	  });

	  models.C_SIU_Assignment.belongsTo(models.C_SIU_School_Period, {
			foreignKey: {
				name: 'c_siu_school_period_id',
			},
	  });

	  models.C_SIU_Assignment.hasMany(models.I_SyncDetail, {
			foreignKey: {
				name: 'siu_assignment_code',
			},
	  });
	};

	return C_SIU_Assignment;
};

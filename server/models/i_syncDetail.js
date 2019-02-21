module.exports = (sequelize, DataTypes) => {
	let SyncDetail = sequelize.define('I_SyncDetail', {
		I_SyncDetail_id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		siu_assignment_code: {
			type: DataTypes.INTEGER
		},
	  	mdl_course_id: {
			type: DataTypes.INTEGER
		},
		mdl_group_id: {
			type: DataTypes.INTEGER
		},
		dateLastSync: {
			type: DataTypes.DATE
		},		
		doSync: {
			type: DataTypes.BOOLEAN,
		}
	},
	{
		tableName: 'I_SyncDetail'
	})

	SyncDetail.associate = function (models) {
	    models.I_SyncDetail.belongsTo(models.I_Sync, {
				foreignKey: {
					name: 'i_sync_id'
				}
	    });

	    models.I_SyncDetail.belongsTo(models.C_SIU_Assignment, {
				foreignKey: {
					name: 'siu_assignment_code'
				}
	    });
	};

	return SyncDetail;
};
module.exports = (sequelize, DataTypes) => {
	let I_SyncUp = sequelize.define('I_SyncUp', {
		I_SyncUp_id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		completed: {
			type: DataTypes.BOOLEAN,
			default: false
		},
	},
	{
		tableName: 'I_SyncUp'
	});

	I_SyncUp.associate = function (models) {
	    models.I_SyncUp.belongsTo(models.I_Sync, {
				foreignKey: {
					name: 'i_sync_id'
				},
				as: 'i_sync',
	    });

	    models.I_SyncUp.hasMany(models.I_Log, {
				foreignKey: {
					name: 'i_syncUp_id',
				},

	    });
	};

	return I_SyncUp;
};
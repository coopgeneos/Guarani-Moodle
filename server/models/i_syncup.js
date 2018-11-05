module.exports = (sequelize, DataTypes) => {
	let I_SyncUp = sequelize.define('I_SyncUp', {
		I_SyncUp_id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		}  
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
	};

	return I_SyncUp;
};
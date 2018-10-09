module.exports = (sequelize, DataTypes) => {
	let Log = sequelize.define('I_Log', {
		I_Log_id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		message: {
			type: DataTypes.STRING(512)
		},
		level: {
	    type: DataTypes.ENUM,
	    values: ['0', '1', '2']
		}
	},
	{
		tableName: 'I_Log'
	})

	Log.associate = function (models) {
	    models.I_Log.belongsTo(models.I_SyncDetail, {
			foreignKey: {
				name: 'i_syncDetail_id',
				allowNull: false
			},
			as: 'SyncDetail_id',
	    });
  	};

	return Log;
};
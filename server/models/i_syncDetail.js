module.exports = (sequelize, DataTypes) => {
	let SyncDetail = sequelize.define('I_SyncDetail', {
		I_SyncDetail_id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		siu_comision: {
			type: DataTypes.STRING
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
		groupNo: {
		    type: DataTypes.ENUM,
		    values: ['0', '1', '2']
		}
	},
	{
		tableName: 'I_SyncDetail'
	})

	SyncDetail.associate = function (models) {
    models.I_SyncDetail.belongsTo(models.I_Sync, {
		foreignKey: {
			name: 'i_sync_id'
		},
		as: 'Sync_id',
    });
	};

	return SyncDetail;
};
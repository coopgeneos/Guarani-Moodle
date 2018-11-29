module.exports = (sequelize, DataTypes) => {
	let Sync = sequelize.define('I_Sync', {
		I_Sync_id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			type: DataTypes.STRING
		},
		siu_activity_code: {
			type: DataTypes.STRING
		},
		//Replace siu_school_period
		c_siu_school_period_id: {
			type: DataTypes.INTEGER
		},
	    mdl_category_id: {
			type: DataTypes.INTEGER
		},
		sync_type: {
			type: DataTypes.ENUM,
		  values: ['0', '1', '2']
		},
		status: {
	    type: DataTypes.ENUM,
	    values: ['PE', 'AP', 'AR']
		}
	},
	{
		tableName: 'I_Sync'
	})

	Sync.associate = function (models) {
	    models.I_Sync.hasMany(models.I_SyncDetail, {
				foreignKey: {
					name: 'i_sync_id'
				},
				as: 'Details',
	    });

	    models.I_Sync.belongsTo(models.C_SIU_School_Period, {
			foreignKey: {
				name: 'c_siu_school_period_id',
			},
	  	});
	};

	return Sync;
};
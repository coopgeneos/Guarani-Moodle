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
		code: {
			type: DataTypes.STRING,
			unique: true
		},
		siu_activity_code: {
			type: DataTypes.STRING
		},
		sync_type: {
			type: DataTypes.ENUM,
		  values: ['0', '1', '2']
		},
		status: {
	    type: DataTypes.ENUM,
	    values: ['PE', 'AP', 'AR']
		},
		task_from: {
			type: DataTypes.DATE
		},
		task_to: {
			type: DataTypes.DATE
		},
		task_periodicity: {
			type: DataTypes.INTEGER,
			validate: { min: 0, max: 23 }
		},
		task_next: {
			type: DataTypes.INTEGER,
			validate: { min: 0, max: 23 }
		},
		task_teacher: {
			type: DataTypes.BOOLEAN,
			default:true
		},
		task_student: {
			type: DataTypes.BOOLEAN,
			default:true
    },
    active: {
      type: DataTypes.BOOLEAN,
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

	     models.I_Sync.hasMany(models.I_SyncUp, {
				foreignKey: {
					name: 'i_sync_id'
				}
	    });

	    models.I_Sync.belongsTo(models.C_SIU_School_Period, {
				foreignKey: {
					name: 'c_siu_school_period_id',
				},
	  	});

	  	models.I_Sync.belongsTo(models.I_SyncCohort, {
				foreignKey: {
					name: 'i_syncCohort_id',
				},
	  	});

	  	models.I_Sync.belongsTo(models.I_SyncCategory, {
				foreignKey: {
					name: 'i_syncCategory_id',
				},
	  	});
	};

	return Sync;
};
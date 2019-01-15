module.exports = (sequelize, DataTypes) => {
	let I_SyncCohort = sequelize.define('I_SyncCohort', {		
		I_SyncCohort_id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			type: DataTypes.STRING
		},
		mdl_cohort_id: {
			type: DataTypes.INTEGER
		},
	},
	{
		tableName: 'I_SyncCohort'
	})

	return I_SyncCohort;
}
module.exports = (sequelize, DataTypes) => {
	let C_MDL_SIU_Processed = sequelize.define('C_MDL_SIU_Processed', {
		C_MDL_SIU_Processed_id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		siu_assignment_code: {
			type: DataTypes.INTEGER
		}, 
		siu_user_id: {
			type: DataTypes.INTEGER
		},
		mdl_group_id: {
			type: DataTypes.INTEGER
		},
		mdl_user_id: {
			type: DataTypes.INTEGER
		}	   
	},
	{
		tableName: 'C_MDL_SIU_Processed'
	});

	C_MDL_SIU_Processed.associate = function (models) {
    models.C_MDL_SIU_Processed.belongsTo(models.I_Sync, {
			foreignKey: {
				name: 'i_sync_id',
			}
	  });	  
	};

	return C_MDL_SIU_Processed;
};
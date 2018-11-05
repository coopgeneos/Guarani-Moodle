module.exports = (sequelize, DataTypes) => {
	let C_MDL_SIU_User = sequelize.define('C_MDL_SIU_User', {
		C_MDL_SIU_User_id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		mdl_user_id: {
			type: DataTypes.INTEGER
		},
		siu_user_id: {
			type: DataTypes.INTEGER
		}    
	},
	{
		tableName: 'C_MDL_SIU_User'
	});

	return C_MDL_SIU_User;
};
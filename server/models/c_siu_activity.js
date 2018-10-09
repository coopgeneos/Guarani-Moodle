'use strict';
module.exports = (sequelize, DataTypes) => {
	let C_SIU_Activity = sequelize.define('C_SIU_Activity', {
		siu_activity_code: {
			type: DataTypes.STRING,
			primaryKey: true
		},
		name: {
			type: DataTypes.STRING
		}    
	},
	{
		tableName: 'C_SIU_Activity'
	});

	return C_SIU_Activity;
};

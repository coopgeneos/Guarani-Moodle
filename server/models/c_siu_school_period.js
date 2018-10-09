'use strict';
module.exports = (sequelize, DataTypes) => {
	let C_SIU_School_Period = sequelize.define('C_SIU_School_Period', {
		C_SIU_School_Period_id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			//autoIncrement: true
		},
		name: {
			type: DataTypes.STRING
		},
	  year: {
			type: DataTypes.INTEGER
		}
	},
	{
		tableName: 'C_SIU_School_Period'
	})

	return C_SIU_School_Period;
};

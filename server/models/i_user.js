'use strict';
module.exports = (sequelize, DataTypes) => {
	let User = sequelize.define('I_User', {
		I_User_id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			type: DataTypes.STRING
		},
	    surname: {
			type: DataTypes.STRING
		},
	    username: {
			type: DataTypes.STRING
		},
		password: {
			type: DataTypes.STRING
		},
		role: {
		    type: DataTypes.ENUM,
		    values: ['0', '1', '2']
		}
	},
	{
		tableName: 'I_User',
		paranoid: true
	})

	return User;
};

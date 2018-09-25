module.exports = (sequelize, DataTypes) => {
	let Config = sequelize.define('I_Config', {		
		key: {
			type: DataTypes.STRING,
			primaryKey: true
		},
		name: {
			type: DataTypes.STRING
		},
	    value: {
			type: DataTypes.STRING
		},
		description: {
			type: DataTypes.STRING
		},
	},
	{
		tableName: 'I_Config'
	})

	return Config;
};
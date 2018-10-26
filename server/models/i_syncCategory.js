module.exports = (sequelize, DataTypes) => {
	let I_SyncCategory = sequelize.define('I_SyncCategory', {		
		I_SyncCategory_id: {
			type: DataTypes.INTEGER,
			primaryKey: true
		},
		name: {
			type: DataTypes.STRING
		},
	  mdl_category_id: {
			type: DataTypes.INTEGER
		},
	},
	{
		tableName: 'I_SyncCategory'
	})

	return I_SyncCategory;
};
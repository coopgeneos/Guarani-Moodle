'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.bulkInsert('I_User', [{
        name: 'Admin',
        surname: 'Admin',
        username: 'Admin',
        password: '6ed9aa9da96087f919dd5dda7be7db04', //n0t4dm1n
        state: '0',
        createdAt: new Date(),
        updatedAt: new Date()
      }]);
    return;
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.bulkDelete('I_User', null, {});
    return;
  }
};

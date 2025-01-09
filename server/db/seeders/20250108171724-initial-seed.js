'use strict';

const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        firstName: 'Bob',
        lastName: 'Bobovich',
        email: 'bob@bob.com',
        password: bcrypt.hashSync('123aaA!', 10),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
    await queryInterface.bulkDelete('Bookings', null, {});
    await queryInterface.bulkDelete('Slots', null, {});
    await queryInterface.bulkDelete('AdminUsers', null, {});
  },
};

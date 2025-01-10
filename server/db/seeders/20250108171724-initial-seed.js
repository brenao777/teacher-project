'use strict';

const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('AdminUsers', [
      {
        firstName: 'Alex',
        lastName: 'K',
        email: 'Alex@k.com',
        password: bcrypt.hashSync('123aaA!', 10),
        isAdmin: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    await queryInterface.bulkInsert('Users', [
      {
        firstName: 'Bob',
        lastName: 'Bobovich',
        email: 'bob@bob.com',
        password: bcrypt.hashSync('123aaA!', 10),
        isAdmin: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstName: 'Kek',
        lastName: 'Kekovich',
        email: 'kek@kek.kek',
        password: bcrypt.hashSync('123aaA!', 10),
        isAdmin: false,
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

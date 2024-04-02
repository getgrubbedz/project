const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('petstore', 'user', 'pass', {
  dialect: 'sqlite',
  host: './petstore.sqlite'
});

module.exports = sequelize;
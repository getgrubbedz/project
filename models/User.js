const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database');

class User extends Model {};

User.init({
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  salt: {
    type: DataTypes.STRING,
    allowNull: false
  },
  first: {
    type: DataTypes.STRING,
    allowNull: false
  },
  last: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('FullAdmin', 'UserAdmin', 'PetAdmin', 'None'),
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'user'
});

module.exports = User;
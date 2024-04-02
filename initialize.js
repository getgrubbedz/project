const sequelize = require('./database');
const crypto = require('crypto');
const User = require('./models/User');
const Pet = require('./models/Pet');

async function initialSetup() {
  await sequelize.sync().then(() => console.log('database is initialized'));
  let salt = crypto.randomBytes(16);
  crypto.pbkdf2('password', salt, 310000, 32, 'sha256', async function(err, hashedPassword) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    try {
      const user = await User.create({
        username: 'admin',
        password: hashedPassword,
        salt: salt,
        first: 'Admin',
        last: 'Admin',
        email: 'admin@petstore.com',
        role: 'FullAdmin'
      });
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  });
  try {
    const pet = await Pet.create({
      name: 'Cheeseball',
      type: 'Dog',
      breed: 'Pitbull',
      age: 2,
      img: '99a9ec35ed291b01b2af85e1df908557',
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

(async () => {
  try {
    await initialSetup();
    console.log('Admin user create successfully!');
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
})();

module.exports = sequelize;
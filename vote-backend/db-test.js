const { Sequelize, DataTypes, Model } = require('sequelize')
const path = require('path')
const dbFile = path.join(__dirname, 'db-test.sqlite3')
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbFile,
  logging: false,
});

exports.sequelize = sequelize

class User extends Model { }
User.init({
  name: DataTypes.STRING
}, {
  sequelize,
})

class Option extends Model { }
Option.init({
  content: DataTypes.STRING,
}, {
  sequelize,
})

User.belongsToMany(Option, {
  through: 'UserOption'
})
Option.belongsToMany(User, {
  through: 'UserOption'
})


async function main() {
  await sequelize.sync({force: true})
  var user1 = await User.create({
    name: 'zs'
  })
  var user2 = await User.create({
    name: 'li'
  })
  var option = await Option.create({
    content: 'bar'
  })
  await option.addUsers([user1, user2])
  var options = await Option.findOne({
    // include: User
    include: {
      model: User,
      attributes: ['name']
    }
  })

  console.log(options.Users)
}
main()

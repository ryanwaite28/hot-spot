const Sequelize = require('sequelize');
const chamber = require('./chamber');



/* --- Production Database --- */

// const database_connect_string = "";
// const sequelize = new Sequelize(database_connect_string, {
//   dialect: 'postgres',
//   dialectOptions: {
//     ssl: true
//   }
// });



/* --- Development Database --- */

const sequelize = new Sequelize({
  password: null,
  dialect: 'sqlite',
  storage: 'database.sqlite',
});



/* --- Models --- */

var models = {};

models.Users = sequelize.define('users', {
  displayname:     { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  username:        { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  email:           { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  password:        { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  bio:             { type: Sequelize.STRING(250), allowNull: true, defaultValue: '' },
  icon:            { type: Sequelize.STRING(500), allowNull: true, defaultValue: '/vault/images/anon.png' },
  link:            { type: Sequelize.STRING(500), allowNull: true, defaultValue: '' },
  verified:        { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
  confirmed:       { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
  date_created:    { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
  unique_value:    { type: Sequelize.STRING, unique: true, defaultValue: chamber.uniqueValue }
}, {
  freezeTableName: true,
  indexes: [{ unique: true, fields: ['username', 'email', 'unique_value'] }]
});

models.Follows = sequelize.define('follows', {
  user_id:         { type: Sequelize.INTEGER, allowNull: false, references: { model: models.Users, key: 'id' } },
  follows_id:      { type: Sequelize.INTEGER, allowNull: false, references: { model: models.Users, key: 'id' } },
  date_created:    { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
  unique_value:    { type: Sequelize.STRING, unique: true, defaultValue: chamber.uniqueValue }
}, {
  freezeTableName: true,
  indexes: [{ unique: true, fields: ['unique_value'] }]
});

models.ChatRooms = sequelize.define('chatrooms', {
  owner_id:        { type: Sequelize.INTEGER, allowNull: false, references: { model: models.Users, key: 'id' } },
  summary:         { type: Sequelize.STRING(250), allowNull: false, defaultValue: '' },
  icon:            { type: Sequelize.STRING(500), allowNull: false, defaultValue: '/vault/images/chatroom-art.png' },
  link:            { type: Sequelize.STRING(500), allowNull: false, defaultValue: '' },
  file:            { type: Sequelize.STRING(500), allowNull: false, defaultValue: '' },
  date_created:    { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
  unique_value:    { type: Sequelize.STRING, unique: true, defaultValue: chamber.uniqueValue }
}, {
  freezeTableName: true,
  indexes: [{ unique: true, fields: ['unique_value'] }]
});

models.ChatRoomMessages = sequelize.define('chatroom_messages', {
  chatroom_id:     { type: Sequelize.INTEGER, allowNull: false, references: { model: models.ChatRooms, key: 'id' } },
  owner_id:        { type: Sequelize.INTEGER, allowNull: false, references: { model: models.Users, key: 'id' } },
  body:            { type: Sequelize.STRING(500), allowNull: false, defaultValue: '' },
  date_created:    { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
  unique_value:    { type: Sequelize.STRING, unique: true, defaultValue: chamber.uniqueValue }
}, {
  freezeTableName: true,
  indexes: [{ unique: true, fields: ['unique_value'] }]
});

models.Messages = sequelize.define('messages', {
  from_id:         { type: Sequelize.INTEGER, allowNull: false, references: { model: models.Users, key: 'id' } },
  to_id:           { type: Sequelize.INTEGER, allowNull: false, references: { model: models.Users, key: 'id' } },
  body:            { type: Sequelize.STRING(500), allowNull: false, defaultValue: '' },
  date_created:    { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
  unique_value:    { type: Sequelize.STRING, unique: true, defaultValue: chamber.uniqueValue }
}, {
  freezeTableName: true,
  indexes: [{ unique: true, fields: ['unique_value'] }]
});

models.Notifications = sequelize.define('notifications', {
  from_id:             { type: Sequelize.INTEGER, allowNull: false, references: { model: models.Users, key: 'id' } },
  to_id:               { type: Sequelize.INTEGER, allowNull: false, references: { model: models.Users, key: 'id' } },
  action:              { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  target_type:         { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  target_id:           { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
  message:             { type: Sequelize.STRING(500), allowNull: false, defaultValue: '' },
  link:                { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  date_created:        { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
  unique_value:        { type: Sequelize.STRING, unique: true, defaultValue: chamber.uniqueValue }
}, {
  freezeTableName: true,
  indexes: [{ unique: true, fields: ['unique_value'] }]
});

models.ApiKeys = sequelize.define('api_keys', {
  firstname:       { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  lastname:        { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  email:           { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  phone:           { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
  verified:        { type: Sequelize.BOOLEAN, defaultValue: false },
  date_created:    { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
  key:             { type: Sequelize.STRING, unique: true, defaultValue: chamber.greatUniqueValue },
  requests_count:  { type: Sequelize.INTEGER, defaultValue: 0 }
}, {
  freezeTableName: true,
  indexes: [{unique: true, fields: ['email', 'key'] }]
});



/* --- Relationships --- */

models.Users.Following               = models.Users.hasMany(models.Follows, {as: 'Following', foreignKey: 'user_id', sourceKey: 'id'});
models.Users.Followers               = models.Users.hasMany(models.Follows, {as: 'Followers', foreignKey: 'follows_id', sourceKey: 'id'});

models.Users.ChatRooms               = models.Users.hasMany(models.ChatRooms, {as: 'ChatRooms', foreignKey: 'owner_id', sourceKey: 'id'});
models.ChatRooms.Owner               = models.ChatRooms.belongsTo(models.Users, {as: 'Owner', foreignKey: 'owner_id', targetKey: 'id'});

models.Users.Notifications           = models.Users.hasMany(models.Notifications, {as: 'Notifications', foreignKey: 'to_id', sourceKey: 'id'});
models.Notifications.Owner           = models.Notifications.belongsTo(models.Users, {as: 'Owner', foreignKey: 'to_id', targetKey: 'id'});

models.ChatRooms.Messages            = models.ChatRooms.hasMany(models.ChatRoomMessages, {as: 'Messages', foreignKey: 'chatroom_id', sourceKey: 'id'});
models.ChatRoomMessages.ChatRoom     = models.ChatRoomMessages.belongsTo(models.ChatRooms, {as: 'ChatRoom', foreignKey: 'chatroom_id', targetKey: 'id'});




/* --- Initialize Database --- */

sequelize.sync({ force: false })
.then(() => { console.log('Database Initialized!'); })
.catch((error) => { console.log('Database Failed!', error); });

/* --- Exports --- */

module.exports = {
  sequelize,
  models
}

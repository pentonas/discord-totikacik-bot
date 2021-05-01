const mongoose = require('mongoose');

const roleBackupMongooseSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  guildID: String,
  roleID: String,
  roleName: String,
  roleColor: String,
  roleHoist: Boolean,
  rolePosition: Number,
  rolePermissions: Number,
  roleMentionable: Boolean,
  roleBackupTime: Number,
  roleMembers: Array,
  roleChannelOverwrites: Array
});
module.exports = mongoose.model("role_backup", roleBackupMongooseSchema);
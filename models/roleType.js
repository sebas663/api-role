var mongoose = require('mongoose');
//Define a schema
var Schema = mongoose.Schema;

var RoleSchema = new Schema({
        code :            String,
        description :     String,
        permissionCodes : [String],
        enable :          { type: Boolean, default: true }
});
// the schema is useless so far
// we need to create a model using it
var Role = mongoose.model('Role', RoleSchema);

// make this available to our users in our Node applications
module.exports = Role;
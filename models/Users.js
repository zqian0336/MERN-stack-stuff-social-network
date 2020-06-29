const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, require: true},
    email: { type: String, require: true, unique:true},
    password: { type: String, require: true},
    avatar: { type: String},
    date: { type: String, default: Date.now}
});

module.exports = mongoose.model("User", UserSchema);
//first para is used for ref in another Model

const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectID, ref:'User'},
    department: {type:String, required: true},
    location: {type: String, required:true},
    status: {type: String, required: true},
    bio: {type: String},
    githubusername: {type: String},
    experience: [{
        title: {type: String},
        company: {type: String},
        location: {type: String},
        from: {type: Date},
        to: {type: Date},
        current: {type: Boolean},
        description: {type: String}
    }],
    education:[{
        institution: {type:String},
        degree:{type:String},
        fieldOfStudy:{type: String},
        from: {type: Date},
        to: {type: Date},
        current: {type: Boolean},
        description: {type: String}

    }],
    social:{
        youtube:{type:String},
        twitter:{type:String},
        facebook:{type:String},
        linkedin:{type:String},
        instagram:{type:String},
    },
    date:{type:Date, default:Date.now}
});

module.exports = mongoose.model('Profile', ProfileSchema);

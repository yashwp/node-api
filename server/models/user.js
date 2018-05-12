const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ =  require('lodash');

let UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 8,
        trim: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid Email'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

UserSchema.methods.toJSON = function() {
    let user = this;
    let userObj = user.toObject();

    return _.pick(userObj, ['_id', 'email']);
};

UserSchema.statics.findByToken = function(token) {
    let User = this;
    let decoded;

    try {
        decoded = jwt.verify(token, 'abc123');
    } catch(e) {
        return Promise.reject();
    }

    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

UserSchema.methods.generateAuthToken = function() {
    let user = this;
    let access = 'auth';
    let token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();
    
    user.tokens.push({access, token});

    return user.save().then(() => {
        return token;
    });
};

let User =  mongoose.model('Users', UserSchema);

module.exports = {User};
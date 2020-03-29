const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        require: true,
        minlength: 5,
        maxlenth: 255,
    },
    email: {
        type: String,
        require: true,
        minlength: 5,
        maxlenth: 255,
        unique: true,
        match: /@/,
    },
    password: {
        type: String,
        require: true,
        minlength: 6,
        maxlenth: 1024,
    },
    isAdmin: Boolean,
});

userSchema.methods.generateAuthToken = function() {
    return jwt.sign({_id: this._id, isAdmin: this.isAdmin}, config.get("jwtPrivateKey"));
}

const User = mongoose.model('User', userSchema);

const validation = (val) => {
    const scheme = {
        name: Joi.string().min(5).max(255).required(),
        email: Joi.string().min(5).max(255).required().email(), 
        password: Joi.string().min(6).max(1024).required(),
    }
    return Joi.validate(val, scheme);
}

module.exports = { User, validation };
const Joi = require('joi');
const mongoose = require('mongoose');

const User = mongoose.model('User', mongoose.Schema({
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
        match: '/@/',
    },
    password: {
        type: String,
        require: true,
        minlength: 6,
        maxlenth: 1024,
    },
}));

const validation = (val) => {
    const scheme = {
        name: Joi.string().min(5).max(255).required(),
        email: Joi.string().min(5).max(255).required().email(), 
        password: Joi.string().min(6).max(1024).required(),
    }
    return Joi.validate(val, scheme);
}

module.exports = { User, validation };
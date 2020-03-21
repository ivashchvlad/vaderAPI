const Joi = require('joi');
const mongoose = require('mongoose');

const Enemy = mongoose.model('Enemy', mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 10,
    }
}));

const validation = (val) => {
    const scheme = {
        name: Joi.string().min(3).required()
    }
    return Joi.validate(val, scheme);
}

module.exports = { Enemy, validation };
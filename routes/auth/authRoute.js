const express = require('express');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const { User } = require('../../models/userModel');


const router = express.Router();

router.get('/', async (req, res) => {

})

router.post('/', async (req, res) => {
    const { error } = validation(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    };
    let user = await User.findOne({email: req.body.email});
    if (!user) {
        return res.status(400).send('User is not exists');
    };

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
        return res.status(400).send('Wrong password');
    };

    res.send(user.generateAuthToken());
});


const validation = (val) => {
    const scheme = {
        email: Joi.string().min(5).max(255).required().email(), 
        password: Joi.string().min(6).max(1024).required(),
    }
    return Joi.validate(val, scheme);
}

module.exports = router;
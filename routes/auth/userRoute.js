const express = require('express');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const { User, validation } = require('../../models/userModel');


const router = express.Router();

router.get('/', async (req, res) => {
    const user = await User.find().sort('name');
    return res.send(user);
});

router.post('/', async (req, res) => {
    const { error } = await validation(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    };
    let user = await User.findOne({email: req.body.email});
        if (user) {
        return res.status(400).send('User already exists');
    };
    
    user = new User({ 
        name: req.body.name,
        email: req.body.email,
        password: req.body.password, 
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    res.header('x-auth-token', user.generateAuthToken()).send(_.pick(user, ['_id', 'name', 'email']));
});

module.exports = router;
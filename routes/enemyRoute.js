const express = require('express');
const authMiddleware = require('../middleware/authMid');
const adminMiddleware = require('../middleware/adminMid');
const { Enemy, validation } = require('../models/enemyModel');


const router = express.Router();




router.get('/', async(req, res) => {
    const enemy = await Enemy.find().sort('name');
    return res.send(enemy);
});

router.post('/', authMiddleware, async (req, res) => {
    const result = validation(req.body);
    if (result.error) {
        return res.status(400).send(result.error.details[0].message);
    }
    let enemy = new Enemy({ name: req.body.name });
    const savedenemy = await enemy.save();
    return res.send(savedenemy);
});

router.put('/:id', (req, res) => {
    const result = validation(req.body);
    if (result.error) {
        return res.status(400).send(result.error.details[0].message);
    }
    Enemy.findByIdAndUpdate(req.params.id, {name: req.body.name}, {new: true}).then(enemy => {
        if (!enemy) {
            return res.status(404).send('this enemy already nonexisting');
        }
        res.send(enemy);
    });
});

router.delete('/:id', [authMiddleware, adminMiddleware], (req, res) => {
    Enemy.findByIdAndRemove(req.params.id).then(enemy => {
        if (!enemy) return res.status(404).send('this enemy already nonexisting');
        res.send(enemy);
    })
});

router.get('/:id', (req, res) => {
    return Enemy.findById(req.params.id).then(enemy => {
        if (!enemy) return res.status(404).send('this enemy already nonexisting');
        res.send(`VADER MURDERED ENEMY ${enemy.name}`);
    });
});

module.exports = router;
const mongoose = require('mongoose');
const winston = require('winston');
const config = require('config');

module.exports = () => {
    mongoose.connect(config.get('db'), {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => {
        console.log('Connected to MongoDB 👍 ...');
        winston.info('Successfully Connected to DB');
    }).catch(err => {
        console.log(`Error occured while connecting to DB ${err.message}`);
    })

}
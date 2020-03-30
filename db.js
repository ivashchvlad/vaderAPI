const winston = require('winston');
const mongoose = require('mongoose');

module.exports = () => {
    mongoose.connect('mongodb://localhost', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => {
        console.log('Connected to MongoDB 👍 ...');
        winston.info('Successfully Connected to DB');
    }).catch(err => {
        console.log(`Error occured while connecting to DB ${err.message}`);
    })

}
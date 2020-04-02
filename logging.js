require('express-async-errors');
//require('winston-mongodb');
const winston = require('winston');

module.exports = () => {
    winston.handleExceptions(
        new winston.transports.Console({ colorize: true, prettyPrint: true}),
        new winston.transports.File({ filename: 'logfile.log' })
    );

    process.on('unhandledRejection', (ex) => {
        throw ex;
    });

    winston.add(new winston.transports.File({ filename: 'logfile.log' }));
    //winston.add(new winston.transports.MongoDB({ db: 'mongodb://localhost/', level: 'info' }));
}
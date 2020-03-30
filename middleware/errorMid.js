const winston = require('winston');

const errorMiddleware = function(err, req, res, next) {
    winston.error(error.message, err);
    return res.status(500).send('Something gone wrong');
}

module.exports = errorMiddleware;
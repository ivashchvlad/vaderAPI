const express = require('express');
const helmet = require('helmet');

const morgan = require('morgan');
const mainDebuger = require('debug')('app:main');

const enemiesRoute = require('./routes/enemyRoute');
const userRoute = require('./routes/auth/userRoute');
const authRoute = require('./routes/auth/authRoute');
const errorMiddleware = require('./middleware/errorMid');

module.exports = (app) => {
    app.use(express.json());
    app.use(helmet());

    if (app.get('env') === 'development') {
        console.log('DEVMOD');
        mainDebuger('Development mode is ON...');
        app.use(morgan('tiny'));
    }

    app.get('/', (req, res) => {
        res.send('Hello World');
    });
    app.use('/enemies', enemiesRoute);
    app.use('/user', userRoute);
    app.use('/auth', authRoute);
    app.get('/vader', (req, res) => {
        res.send('PSHHHHH........Poooooohhh');
    });
    app.use(errorMiddleware);
};


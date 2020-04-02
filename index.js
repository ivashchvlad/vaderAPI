const express = require('express');

const app = express();

require('./logging')();
require('./routes')(app);
require('./db')();
require('./configCheck')();

const SYS_PORT = process.env.PORT || 3000;

const server = app.listen(SYS_PORT, () => {
    console.log(`Listening on port ${SYS_PORT}...`);
});

module.exports = server;

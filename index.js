var express = require('express');

const mongoose = require('mongoose');
var helmet = require('helmet');
var morgan = require('morgan');
var mainDebuger = require('debug')('app:main');

const enemiesRoute = require('./routes/enemyRoute');

var app = express();

mongoose.connect('mongodb://localhost', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB 👍 ...');
}).catch(err => {
    console.log(`Error occured while connecting to DB ${err.message}`); 
})

app.use(express.json());
app.use(helmet());

if(app.get('env') === 'development'){
    console.log('DEVMOD');
    mainDebuger('Development mode is ON...');
    app.use(morgan('tiny'));
}

const SYS_PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use('/enemies', enemiesRoute);

app.get('/vader', (req, res) => {
    res.send('PSHHHHH........Poooooohhh');
});

app.listen(SYS_PORT, () => {
    console.log(`Listening on port ${SYS_PORT}...`);
});

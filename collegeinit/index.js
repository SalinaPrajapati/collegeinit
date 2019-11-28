var express = require('express');
var expressSession = require('express-session')
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(expressSession({secret:'my secret key', saveUninitialized: false, resave: false}))

var routes = require('./server/routes/routes');
app.use(express.static(path.join(__dirname + '/public')));
app.set('view engine', 'ejs');
app.set('views', './views/');
app.use('/', routes);

app.listen(7000, function () {
    console.log('Listening to 7000');
});
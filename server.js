const port = 6969;

//Requires
const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');

//Middleware
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(express.static('static'));

//Routers
const indexRouter = require('./routes/index').Router;
const mapRouter = require('./routes/map').Router;
app.use('/', indexRouter);
app.use('/map', mapRouter);

app.listen(port, () => {
    console.log("Listening at port:" + port);
})
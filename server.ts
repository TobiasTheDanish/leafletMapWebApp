const port: Number = 6969;
const root: String = 'C:\\Dev\\Projects\\JavaScript\\leafletMapWebApp'

//Imports
import bodyParser from 'body-parser';
import express, { Express, Router }from 'express';
const app: Express = express();

//Requires
const expressLayouts = require('express-ejs-layouts');

//Middleware
app.set('view engine', 'ejs');
app.set('views', root + '/dist/views');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use("/public", express.static('dist/public'));
app.set('json spaces', 2);

//Routers
const indexRouter:Router = require('./routes/index').Router;
const mapRouter:Router = require('./routes/map').Router;
const apiRouter:Router = require('./routes/api').Router;
app.use('/', indexRouter);
app.use('/map', mapRouter);
app.use('/api', apiRouter);

app.listen(port, () => {
    console.log("Listening at port:" + port);
})
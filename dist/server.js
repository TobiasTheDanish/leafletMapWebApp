"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const port = 6969;
const root = 'C:\\Dev\\Projects\\JavaScript\\leafletMapWebApp';
//Imports
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
//Requires
const expressLayouts = require('express-ejs-layouts');
//Middleware
app.set('view engine', 'ejs');
app.set('views', root + '/dist/views');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.use("/public", express_1.default.static('dist/public'));
app.set('json spaces', 2);
//Routers
const indexRouter = require('./routes/index').Router;
const mapRouter = require('./routes/map').Router;
const apiRouter = require('./routes/api').Router;
app.use('/', indexRouter);
app.use('/map', mapRouter);
app.use('/api', apiRouter);
app.listen(port, () => {
    console.log("Listening at port:" + port);
});

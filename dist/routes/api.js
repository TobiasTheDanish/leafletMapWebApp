"use strict";
//https://api.geoapify.com/v1/geocode/reverse?lat=51.21709661403662&lon=6.7782883744862374&apiKey=
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SECRETS = require('../secrets').SECRETS;
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.get('/get-locations', getLocations, (req, res) => {
    res.json(res.locals.locations);
});
router.post('/new-location', getLocations, (req, res) => {
    const newLocation = req.body;
    if (res.locals.locations !== null && res.locals.locations.length > 0) {
        newLocation.id = res.locals.locations[res.locals.locations.length - 1].id + 1;
    }
    else {
        newLocation.id = 1;
    }
    res.locals.locations.push(newLocation);
    res.json(res.locals.locations);
});
router.get('/address', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var address = yield fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${req.query.lat}&lon=${req.query.long}&apiKey=${SECRETS.GEOAPIFY_API_KEY}`)
        .then((response) => response.json())
        .then((data) => {
        var feature = data.features[0];
        return {
            country: feature.properties.country,
            city: feature.properties.city,
            postcode: feature.properties.postcode,
            suburb: feature.properties.suburb,
            street: feature.properties.street,
            housenumber: feature.properties.housenumber
        };
    });
    res.json(address);
}));
module.exports.Router = router;
const locations = [];
function getLocations(req, res, next) {
    res.locals.locations = locations;
    next();
}

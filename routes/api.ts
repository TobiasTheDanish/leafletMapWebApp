//https://api.geoapify.com/v1/geocode/reverse?lat=51.21709661403662&lon=6.7782883744862374&apiKey=

type Location = {
    id: Number,
    lat: Number,
    long: Number
}

type Address = {
    country: String,
    city: String,
    postcode: String,
    suburb: String,
    street: String,
    housenumber: String
}

const SECRETS = require('../secrets').SECRETS;
import express,{ Router, Request, Response } from 'express';
import { type } from 'os';
const router = express.Router();

router.get('/get-locations', getLocations,  (req: Request, res: Response) => {
    res.json(res.locals.locations);
});

router.post('/new-location', getLocations, (req: Request, res: Response) => {
    const newLocation: Location = req.body;

    if (res.locals.locations !== null && res.locals.locations.length > 0) {
        newLocation.id = res.locals.locations[res.locals.locations.length-1].id + 1;
    } else {
        newLocation.id = 1;
    }

    res.locals.locations.push(newLocation);
    res.json(res.locals.locations);
})

router.get('/address', async (req: Request, res: Response) => {
    var address: Address = await fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${req.query.lat}&lon=${req.query.long}&apiKey=${SECRETS.GEOAPIFY_API_KEY}`)
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
})
module.exports.Router = router;

const locations: Location[] = [];

function getLocations(req: Request, res: Response, next: CallableFunction) {
    res.locals.locations = locations;
    next();
}
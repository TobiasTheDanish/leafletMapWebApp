const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('map/index');
});

router.get('/location', (req, res) => {
    res.render('map/location');
})
module.exports.Router = router;
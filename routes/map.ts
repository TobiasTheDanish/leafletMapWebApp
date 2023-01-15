import express,{ Router, Request, Response } from 'express';
const router: Router = express.Router();

router.get('/', (req: Request, res: Response) => {
    res.render('map/index');
});

router.get('/location', (req: Request, res: Response) => {
    res.render('map/location');
})
module.exports.Router = router;

import express from 'express';
import { auth } from './auth';
import { ride } from './ride';

let router = express.Router();

router.get('/status', function (req, res) {
  res.json('up and running :)');
});

router.post('/login', auth.tokensignin);

router.post('/api/v1/ride/create', ride.create);

router.get('/ride/:rideID', ride.getRide);

router.get('/api/v1/rides', ride.getAllRides);

router.get('/api/v1/myrides/:riderID', ride.getMyRides);

router.put('/api/v1/ride/:rideID/accept', ride.accept);

router.delete('/api/v1/ride/:rideID', ride.deleteRide);


export { router };

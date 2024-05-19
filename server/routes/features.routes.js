import express from 'express';
import { getProfile, publish, setProfile, changePass, search, myRides, deleteRide, getPublicProfile, getDetails, setAadhar, setLicense } from '../controllers/features.controller.js';
import authenticate from '../authentication/authentication.js';
const router = express.Router();

router.post('/setProfile', setProfile);
router.post('/getProfile', authenticate, getProfile);
router.post('/setAadhar', setAadhar);
router.post('/setLicense', setLicense);
router.post('/getDetails', authenticate, getDetails);
router.put('/changePass', changePass);
router.post('/publish', publish);
router.post('/search', search);
router.post('/myRides', myRides);
router.delete('/deleteRide/:id', deleteRide);
router.get('/getPublicProfile/:id', getPublicProfile);

export default router;
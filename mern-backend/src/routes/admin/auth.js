const express = require('express');
const { requireSignin } = require('../../common-middleware');
const { signup, signin, signout} = require('../../controller/admin/auth');
const { validateSignUpRequest, isRequestValidated, validateSignInRequest } = require('../../validator/Validator');
const router = express.Router();


router.post('/admin/signup',validateSignUpRequest, isRequestValidated, signup);

router.post('/admin/signin',validateSignInRequest, isRequestValidated, signin);

router.post('/admin/signout', signout);
  
module.exports = router;
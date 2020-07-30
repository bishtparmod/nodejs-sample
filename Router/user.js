var express = require('express');
var router = express.Router();
var user = require('../Controller/user')
var payment = require('./Payment')
var photo = require('../Controller/photo')

/*All User route */
router.post('/signup', user.signup);
router.post('/login', user.login);
router.post('/session_login', user.sessionlogin);
router.post('/resetPassword', user.resetPassword);
router.post('/forgotPassword', user.forgotPassword);
router.post('/updateUser', user.updateUser);
router.post('/listuser', user.listUser);
router.post('/lookuplistuser', user.aggregationlistUser);
router.post('/upload',photo.photoUpload)

module.exports = router
var express = require('express');
var router = express.Router();
var user = require('../Controller/user')

/*All User route */
router.post('/signup', user.signup);
router.post('/login', user.login);
router.post('/session_login', user.sessionlogin);
router.post('/resetPassword', user.resetPassword);
router.post('/forgotPassword', user.forgotPassword);
router.post('/updateUser', user.updateUser);

module.exports = router
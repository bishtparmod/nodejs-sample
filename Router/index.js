var express = require('express');
var router = express.Router();
var user = require('./user')
var payment = require('./Payment')
var chat = require('./chat')

/*All User route */
router.use('/', user);

/** Card and Payment route */
router.use('/payment', payment);

/** chat route */
router.use('/chat', chat);

module.exports = router
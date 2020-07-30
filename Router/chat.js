var express = require('express');
var router = express.Router();
var chat = require('../Controller/socket')

router.post('/add',chat.chatModule)

module.exports = router
'use strict';

var express = require('express');
var controller = require('./translate.controller');

var router = express.Router();

router.get('/:lang', controller.translate);

module.exports = router;
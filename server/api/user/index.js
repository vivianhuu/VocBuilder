'use strict';

var express = require('express');
var controller = require('./user.controller');
var config = require('../../config');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/allusers', controller.allu);
//router.delete('/allusers/:id', controller.destroy);
router.get('/allusers/:id', controller.show);
router.put('/allusers/newuser', controller.create);
router.get('/userInfo',  controller.me);
router.put('/changePwd', controller.changePassword);
// router.get('/:username/allusers/:id', auth.isAuthenticated(), controller.show);
//router.post('/signup', controller.create);

module.exports = router;
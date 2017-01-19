'use strict';
var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config');
var User = require('../api/user/user.model');
var jwt = require('jsonwebtoken');
var auth = require('./auth.service');
var router = express.Router();

var validationError = function (res, err){
	return res.status(422).json(err);
};

router.post('/login', function (req, res, next){
	User.find({email: req.body.email}, function (err, user){
		console.log(req.body.email);
		if (err) {
			console.log(err);
			return next(err);
		} else if (!user) {
			console.log('not a user');
			return res.json({message: 'This email is not registered yet.'});
		} else {
			if (! user.authenticate(req.body.password)) {
				console.log('wrong pwd');
				return res.json({message: 'Invalid password.'});
			} else {
				console.log(user);
				console.log('token');
				var token = auth.signToken(user._id, user.username, user.role);
				res.json({token: token, user: user});
			};
		};
	});
});

router.post('/signup', function (req, res, next){
	var newUser = new User(req.body);
	if (newUser.role == "") {
		newUser.role = "user";
	};
	newUser.date = new Date().toString();
	newUser.save(function (err, user){
		if (err) {
			return validationError(res, err);
		} else {
			var token = jwt.sign({_id: user.id, name: user.username, role: user.role}, config.secrets.session, {expiresIn: 60*5});
			return res.status(201).json({token: token, user: user});
		};
	});
});

module.exports = router;
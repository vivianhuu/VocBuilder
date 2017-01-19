'use strict';

var User = require('./user.model');
var passport = require('passport');
var config = require('../../config');
var jwt = require('jsonwebtoken');

var validationError = function (res, err){
	return res.status(422).json(err);
};

exports.allu = function (req, res){
	User.find({}).sort('-date').exec(function (err, users){
		if(err){
			return res.status(500).json(err);
		} else {
			return res.status(200).json(users);
		};
	});
};

exports.create = function(req, res, next) {
	var newUser = new User(req.body);
	newUser.provider = 'local';
	if (newUser.role=="") {
		newUser.role = 'user';
	};
	newUser.date = new Date().toString();
	newUser.save(function (err, user){
		if (err) {
			return validationError(res, err);
		} else {
			var token = jwt.sign({_id: user._id, username: user.username}, config.secrets.session, {expiresInMinutes: 60*5});
			return res.status(201).json({token: token});
		};
	});
};

exports.show = function(req, res, next){
	// var userName = req.params.id;
	User.findById(req.params.id, function (err, user){
		if (err) {
			return next(err);
		};
		if (!user) {
			return res.status(401);
		} else {
			return res.status(200).json(user.profile);
		};
	});
};

exports.destroy = function (req, res) {
	User.findOneAndRemove({_id: req.params.id}, function (err, user){
		if (err) {
			return res.status(500).json(err);
		} else {
			return res.status(204);
		};
	});
};

exports.changePassword =function(req, res, next){
	var userName = req.params.username || req.params.admin;
	var oldPass = String(req.body.oldPassword);
	var newPass = String(req.body.newPassword);
	User.find({username: userName}, function (err, user){
		if (user.authenticate(oldPass)) {
           user.password = newPass;
           user.save(function (err){
           	if (err) {
           		return validationError(res, err);
           	} else {
           		return res.status(200);
           	};
           });
		} else {
			return res.status(403);
		};
	});
};

exports.me = function(req, res, next) {
	var userName = req.params.username;
	User.find({
		username: userName
	}, '-salt -hashedPassword', function (err, user){
		if (err) {
			return next(err);
		} else if (!user) {
			return res.status(401);
		} else {
			return res.status(200).json(user);
		};
	});
};

exports.authCallback = function(req, res, next){
	res.redirect('/');
};
'use strict';

var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var compose = require('composable-middleware');
var User = require('../api/user/user.model');
var validateJwt = expressJwt({secret: config.secrets.session, userProperty: 'payload'});

function isAuthenticated(){
	return compose()
	.use(function (req, res, next){
		if (req.query && req.query.hasOwnProperty('access_token')) {
			req.headers.authorization = 'Bearer' + req.query.access_token;
		} else {
			validateJwt(req, res, next);
		};
	})
	.use(function (req, res, next){
		User.findById(req.user._id, function (err, user){
			if (err) {
				return next(err);
			} else if (!user) {
				return res.status(401);
			} else {
				req.user = user;
				next();
			};
		});
	});
};

function hasRole(roleRequired){
	if (!roleRequired) {
		throw new Error('Required role needs to be set.');
		return compose()
		.use(isAuthenticated())
		.use(function meetRequirements (req, res, next){
			if (config.userRoles.indexOf(req.user.role) >= config.userRoles.indexOf(roleRequired)) {
				next();
			} else {
				res.status(403);
			};
		});
	};
};

function signToken(id, username, role){
	return jwt.sign({_id: id, name: username, role: role}, config.secrets.session, {expiresIn: 60*5});
};

function setTokenCookie(req, res){
	if (!req.user) {
		return res.json(404, {message: 'Something went wrong.'});
	} else {
		var token = signToken(req.user._id, req.user.username, req.user.role);
		res.cookie('token', JSON.stringify(token));
		res.redirect('/:username', {params: {username: req.user.username}});
	};
};

exports.isAuthenticated = isAuthenticated;
exports.hasRole = hasRole;
exports.signToken = signToken;
exports.setTokenCookie = setTokenCookie;
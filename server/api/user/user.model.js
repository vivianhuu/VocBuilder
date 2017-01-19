'use strict';

var mongoose = require ('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto'); // for encrypting password
var authTypes = ['twitter', 'facebook', 'google', 'local'];

var UserSchema = new Schema({
	username: String,
	password: String,
	email: {type: String, lowercase: true},
	role: {type: String, default: 'user'},
	provider: String,
	date: String
});

// UserSchema.virtual('password').set(function (password){
// 	this._password = password;
// 	this.salt = this.makeSalt();
// 	this.hashedPassword = this.encryptPassword(password);
// }).get(function(){
// 	return this._password;
// });

UserSchema.virtual('profile').get(function(){
	return {
		'username': this.username,
		'role': this.role,
		'email': this.email
	};
});

UserSchema.virtual('token').get(function(){
	return {
		'_id': this._id,
		'username': this.username,
		'role': this.role
	};
});

UserSchema.path('email').validate(function (email){
	if (authTypes.indexOf(this.provider)!== -1) {
		return true;
	};
	return email.length;
}, 'Email cannot be blank');

UserSchema.path('password').validate(function (password){
	if (authTypes.indexOf(this.provider) !== -1) {
		return true;
	};
	return password.length;
}, 'Password cannot be blank');

UserSchema.path('username').validate(function (value, respond){
	var text = this;
	this.constructor.findOne({name: value}, function (err, user){
		if (err) {
			throw (err);
		};
		if (user) {
			if (text.id === user.id) {
				return respond(true);
			};
			return respond(false);
		};
	});
}, 'The specified name is already in use.');

UserSchema.path('email').validate(function (value, respond){
	var self = this;
	this.constructor.find({email: value}, function (err, user){
		if (err) {
			throw (err);
		};
		if (user) {
			if (self.id === user.id) {
				return respond(true);
			};
			return respond(false);
		};
	});
}, 'The specified email address is already in use.');

var validatePresenceOf = function(value){
	return value && value.length;
};

UserSchema.pre('save', function (next) {
	if (!this.isNew) {
		return next();
	};
	if (!validatePresenceOf(this.password) && authTypes.indexOf(this.provider) === -1) {
		next(new Error('Invalid password'));
	}else {
		next();
	};
});

UserSchema.methods.authenticate = function (plainText){
	return plainText === this.password;
};
// UserSchema.methods = {
// 	//check password
// 	authenticate: function(plainText) {
// 		return plainText === this.password;
// 	},

// 	makeSalt: function() {
//     	return crypto.randomBytes(16).toString('base64');
//   	},
  	
// 	encryptPassword: function(password){
// 		if (!password || !this.salt) {
// 			return '';
// 		};
// 		var salt = new Buffer(this.salt, 'base64');
// 		return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
// 	}
// };

module.exports = mongoose.model('User', UserSchema, 'User');
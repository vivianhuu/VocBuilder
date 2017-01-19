'use strict';

var config = {};
var path = require('path');
var _ = require('lodash');

config.secrets = {
	session: 'Voc-Builder-secret'
};
config.userRoles = ['user', 'admin'];

module.exports = config;
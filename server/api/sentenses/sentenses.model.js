'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var SentenceSchema = new Schema({
	username: String,
	sentence: String,
	notes: Array,
	date: String
});

module.exports = mongoose.model('collectedSentence', SentenceSchema);
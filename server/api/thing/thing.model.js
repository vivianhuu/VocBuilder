'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ThingSchema = new Schema({
	title: String,
    contents: Array,
    tag: String,
    author: String,
    date: String
});

module.exports = mongoose.model('Thing', ThingSchema, 'Thing');
'use strict';

var _ = require('lodash');
var Thing = require('./thing.model');
var Word = require('../words/words.model');
var Sentence = require('../sentenses/sentenses.model');

exports.index = function (req, res) {
	Thing.find({}).sort('-date').exec(function (err, res){
		if (err) {
			return handleError(res, err);
		};
		return res.status(200).json(things);
	});
};

exports.show = function (req, res){
	Thing.findById(req.params.id, function (err, thing){
		if (err) {
			return handleError(res, err);
		};
		if (!thing) {
			return res.status(404);
		};
		return res.status(200).json(thing);
	});
};

exports.create = function (req, res){
	var text = {};
	text.title = String(req.body.title);
	text.contents = Array(req.body.contents);
	text.author = String(req.body.username);
	text.date = new Date().toString();
	text.tag = String(req.body.tag);
	Thing.create(text, function (err, thing){
		if (err) {
			return handleError(res, err);
		} else{
			return res.status(201).json(thing);
		};
	});
};

exports.ws = function (req, res){
	if (req.body.tag == 'word') {
		var word = {};
		word.username = String(req.params.username);
		word.word = String(req.body.word);
		word.atts = Array(req.body.atts);
		word.date = new Date().toString();
		if (Word.find({username: word.username, word: word.word})) {
			res.send({message: 'You have collected this word!'});
		} else {
			Word.create(word, function (err, word){
				if (err) {
					return handleError(res, err);
				} else{
					return res.status(201);
				};	
			});
		};	
	} else {
		var sentence = {};
		sentence.username = String(req.params.username);
		sentence.sentence = String(req.body.sentence);
		sentence.notes = Array(req.body.notes);
		sentence.date = new Date().toString();
		if (Sentence.find({username: sentence.username, sentence: sentence.sentence})) {
			res.send({message: 'You have collected this sentence!'});
		} else {
			Sentence.create(sentence, function (err, sentence){
				if (err) {
					return handleError(res, err);
				} else{
					return res.status(201);
				};
			});
		};
	};
};

exports.update = function (req, res){
	if (req.body._id) {
		delete req.body._id;
	};
	Thing.findById(req.params.id, function (err, thing){
		if (err) {
			return handleError(res, err);
		};
		if (!thing) {
			return res.status(404);
		};
		var text = {};
		text.title = String(req.body.title);
		text.contents = String(req.body.contents);
		text.tag = String(req.body.tag);
		text.author = String(req.params.username);
		text.date = new Date().toString();
		var updated = _.merge(thing, text);
		updated.save(function (err){
			if (err) {
				return handleError(res, err);
			} else{
				return res.status(200).json(thing);
			};
		});
	});
};

exports.destroy = function (req, res){
	Thing.findById(req.params.id, function (err, thing){
		if (err) {
			return handleError(res, err);
		};
		if (!thing) {
			return res.status(404);
		};
		thing.remove(function (err){
			if (err) {
				return handleError(res, err);
			} else{
				return res.status(204);
			};
		});
	});
};

function handleError(res, err){
	return res.status(500).json(err);
}
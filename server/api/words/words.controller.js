'use strict';

var _= require('lodash');
var Word = require('./words.model');

exports.index = function (req, res){
	//var username = req.params[req.route.keys[0].name];
	Word.find({username: req.params.username}).sort('-date').exec(function (err, words){
		if (err) {
			return res.send({message: "Boom! Let's start here~"});
		} else {
			return res.status(200).json(words);
		};	
	});
};

exports.show = function (req, res){
	Word.findById(req.params.id, function (err, word){
		if (err) {
			return handlerError(res, err);
		} else if (!word) {
			return res.status(404);
		} else {
			return res.status(200).json(word);
		};
	});
};

exports.create = function(req, res){
	var newWord = {};
	newWord.username = req.params.username;
	newWord.word = String(req.body.word);
	newWord.atts = Array(req.body.atts);
	// if (req.body.sample) {
	// 	newWord.sample = String(req.body.sample);
	// } else {
	// 	newWord.sample = "";
	// };
	newWord.date = new Date().toString();

	if (Word.fing({username: req.params.username, word: newWord.word})) {
		return res.send({message: 'You have collected this word.'});
	} else {
		Word.create(newWord, function (err, word){
			if (err) {
				return handlerError(res, err);
			} else {
				return res.status(201).json(word);
			};	
		});
	};
};

exports.update = function(req, res){
	Word.findById(req.params.id, function (err, word){
		if (err) {
			return handlerError(res, err);
		} else if (!word) {
			return res.status(404);
		} else {
			var uword = {};
			uword.username = req.params.username;
			uword.word = String(req.body.word);
			uword.atts = Array(req.body.atts);
			uword.date = new Date().toString();
			var updated = _.merge(word, uword);
			updated.save(function (err){
				if (err) {
					return handlerError(res, err);
				} else {
					return res.status(200).json(word);
				};
			});
		};
	});
};

exports.destroy = function(req, res){
	Word.findById(req.params.id, function (err, word){
		if (err) {
			return handlerError(res, err);
		} else if (!word) {
			return res.status(404);
		} else {
			word.remove(function (err){
				if (err) {
					return handlerError(res, err);
				} else {
					return res.status(204);
				};
			});
		};
	});
};

// exports.destroyMore = function(req, res){
// 	Word.findById(req.body.id, function (err, word){
// 		if (err) {
// 			return handlerError(res, err);
// 		};
// 		if (!word) {
// 			return res.status(404);
// 		};
// 		word.remove(function (err){
// 			if (err) {
// 				return handlerError(res, err);
// 			};
// 			return res.status(204);
// 		});
// 	});
// };

function handlerError(res, err){
	return res.status(500).json(err);
}
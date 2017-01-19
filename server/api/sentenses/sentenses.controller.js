'use strict';

var _=require('lodash');
var Sentence = require('./sentenses.model');

exports.index = function(req, res){
	Sentence.find({username: req.params.username}).sort('-date').exec(function (err, res){
		if (err) {
			return res.send({message: "Boom! Let's start here~."});
		} else {
			return res.status(200).json(sentences);
		};
	});
};

exports.show = function(req, res){
	Sentence.findById(req.params.id, function (err, sentence){
		if (err) {
			return handleError(res, err);
		} else if (!sentence) {
			return res.status(404);
		} else {
			return res.status(200).json(sentence);
		};
	});
};

exports.create = function (req, res){
	var newSentence = {};
	newSentence.username = req.params.username;
	newSentence.sentence = String(req.body.sentence);
	if (req.body.notes) {
		newSentence.notes = String(req.body.notes);
	} else {
		newSentence.notes = [];
	};
	newSentence.date = new Date().toString();
    if (Sentence.find({username:req.params.username, sentence: newSentence.sentence})) {
    	res.send({message: 'You have collected this sentence.'});
    } else {
    	Sentence.create(newSentence, function (err, sentence){
			if (err) {
				return handleError(res,err);
			} else {
				return res.status(201).json(sentence);
			};
		});
    };	
};

exports.update = function (req, res){
	Sentence.findById(req.params.id, function (err, Sentence){
		if (err) {
			return handleError(res, err);
		} else if (!Sentence) {
			return res.status(404);
		} else {
			var usen = {};
			usen.username = req.params.username;
			usen.Sentence = String(req.body.Sentence);
			if (req.body.notes) {
				usen.notes = Array(req.body.notes);
			} else {
				usen.notes = [];
			};
			usen.date = new Date().toString();
			var updated = _.merge(Sentence, usen);
			updated.save(function (err){
				if (err) {
					return handleError(res, err);
				} else {
					return res.status(200).json(Sentence);
				};
			});
		};	
	});
};

exports.destroy = function(req, res){
	Sentence.findById(req.params.id, function (err, sentence){
		if (err) {
			return handleError(res, err);
		} else if (!sentence) {
			return res.status(404);
		} else {
			sentence.remove(function (err){
			if (err) {
				return handleError(res, err);
			} else {
				return res.status(204);
				};
			});
		};	
	});
};

exports.destroyMore = function(req, res){
	for (var i = 0; i<req.body.length; i++){
		Sentence.findById(req.body[i].id, function (err, sentence){
			if (err) {
				return handleError(res, err);
			} else if (!sentence) {
				return res.status(404).send(i);
			} else {
				sentence.remove(function (err){
					if (err) {
						return handleError(res, err);
					} else {
						return res.status(204).send(i);
					};
				});
			};
		});
	};
};

function handleError (res, err){
	return res.status(500).json(err);
}
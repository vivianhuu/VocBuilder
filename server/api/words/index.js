'use strict';

var express = require('express');
var controller = require('./words.controller');
var router =express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.get('/:id/edit', controller.show);
//router.post('/:username/dashboard/:id', controller.create);
router.post('/newword', controller.create);
router.put('/:id/edit', controller.update);
router.put('/:id', controller.update);
router.delete('/:id', controller.destroy);
router.delete('/', controller.destroy);

module.exports = router;
'use strict';

var express = require('express');
var controller = require('./thing.controller');
var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/:id', controller.ws);
// router.get('/:id', controller.show);
router.post('/newpost', controller.create);
router.put('/:id/edit', controller.update);
router.patch('/:id/edit', controller.update);
router.delete('/', controller.destroy);

module.exports = router; 
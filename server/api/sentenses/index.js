'use strict';

var express = require('express');
var controller = require('./sentenses.controller');
var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.get('/:id/edit', controller.show);
router.post('/newsentence', controller.create);
//router.post('/:username/dashboard/:id', controller.create);
router.put('/:id', controller.update);
router.put('/:id/edit', controller.update);
router.delete('/:id', controller.destroy);
router.delete('/', controller.destroyMore);

module.exports = router;
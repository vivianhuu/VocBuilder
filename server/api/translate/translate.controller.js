'use strict';

var _ = require('lodash');
var fs = require('fs');
// var Translate = require('./translate.model');

var LANG_PATH = 'server/api/translate/langs/'
var SUFFIX = '.json';

// Get a single translate
exports.translate = function(req, res) {
  var lang = req.params.lang;
  var obj;
  
  fs.readFile(LANG_PATH + lang + SUFFIX, 'utf8', function (err, data) {
    if(err) { return handleError(res, err); }
    obj = JSON.parse(data);
    if(!obj) { return res.send(404); }
    return res.json(obj);
  });

};

function handleError(res, err) {
   return res.send(500, err);
}
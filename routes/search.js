var express = require('express');
var sequelize = require('sequelize');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var swig = require('swig');
var models = require('../models');
var Page = models.Page;
var User = models.User;
var router = express.Router();
var Promise = require('bluebird');
module.exports = router;


router.get('/', function(req, res, next) {
	console.log('search');
	res.render('tagsearch');
})



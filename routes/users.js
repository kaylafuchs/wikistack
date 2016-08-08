var express = require('express');
var sequelize = require('sequelize');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var swig = require('swig');
var router = express.Router();
var Promise = require('bluebird');
var models = require('../models');
var Page = models.Page;
var User = models.User;
module.exports = router;

router.get('/', function(req, res, next) {
  User.findAll()
  .then(function(users){
  	res.render('users',{users: users});
  })
});

router.get('/:userId',function(req,res,next){
	var userPromise = User.findById(req.params.userId);
	var pagesPromise = Page.findAll({
		where: {
			authorId: req.params.userId
		}
	});

	Promise.all([userPromise, pagesPromise])
	.then(function(values){
		var user = values[0];
		var pages = values[1];
		res.render('user',{user: user, pages: pages});
	})
	.catch(next);
});
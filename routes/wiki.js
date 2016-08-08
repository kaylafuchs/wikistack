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


router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());

router.get('/', function(req, res, next) {
	Page.findAll({})
	.then(function(pages){
		console.log(pages)
		res.render('index',{pages: pages});
	});
});



router.post('/', function(req, res, next) {
  User.findOrCreate({
  	where: {
  		name: req.body.authorName,
  		email: req.body.authorEmail
  	}
  })
  .then(function(values){
  	var user = values[0];
  	var page = Page.build({
	  	title: req.body.title,
	  	content: req.body.pageContent,
		status: req.body.pageStatus || null

	});

	return page.save().then(function(page){
		return page.setAuthor(user);
	});
  })
  .then(function(page){
  	res.redirect(page.route);
  })
  .catch(next);
});



router.get('/add', function(req, res, next) {
  res.render('addpage');
});



router.get('/:urlTitle',function(req,res,next){
	Page.findOne({
	    where: {
	        urlTitle: req.params.urlTitle
	    },
	    include: [
	        {model: User, as: 'author'}
	    ]
	})
	.then(function (page) {
	    // page instance will have a .author property
	    // as a filled in user object ({ name, email })
	    if (page === null) {
	        res.status(404).send();
	    } else {
	        res.render('wikipage', {
	            page: page
	        });
	    }
	})
	.catch(next);
})



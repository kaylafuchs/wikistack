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
		status: req.body.pageStatus || null,
		tags: req.body.pageTags.split(' ')

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

router.get('/search',function(req,res,next){
	var query = req.query.searchQuery
	query = query.split("+");

	function searchByQuery(query){
		return query.map(function(tag){
			return Page.findAll({
				where: {
					tags: {
						$contains: tag
					}
				}
			})
		})
	}

	var searched = searchByQuery(query);
	console.log(searched);


	Promise.all(searched)
	.then(function(pages){
		res.render('searchresult', {tags: query, pages: pages})
	})

})


router.get('/:urlTitle',function(req,res,next){
	console.log("url");
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

router.get('/tag/:tag',function(req,res,next){
	var tag = req.params.tag

	Page.findAll({
		where: {
			tags: {
				$contains: [tag]
			}
	}
			
	}).then(function(pages){
		console.log(pages);
		if (pages === null) {
		    res.status(404).send();
		} else {
		    res.render('tagpage', {
		        pages: pages,
		        tag: tag
		    });
		}
	}).catch(next);
})





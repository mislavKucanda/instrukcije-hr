var express = require('express');
var expressValidator = require('express-validator');
var passport = require('passport');
var bcrypt = require('bcrypt');

var controllers = require('../controllers');

const saltRounds = 10;
var router = express.Router();

router.get('/logout', function(req, res) {
	console.log('Log Out');
	req.logOut();
	console.log('Destroy session');
	req.session.destroy(function(err) {
		if (err)
			return res.json({
				confirmation: 'fail',
				message: 'Session destroy - unsucccessful',
			});
		return res.json({
			confirmation: 'success',
			message: 'You successfully logged out.',
		});
	});
});

router.get('/:resource', function(req, res, next) {
	const { resource } = req.params;
	var controller = controllers[resource];

	if(controller == null) {
		res.json({
			confirmation: 'fail',
			message: 'Resource does not exciste.',
		});
		return;
	}

	controller.find(req.query, function(err, results) {
		if(err) {
			res.json({
				confirmation: 'fail',
				message: err,
			});
			return;
		} else {
			res.json({
				confirmation: 'success',
				results: results,
			});
		}
	});
});

router.get('/:resource/:id', function(req, res, next) {
	const { resource, id } = req.params;
	var controller = controllers[resource];

	if(controller == null) {
		res.json({
			confirmation: 'fail',
			message: 'Resource does not exciste.',
		});
		return;
	}

	controller.findById(id, function(err, result) {
		if(err) {
			res.json({
				confirmation: 'fail',
				message: err,
			});
			return;
		} else {
			res.json({
			confirmation: 'success',
			result: result,
			});
		}	
	});
});

router.post('/login', passport.authenticate('local'),
  function(req, res) {
  	res.json({
  		confirmation: 'success',
  		result: req.user,
  	});
  });

router.post('/:resource', function(req, res, next) {
	const { resource } = req.params;
	var controller = controllers[resource];

	if(controller == null) {
		res.json({
			confirmation: 'fail',
			message: 'Resource does not exciste.',
		});
		return;
	}

	if(resource === 'user') {

		controller.find({username: req.body.username}, function(err, existingUser) {
			
			if(existingUser.length === 0) {
				console.log('Vnoter sem');
				let newUser = req.body;
				bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
					newUser.password = hash;
					controller.create(newUser, function(err, savedUser) {
						if(err) {
							return res.json({
								confirmation: 'fail',
								message: err,
							});
						} else {
							req.login(savedUser._id, function(err) {
								return res.json({
									confirmation: 'success',
									result: savedUser,
								});
							});
						}
					});
				});
			} else {
				return res.json({
					confirmation: 'fail',
					message: 'Username je zauzet, molimo odaberite drugi.',
				});
			}
		});

	} else {
		controller.create(req.body, function(err, result) {
			if(err) {
				res.json({
					confirmation: 'fail',
					message: err,
				});
				return;
			} else {
				res.json({
				confirmation: 'success',
				result: result,
				});
			}
		});
	}
});

router.post('/login', passport.authenticate('local', {
	successRedirect: '/profile',
	failureRedirect: '/login',
}));

passport.serializeUser(function(user_id, done) {
  done(null, user_id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

function authenticationMiddleware() {
	return (req, res, next) => {
		console.log(`
			req.session.passport.user: ${JSON.
			stringify(req.session.passport)}`);
		if (req.isAuthenticated()) 
			return next();
		res.redirect('/login');
	}
}


module.exports = router;

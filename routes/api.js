var express = require('express');
var expressValidator = require('express-validator');
var passport = require('passport');
var bcrypt = require('bcrypt');

var controllers = require('../controllers');
var User = require('../models/User');

const saltRounds = 10;
var router = express.Router();

router.get('/logout', function(req, res) {
	console.log('Log Out');
	req.logout();
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

//router.get('/testLogiranosti', passport.authenticate('local'), function(req, res) {
	//res.json({ user: req.user });
//});
router.get('/userIsLoggedIn', function(req, res) {
	//passport.authenticate('local', function(err, user, info) {
		//if (err) { 
			//return res.json({ error: err }); 
		//}
    //if (!user) { 
    //	return res.json({ information: 'Niste logirani.' }); 
    //}
    //return res.json({ user: user });
  //});
  res.json({ session: req.session.passport });
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

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { 
    	return res.json({
				confirmation: 'fail',
				result: 'Došlo je do pogreške na serveru.',
			});
    }
    if (!user) { 
    	return res.json({
    		confirmation: 'fail',
    		result: 'Unesena kombinacija korisničkog imena i lozinke nije ispravna.',
    	}); 
    }
    req.logIn(user, function(err) {
      if (err) { 
      	return res.json({
      		confirmation: 'fail',
      		result: 'Došlo je do pogreške na serveru.'
      	}); 
      }
      return res.json({
      	confirmation: 'success',
      	result: user,
      });
    });
  })(req, res, next);
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

		//VALIDATION
		req.checkBody('username', 'Korisničko ime je obavezno odabrati.').notEmpty();
		req.checkBody('username', 'Korisničko ime mora imati između 5 i 15 znakova.').len(5, 15);
		req.checkBody('password', 'Lozinka je obavezno polje.').notEmpty();
		req.checkBody('password', 'Lozinka mora imati između 5 i 20 znakova.').len(5,20);
		if(req.body.type === 'instruktor') {
			req.checkBody('description', 'Obavezno unesite sadržaj oglasa.').notEmpty();
			req.checkBody('category', 'Obavezno je odabrati barem jednu kategoriju.').notEmpty();
		}
		if(req.body.type === 'student') {
			req.checkBody('educationLevel', 'Obavezno unesite razinu obrazovanja.').notEmpty();
			req.checkBody('educationGrade', 'Obavezno unesite trenutnu godinu obrazovanja.').notEmpty();
			if(req.body.educationLevel === 'SREDNJA ŠKOLA' || req.body.educationLevel === 'FAKULTET') {
				req.checkBody('institutionName', 'Obavezno unesite naziv ' +
				 (req.body.educationLevel === 'SREDNJA ŠKOLA' ? 'srednje škole.' : 'fakulteta.')).notEmpty();
			}
		}
		req.checkBody('email', 'Uneseni email je pogrešnog formata.').isEmail();
		req.checkBody('type', 'Moguće vrijednosti za uneseni tip su instruktor ili student.').isIn(['instruktor','student']);
		req.checkBody('password', 'Unesene lozinke se ne podudaraju.').equals(req.body.passwordMatch);
		var errors = req.validationErrors();
		if(errors) {
			var errorsList = [];
			errors.map((error) => errorsList.push(error.msg));
			res.json({
				confirmation: 'fail',
				result: errorsList,
			});
			return;
		}

		controller.find({ username: req.body.username }, function(err, existingUser) {
			
			if(existingUser.length === 0) {
				console.log('Vnoter sem');
				let newUser = req.body;
				//ovo kriptiranje je puno logicnije staviti u controller
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
					result: ['Korisničko ime je zauzeto.'],
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


//ovo bi vjerojatno trebalo biti rješeno na nacin:
//router.post('/login',
//passport.authentification('local'), function(req, res){});
router.post('/login', passport.authenticate('local', {
	successRedirect: '/profile',
	failureRedirect: '/login',
}));

passport.serializeUser(function(user_id, done) {
  User.findById(user_id, function(err, user) {
  	done(err, user);
  });
});

passport.deserializeUser(function(user_id, done) {
  User.findById(user_id, function(err, user) {
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

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/:page', function(req, res, next) {
  res.render('index');
});

router.get('/prijava', function(req, res, next) {
  res.render('index');
});

router.get('/profiles', function(req, res, next) {
  res.render('index');
});

router.get('/profiles/:page', function(req, res, next) {
  res.render('index');
});

router.get('/registracija', function(req, res, next) {
  res.render('index');
});

router.get('/prijava', function(req, res, next) {
  res.render('index');
});

router.get('/profil', function(req, res, next) {
  res.render('index');
});

router.get('/postavke', function(req, res, next) {
  res.render('index');
});

router.get('/profil/:id', function(req, res, next) {
  res.render('index');
});

router.get('/unospodataka', function(req, res, next) {
  res.render('createzone', { title: 'kreiranje novoga' });
});


module.exports = router;

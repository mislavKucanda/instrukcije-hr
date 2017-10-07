var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/unospodataka', function(req, res, next) {
  res.render('createzone', { title: 'kreiranje novoga' });
});


module.exports = router;

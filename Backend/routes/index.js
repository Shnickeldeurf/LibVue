<<<<<<< HEAD
var express = require('express');

var router = express.Router();

module.exports = router;
=======
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
>>>>>>> cb083d8 (backend init setup)

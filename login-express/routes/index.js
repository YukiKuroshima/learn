var express = require('express');
var router = express.Router();

// Get Homepage
router.get('/', ensureAuthenticated, function(req, res){
	res.render('index');
});

// Prevent user from seeing dashboard page without logging in
function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		// if logged in keep going
		return next();
	} else {
		res.redirect('/users/login');
	}
}

module.exports = router;

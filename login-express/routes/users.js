var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

// Register
router.get('/register', function (req, res) {
	res.render('register');
});

// Login
router.get('/login', function (req, res) {
	res.render('login');
});

// Register User
// Program comes here when user click the submit button of register page
router.post('/register', function (req, res) {
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	// Taking care of errors
	if (errors) {
		// error occures and render to register with error params
		res.render('register', {
			errors: errors
		});
	} else {
		// No error -> create new user
		var newUser = new User({
			name: name,
			email: email,
			username: username,
			password: password
		});

		// Create user in the model
		User.createUser(newUser, function (err, user) {
			if (err) throw err;
			console.log(user);
		});

		// show success message
		req.flash('success_msg', 'You are registered and can now login');

		// redirect to login page
		res.redirect('/users/login');
	}
});

// http://passportjs.org/docs
passport.use(new LocalStrategy(
	function (username, password, done) {
		// match the user name Func is in the model/user.js
		User.getUserByUsername(username, function (err, user) {
			if (err) throw err;
			if (!user) {
				// Username is not found
				return done(null, false, { message: 'Unknown User' });
			}
			// User matched
			User.comparePassword(password, user.password, function (err, isMatch) {
				if (err) throw err;
				if (isMatch) {
					// let passport know that we are 'done' with authentification succesfully
					return done(null, user);
				} else {
					// let passport know that we are 'done' with authentification unsuccesfully					
					return done(null, false, { message: 'Invalid password' });
				}
			});
		});
	}));

// http://passportjs.org/docs
passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.getUserById(id, function (err, user) {
		done(err, user);
	});
});

// http://passportjs.org/docs
router.post('/login',
	passport.authenticate('local', { successRedirect: '/', failureRedirect: '/users/login', failureFlash: true }),
	function (req, res) {
		res.redirect('/');
	});

router.get('/logout', function (req, res) {
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/users/login');
});

module.exports = router;
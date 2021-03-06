var LocalStrategy   = require('passport-local').Strategy;
var User            = require('../models/users');

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use('signup', new LocalStrategy({
    	usernameField : 'usernameSignup',
        passwordField : 'pwSignup',
        passReqToCallback : true 
    },
    
    function(req, username, password, done) {
        process.nextTick(function() {
	        User.findOne({ 'username' :  username }, function(err, user) {
	            if (err){
	                return done(err);
	            }
	            if (user) {
	                return done(null, false, req.flash('signupMessage', 'Username already exists.'));
	            } else {
	                var newUser            = new User();
	                newUser.username = username;
	                newUser.password = newUser.generateHash(password);
	                newUser.name	 = req.body.nameSignup;
	                newUser.dob		 = req.body.dobSignup;
	                newUser.save(function(err) {
	                    if (err){
	                        throw err;
	                    }
	                    return done(null, newUser);
	                });
	            }
	        });
        });
    }));

    passport.use('login', new LocalStrategy({
    	usernameField : 'usernameLogin',
        passwordField : 'pwLogin',
        passReqToCallback : true
    },
    
    function(req, username, password, done) {
        User.findOne({ 'username' :  username }, function(err, user) {
            if (err){
                return done(err);
            }
            if (!user){
                return done(null, false, req.flash('loginMessage', 'Username does not exist.'));
            }
            if (!user.validPassword(password)){
                return done(null, false, req.flash('loginMessage', 'Username and password do not match.'));
            }
            return done(null, user);
        });

    }));

};

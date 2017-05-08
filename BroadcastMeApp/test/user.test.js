var mongoose = require('mongoose');
var configDB = require('../config/database.js');
var User	= require('../models/users');

//mongoose.connect(configDB.url);

describe('User', function() {
	this.timeout(5000);
	before(function (done) {
        mongoose.connect(configDB.url, done);
    });
	
	describe('#save()', function() {
		this.timeout(5000);
		it('should save without error', function(done) {
			this.timeout(5000);
			var newUser = new User()
			newUser.username = 'loremipsum';
            newUser.password = newUser.generateHash('ipsum_lorem');
            newUser.name	 = 'Lorem Ipsum';
            newUser.dob		 = '01-01-1993';
			newUser.save(function(err) {
		        if(err){
		        	done(err);
		        }
		        else{
		        	done();
		        }
			});
		});
	});
	
	describe('#find()', function() {
		it('respond with matching records', function() {
			this.timeout(5000);
			return User.find({ username: 'loremipsum' }).length == 1;
		});
	});
});
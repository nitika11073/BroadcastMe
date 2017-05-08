var request = require('supertest');
var server = request.agent('http://localhost:3000');

describe('Passport', function() {
	describe('login', function() {
		it('should login existing user', function(done) {
			server.post('/login').send({
				usernameLogin: 'loremipsum',
				pwLogin		 : 'ipsum_lorem'	
			}).expect('Location', '/').end(function(err, res) {
				if (err) return done(err);
				return done();
			});
		});
	});
	
	describe('signup', function() {
		it('should signup new user', function(done) {
			server.post('/register').send({
				usernameSignup	: 'loremipsum2',
				pwSignup		: 'ipsum_lorem',
				nameSignup		: 'Lorem Ipsum Dolor',
				dobSignup		: '01-05-1995'
			}).expect('Location', '/').end(function(err, res) {
				if (err) return done(err);
				return done();
			});
		});
	});
});
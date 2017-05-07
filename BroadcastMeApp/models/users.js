var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// schema definition for user model
var userSchema = mongoose.Schema({
	username	: String,
	password	: String,
	name		: String,
	dob			: Date,
	following	: [String],
	messages	: [{datePosted : Date, content : String}]
});

// method to generate hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// method to check if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

// create and expose the user model
module.exports = mongoose.model('User', userSchema);
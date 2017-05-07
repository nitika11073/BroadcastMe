var User            = require('../models/users');
var Promise = require('promise');

module.exports = function(app, passport) {

    app.get('/', isLoggedIn, function(req, res) {
        res.render('wall',{
            user : req.user
        });
    });
    
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile',{
            user : req.user
        });
    });
    
    app.get('/login', function(req, res) {
        res.render('login');
    });

    app.post('/register', passport.authenticate('signup', {
        successRedirect : '/',
        failureRedirect : '/login',
        failureFlash : true
    }));
    
    app.post('/login', passport.authenticate('login', {
        successRedirect : '/',
        failureRedirect : '/login',
        failureFlash : true
    }));
    
    app.use('/addMessage', function(req, res) {
    	User.findOne({ 'username' :  req.user.username }, function(err, user) {
    		 if (err){
    			 res.send(err);
             } else{
            	 user.messages.push({datePosted: new Date(), content: req.query.message});
            	 user.save(function(err) {
                     if (err)
                         res.send(err);
                     res.json({ message: 'Message Broadcasted' ,
                    	 user: user.username,
                    	 msg: user.messages});
                 });
             }
		});
	});
    
    app.use('/follow', function(req, res) {
    	User.findOne({ 'username' :  req.user.username }, function(err, user) {
    		 if (err){
                res.send(err);
             } else{
            	 user.following.push(req.query.username);
            	 user.save(function(err) {
                     if (err)
                         res.send(err);
                     res.json({ message: 'userAdded' ,
                    	 user: user.username,
                    	 following: user.following});
                 });
             }
    		 
		});
	});
    
    app.use('/getFollowingPosts', function(req, res) {
    	User.findOne({ 'username' :  req.user.username }, function(err, user) {
    		 if (err){
    			 res.send(err);
              } else{
            	  var followMessages = [];
            	  var promises = user.following.map(function(followUsername, index){
            		  return new Promise(function(resolve, reject){
            			  User.findOne({ 'username' : followUsername }, function(err, followUser) {
            				  if (err){
            					  reject();
            				  }else{            					  
	            				  followMessages = followMessages.concat(followUser.messages)
	            				  resolve();
            				  }
            			  });            			  
            		  });
            	  });
            	  Promise.all(promises).then(function(){
            		  followMessages.sort(function(a,b){
            			  return new Date(b.date) - new Date(a.date);
            		  });
            		  res.json(followMessages);
            	  }).catch(
        			  console.error
            	  );
              }
    	});
	});
    
    
    app.use('/getFollowingUsers', function(req, res) {
    	User.findOne({ 'username' :  req.user.username }, function(err, user) {
    		 if (err){
    			 res.send(err);
              } else{
            	  var followUsers = [];
            	  var promises = user.following.map(function(followUsername, index){
            		  return new Promise(function(resolve, reject){
            			  User.findOne({ 'username' : followUsername }, function(err, followUser) {
            				  if (err){
            					  reject();
            				  }else{            					  
            					  followUsers.push({name : followUser.name, username : followUser.username});
	            				  resolve();
            				  }
            			  });            			  
            		  });
            	  });
            	  Promise.all(promises).then(function(){
            		  res.json(followUsers);
            	  }).catch(
        			  console.error
            	  );
              }
    	});
	});
    
};

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
}

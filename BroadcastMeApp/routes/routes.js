var User            = require('../models/users');
var Promise = require('promise');

module.exports = function(app, passport) {

    app.get('/', isLoggedIn, function(req, res) {
        res.render('wall',{
            user : req.user
        });
    });
    
    app.get('/profile', function(req, res) {
    	var queryUser = req.query.user ? req.query.user : (req.user ? req.user.username : '')
    	var showFollow = req.user && req.user.username != queryUser ? true : false;
    	var isFollow = req.user && (req.user.following.indexOf(queryUser)>-1 || req.user.username == queryUser) ? true : false ;
    	if(!!queryUser){    		
	    	User.findOne({ 'username' :  queryUser }, function(err, user) {
	    		 if (err){
	    			 res.send(err);
	             } else{
	            	 res.render('profile',{
	            		 user : req.user,
	            		 profileUser : user,
	            		 isFollowing: isFollow,
	            		 showFollowBtn : showFollow
	            	 });            	 
	             }
	    	});
    	} else {
    		res.redirect('/login');
    	}
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
    
    app.post('/addMessage', function(req, res) {
    	User.findOne({ 'username' :  req.user.username }, function(err, user) {
    		 if (err){
    			 res.send(err);
             } else{
            	 var msg = req.body.message
            	 if(msg.length > 140){
            		 msg = msg.substring(0,140);
            	 }
            	 user.messages.push({datePosted: new Date(), content: msg});
            	 user.save(function(err) {
                     if (err)
                         res.send(err);
                     res.json({ message: 'Message Broadcasted'});
                 });
             }
		});
	});
    
    app.post('/follow', function(req, res) {
    	User.findOne({ 'username' :  req.user.username }, function(err, user) {
    		 if (err){
                res.send(err);
             } else{
            	 user.following.push(req.body.username);
            	 user.save(function(err) {
                     if (err)
                         res.send(err);
                     res.json({ message: 'user followed'});
                 });
             }
    		 
		});
	});
    
    app.post('/unfollow', function(req, res) {    	
		User.findOne({ 'username' :  req.user.username }, function(err, user) {
			if (err){
                res.send(err);
             } else{
            	 user.following.splice(user.following.indexOf(req.body.username), 1);
            	 user.save(function(err) {
                     if (err)
                         res.send(err);
                     res.json({ message: 'user unfollowed'});
            	 });
             }
		});
	});
    
    app.get('/getFollowingPosts', function(req, res) {
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
            				  }else if(!!followUser){            					
            					  followUser.messages.forEach(function(msg, index) {
	        						  followMessages.push({
	        							  date		: msg.datePosted,
	        							  message	: msg.content,
	        							  postedBy	: followUser.name
	        						  })
            					  })
	            				  resolve();
            				  } else{
            					  resolve()
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
    
    
    app.get('/getFollowingUsers', function(req, res) {
    	User.findOne({ 'username' :  req.user.username }, function(err, user) {
    		 if (err){
    			 res.send(err);
              } else if(!!user){
            	  var followUsers = [];
            	  var promises = user.following.map(function(followUsername, index){
            		  return new Promise(function(resolve, reject){
            			  User.findOne({ 'username' : followUsername }, function(err, followUser) {
            				  if (err){
            					  reject();
            				  }else if(!!followUser){            					  
            					  followUsers.push({name : followUser.name, username : followUser.username});
	            				  resolve();
            				  } else{
            					  resolve()
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

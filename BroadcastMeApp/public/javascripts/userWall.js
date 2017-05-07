var BroadcastMe = BroadcastMe || {};

BroadcastMe.userWall = (function(){
	var cache, data, fn, api;
	
	cache = {
			wallPosts : $(".wall-posts"),
			followUsers : $(".follow-users")
	};
	
	fn = {
			_init : function() {
				fn._bindEvents();
			},
			_bindEvents : function() {
				fn._getWallPosts();
				fn._getFollowingUsers();
			},
			_getWallPosts : function(){
				$.ajax({
					url : 'getFollowingPosts'
				}).done(function(response) {
					response.forEach(function(post, index) {
						cache.wallPosts.append("<p>"+post.content+"</p>");
					});
				});
			},
			_getFollowingUsers : function(){
				$.ajax({
					url : 'getFollowingUsers'
				}).done(function(response) {
					response.forEach(function(user, index) {
						cache.followUsers.append("<p>"+user.name+"</p>");
					});
				});
			}
	}
	
	api = {
			init: function(){ 
	 			return fn._init.apply(this, arguments); 
	 		}
	}
	return api;
})();

BroadcastMe.userWall.init();
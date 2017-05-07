var BroadcastMe = BroadcastMe || {};

BroadcastMe.userWall = (function(){
	var cache, data, fn, api;
	
	cache = {
			wallPosts : $(".wall-posts"),
			followUsers : $(".follow-users"),
			addMsgForm : $('#newMsg')
	};
	
	fn = {
			_init : function() {
				fn._bindEvents();
				fn._getWallPosts();
				fn._getFollowingUsers();
			},
			_bindEvents : function() {
				cache.addMsgForm.on('submit', fn._addMessage);
			},
			_getWallPosts : function(){
				$.ajax({
					url : 'getFollowingPosts'
				}).done(function(response) {
					response.forEach(function(post, index) {
						var newPost = $("<div/>");
						newPost.addClass('panel panel-default');
						newPost.append("<div class='panel-heading'>"+post.postedBy+"</div>");
						newPost.append("<div class='panel-body'>"+post.message+"</div>");
						cache.wallPosts.append(newPost);
					});
				});
			},
			_getFollowingUsers : function(){
				$.ajax({
					url : 'getFollowingUsers'
				}).done(function(response) {
					var newUser = $("<ul/>");
					newUser.addClass("list-group");
					response.forEach(function(user, index) {						
						newUser.append("<li class='list-group-item'><a href='/profile?user="+user.username+"'>"+user.name+"</a></li>");
					});
					cache.followUsers.append(newUser);
				});
			},
			_addMessage : function(event) {
				var _this = this;
				var message = cache.addMsgForm.find("#message").val();
				event.preventDefault();
				if(!!message){					
					$.ajax({
						type: 'POST',
						url: _this.action,
						data : {message : message}
					}).done(function(){
						cache.addMsgForm.find("#message").val("");
					});
				}
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
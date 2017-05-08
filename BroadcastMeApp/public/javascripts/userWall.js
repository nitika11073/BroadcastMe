var BroadcastMe = BroadcastMe || {};

BroadcastMe.userWall = (function(){
	var cache, data, fn, api;
	
	cache = {
			wallPosts : $(".wall-posts"),
			followUsers : $(".follow-users"),
			addMsgForm : $('#newMsg'),
			postProgressBar : $(".post-loader"),
			followProgressBar : $(".follow-loader")
	};
	
	fn = {
			_init : function() {
				fn._bindEvents();
				fn._getWallPosts();
				fn._getFollowingUsers();
				fn._showPageLoaders();
			},
			
			_bindEvents : function() {
				cache.addMsgForm.on('submit', fn._addMessage);
			},
			
			_getWallPosts : function(){
				$.ajax({
					url : 'getFollowingPosts'
				}).done(function(response) {
					fn._hidePostLoader();
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
					fn._hideFollowLoader();
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
			},
			
			_showPageLoaders : function() {
				cache.postProgressBar.find(".progress-bar").attr("aria-valuenow", 100);
				cache.postProgressBar.find(".progress-bar").attr("style", "width: 100%");
				cache.followProgressBar.find(".progress-bar").attr("aria-valuenow", 100);
				cache.followProgressBar.find(".progress-bar").attr("style", "width: 100%");
			},
			
			_hidePostLoader : function() {
				cache.postProgressBar.addClass('hidden');
			},
			
			_hideFollowLoader : function() {
				cache.followProgressBar.addClass('hidden');
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
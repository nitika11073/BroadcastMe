var BroadcastMe = BroadcastMe || {};

BroadcastMe.userProfile = (function(){
	var cache, data, fn, api;
	
	cache = {
			follow : $('#follow'),
			unfollow : $('#unfollow')
	};
	
	fn = {
			_init : function() {
				fn._bindEvents();
			},
			
			_bindEvents : function() {
				cache.follow.on('click', fn._followUser);
				cache.unfollow.on('click', fn._unfollowUser);
			},

			_followUser : function() {
				var followUsername = this.getAttribute("data-username");
				$.ajax({
					type: 'POST',
					url : '/follow',
					data: {username : followUsername} 
				}).done(function() {

				});
			},
			
			_unfollowUser : function() {
				var unfollowUsername = this.getAttribute("data-username");
				$.ajax({
					type: 'POST',
					url : '/unfollow',
					data: {username : unfollowUsername} 
				}).done(function() {

				});
			}
	};
	
	api = {
			init: function(){ 
	 			return fn._init.apply(this, arguments); 
	 		}
	}
	return api;
})();

BroadcastMe.userProfile.init();
var BroadcastMe = BroadcastMe || {};

BroadcastMe.userProfile = (function(){
	var cache, data, fn, api;
	
	cache = {
			addMsgForm : $('#newMsg')
	};
	
	fn = {
			_init : function() {
				fn._bindEvents();
			},
			_bindEvents : function() {
				cache.addMsgForm.on('submit', fn._addMessage);
				
			},
			_addMessage : function(event) {
				var _this = this;
				var message = cache.addMsgForm.find("#message").val();
				event.preventDefault();
				$.ajax({
					url: _this.action,
					data : {message : message}
				}).done(function(){
					console.log("added");
				});
			},
			
			_followUser : function() {
				
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
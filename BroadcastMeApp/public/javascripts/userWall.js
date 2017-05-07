var BroadcastMe = BroadcastMe || {};

BroadcastMe.userWall = (function(){
	var cache, data, fn, api;
	
	cache = {
			
	};
	
	fn = {
			_init : function() {
				fn._bindEvents();
			},
			_bindEvents : function() {
				
			}
	
	api = {
			init: function(){ 
	 			return fn._init.apply(this, arguments); 
	 		}
	}
	return api;
})();

BroadcastMe.userWall.init();
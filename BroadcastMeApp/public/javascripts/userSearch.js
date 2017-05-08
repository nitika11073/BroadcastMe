var BroadcastMe = BroadcastMe || {};

BroadcastMe.userSearch = (function(){
	var cache, data, fn, api;
	
	var data = {
			usersList : []
	}
	
	cache = {
			searchInput : $("#search-input"),
			searchForm : $(".search-form")
	};
	
	fn = {
			_init : function() {
				fn._getUsersList();
			},
			
			bindEvents : function() {
				cache.searchForm.on('submit', fn._submitSearch)
			},
			
			_getUsersList : function(){
				$.ajax({
					url : 'getUsersList'
				}).done(function(response) {
					data.usersList = response;
					fn._autocompleteUser();
				});
			},
			
			_autocompleteUser : function(){
				cache.searchInput.autocomplete({
					source : data.usersList,
					minLength: 2,
					appendTo : ".search-suggestions",
					select: function( event, ui ) {
						event.preventDefault();
						cache.searchInput.val(ui.item.username);
						window.location = '/profile?user=' + ui.item.username;
					}
				})
			},
			
			_submitSearch: function() {
				
			}
	}
	
	api = {
			init: function(){ 
	 			return fn._init.apply(this, arguments); 
	 		}
	}
	return api;
})();

BroadcastMe.userSearch.init();
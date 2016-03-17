(function () {
    'use strict';
    
    angular.module('yuMailApp').config(function($routeSegmentProvider, $routeProvider) {

	    $routeSegmentProvider.options.autoLoadTemplates = true;
	
	    $routeSegmentProvider.
    	when('/home', 'home').
    	when('/home/contacts', 'home.contacts').
    	when('/home/configs', 'home.configs').
    	segment('home', {
	        templateUrl : 'home/tmpl.html',
	    });

	    $routeSegmentProvider.
		    within('home').
			    segment('default', {
			    	'default': true,
			        templateUrl : 'home/default.html'
			    }).
                segment('contacts', {
                    templateUrl : 'contacts/tmpl.html'
                }).
	            segment('configs', {
	                templateUrl : 'settings/tmpl.html'
	            });
	    
	    $routeProvider.otherwise({redirectTo: '/home'}); 
		});
})();
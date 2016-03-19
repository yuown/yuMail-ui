(function () {
    'use strict';
    
    angular.module('yuMailApp').config(function($routeSegmentProvider, $routeProvider) {

	    $routeSegmentProvider.options.autoLoadTemplates = true;
	
	    $routeSegmentProvider.
    	when('/home', 'home').
    	when('/home/contacts', 'home.contacts').
    	when('/home/groups', 'home.groups').
    	when('/home/configs', 'home.configs').
    	when('/home/templates', 'home.templates').
    	segment('home', {
	        templateUrl : 'dist/js/home/tmpl.html',
	    });

	    $routeSegmentProvider.
		    within('home').
			    segment('default', {
			    	'default': true,
			        templateUrl : 'dist/js/home/default.html'
			    }).
                segment('contacts', {
                    templateUrl : 'dist/js/contacts/tmpl.html'
                }).
                segment('groups', {
                    templateUrl : 'dist/js/groups/tmpl.html'
                }).
	            segment('configs', {
	                templateUrl : 'dist/js/settings/tmpl.html'
	            }).
                segment('templates', {
                    templateUrl : 'dist/js/templates/tmpl.html'
                });
	    
	    $routeProvider.otherwise({redirectTo: '/home'}); 
		});
})();
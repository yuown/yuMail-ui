(function () {
    'use strict';
    
    angular.module('yuMailApp').controller('HomeController', [ '$scope', '$rootScope', '$timeout', '$mdSidenav', 'AuthenticationService', '$location', '$controller', function($scope, $rootScope, $timeout, $mdSidenav, AuthenticationService, $location, $controller) {
	    'use strict';
	    
	    $scope.app = {
	    	name: "yuMail",
	    	icon: "menu"
	    };
	
	    $scope.urls = [ {
			url : "#/home",
			title : "Home",
			icon : "home"
		}, {
			url : "#/home/groups",
			title : "Groups",
			icon : "group"
		}, {
			url : "#/home/contacts",
			title : "Contacts",
			icon : "contacts"
		}, {
            url : "#/home/templates",
            title : "Templates",
            icon : "insert_drive_file"
        }, {
			url : "#/home/configs",
			title : "Configuration Items",
			icon : "settings"
		}];
	    
	    $controller('BaseController', {
			$scope : $scope
		});
	    
	    $scope.toggleLeft = buildDelayedToggler('left');
	
	    function buildDelayedToggler(navID) {
			return debounce(function() {
				$mdSidenav(navID).toggle();
			}, 200);
		}
	    
	    function debounce(func, wait, context) {
			var timer;
			return function debounced() {
				var context = $scope, args = Array.prototype.slice
						.call(arguments);
				$timeout.cancel(timer);
				timer = $timeout(function() {
					timer = undefined;
					func.apply(context, args);
				}, wait || 10);
			};
		}
	    
	} ]);
	
    angular.module('yuMailApp').controller('LeftController', [ '$scope', '$timeout', '$mdSidenav', function($scope, $timeout, $mdSidenav) {
		'use strict';
	
		$scope.close = function() {
			$mdSidenav('left').close();
		};
	
	} ]);
	
    angular.module('yuMailApp').controller('DefaultController', [ '$scope', '$timeout', '$mdSidenav', 'AjaxService', '$rootScope', '$mdDialog', function($scope, $timeout, $mdSidenav, AjaxService, $rootScope, $mdDialog) {
		'use strict';
		
		$rootScope.pageTitle = "Home";
	
		var millisPerDay = 1000 * 60 * 60 * 24;
	
	    $scope.init = function() {
	        $scope.groupsUrl = "groups/";
	        $scope.contactsUrl = "contacts/";
	        AjaxService.call($scope.groupsUrl, 'GET').success(function(data, status, headers, config) {
                $scope.groups = data;
                if($scope.groups.length > 0) {
                    $scope.fetchContactsByGroup($scope.groups[0]);
                }
            });
	    };
	    
	    $scope.load = function() {
	    	
	    };
		
	    $scope.fetchContactsByGroup = function(group) {
	        AjaxService.call($scope.contactsUrl + 'byGroup/' + group.id, 'GET').success(function(data, status, headers, config) {
                $scope.contacts = data;
            });
	    };
	} ]);
})();
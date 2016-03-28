(function () {
    'use strict';
    
    angular.module('yuMailApp').controller('ConfigItemsController', [ '$scope', '$rootScope', 'AjaxService', '$location', '$controller', function($scope, $rootScope, AjaxService, $location, $controller) {
	    'use strict';
	    
	    $controller('BaseController', {
			$scope : $scope
		});
	    
	    $rootScope.pageTitle = "Settings";
	    
	    $scope.restUrl = "settings/";
	    
	    $scope.load = function() {
	    	AjaxService.call($scope.restUrl, 'GET').success(function(data, status, headers, config) {
	            $scope.items = data;
	        });
	    };
	    
	    $scope.init = function() {
	    	$scope.load();
	    };
	    
	    $scope.getSetting = function(name) {
	    	if($scope.items && $scope.items.length > 0) {
		    	for(var i=0;i<$scope.items.length;i++) {
		    		if($scope.items[i].name == name) {
		    			return $scope.items[i];
		    		}
		    	}
	    	}
	    };
	    
	    $scope.save = function() {
	        AjaxService.call($scope.restUrl + "all", 'POST', $scope.items).success(function(data, status, headers, config) {
	        	$scope.items = data;
	        });
	    };
	    
	} ]);
	
    angular.module('yuMailApp').controller('ConfigItemController', [ '$scope', '$rootScope', 'AjaxService', '$controller', function($scope, $rootScope, AjaxService, $controller) {
	    'use strict';
	    
	    $controller('BaseController', {
			$scope : $scope
		});
	    
	    $scope.restUrl = "settings/";
	    
	    $scope.init = function() {
	        $scope.item = $rootScope.temp.item;
	    };
	    
	    $scope.save = function() {
	        AjaxService.call($scope.restUrl, 'POST', $scope.item).success(function(data, status, headers, config) {
	        	$scope.item = data;
	        });
	    };
	    
	} ]);
})();
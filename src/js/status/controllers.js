(function () {
    'use strict';
    
    angular.module('yuMailApp').controller('StatusesController', [ '$scope', '$rootScope', 'AjaxService', '$location', '$controller', function($scope, $rootScope, AjaxService, $location, $controller) {
	    'use strict';
	    
	    $controller('BaseController', {
			$scope : $scope
		});
	    
	    $rootScope.pageTitle = "Email Status";
	    
	    $scope.restUrl = "status/";
	    
	    $scope.load = function() {
	    	AjaxService.call($scope.restUrl + "/ids", 'GET').success(function(data, status, headers, config) {
	            $scope.items = data;
	        });
	    };
	    
	    $scope.init = function() {
	    	$scope.load();
	    };
	    
	    $scope.add = function(data, ev) {
		    if(!data) {
		    	data = {};
		    }
		    $rootScope.temp = {
	            item : data
	        };
		    $scope.openAsDialog('dist/js/status/view.html', ev, function() {
		        $scope.load();
		    });
		};
		
		$scope.deleteItem = function(item, $event) {
			$scope.confirmDialog({
				title: 'Are you sure to delete this ?',
				content: 'Status: ' + item.id,
				okLabel: 'Delete',
				cancelLabel: 'Cancel'
			}, $event, function() {
				AjaxService.call($scope.restUrl + item.id, 'DELETE').success(function(data, status, headers, config) {
	                $scope.load();
	            });
			});
	    };
	    
	} ]);
	
    angular.module('yuMailApp').controller('StatusController', [ '$scope', '$rootScope', 'AjaxService', '$controller', 'ngQuillConfig', function($scope, $rootScope, AjaxService, $controller, ngQuillConfig) {
	    'use strict';
	    
	    $controller('BaseController', {
			$scope : $scope
		});
	    
	    $scope.restUrl = "status/";
	    
	    $scope.init = function() {
	        $scope.item = $rootScope.temp.item;
	    };
	    
	} ]);
})();
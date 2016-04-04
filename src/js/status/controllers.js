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
	    	AjaxService.call($scope.restUrl + "ids", 'GET').success(function(data, status, headers, config) {
	            $scope.items = data;
	        });
	    };
	    
	    $scope.init = function() {
	    	$scope.load();
	    };
	    
	    $scope.view = function(data, ev) {
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
				content: 'Request: ' + item,
				okLabel: 'Delete',
				cancelLabel: 'Cancel'
			}, $event, function() {
				AjaxService.call($scope.restUrl + "/request/" + item, 'DELETE').success(function(data, status, headers, config) {
	                $scope.load();
	            });
			});
	    };
	    
	} ]);
	
    angular.module('yuMailApp').controller('StatusController', [ '$scope', '$rootScope', 'AjaxService', '$controller', function($scope, $rootScope, AjaxService, $controller) {
	    'use strict';
	    
	    $controller('BaseController', {
			$scope : $scope
		});
	    
	    $scope.restUrl = "status/";
	    
	    $scope.init = function() {
	        $scope.item = $rootScope.temp.item;
	        AjaxService.call($scope.restUrl + "/request/" + $scope.item, 'GET').success(function(data, status, headers, config) {
	            $scope.items = data;
	        });
	    };
	    
	    $scope.view = function(data, ev) {
		    if(!data) {
		    	data = {};
		    }
		    $rootScope.temp = {
	            item : data
	        };
		    $scope.openAsDialog('dist/js/status/viewStatus.html', ev, function() {
		    	$rootScope.temp = {
		            item : $scope.item
		        };
		    	$scope.openAsDialog('dist/js/status/view.html', ev, function() { });
		    });
		};
	    
	} ]);
    
    angular.module('yuMailApp').controller('ViewStatusController', [ '$scope', '$rootScope', 'AjaxService', '$controller', function($scope, $rootScope, AjaxService, $controller) {
	    'use strict';
	    
	    $controller('BaseController', {
			$scope : $scope
		});
	    
	    $scope.restUrl = "status/";
	    
	    $scope.init = function() {
	        $scope.item = $rootScope.temp.item;
	    };
	    
	    $scope.retry = function(data, ev) {
	        AjaxService.call($scope.restUrl + '/request/retry/' + $scope.item.id, 'GET').success(function(data, status, headers, config) {
	            $scope.confirmDialog({
	                title: 'Retry Email',
	                content: 'Email Retry Submitted',
	                okLabel: 'OK'
	            }, ev, function() {
	                $scope.cancel();
	            });
            });
		};
	    
	} ]);
})();
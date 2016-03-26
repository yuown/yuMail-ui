(function () {
    'use strict';
    
    angular.module('yuMailApp').controller('GroupsController', [ '$scope', '$rootScope', 'AjaxService', '$location', '$controller', function($scope, $rootScope, AjaxService, $location, $controller) {
	    'use strict';
	    
	    $controller('BaseController', {
			$scope : $scope
		});
	    
	    $rootScope.pageTitle = "Groups";
	    
	    $scope.restUrl = "groups/";
	    
	    $scope.load = function() {
	    	AjaxService.call($scope.restUrl, 'GET').success(function(data, status, headers, config) {
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
		    $scope.openAsDialog('dist/js/groups/add.html', ev, function() {
		        $scope.load();
		    });
		};
		
		$scope.deleteItem = function(item, $event) {
			$scope.confirmDialog({
				title: 'Are you sure to delete this ?',
				content: 'Group Name: ' + item.name + "  (Hint: Contacts with only this one Group Assigned will also be Deleted)",
				okLabel: 'Delete',
				cancelLabel: 'Cancel'
			}, $event, function() {
				AjaxService.call($scope.restUrl + item.id, 'DELETE').success(function(data, status, headers, config) {
	                $scope.load();
	            });
			});
	    };
	    
	    $scope.enableDisable = function(item) {
	        AjaxService.call($scope.restUrl, 'POST', item).success(function(data, status, headers, config) {
	            $scope.item = data;
	        });
	    };
	    
	} ]);
	
    angular.module('yuMailApp').controller('GroupController', [ '$scope', '$rootScope', 'AjaxService', '$controller', function($scope, $rootScope, AjaxService, $controller) {
	    'use strict';
	    
	    $controller('BaseController', {
			$scope : $scope
		});
	    
	    $scope.restUrl = "groups/";
	    
	    $scope.init = function() {
	        $scope.item = $rootScope.temp.item;
	    };
	    
	    $scope.save = function() {
	        AjaxService.call($scope.restUrl, 'POST', $scope.item, $scope.item.groups).success(function(data, status, headers, config) {
	        	$scope.item = data;
	        });
	    };
	    
	} ]);
})();
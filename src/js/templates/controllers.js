(function () {
    'use strict';
    
    angular.module('yuMailApp').controller('TemplatesController', [ '$scope', '$rootScope', 'AjaxService', '$location', '$controller', function($scope, $rootScope, AjaxService, $location, $controller) {
	    'use strict';
	    
	    $controller('BaseController', {
			$scope : $scope
		});
	    
	    $rootScope.pageTitle = "Email Templates";
	    
	    $scope.restUrl = "templates/";
	    
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
		    $scope.openAsDialog('dist/js/templates/add.html', ev, function() {
		        $scope.load();
		    });
		};
		
		$scope.deleteItem = function(item, $event) {
			$scope.confirmDialog({
				title: 'Are you sure to delete this ?',
				content: 'Template Name: ' + item.name,
				okLabel: 'Delete',
				cancelLabel: 'Cancel'
			}, $event, function() {
				AjaxService.call($scope.restUrl + item.id, 'DELETE').success(function(data, status, headers, config) {
	                $scope.load();
	            });
			});
	    };
	    
	} ]);
	
    angular.module('yuMailApp').controller('TemplateController', [ '$scope', '$rootScope', 'AjaxService', '$controller', function($scope, $rootScope, AjaxService, $controller) {
	    'use strict';
	    
	    $controller('BaseController', {
			$scope : $scope
		});
	    
	    $scope.restUrl = "templates/";
	    
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
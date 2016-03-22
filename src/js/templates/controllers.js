(function () {
    'use strict';
    
    angular.module('yuMailApp').config(['ngQuillConfigProvider', function (ngQuillConfigProvider) {
        ngQuillConfigProvider.set([{
            alias: '10',
            size: '10px'
        }, {
            alias: '12',
            size: '12px'
        }, {
            alias: '14',
            size: '14px'
        }, {
            alias: '16',
            size: '16px'
        }, {
            alias: '18',
            size: '18px'
        }, {
            alias: '20',
            size: '20px'
        }, {
            alias: '22',
            size: '22px'
        }, {
            alias: '24',
            size: '24px'
        }], [{
            label: 'Arial',
            alias: 'Arial'
        }, {
            label: 'Sans Serif',
            alias: 'sans-serif'
        }, {
            label: 'Serif',
            alias: 'serif'
        }, {
            label: 'Monospace',
            alias: 'monospace'
        }, {
            label: 'Trebuchet MS',
            alias: '"Trebuchet MS"'
        }, {
            label: 'Verdana',
            alias: 'Verdana'
        }])
    }]);
    
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
	
    angular.module('yuMailApp').controller('TemplateController', [ '$scope', '$rootScope', 'AjaxService', '$controller', 'ngQuillConfig', function($scope, $rootScope, AjaxService, $controller, ngQuillConfig) {
	    'use strict';
	    
	    $controller('BaseController', {
			$scope : $scope
		});
	    
	    $scope.restUrl = "templates/";
	    
	    $scope.init = function() {
	        $scope.item = $rootScope.temp.item;
	        $scope.showToolbar = true;
	        $scope.toolbarCreated = true;
	        
	        $scope.translations = angular.extend({}, ngQuillConfig.translations, {
	            10: 'smallest'
	        });
	        // Own callback after Editor-Creation
	        $scope.editorCallback = function (editor, name) {
	            console.log('createCallback ' + $scope.toolbarCreated);
	        };
	        //         Event after an editor is created --> gets the editor instance on optional the editor name if set
	        $scope.$on('editorCreated', function (event, editor, name) {
	            console.log('createEvent ' + $scope.toolbarCreated);
	        });
	    };
	    
	    $scope.save = function() {
	        AjaxService.call($scope.restUrl, 'POST', $scope.item).success(function(data, status, headers, config) {
	        	$scope.item = data;
	        });
	    };
	    
	} ]);
})();
(function () {
    'use strict';
    
    angular.module('yuMailApp').controller('ContactsController', [ '$scope', '$rootScope', 'AjaxService', '$location', '$controller', function($scope, $rootScope, AjaxService, $location, $controller) {
	    'use strict';
	    
	    $controller('BaseController', {
			$scope : $scope
		});
	    
	    if($rootScope.temp.page) {
			$scope.currentPage = $rootScope.temp.page;
			$scope.page = $scope.currentPage - 1;
		} else {
			$scope.currentPage = 1;
		}
	    
	    $rootScope.pageTitle = "Contacts";
	    
	    $scope.restUrl = "contacts/";
	    
	    $scope.load = function(pageNumber) {
	    	AjaxService.call($scope.restUrl + '?paged=true&page=' + (pageNumber - 1), 'GET').success(function(data, status, headers, config) {
	    		$scope.totalItems = headers("totalItems");
	        	$scope.pages = headers("pages");
	        	$scope.currentPage = pageNumber;
	            $scope.items = data;
	        });
	    };
	    
	    $scope.init = function() {
	    	$scope.load($scope.currentPage);
	    };
	    
	    $scope.add = function(data, ev) {
		    if(!data) {
		    	data = {};
		    }
		    $rootScope.temp = {
	            item : data
	        };
		    $scope.openAsDialog('dist/js/contacts/add.html', ev, function() {
		        $scope.load($scope.currentPage);
		    });
		};
		
		$scope.deleteItem = function(item, $event) {
			$scope.confirmDialog({
				title: 'Are you sure to delete this ?',
				content: 'Contact Name: ' + item.name,
				okLabel: 'Delete',
				cancelLabel: 'Cancel'
			}, $event, function() {
				AjaxService.call($scope.restUrl + item.id, 'DELETE').success(function(data, status, headers, config) {
	                $scope.load($scope.currentPage);
	            });
			});
	    };
	    
	    $scope.enableDisable = function(item) {
	        AjaxService.call($scope.restUrl, 'POST', item).success(function(data, status, headers, config) {
	            $scope.item = data;
	        });
	    };
	    
	} ]);
	
    angular.module('yuMailApp').controller('ContactController', [ '$scope', '$rootScope', 'AjaxService', '$controller', function($scope, $rootScope, AjaxService, $controller) {
	    'use strict';
	    
	    $controller('BaseController', {
			$scope : $scope
		});
	    
	    $scope.restUrl = "contacts/";
	    
	    $scope.init = function() {
	        $scope.item = $rootScope.temp.item;
	        AjaxService.call('groups', 'GET').success(function(data, status, headers, config) {
	            $scope.groups = data;
	        });
	    };
	    
	    $scope.save = function() {
	        AjaxService.call($scope.restUrl, 'POST', $scope.item, JSON.stringify($scope.item.groups)).success(function(data, status, headers, config) {
	        	$scope.item = data;
	        });
	    };
	    
	    $scope.getGroup = function(allottedGroup) {
	    	for(var i in $scope.groups) {
	    		if($scope.groups[i].id == allottedGroup) {
	    			return $scope.groups[i];
	    		}
	    	}
	    };
	    
	    $scope.isAssigned = function(contact, grp) {
	    	for(var allotedGroup in contact.groups) {
	    		if(grp.id == contact.groups[allotedGroup].id) {
	    			return true;
	    		}
	    	}
	    	return false;
	    };
	    
	    $scope.addGroupToContact = function(contact, grpId) {
	    	if(!$scope.isAssigned(contact, $scope.getGroup(grpId))) {
	    		if(!contact.groups) {
	    			contact.groups = [];
	    		}
	    		try {
	    			grpId = parseInt(grpId);
				} catch (e) { }
	    		contact.groups.push({id: grpId, value: 1});
	    		grpId = null;
	    	}
	    };
	    
	    $scope.getAssignedGroup = function(allottedGroup) {
	    	for(var i in $scope.groups) {
	    		if($scope.contact.groups[i].id == allottedGroup) {
	    			return i;
	    		}
	    	}
	    };
	    
	    $scope.removeGroupFromContact = function(contact, grpId) {
	    	var assigned = $scope.getAssignedGroup(grpId);
			if(assigned && assigned >= 0) {
				AjaxService.call('contacts/' + $scope.contact.id + '/group/' + grpId, 'DELETE').success(function(data, status, headers, config) {
					$scope.contact.groups.splice(assigned, 1);
					AjaxService.call('groups/available', 'GET').success(function(data, status, headers, config) {
			            $scope.groups = data;
			        });
	            });
			}
		};
	    
	} ]);
})();
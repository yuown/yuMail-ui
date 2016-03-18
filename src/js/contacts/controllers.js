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
	        if($scope.item.id) {
		        AjaxService.call($scope.restUrl + $scope.item.id + '/groups', 'GET').success(function(data, status, headers, config) {
		        	$scope.groupMap = data;
		        });
	        }
	        AjaxService.call('groups', 'GET').success(function(data, status, headers, config) {
	            $scope.groups = data;
	        });
	    };
	    
	    $scope.save = function() {
	        $scope.item.groups = null;
	        AjaxService.call($scope.restUrl, 'POST', $scope.item, JSON.stringify($scope.groupMap)).success(function(data, status, headers, config) {
	        	$scope.item = data;
	        	AjaxService.call($scope.restUrl + $scope.item.id + '/groups', 'GET').success(function(data, status, headers, config) {
		        	$scope.groupMap = data;
		        });
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
	    	for(var allotedGroup in $scope.groupMap) {
	    		if(grp.id == $scope.groupMap[allotedGroup].id) {
	    			return true;
	    		}
	    	}
	    	return false;
	    };
	    
	    $scope.addGroupToContact = function(contact, grpId) {
	    	if(!$scope.isAssigned(contact, $scope.getGroup(grpId))) {
	    		if(!$scope.groupMap) {
	    		    $scope.groupMap = [];
	    		}
	    		try {
	    			grpId = parseInt(grpId);
				} catch (e) { }
				$scope.groupMap.push({id: grpId, value: 1});
	    		grpId = null;
	    	}
	    };
	    
	    $scope.getAssignedGroup = function(allottedGroup) {
	    	for(var i in $scope.groups) {
	    		if($scope.groupMap[i].id == allottedGroup) {
	    			return i;
	    		}
	    	}
	    };
	    
	    $scope.removeGroupFromContact = function(contact, grpId) {
	    	var assigned = $scope.getAssignedGroup(grpId);
			if(assigned && assigned >= 0) {
				if($scope.item.id) {
					$scope.groupMap.splice(assigned, 1);
					AjaxService.call('contacts/' + $scope.item.id + '/groups/' + grpId, 'DELETE').success(function(data, status, headers, config) {
						AjaxService.call($scope.restUrl + $scope.item.id + '/groups', 'GET').success(function(data, status, headers, config) {
				        	$scope.groupMap = data;
				        });
				    });
				}
			}
		};
	    
	} ]);
})();
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
	    
	    $scope.load = function(pageNumber, searchParam) {
	        var url = $scope.restUrl + '?paged=true&page=' + (pageNumber - 1);
	        if(searchParam) {
	            url += '&name=' + searchParam;
	        }
	    	AjaxService.call(url, 'GET').success(function(data, status, headers, config) {
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
	    
	    $scope.import = function(ev) {
            $scope.openAsDialog('dist/js/contacts/import.html', ev, function() {
                $scope.load(1);
            });
        };
        
        $scope.export = function(ev) {
            $scope.openAsDialog('dist/js/contacts/export.html', ev, function() { });
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
	        AjaxService.call('groups?enabled=true', 'GET').success(function(data, status, headers, config) {
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
    
    angular.module('yuMailApp').directive('csvReader', function() {
        return {
            scope : {
                csvReader : "="
            },
            link : function(scope, element) {
                angular.element(element).on('change', function(changeEvent) {
                    var files = changeEvent.target.files;
                    if (files.length == 1) {
                        var r = new FileReader();
                        r.onload = function(e) {
                            var contents = e.target.result;
                            scope.$apply(function() {
                                scope.csvReader = [];
                                var lines = contents.split('\n');
                                for (var line = 0; line < lines.length; line++) {
                                    scope.csvReader[line] = lines[line].split(',');
                                }
                            });
                        };
                        r.readAsText(files[0]);
                    } else {
                        alert("Please Select only one CSV File to Import");
                    }
                });
            }
        };
    });
    
    angular.module('yuMailApp').controller('ImportContactController', [ '$scope', '$rootScope', 'AjaxService', '$controller', function($scope, $rootScope, AjaxService, $controller) {
        'use strict';
        
        $controller('BaseController', {
            $scope : $scope
        });
        
        $scope.restUrl = "contacts/import/";
        
        $scope.init = function() {
            AjaxService.call('groups?enabled=true', 'GET').success(function(data, status, headers, config) {
                $scope.groups = data;
            });
        };
        
        $scope.importContacts = function() {
            var toImport = [];
            for(var i = 1; i < $scope.csvContents.length; i++) {
                if($scope.csvContents[i].selectedToImport == true) {
                    toImport[i - 1] = {
                        "name" : $scope.csvContents[i][0],
                        "email" : $scope.csvContents[i][1]
                    };
                }
            }
            AjaxService.call($scope.restUrl + $scope.selectedGroup.id, 'POST', toImport).success(function(data, status, headers, config) {
                $scope.item = data;
                $scope.cancel();
            });
        };
        
        $scope.selectAll = function(flag) {
            for(var i = 1; i < $scope.csvContents.length; i++) {
                $scope.csvContents[i].selectedToImport = flag;
            }
        };
        
        $scope.swapSelection = function() {
            for(var i = 1; i < $scope.csvContents.length; i++) {
                $scope.csvContents[i].selectedToImport = !$scope.csvContents[i].selectedToImport;
            }
        };
    } ]);
    
    angular.module('yuMailApp').controller('ExportContactController', [ '$scope', '$rootScope', 'AjaxService', '$controller', function($scope, $rootScope, AjaxService, $controller) {
        'use strict';
        
        $controller('BaseController', {
            $scope : $scope
        });
        
        $scope.restUrl = "contacts/export/";
        $scope.contactsUrl = "contacts/";
        
        $scope.init = function() {
            AjaxService.call('groups?enabled=true', 'GET').success(function(data, status, headers, config) {
                $scope.groups = data;
                if($scope.groups.length > 0) {
                    $scope.fetchContactsByGroup($scope.groups[0]);
                }
            });
            
            $scope.fetchContactsByGroup = function(group) {
                AjaxService.call($scope.contactsUrl + 'byGroup/' + group.id, 'GET').success(function(data, status, headers, config) {
                    $scope.contacts = data;
                });
            };
        };
        
        $scope.exportContacts = function() {
            var toExport = [];
            toExport.push({"name": "Name", "email": "Email"});
            for(var i = 0; i < $scope.contacts.length; i++) {
                if($scope.contacts[i].selectedToExport == true) {
                    toExport.push($scope.contacts[i]);
                }
            }
            var array = typeof toExport != 'object' ? JSON.parse(toExport) : toExport;

            var str = '';

            for (var i = 0; i < array.length; i++) {
                var line = '';
                line += array[i].name + ',' + array[i].email;
                line.slice(0, line.Length - 1);
                str += line + '\r\n';
            }
            var wdw = window.open("data:text/csv;charset=utf-8," + escape(str));
            $scope.cancel();
        };
        
        $scope.selectAll = function(flag) {
            for(var i = 0; i < $scope.contacts.length; i++) {
                $scope.contacts[i].selectedToExport = flag;
            }
        };
        
        $scope.swapSelection = function() {
            for(var i = 0; i < $scope.contacts.length; i++) {
                $scope.contacts[i].selectedToExport = !$scope.contacts[i].selectedToExport;
            }
        };
    } ]);
    
})();
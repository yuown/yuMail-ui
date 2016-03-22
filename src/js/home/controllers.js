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
    
    

    angular.module('yuMailApp').directive('fileUpload', function() {
		return {
			scope : true,
			link : function(scope, el, attrs) {
				el.bind('change', function(event) {
					var files = event.target.files;
					for (var i = 0; i < files.length; i++) {
						scope.$emit("fileSelected", {
							file : files[i]
						});
					}
				});
			}
		}
	});
    	
    angular.module('yuMailApp').controller('DefaultController', [ '$scope', '$timeout', '$mdSidenav', 'AjaxService', '$rootScope', '$mdDialog', function($scope, $timeout, $mdSidenav, AjaxService, $rootScope, $mdDialog) {
		'use strict';
		
		$rootScope.pageTitle = "Home";
	
		var millisPerDay = 1000 * 60 * 60 * 24;
	
	    $scope.init = function() {
	    	$scope.selectedContacts = [];
	        $scope.groupsUrl = "groups/";
	        $scope.contactsUrl = "contacts/";
	        $scope.templatesUrl = "templates/";
	        $scope.attachments = [];
	        AjaxService.call($scope.groupsUrl, 'GET').success(function(data, status, headers, config) {
                $scope.groups = data;
                if($scope.groups.length > 0) {
                    $scope.fetchContactsByGroup($scope.groups[0]);
                }
            });
	        AjaxService.call($scope.templatesUrl, 'GET').success(function(data, status, headers, config) {
	            $scope.templates = data;
	            if($scope.templates.length > 0) {
	            	$scope.selectedTemplate = $scope.templates[0];
	            }
	        });
	        
	        $scope.$on("fileSelected", function (event, args) {
	    	    $scope.$apply(function () {            
	    	        // add the file object to the scope's files collection
	    	    	var newFile = {"name": args.file.path};
	    	    	var idx = $scope.findFilePos(newFile);
	    	    	if(idx == -1) {
	    	        	$scope.attachments.push(newFile);
	    	    	}
	    	    });
	    	});
	    };
	    
	    $scope.load = function() {
	    	
	    };
		
	    $scope.fetchContactsByGroup = function(group) {
	        AjaxService.call($scope.contactsUrl + 'byGroup/' + group.id, 'GET').success(function(data, status, headers, config) {
                $scope.contacts = data;
            });
	    };
	    $scope.addContacts = function(arg) {
	    	for(var i = 0; i < $scope.contacts.length; i++) {
	    		var contact = $scope.contacts[i];
	    		if(arg == 'sel') {
	    			if(contact.selectedToAdd == true) {
		    			contact.selected = true;
		    			contact.selectedToAdd = false;
		    			contact.selectedToRemove = false;
		    			var idx = $scope.selectedContacts.indexOf(contact);
		    			if(idx == -1) {
		    				$scope.selectedContacts.push(contact);
		    			}
	    			}
	    		} else if(arg == 'all') {
	    			contact.selected = true;
	    			contact.selectedToAdd = false;
	    			contact.selectedToRemove = false;
	    			var idx = $scope.selectedContacts.indexOf(contact);
	    			if(idx == -1) {
	    				$scope.selectedContacts.push(contact);
	    			}
	    		}
	    	}
	    };
	    
	    $scope.addContact = function(contact) {
	    	contact.selected = true;
			contact.selectedToAdd = false;
			contact.selectedToRemove = false;
			var idx = $scope.selectedContacts.indexOf(contact);
			if(idx == -1) {
				$scope.selectedContacts.push(contact);
			}
	    };
	    
	    $scope.removeContacts = function(arg) {
	    	for(var i = $scope.selectedContacts.length - 1; i >=0 ; i--) {
	    		var contact = $scope.selectedContacts[i];
	    		if(arg == 'sel') {
	    			if(contact.selectedToRemove == true) {
	    				contact.selected = false;
		    			contact.selectedToAdd = false;
		    			contact.selectedToRemove = false;
		    			var idx = $scope.selectedContacts.indexOf(contact);
		    			if(idx > -1) {
		    				$scope.selectedContacts.splice(i, 1);
		    			}
	    			}
	    		} else if(arg == 'all') {
	    			contact.selected = false;
	    			contact.selectedToAdd = false;
	    			contact.selectedToRemove = false;
	    			var idx = $scope.selectedContacts.indexOf(contact);
	    			if(idx > -1) {
	    				$scope.selectedContacts.splice(i, 1);
	    			}
	    		}
	    	}
	    };
	    
	    $scope.removeContact = function(contact) {
	    	contact.selected = false;
			contact.selectedToAdd = false;
			contact.selectedToRemove = false;
			var idx = $scope.selectedContacts.indexOf(contact);
			if(idx > -1) {
				$scope.selectedContacts.splice(idx, 1);
			}
	    };
	    
	    $scope.removeAttachment = function(attachment) {
	    	$scope.attachments.splice($scope.attachments.indexOf(attachment), 1);
	    };
	    
	    $scope.findFilePos = function(file) {
	    	var idx = -1;
	    	for(var i = 0; i < $scope.attachments.length; i++) {
	    		if($scope.attachments[i].name == file.name) {
	    			idx = i;
	    			break;
	    		}
	    	}
	    	return idx;
	    }
	    
	} ]);
})();
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
            url : "#/home/status",
            title : "Email Statuses",
            icon : "mail_outline"
        }, {
			url : "#/home/configs",
			title : "Settings",
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
			link : function(scope, element, attrs) {
			    angular.element(element).on('change', function(event) {
					var files = event.target.files;
					for (var i = 0; i < files.length; i++) {
						scope.$emit("fileSelected", {
							file : files[i]
						});
					}
					event.target.value = null;
				});
			}
		}
	});
    	
    angular.module('yuMailApp').controller('DefaultController', [ '$scope', '$timeout', '$mdSidenav', 'AjaxService', '$rootScope', '$mdDialog', function($scope, $timeout, $mdSidenav, AjaxService, $rootScope, $mdDialog) {
		'use strict';
		
		$rootScope.pageTitle = "Home";
	
		var millisPerDay = 1000 * 60 * 60 * 24;
	
	    $scope.init = function() {
	        $scope.groupsUrl = "groups/?enabled=true";
	        $scope.contactsUrl = "contacts/";
	        $scope.templatesUrl = "templates/?enabled=true";
	        $scope.sendMailUrl = "sendMail/";
	        
	        $scope.request = {
	        		attachments: [],
	        		selectedContacts: []
	        };
	        AjaxService.call($scope.groupsUrl, 'GET').success(function(data, status, headers, config) {
                $scope.groups = data;
                if($scope.groups.length > 0) {
                    $scope.fetchContactsByGroup($scope.groups[0]);
                }
            });
	        AjaxService.call($scope.templatesUrl, 'GET').success(function(data, status, headers, config) {
	            $scope.templates = data;
	            if($scope.templates.length > 0) {
	            	$scope.request.selectedTemplate = $scope.templates[0];
	            }
	        });
	        
	        $scope.$on("fileSelected", function (event, args) {
	    	    $scope.$apply(function () {            
	    	    	var newFile = {"name": args.file.path};
	    	    	var idx = $scope.findFilePos(newFile);
	    	    	if(idx == -1) {
	    	        	$scope.request.attachments.push(newFile);
	    	    	}
	    	    });
	    	});
	    };
	    
	    $scope.load = function() {
	    	
	    };
		
	    $scope.fetchContactsByGroup = function(group) {
	        AjaxService.call($scope.contactsUrl + 'byGroup/' + group.id + '?enabled=true', 'GET').success(function(data, status, headers, config) {
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
		    			var idx = $scope.request.selectedContacts.indexOf(contact);
		    			if(idx == -1) {
		    				$scope.request.selectedContacts.push(contact);
		    			}
	    			}
	    		} else if(arg == 'all') {
	    			contact.selected = true;
	    			contact.selectedToAdd = false;
	    			contact.selectedToRemove = false;
	    			var idx = $scope.request.selectedContacts.indexOf(contact);
	    			if(idx == -1) {
	    				$scope.request.selectedContacts.push(contact);
	    			}
	    		}
	    	}
	    };
	    
	    $scope.addContact = function(contact) {
	    	contact.selected = true;
			contact.selectedToAdd = false;
			contact.selectedToRemove = false;
			var idx = $scope.request.selectedContacts.indexOf(contact);
			if(idx == -1) {
				$scope.request.selectedContacts.push(contact);
			}
	    };
	    
	    $scope.removeContacts = function(arg) {
	    	for(var i = $scope.request.selectedContacts.length - 1; i >=0 ; i--) {
	    		var contact = $scope.request.selectedContacts[i];
	    		if(arg == 'sel') {
	    			if(contact.selectedToRemove == true) {
	    				contact.selected = false;
		    			contact.selectedToAdd = false;
		    			contact.selectedToRemove = false;
		    			var idx = $scope.request.selectedContacts.indexOf(contact);
		    			if(idx > -1) {
		    				$scope.request.selectedContacts.splice(i, 1);
		    			}
	    			}
	    		} else if(arg == 'all') {
	    			contact.selected = false;
	    			contact.selectedToAdd = false;
	    			contact.selectedToRemove = false;
	    			var idx = $scope.request.selectedContacts.indexOf(contact);
	    			if(idx > -1) {
	    				$scope.request.selectedContacts.splice(i, 1);
	    			}
	    		}
	    	}
	    };
	    
	    $scope.removeContact = function(contact) {
	    	contact.selected = false;
			contact.selectedToAdd = false;
			contact.selectedToRemove = false;
			var idx = $scope.request.selectedContacts.indexOf(contact);
			if(idx > -1) {
				$scope.request.selectedContacts.splice(idx, 1);
			}
	    };
	    
	    $scope.removeAttachment = function(attachment) {
	    	$scope.request.attachments.splice($scope.request.attachments.indexOf(attachment), 1);
	    };
	    
	    $scope.findFilePos = function(file) {
	    	var idx = -1;
	    	for(var i = 0; i < $scope.request.attachments.length; i++) {
	    		if($scope.request.attachments[i].name == file.name) {
	    			idx = i;
	    			break;
	    		}
	    	}
	    	return idx;
	    }
	    
	    $scope.sendMail = function($event) {
	    	var atts = [];
	    	for(var i=0;i<$scope.request.attachments.length;i++) {
	    		atts[i] = $scope.request.attachments[i].name;
	    	}
	    	var content = $scope.request.selectedTemplate.content;
	    	var request = angular.copy($scope.request);
	    	request.attachments = atts;
	    	request.content = content;
	    	var errorMessage = '';
	    	if(!request.selectedContacts || request.selectedContacts.length == 0) {
	    	    errorMessage = 'Cannot Send Mail without any Contact Selected!';
	    	} else if(!request.subject || request.subject.trim().length == 0) {
	    	    errorMessage = 'Mail Subject is Empty!';
	    	} else if(!request.content || request.content.trim() == '<div><br></div>' || request.content.trim() == '<div>&nbsp;</div>' || request.content.trim().length == 0) {
                errorMessage = 'Mail Content is Empty!';
            }
	    	if(errorMessage.trim().length > 0) {
	    	    $scope.confirmDialog({
                    title: 'Error',
                    content: errorMessage,
                    okLabel: 'OK'
                }, $event, function() { });
	    	} else {
	    	    AjaxService.call($scope.sendMailUrl, 'POST', request);
	    	}
	    };
	    
	} ]);
})();
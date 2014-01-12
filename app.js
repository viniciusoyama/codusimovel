var app = angular.module("CodusApp", ["firebase"]);

app.controller("PropertiesController", [ "$scope", "$firebase", "$window" , function($scope, $firebase, $window) {
  var propertiesRef = new Firebase("https://1389469963926.firebaseio.com/propeties");
  var propertyStatuesRef = new Firebase("https://1389469963926.firebaseio.com/propeties");
  $scope.properties = $firebase(propertiesRef);
  $scope.propertyStatuses = $firebase(propertyStatuesRef);
  $scope.newProperty = {status: 'Alou'};

  $scope.addPropertyStatus = function() {
    var newPropertyStatusName = $scope.newPropertyStatusName.trim();
    if (newPropertyStatusName.length == 0) {
      return;
    }
    $scope.propertyStatuses.$add({
      name: newPropertyStatusName
    });
    $scope.newPropertyStatusName = '';
  };

  $scope.removePropertyStatus = function(id) {
    $scope.propertyStatuses.$remove(id);
  };

  $scope.addProperty = function() {

    $scope.propertyStatuses.$add($scope.newProperty);
    $scope.newProperty = {status: 'Alou'};
  };

  $scope.removeProperty = function(id) {
    if ($window.confirm("Confirma a remocao?")) {
      $scope.properties.$remove(id);
    }
  };


}]);
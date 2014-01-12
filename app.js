var app = angular.module("CodusApp", ["firebase"]);

app.controller("PropertiesController", [ "$scope", "$firebase" , function($scope, $firebase) {
  var propertiesRef = new Firebase("https://1389469963926.firebaseio.com/propeties");
  var propertyStatuesRef = new Firebase("https://1389469963926.firebaseio.com/propeties");
  $scope.properties = $firebase(propertiesRef);
  $scope.propertyStatuses = $firebase(propertyStatuesRef);

  $scope.addPropertyStatus = function () {
    var newPropertyStatusName = $scope.newPropertyStatusName.trim();
    if (!newPropertyStatusName.length) {
      return;
    }
    $scope.propertyStatuses.$add({
      name: newPropertyStatusName,
      completed: false
    });
    $scope.newPropertyStatusName = '';
  };

  $scope.removePropertyStatus = function (id) {
    $scope.propertyStatuses.$remove(id);
  };

  $scope.addMessage = function(e) {
    if (e.keyCode != 13) return;
    $scope.messages.$add({from: $scope.name, body: $scope.msg});
    $scope.msg = "";
  }
}]);
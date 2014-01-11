var app = angular.module("CodusApp", ["firebase"]);

app.controller("PropertiesController", [ "$scope", "$firebase" , function($scope, $firebase) {
  var propertiesRef = new Firebase("https://1389469963926.firebaseio.com/propeties");
  $scope.properties = $firebase(propertiesRef);
  $scope.propertyStatuses = ['Pendente visita', 'Visitado', 'OK', 'Descartado'];
  $scope.addMessage = function(e) {
    if (e.keyCode != 13) return;
    $scope.messages.$add({from: $scope.name, body: $scope.msg});
    $scope.msg = "";
  }
}]);
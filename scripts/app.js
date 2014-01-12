var app = angular.module("CodusApp", ["firebase"]);

app.directive('onlyNumber', function() {
  return function(scope, element, attrs) {
    var keyCode = [8,9,37,39,48,49,50,51,52,53,54,55,56,57,96,97,98,99,100,101,102,103,104,105,110];

    if (attrs.hasOwnProperty("onlyNumberFloat")) {
      keyCode.push(190);
    }

    element.bind("keydown", function(event) {
      if($.inArray(event.which,keyCode) == -1) {
          scope.$apply(function(){
              scope.$eval(attrs.onlyNum);
              event.preventDefault();
          });
          event.preventDefault();
      }
    });
  };
});

app.controller("PropertiesController", [ "$scope", "$firebase", "$window" , function($scope, $firebase, $window) {
  var propertiesRef = new Firebase("https://1389469963926.firebaseio.com/propeties");
  var propertyStatuesRef = new Firebase("https://1389469963926.firebaseio.com/propertyStatuses");
  $scope.properties = $firebase(propertiesRef);
  $scope.propertyStatuses = $firebase(propertyStatuesRef);
  $scope.newProperty = { status: ''};

  function resetNewProperty() {
    var keys = $scope.propertyStatuses.$getIndex();

    keys.forEach(function(key, i) {
      if (i == 0) {
        $scope.newProperty = {status: $scope.propertyStatuses.$child(key).name};
      }
    });
  }

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

    $scope.properties.$add(formatPropertyToBeSaved($scope.newProperty));
    resetNewProperty();
  };

  $scope.removeProperty = function(id) {
    if ($window.confirm("Confirma a remocao?")) {
      $scope.properties.$remove(id);
    }
  };

  function formatPropertyToBeSaved(property) {
    property.rent = parseFloat(property.rent);
    property.condominium = parseFloat(property.condominium);
    property.iptu = parseFloat(property.iptu);
    property.total = property.rent + property.condominium + property.iptu;

    property.totalPerM2 = property.total/parseFloat(property.size);
    return property;
  }


}]);
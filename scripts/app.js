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

app.filter('nl2p', function () {
  return function(text){
    text = String(text).trim();
    return (text.length > 0 ? '<p>' + text.replace(/[\r\n]+/, '</p><p>') + '</p>' : null);
  }
});

app.filter('statusFilter', [function () {
  return function (properties, selectedStatus) {
    if (!angular.isUndefined(properties) && !angular.isUndefined(selectedStatus) && properties.length > 0) {
      var tempProperties = [];

      angular.forEach(properties, function (property) {
        if (property.status && property.status.name == selectedStatus.name) {
          tempProperties.push(property);
        }
      });

      return tempProperties;
    } else {
      return properties;
    }
  };
}]);

app.controller("PropertiesController", [ "$scope", "$firebase", "$window" , function($scope, $firebase, $window) {
  var propertiesRef = new Firebase("https://1389469963926.firebaseio.com/propeties");
  var propertyStatuesRef = new Firebase("https://1389469963926.firebaseio.com/propertyStatuses");
  $scope.properties = $firebase(propertiesRef);
  $scope.propertyStatuses = $firebase(propertyStatuesRef);
  $scope.newProperty = {};
  $scope.orderPredicate = 'size';
  $scope.orderReverse = false;

  $scope.resetPropertyForm = function() {
    var keys = $scope.propertyStatuses.$getIndex();

    keys.forEach(function(key, i) {
      if (i == 0) {
        $scope.newProperty = {status: $scope.propertyStatuses[key]};
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
    var statusName = $scope.propertyStatuses[id].name;
    var propertiesKeys = $scope.properties.$getIndex();
    var existsPropertyWithStatus = propertiesKeys.reduce(function(memo, key) {
      return (memo || ($scope.properties[key].statusId == id));
    }, false);
    if (existsPropertyWithStatus) {
      alert("Não é possível efetuar a remoção pois existem imóveis com este status.");
      return;
    }
    return;

    $scope.propertyStatuses.$remove(id);
  };

  $scope.addProperty = function() {
    if (propertyValid($scope.newProperty)) {
      $scope.properties.$add(formatPropertyToBeSaved($scope.newProperty));
      $scope.resetPropertyForm();
    }
  };

  $scope.updateProperty = function() {
    if (propertyValid($scope.newProperty)) {
      $scope.properties[$scope.newProperty.$id] = formatPropertyToBeSaved($scope.newProperty);
      $scope.properties.$save($scope.newProperty.$id);
      $scope.resetPropertyForm();
    }
  };

  $scope.removeProperty = function(id) {
    if ($window.confirm("Confirma a remoção?")) {
      $scope.properties.$remove(id);
    }
  };

  $scope.editProperty = function(id) {
    $scope.newProperty = $scope.properties.$child(id);
    $scope.newProperty.$id = id;
    $("html, body").animate({ scrollTop: "0px" });
  }

  function formatPropertyToBeSaved(property) {
    property.rent = parseFloat(parseFloat(property.rent).toFixed(2));
    property.condominium = parseFloat(parseFloat(property.condominium).toFixed(2));
    property.iptu = parseFloat(parseFloat(property.iptu).toFixed(2));
    property.total = parseFloat((property.rent + property.condominium + property.iptu).toFixed(2));

    property.totalPerM2 = parseFloat((property.total/parseFloat(property.size)).toFixed(2));
    return property;
  }

  function propertyValid(property) {
    return !!property.statusId;
  }


}]);
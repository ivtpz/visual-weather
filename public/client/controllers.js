"use strict";
angular.module('weather.view', [])

.controller('weatherCtrl', function($scope, DataService, $rootScope) {
  $scope.data = {};
  $scope.active = false;

  $scope.fetch = function(type, view) {
    $scope.data.type = view;
    if (type === 'forecast') {
      var url = `/forecast?zip=${$scope.zipcode}`
    } else if (type === 'history') {
      $scope.startTime = $scope.startTime.slice(-4) + '-' + $scope.startTime.slice(0,5)
      var url = `/history?zip=${$scope.zipcode}&time=${$scope.startTime}`
    }
    $scope.zipcode = '';
    $scope.startTime = '';
    DataService.fetch(url)
    .then(data => {
      $scope.data.weather = data.hourly.data;
      $rootScope.$broadcast('create', $scope.data)
      $scope.active = true;
    });
  };

  $scope.setWeatherArray = function(array) {
    $scope.tableData = array;
  };

  $scope.saveVisual = function() {
    DataService.save($scope.name, $scope.data.type, $scope.tableData)
    $scope.name = '';
  };
})

.controller('savedView', function($scope, DataService, $rootScope) {
  $scope.load = function() {
    DataService.getAll()
    .then(data => {
      console.log(data)
      $scope.data = data.data;
    })
  };
  $scope.load();
  $scope.makeView = function(view) {
    $rootScope.$broadcast('create', view);
  }
});
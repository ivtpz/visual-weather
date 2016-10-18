"use strict";
angular.module('weather.view', [])

.controller('weatherCtrl', function($scope, GetWeather) {
  $scope.data = {};
  $scope.update = false;
  $scope.view = 'forecast';
  $scope.dataView = 'temp';
  $scope.fetch = function() {
    if ($scope.view === 'forecast') {
      var url = `/forecast?zip=${$scope.zipcode}`
    } else if ($scope.view === 'history') {
      $scope.startTime = $scope.startTime.slice(-4) + '-' + $scope.startTime.slice(0,5)
      var url = `/history?zip=${$scope.zipcode}&time=${$scope.startTime}`
    }
    $scope.zipcode = '';
    $scope.startTime = '';
    GetWeather.fetch(url)
    .then(data => {
      if ($scope.view === 'forecast') {
        $scope.data.weather = data.hourly.data;
      } else if ($scope.view === 'history') {
        $scope.data.weather = data.hourly.data;
      }
      $scope.update = !$scope.update;
    });
  };
  $scope.switchView = function(view) {
    $scope.view = view;
    $scope.startTime = '';
    $scope.zipcode = '';
  };
  $scope.setData = function(dataView) {
    $scope.dataView = dataView;
  }
})
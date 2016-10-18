"use strict";
angular.module('weather.view', [])

.controller('weatherCtrl', function($scope, GetWeather, SaveWeather, $rootScope) {
  $scope.data = {};
  $scope.dataView = 'temp';
  $scope.active = false;
  $scope.fetch = function(type) {
    if (type === 'forecast') {
      var url = `/forecast?zip=${$scope.zipcode}`
    } else if (type === 'history') {
      $scope.startTime = $scope.startTime.slice(-4) + '-' + $scope.startTime.slice(0,5)
      var url = `/history?zip=${$scope.zipcode}&time=${$scope.startTime}`
    }
    $scope.zipcode = '';
    $scope.startTime = '';
    GetWeather.fetch(url)
    .then(data => {
      if (type === 'forecast') {
        $scope.data.weather = data.hourly.data;
      } else if (type === 'history') {
        $scope.data.weather = data.hourly.data;
      }
      $rootScope.$broadcast('create', $scope.data)
      $scope.active = true;
    });
  };

  $scope.setData = function(dataView) {
    $scope.dataView = dataView;
  };
  $scope.setWeatherArray = function(array) {
    $scope.tableData = array;
  }
  $scope.saveVisual = function() {
    SaveWeather.dbInsert($scope.name, $scope.dataView, $scope.tableData)
    $scope.name = '';
  };
})

.controller('savedView', function($scope, SaveWeather, $rootScope) {
  $scope.load = function() {
    console.log('loading started')
    SaveWeather.getAll()
    .then(data => {
      console.log(data)
      $scope.data = data.data;
    })
  };
  $scope.load();
  $scope.makeView = function(view) {
    console.log('should broadcast ')
    $rootScope.$broadcast('create', view);
  }
})
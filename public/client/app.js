'use strict';
angular.module('weather', [])

.controller('weatherCtrl', function($scope, GetWeather) {
  $scope.data = {};
  $scope.fetch = function() {
    GetWeather.fetch($scope.zipcode)
    .then(data => {
      $scope.data.weather = data;
    });
  };
})

.factory('GetWeather', function($http) {
  var fetch = function (zip) {
    console.log('about to make get request with ', zip)
    return $http({
      method: 'GET',
      url: `/forecast?zip=${zip}`
    }).then(data => {
      return data.data.hourly.data;
    })
  }
  return {
    fetch: fetch
  }
})

.directive('d3Forecast', function() {

  return {
    restrict: 'E',
    link: function (scope, element, attrs) {
      //watching for new data, create visualization with new data
      scope.$watch('data', function(newV) {
        console.log(newV)
      }, true)
    }
  }
})

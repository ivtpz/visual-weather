'use strict';
const dayMap = 'Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday'.split(',');

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
  let fetch = function (zip) {
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
      scope.$watch('data', function(data) {

        if (data.weather) {
          let visual = d3.select(element[0])
          //make sure display is clear
          visual.selectAll('*').remove();
          //get just the temp and time data
          let tempData = data.weather.map(hour => {
            let day = new Date(hour.time*1000).getDay();
            return {
              temp: hour.apparentTemperature,
              day: dayMap[day],
              hour: new Date(hour.time*1000).getHours()
            }
          })
          console.log(tempData)
          //create a new visualizing space
          visual.append('svg')
            .attr('width', 650)
            .attr('height', 400)
            .style('background', 'lime')
            .selectAll()
        }
      }, true)
    }
  }
})

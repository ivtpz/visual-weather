'use strict';
const dayMap = 'Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday'.split(',');

angular.module('weather', [])

.controller('weatherCtrl', function($scope, GetWeather) {
  $scope.data = {};
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
        console.log(data)
      } else if ($scope.view === 'history') {
        $scope.data.weather = data.hourly.data;
      }
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

.factory('GetWeather', function($http) {
  let fetch = function (url) {
    console.log('about to make get request with ', url)
    return $http({
      method: 'GET',
      url: url
    }).then(data => {
      return data.data;
    })
  }
  return {
    fetch: fetch
  }
})

.factory('ColorRange', function() {
  //setting color map
  let pick = function(temp) {
    let ref = {
      xcold: { //10
        red: 20, green: 80, blue: 240
      },
      cold: { //25
        red: 60, green: 190, blue: 240
      },
      mcold: { //40
        red: 25, green: 220, blue: 120
      },
      med: { //55
        red: 220, green: 200, blue: 30
      },
      mhot: { //70
        red: 230, green: 160, blue: 20
      },
      hot: { //85
        red: 240, green: 60, blue: 20
      },
      xhot: { //100
        red: 200, green: 0, blue: 40
      }
    };
    //mixing colors
    if (temp < 10) {
      return `rgb(${ref.cold.red}, ${ref.cold.green}, ${ref.cold.blue})`
    } else if (temp > 100) {
      return `rgb(${ref.hot.red}, ${ref.hot.green}, ${ref.hot.blue})`
    } else {
      if (temp < 25){
        var percent = (temp - 10) / 15;
        var low = 'xcold';
        var high = 'cold';
      } else if (temp < 40) {
        var percent = (temp - 25) / 15;
        var low = 'cold';
        var high = 'mcold';
      } else if (temp < 55) {
        var percent = (temp - 40) / 15;
        var low = 'mcold';
        var high = 'med';
      } else if (temp < 70) {
        var percent = (temp - 55) / 15;
        var low = 'med';
        var high = 'mhot';
      } else if (temp < 85) {
        var percent = (temp - 70) / 15;
        var low = 'mhot';
        var high = 'hot';
      } else {
        var percent = (temp - 85) / 15;
        var low = 'hot';
        var high = 'xhot';
      }
      let red = ref[low].red + (ref[high].red - ref[low].red) * percent;
      let green = ref[low].green + (ref[high].green - ref[low].green) * percent;
      let blue = ref[low].blue + (ref[high].blue - ref[low].blue) * percent;
      return `rgb(${parseInt(red)}, ${parseInt(green)}, ${parseInt(blue)})`;
    }
  }
  return {
    pick: pick
  };
})

.directive('d3Forecast', function(ColorRange) {

  return {
    restrict: 'E',
    link: function (scope, element, attrs) {
      //watching for new data, create visualization with new data
      scope.$watch('data', function(data) {
      console.log(scope.dataView)
        if (data.weather) {
          //get data for history requests
          if (data.weather.length < 26) {
            var tableData = [[]];
            data.weather.forEach(hour => {
              let day = new Date(hour.time*1000).getDay();
              if (scope.dataView === 'temp') {
                tableData[0].push({
                  temp: hour.apparentTemperature,
                  day: dayMap[day],
                  hour: new Date(hour.time*1000).getHours()
                })
              } else if (scope.dataView === 'wind') {
                tableData[0].push({
                  wind: hour.windSpeed,
                  day: dayMap[day],
                  hour: new Date(hour.time*1000).getHours()
                })
              }
            })
          } else {
            //get just the temp or wind speed and time data
            var tableData = new Array(7);
            var skip = true;
            var start = 0;
            data.weather.forEach(hour => {
              let time = new Date(hour.time*1000).getHours();
              if (skip && time === 0) {
                skip = false;
                start = new Date(hour.time*1000).getDay();
              }
              if (!skip) {
                let day = new Date(hour.time*1000).getDay();
                var info;
                if (scope.dataView === 'temp') {
                  info = {
                    temp: hour.apparentTemperature,
                    day: dayMap[day],
                    hour: new Date(hour.time*1000).getHours()
                  };
                } else if (scope.dataView === 'wind' && time % 2 === 0) {
                  info = {
                    wind: hour.windSpeed,
                    day: dayMap[day],
                    hour: new Date(hour.time*1000).getHours()
                  };
                } else {
                  info = undefined;
                }
                if (!tableData[day] && info) {
                  tableData[day] = [info];
                } else if (info) {
                  tableData[day].push(info);
                }
              }
            });
            tableData = tableData.slice(start).concat(tableData.slice(0, start));
          }
          //display data above visualization
          var tooltip = d3.select("#dataDisplay")
            .append("div")
            .style("padding-left", 15 + 'px')
            .style("visibility", "hidden");

          let visual = d3.select(element[0]);
          //make sure display is clear
          visual.selectAll('*').remove();
          //create a new visualizing space
          if (scope.dataView === 'temp') {
            visual.append('table')
              .attr('width', 800)
              .attr('height', tableData.length * 40)
              .selectAll('tr')
              .data(tableData)
              .enter()
              .append('tr')
              .selectAll('td')
              .data(d => d)
              .enter()
              .append('td')
              .style('background-color', (d) => ColorRange.pick(d.temp))
              .on('mouseover', (d) => {
                return tooltip.style("visibility", "visible")
                  .text(`${parseInt(d.temp)} ° on ${d.day} at ${d.hour}:00`)
              })
              .on("mouseout", () => {return tooltip.style("visibility", "hidden");});
            } else if (scope.dataView === 'wind') {
              console.log(tableData)
              visual.append('table')
                .selectAll('tr')
                .data(tableData)
                .enter()
                .append('tr')
                .selectAll('td')
                .data(d => d)
                .enter()
                .append('td')
                .style('background-color', 'black')
                .on('mouseover', (d) => {
                return tooltip.style("visibility", "visible")
                  .text(`${d.wind} mph on ${d.day} at ${d.hour}:00`)
                })
                .on("mouseout", () => {return tooltip.style("visibility", "hidden");})
                .each(function (d, i) {
                  console.log(d)
                  var width = 60,
                  height = 60,
                  rotate = [10, -10],
                  velocity = [.003*d.wind, -.0015*d.wind],
                  time = Date.now();

                  var projection = d3.geoOrthographic()
                  .scale(30)
                  .translate([width / 2, height / 2])
                  .clipAngle(90 + 1e-6)
                  .precision(.3);

                  var path = d3.geoPath()
                      .projection(projection);

                  var graticule = d3.geoGraticule().step([20,20]);

                  var svg = d3.select(this).selectAll('svg')
                  .data([d])
                  .enter()
                  .append("svg")
                      .text(d => d)
                      .attr("width", width)
                      .attr("height", height);

                  svg.append("path")
                      .datum({type: "Sphere"})
                      .attr("class", "sphere")
                      .attr("d", path)

                  svg.append("path")
                      .datum(graticule)
                      .attr("class", "graticule")
                      .attr("d", path);


                  var feature = svg.selectAll("path");

                  d3.timer(function() {
                    var dt = Date.now() - time;
                    projection.rotate([rotate[0] + velocity[0] * dt, rotate[1] + velocity[1] * dt]);
                    feature.attr("d", path);
                  });
                })
            }
        }
      }, true)
    }
  }
})

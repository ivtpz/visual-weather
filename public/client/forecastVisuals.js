"use strict";
const dayMap = 'Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday'.split(',');

angular.module('weather.visual', ['weather.view'])

.directive('d3Forecast',function(ColorRange, $rootScope) {
  var directive = {
    restrict: 'E',
    controller: 'weatherCtrl',
    link: link
  };
  return directive; 


  function link(scope, element, attrs, controller) {
    //watching for new data, create visualization with new data
    scope.$root.$on('create', (event, data) => {
      let type = data.type || scope.data.type;
      //handle new data
      if (data.weather) {
        if (data.weather.length < 26) {
          var tableData = formatHistoricData(data.weather, type)
        } else {
          var tableData = formatForecastData(data.weather, type)
        }
        scope.setWeatherArray(tableData);
      } else {
      //already saved data
        var tableData = data.weatherData;
      }
      visualize(tableData, type, element);
    }, true) 
  }

  function formatHistoricData(weatherData, type) {
    // get data for history requests
    // weather data is for a single day 
    var tableData = [[]];
    weatherData.forEach(hour => {
      let time = new Date(hour.time*1000).getHours();
      let day = new Date(hour.time*1000).getDay();
      if (type === 'temp') {
        tableData[0][time] = {
          temp: hour.apparentTemperature,
          day: dayMap[day],
          hour: time
        };
      } else if (type === 'wind' && time % 3 === 0) {
        tableData[0][time / 3] ={
          wind: hour.windSpeed,
          day: dayMap[day],
          hour: time
        };
      }
    }) 
    return tableData
  }

  function formatForecastData(weatherData, type) {
    // get just the temp or wind speed and time data
    // for forecast requests where weather data is
    // for following 7 days
    var tableData = new Array(7);
    var skip = true;
    var start = 0;
    weatherData.forEach(hour => {
      let time = new Date(hour.time*1000).getHours();
      //start at 00:00 on the next day
      if (skip && time === 0) {
        skip = false;
        start = new Date(hour.time*1000).getDay();
      }
      // put data in matrix after finding 00:00 on first day
      if (!skip) {
        let day = new Date(hour.time*1000).getDay();
        var info;
        if (type === 'temp') {
          info = {
            temp: hour.apparentTemperature,
            day: dayMap[day],
            hour: new Date(hour.time*1000).getHours()
          };
        } else if (type === 'wind' && time % 4 === 0) {
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
    return tableData.slice(start).concat(tableData.slice(0, start));
  }

  function visualize(tableData, type, element) {
    //display data above visualization
    var tooltip = d3.select("#dataDisplay")

    tooltip.selectAll('div').remove();

    tooltip.append("div")
      .style("visibility", "hidden");

    let visual = d3.select(element[0]);
    //make sure display is clear
    visual.selectAll('*').remove();
    //create a new visualizing space
    var visTable = 
    if (type === 'temp') {
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
            .text(`Temperature: ${parseInt(d.temp)} ° on ${d.day} at ${d.hour}:00`)
        })
        .on("mouseout", () => {return tooltip.style("visibility", "hidden");});
    } else if (type === 'wind') {
      visual.append('table')
        .selectAll('tr')
        .data(tableData)
        .enter()
        .append('tr')
        .selectAll('td')
        .data(d => d)
        .enter()
        .append('td')
        //.style('background-color', 'black')
        .on('mouseover', (d) => {
        return tooltip.style("visibility", "visible")
          .text(`Wind Speed: ${d.wind} mph on ${d.day} at ${d.hour}:00`)
        })
        .on("mouseout", () => {return tooltip.style("visibility", "hidden");})
        .each(function (d, i) {
          var width = 90,
          height = 90,
          rotate = [10, -10],
          velocity = [.003*d.wind, -.0015*d.wind],
          time = Date.now();

          var projection = d3.geoOrthographic()
          .scale(44)
          .translate([width / 2, height / 2])
          .clipAngle(90 + 1e-6)
          .precision(.3);

          var path = d3.geoPath()
              .projection(projection);

          var graticule = d3.geoGraticule().step([30,30]);

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
      //adding an equator
        svg.append("path")
          .datum({type: "LineString", coordinates: [[-180, 0], [-90, 0], [0, 0], [90, 0], [180, 0]]})
          .attr("class", "equator")
          .attr("d", path);
      //adding a prime meridian
        svg.append("path")
          .datum({type: "LineString", coordinates: [[0, -180], [0, -90], [0, 0], [0, 90], [0, 180]]})
          .attr("class", "equator")
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
})
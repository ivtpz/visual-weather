'use strict';

angular.module('weather', ['weather.view', 'weather.visual', 'weather.services', 'ngRoute'])
.config(function($routeProvider, $location) {
  .when('/generate', {
    templateUrl: './generate.html',
    controller: 'weatherCtrl'
  })
  .when('/viewSaved', {
    templateUrl: './viewSaved.html',
    controller: 'weatherCtrl'
  })
})







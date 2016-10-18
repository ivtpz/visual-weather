'use strict';

angular.module('weather', ['weather.view', 'weather.visual', 'weather.services', 'ngRoute'])
.config(function($routeProvider) {
  $routeProvider
  .when('/generate', {
    templateUrl: 'client/ngViews/generate.html',
    controller: 'weatherCtrl'
  })
  .when('/history', {
    templateUrl: 'client/ngViews/history.html',
    controller: 'weatherCtrl'
  })
  .when('/viewSaved', {
    templateUrl: 'client/ngViews/viewSaved.html',
    controller: 'savedView'
  })
  .otherwise('/generate')
})







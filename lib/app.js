'use strict';

var app = angular.module('app', []);
app.directive('ngSparkline', function() {
  var url = "https://apibeta.shippable.com/projects/530312b703e7b83800959924/builds/";
  return {
    restrict: 'A',
    require: '^ngCity',
    transclude: true,
    scope: {
      ngCity: '@'
    },
    template: '<div class="sparkline"><div ng-transclude></div><div class="graph"></div></div>',
    controller: ['$scope', '$http', function($scope, $http) {
      $scope.getTemp = function(city) {
        $http({
          method: 'GET',
          url: url,
          headers: {
            Authorization: 'token' + '31ae9dad-e22a-45de-af3b-19e0443e8ed8'
         //   Content-Type: 'application/json;charset=utf8'
           }
        }).success(function(data) {
            console.log(data);
          var weather = [];
          angular.forEach(data, function(value){
            weather.push(value);
          });

          $scope.weather = weather;
          console.log($scope.weather);
        }).error(function(data, status){
            console.log('data');
            console.log(data);
            console.log('status');
            console.log(status);
        });
      }
    }],
    link: function(scope, iElement, iAttrs, ctrl) {
      scope.getTemp(iAttrs.ngCity);
      scope.$watch('weather', function(newVal) {
        // the `$watch` function will fire even if the
        // weather property is undefined, so we'll
        // check for it
        if (newVal) {
          var highs = [];
          console.log(scope.weather);
          angular.forEach(scope.weather, function(value){
            highs.push(value.duration);
          });

          chartGraph(iElement, highs, iAttrs);
        }
      });
    }
  }
});


var chartGraph = function(element, data, opts) {
  var width = opts.width || 200,
      height = opts.height || 80,
      padding = opts.padding || 30;

  // chart
  var svg     = d3.select(element[0])
                  .append('svg:svg')
                  .attr('width', width)
                  .attr('height', height)
                  .attr('class', 'sparkline')
                  .append('g')
                    .attr('transform', 'translate('+padding+', '+padding+')');

  svg.selectAll('*').remove();

  var maxY    = d3.max(data),
      x       = d3.scale.linear()
                  .domain([0, data.length])
                  .range([0, width]),
      y       = d3.scale.linear()
                  .domain(d3.extent(data))
                  .range([0, height]),
      yAxis = d3.svg.axis().scale(y)
                    .orient('left')
                    .ticks(5);

  svg.append('g')
      .attr('class', 'axis')
      .call(yAxis);

  var line    = d3.svg.line()
                  .interpolate('linear')
                  .x(function(d,i){return x(i);})
                  .y(function(d,i){return y(d);}),
      path    = svg.append('svg:path')
                    .data([data])
                    .attr('d', line)
                    .attr('fill', 'none')
                    .attr('stroke-width', '1');
}

app.directive('ngCity', function() {
  return {
    controller: function($scope) {}
  }
});


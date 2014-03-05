'use strict';
var myapp = angular.module('myapp', []);

myapp.controller('singlePostController', ['$scope', function($scope){
    $scope.data = [1,2,3];
    $scope.datalength = $scope.data.length;
}]);

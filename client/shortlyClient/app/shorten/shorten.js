angular.module('shortly.shorten', [])

.controller('ShortenController', function ($scope, $location, Links) {
  // Your code here
  $scope.link = {};

  $scope.addLink = function (url) {
    Links.addLink({url: url})
    .then(function (data) { 
        $scope.link = data;
        console.dir($scope.link);
      }).catch(function (err) {
        throw err;
      });
  };
  
});

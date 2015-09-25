angular.module('grump.browse', [])

.controller('BrowseController', function ($scope, Files) {
  $scope.grumps = [];
  console.log("Frumps!", $scope.grumps);

  $scope.getGrumps = function(){
    Files.getGrumps().then(function (results) {
      console.log("DATA!",results.data);
      $scope.grumps = results.data;
      console.log("Frumps!", $scope.grumps);
    });
  };

  $scope.getGrumps();

});

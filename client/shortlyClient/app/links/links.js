angular.module('shortly.links', [])

.controller('LinksController', function ($scope, Links) {
  $scope.data = {};
  //yo give me the links
  $scope.getLinks = function () {
    Links.getLinks()
      .then(function (data) {
      $scope.data.links = data;
    }).catch(function (error) {
        console.error(error);
      });
  }

  //calling get links on initliaiztion
  $scope.getLinks()

    // use factory
    //yo return the links as an array objects

  //set $scope = to links

});

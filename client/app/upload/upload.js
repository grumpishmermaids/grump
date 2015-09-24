angular.module('grump.upload', [])

.controller('UploadController', function ($scope, Files) {
  $scope.file = {
    url : null,
    author : null,
    runFile : null,
    description : null,
    command : null
  };

  $scope.submitForm = function() {
    Services.submitFile (obj)
      .then(function(result){
        console.log(result);
      });
  };

});

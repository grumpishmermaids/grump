angular.module('grump.services', [])

.factory('Files', function ($http) {
  // Your code here
  var submitFile = function (obj) {
    return $http({
      method: 'POST',
      data: obj,
      url: 'api/submit'
    }).then(function (resp) {
      return resp.data;
    });
  };

  return {
    submitFile: submitFile,
  };

});

var myApp = angular.module('myApp', []);
myApp.controller('myController', function($scope, $http) {

  function refresh() {
    $http.get('/api')
      .success(function(gotFromApi) {
      $scope.movies = gotFromApi;
      $scope.movie = "";
    });
  }

  refresh();

  $scope.addMovie = function() {
    $http.post('/api', $scope.movie)
      .success(function(gotFromApi) {
        //console.log(JSON.stringify(gotFromApi));
        $scope.movies = gotFromApi;
        refresh();
      });
  };

  $scope.remove = function(id) {
    $http.delete('/api/' + id).success(function(gotFromApi) {
      refresh();
    });
  };

  $scope.edit = function(id) {
    $http.get('/api/' + id).success(function(gotFromApi) {
      $scope.movie = gotFromApi;
    });
  };

  $scope.update = function() {
    $http.put('/api/' + $scope.movie._id, $scope.movie).success(function(gotFromApi) {
      refresh();
    })
  };

  $scope.deselect = function() {
    $scope.movie = "";
  };

});
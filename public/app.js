'use strict';

var app = angular.module('app', ['ngAnimate', 'ngRoute', 'ui.bootstrap'])
  .directive('passwordCheck', [function () {
    return {
      restrict: 'A',
      scope: true,
      require: 'ngModel',
      link: function (scope, elem , attributes, control) {
        var checker = function () {
          var password1 = scope.$eval(attributes.ngModel);
          var password2 = scope.$eval(attributes.passwordCheck);
          return password1 == password2;
        };
        scope.$watch(checker, function (n) {
          control.$setValidity('unique', n);
        });
      }
    }
  }])
  .factory('Auth', function($rootScope, $http) {
    return {
      login : function() {
        $rootScope.loggedIn = true;
        $rootScope.$broadcast('login');
      },
      isLoggedIn : function() {
        return $rootScope.loggedIn;
      },
      logout : function() {
        $rootScope.loggedIn = false;
        $rootScope.$broadcast('login');
      },
      refresh: function() {
        $rootScope.loggedIn = false;
        // var _this = this;
        //
        // $http.get('/api/login')
        //   .success(function(data, status, headers) {
        //     $rootScope.commit = headers().commit;
        //     if (data.logged_in) {
        //       _this.login();
        //     } else {
        //       $rootScope.loggedIn = false;
        //     }
        //   })
        //   .error(function() {
        //     $rootScope.loggedIn = false;
        //   });
      }
    }
  });

app.run(function($anchorScroll, Auth) {
  // always scroll by 70 extra pixels (navbar height + padding)
  $anchorScroll.yOffset = 70;
  // runs on first page load and refresh
  Auth.refresh();
});

app.controller('NavbarController', function($scope, $location, Auth) {
  $scope.isActive = function(url) {
    return $location.path() === url;
  };

  $scope.refresh = function() {
    $scope.loggedIn = Auth.isLoggedIn();
  };

  $scope.$on('login', function() {
    $scope.refresh();
  });

  $('.navbar-nav li a').click(function() {
    if ($('.navbar-collapse.collapse').hasClass('in')) {
      $('#navbar').collapse('hide');
    }
  });
});

app.controller('HomeController', function($scope) {

});

app.config(function($routeProvider, $locationProvider) {
  $routeProvider
  .when('/', {
    templateUrl: 'partials/home.html',
    controller: 'HomeController'
  });

  $routeProvider.otherwise({redirectTo: '/'});
});

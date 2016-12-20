;(function() {
  "use strict";

  angular.
    module("bookApp", [
      "ngRoute",
      "appLogin",
      "appRegistration",
      "newBook",
      "bookView"
    ]).
    config(AppConfig).
    run(appRun);

    AppConfig.$inject = ["$routeProvider", "$locationProvider"];
    appRun.$inject = ["$location", "$timeout"];

    function AppConfig($routeProvider, $locationProvider) {
      var config = {
        apiKey: "AIzaSyA1JpfN0-lBf_uxO7q74awI0s1ky6AIUuM",
        authDomain: "levelup-db.firebaseapp.com",
        databaseURL: "https://levelup-db.firebaseio.com",
        storageBucket: "levelup-db.appspot.com"
      };
      firebase.initializeApp(config);

      console.log($routeProvider);
      $routeProvider.
        when("/login", {
          template: "<app-login></app-login>"
        }).
        when("/registration", {
          template: "<app-registration></app-registration>"
        }).
        when("/new-book", {
          template: "<new-book></new-book>"
        }).
        when("/book/:bookId", {
          template: "<book-view></book-view>"
        }).
        when("/", {
          template: "<book-app></book-app>"
        });

      $locationProvider.html5Mode(true);
    }

    function appRun($location, $timeout) {
      firebase.auth().onAuthStateChanged(function(user) {
        if(user) {
          $timeout(function() {
            $location.path("/");
          });
        } else $location.path("/login");
      });
    }

})();

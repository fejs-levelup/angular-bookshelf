;(function() {
  "use strict";

  angular.
    module("bookApp", [
      "ngRoute",
      "appLogin",
      "appRegistration",
      "newBook",
      "bookView",
      "bookRates",
      "bookComments"
    ]).
    config(AppConfig).
    run(appRun);

    AppConfig.$inject = ["$routeProvider", "$locationProvider"];
    appRun.$inject = ["$location", "$timeout", "$rootScope"];

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

    function appRun($location, $timeout, $rootScope) {
      firebase.auth().onAuthStateChanged(function(user) {
        if(user) {
          $timeout(function() {
            $location.path("/");
          });
          firebase.
            database().
            ref(`Users/${user.uid}`).
            once("value").
            then(function(snapshot) {
              let currentUser = snapshot.val();

              if(!currentUser) return;

              $rootScope.currentUserName = currentUser.name;
            });
        } else $location.path("/login");
      });
    }

})();

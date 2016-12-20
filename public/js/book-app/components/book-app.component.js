;(function() {
  "use strict";

  angular.
    module("bookApp").
    component("bookApp", {
      template: `
        <div class="nav"><a href="new-book">Add new book</a></div>

        <div class="book-container" ng-repeat="book in $ctrl.books">
          <h3>{{book.title}}</h3>
          <img ng-src="http://theproactiveprogrammer.com/wp-content/uploads/2014/09/js_good_parts.png" alt="" />
          <p>{{book.rate}}</p>
          <p>{{book.author}}</p>
          <p>{{book.descroption}}</p>
        </div>
      `,
      controller: BookAppController
    });

  BookAppController.$inject = ["$scope"];

  function BookAppController($scope) {
    let vm = this,
        bookRef = firebase.database().ref("Books");


    vm.books = [];

    bookRef.on("value", function(snapshot) {
      // vm.users.push(snapshot.val());
      snapshot.forEach(function(subSnap) {
        vm.books.push(subSnap.val());
      });

      if(!$scope.$$phase) $scope.$apply();
    });
  }
})();

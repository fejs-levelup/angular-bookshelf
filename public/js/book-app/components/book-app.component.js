;(function() {
  "use strict";

  angular.
    module("bookApp").
    component("bookApp", {
      template: `
        <div class="nav"><a href="new-book" class="nav-click">Add new book</a></div>

        <div class="book-container" ng-repeat="book in $ctrl.books">
          <h3>{{book.title}}</h3>
          <img ng-src="{{book.coverUrl}}" alt="" />
          <p>{{book.rate}}</p>
          <p>{{book.author}}</p>
          <p>{{book.descroption}}</p>
        </div>
      `,
      controller: BookAppController
    });

  BookAppController.$inject = ["$scope", "$timeout"];

  function BookAppController($scope, $timeout) {
    let vm = this,
        bookRef = firebase.database().ref("Books"),
        storageRef = firebase.storage();


    vm.books = [];
    vm.getCoverUrl = getCoverUrl;

    function getCoverUrl(refUrl, book) {
      storageRef.ref(refUrl).getDownloadURL().then(url => {
        $scope.$apply(function() {
          book.coverUrl = url;
        });
      });
    }

    bookRef.on("value", function(snapshot) {

      $timeout(function() {
        snapshot.forEach(function(subSnap) {
          let book = subSnap.val();

          getCoverUrl(book.cover, book);
          vm.books.push(book);
        });
      });

    });
  }
})();

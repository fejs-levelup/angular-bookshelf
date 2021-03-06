;(function() {
  "use strict";

  angular.
    module("bookApp").
    component("bookApp", {
      template: `
        <div class="nav">
          <a href="new-book" class="nav-click">Add new book</a>
          <input
            type="text"
            class="book-search"
            placeholder="Search book"
            ng-model="search.$">
        </div>

        <div class="book-container" ng-repeat="book in $ctrl.books | orderBy: 'title' | filter:search">
          <h3 ng-click="$ctrl.openBook(book.id)">{{book.title | uppercase | bookTitle}}</h3>
          <img ng-src="{{book.coverUrl}}" alt="" />
          <p>{{book.rate}}</p>
          <p>{{book.author}}</p>
          <p>{{book.descroption}}</p>
        </div>
      `,
      controller: BookAppController
    });

  BookAppController.$inject = ["$scope", "$timeout", "$location", "bookAppService"];

  function BookAppController($scope, $timeout, $location, bookAppService) {
    let vm = this,
        bookRef = firebase.database().ref("Books");


    vm.books = [];
    vm.getCoverUrl = getCoverUrl;
    vm.openBook = openBook;

    function getCoverUrl(refUrl, book) {
      bookAppService.getBookCover(refUrl, url => {
        $scope.$apply(function() {
          book.coverUrl = url;
        });
      });
    }

    function openBook(id) {
      $location.path(`book/${id}`);
    }

    bookRef.on("value", function(snapshot) {

      $timeout(function() {
        snapshot.forEach(function(subSnap) {
          let book = subSnap.val();

          book.id = subSnap.key;

          getCoverUrl(book.cover, book);
          bookAppService.getBookRate(book.id).then(function(res) {
            book.rate = res;
          });
          vm.books.push(book);
        });
      });

    });
  }
})();

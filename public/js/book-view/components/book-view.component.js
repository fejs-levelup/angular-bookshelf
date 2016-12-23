;(function() {
  "use strict";

  angular.
    module("bookView").
    component("bookView", {
      templateUrl: "js/book-view/components/templates/book-view.template.html",
      controller: BookViewController
    });

  BookViewController.$inject = ["$routeParams"];

  function BookViewController($routeParams) {
    console.log($routeParams);
  }
})();
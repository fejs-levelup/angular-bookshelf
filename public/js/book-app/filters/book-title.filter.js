;(function () {
  "use strict";

  angular.
    module("bookApp").
    filter("bookTitle", function() {
      return function(input) {
        let result = input;

        if(result.length > 13) {
          result = result.slice(0, 10) + "...";
        }
        return result;
      }
    })
})();
;(function() {
  "use strict";

  angular.
    module("bookApp").
    factory("bookAppService", bookAppService);

    function bookAppService() {
      return {
        getBookCover
      };

      function getBookCover(url, cb) {
        firebase.storage().ref(url).getDownloadURL().then(cb);
      }
    }
})();
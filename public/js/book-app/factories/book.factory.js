;(function() {
  "use strict";

  angular.
    module("bookApp").
    factory("bookAppService", bookAppService);

    function bookAppService() {
      return {
        getBookCover,
        getBookRate
      };

      function getBookCover(url, cb) {
        firebase.storage().ref(url).getDownloadURL().then(cb);
      }

      function getBookRate(id) {
        return new Promise(function(resolve, reject) {
          firebase.
            database().
            ref(`BookRates/${id}`).
            once("value").then(function(snapshot) {
              let sum = 0,
                  l = snapshot.numChildren(),
                  result = null;

              if(!l) {
                reject(result);
                return;
              }

              snapshot.forEach(function(childSnap) {
                sum += childSnap.val();
              });

              result = (sum / l).toPrecision(2);
              resolve(result);
          });
        });
      }
    }
})();
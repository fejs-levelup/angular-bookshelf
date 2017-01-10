;(function() {
  "use strict";

  angular.
    module("bookView").
    component("bookView", {
      templateUrl: "js/book-view/components/templates/book-view.template.html",
      controller: BookViewController
    });

  BookViewController.$inject = [
    "$routeParams",
    "bookAppService",
    "$scope"
  ];

  function BookViewController(
    $routeParams, bookAppService, $scope
    ) {
    let vm = this,
        id = $routeParams.bookId,
        ratesRef = firebase.database().ref(`BookRates/${id}`),
        booksRef = firebase.database().ref(`Books/${id}`);

    // vm.$onInit = getBookData;
    vm.$onDestroy = onDestroy;
    vm.setRate = setRate;
    vm.getAvgRate = rate => Math.round(rate);

    function onDestroy() {
      booksRef.off("value");
    }

    function setRate(rate) {
      let uid = firebase.auth().currentUser.uid;

      vm.userRate = rate;
      $scope.$broadcast("userRate", {userRate: vm.userRate})

      ratesRef.child(uid).set(rate, function() {
        ratesRef.once("value").then(function(snapshot) {
          let result = 0,
              length = snapshot.numChildren();

          snapshot.forEach(function(childSnap) {
            result += childSnap.val();
          });

          firebase.
            database().
            ref(`Books/${id}`).
            child("rate").
            set(result / length);
        });
        
      });
    }

    let userRateReq = new Promise(res => {
      let uid = null,
          currentUser = null;

      function getUserId() {
        currentUser = firebase.auth().currentUser;

        if(!currentUser) window.requestAnimationFrame(getUserId);
        else {
          uid = currentUser.uid;
          res(uid);
        }
      }

      window.requestAnimationFrame(getUserId);
    });

    let getBookReq = new Promise(res => {
      booksRef.on("value", snapshot => res(snapshot));
    });

    Promise.all([userRateReq, getBookReq]).then(function(res) {
      let uid = res[0],
          book = res[1];

      ratesRef.child(uid).once("value").then(function(snapshot) {
        $scope.$apply(function() {
          vm.userRate = snapshot.val();
        });

        getBookData(book);
      });
    });

    userRateReq.then(res => { console.log(res); });

    function getBookData(snapshot) {

        vm.book = snapshot.val();
        vm.book.id = id;
        vm.book.rates = [];

        let l = vm.book.maxRate || 5,
            rate = vm.book.rate;

        for(let i = 1; i <= l; i += 1) {
          if(!rate) vm.book.rates.push(false)
          else vm.book.rates.push(i >= rate)
        }

        bookAppService.getBookCover(vm.book.cover, url => {
          $scope.$apply(function() {
            vm.book.coverUrl = url;
          });
        });

    }
  }
})();
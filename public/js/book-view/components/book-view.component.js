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
        uid = firebase.auth().currentUser.uid,
        ratesRef = firebase.database().ref(`BookRates/${id}`);

    vm.$onInit = getBookData;
    vm.setRate = setRate;

    function setRate(rate) {
      ratesRef.once("value").then(snapshot => {
          let rates = {},
              data = snapshot.val();

          if(data) {
            let result = 0,
                dataLength = Object.keys(data).length;
            for(let rate in data) result += data[rate];

            $scope.$apply(function() {
              vm.book.rate = (result + rate) / (dataLength + 1);
            });

            if(!(uid in data)) firebase.database().ref(`Books/${id}/rate`).set(vm.book.rate);
          }

          ratesRef.child(`${uid}`).set(rate);
        });
    }

    function getBookData() {
      firebase.database().ref(`Books/${id}`).once("value").then(snapshot => {
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
        })
      });
    }
  }
})();
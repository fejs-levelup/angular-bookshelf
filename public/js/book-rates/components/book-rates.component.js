;(function() {
  "use strict";

  angular.
    module("bookRates").
    component("bookRates", {
      template: `
        <div class="book-rates">
          <i
            ng-repeat="rate in $ctrl.rates track by $index"
            ng-class="{'fa-bookmark-o': !rate.isMarked, 'fa-bookmark': rate.isMarked}"
            ng-click="$ctrl.onChangeRate({ rate: $index + 1 })"
            class="fa"
            aria-hidden="true"></i>
          Avg: {{$ctrl.displayRate}}
        </div>
      `,
      bindings: {
        maxRates: "<",
        avgRate: "<",
        displayRate: "<",
        onChangeRate: "&",
        userRate: "<"
      },
      controller: BookRatesController
    });

  BookRatesController.inject = ["$scope", "$timeout"];

  function BookRatesController($scope, $timeout) {
    let vm = this,
        avgRate = vm.userRate || vm.avgRate;

    vm.rates = [];

    $scope.$on("userRate", function(ev, data) {
      console.log(ev);
      vm.rates = [];
      avgRate = data.userRate;

      $timeout(function() {
        for(let i = 1, l = vm.maxRates; i <= l; i += 1) {
          vm.rates.push({ isMarked:  i <= avgRate });
        }
      });
    });

    for(let i = 1, l = vm.maxRates; i <= l; i += 1) {
      vm.rates.push({ isMarked:  i <= avgRate });
    }
  }
})();
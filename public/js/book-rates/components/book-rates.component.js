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

  BookRatesController.inject = ["$scope"];

  function BookRatesController($scope) {
    let vm = this,
        avgRate = vm.userRate || vm.avgRate;

    vm.rates = [];

    $scope.$on("userRate", function(ev) {
      console.log(ev);
      vm.rates = [];
      avgRate = vm.userRate;
      for(let i = 1, l = vm.maxRates; i <= l; i += 1) {
        vm.rates.push({ isMarked:  i <= avgRate });
      }
      $scope.$apply();
    });

    for(let i = 1, l = vm.maxRates; i <= l; i += 1) {
      vm.rates.push({ isMarked:  i <= avgRate });
    }
  }
})();
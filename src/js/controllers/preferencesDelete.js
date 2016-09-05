'use strict';

angular.module('copayApp.controllers').controller('preferencesDeleteWalletController',
  function($scope, $stateParams, $ionicNavBarDelegate, $ionicHistory, gettextCatalog, lodash, profileService, $state, ongoingProcess, popupService) {
    $ionicNavBarDelegate.title(gettextCatalog.getString('Delete'));
    var wallet = profileService.getWallet($stateParams.walletId);
    $scope.alias = lodash.isEqual(wallet.name, wallet.credentials.walletName) ? null : wallet.name + ' ';
    $scope.walletName = '[' + wallet.credentials.walletName + ']';

    $scope.showDeletePopup = function() {
      var title = gettextCatalog.getString('Warning!');
      var message = gettextCatalog.getString('Are you sure you want to delete this wallet?');
      popupService.showConfirm(title, message, function(res) {
        if (res) deleteWallet();
      });
    };

    function deleteWallet() {
      ongoingProcess.set('deletingWallet', true);
      profileService.deleteWalletClient(wallet, function(err) {
        ongoingProcess.set('deletingWallet', false);
        if (err) {
          popupService.showAlert(gettextCatalog.getString('Error'), err.message || err);
        } else {
          $ionicHistory.clearHistory();
          $state.go('tabs.home');
        }
      });
    };
  });

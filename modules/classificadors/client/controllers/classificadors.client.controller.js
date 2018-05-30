(function () {
  'use strict';

  // Classificadors controller
  angular
    .module('classificadors')
    .controller('ClassificadorsController', ClassificadorsController);

  ClassificadorsController.$inject = ['$scope', '$state','$timeout', '$interval' , '$window', 'Authentication', 'classificadorResolve','FileUploader','ClassificadorsService'];

  function ClassificadorsController ($scope, $state, $timeout, $interval, $window, Authentication, classificador, FileUploader, ClassificadorsService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.classificador = classificador;
    vm.error = null;
    vm.success = null;
    vm.form = {};
    vm.remove = remove;
    //vm.save = save;
    vm.carregando = null;
    vm.controle = null;


    vm.imageLoad = "./modules/classificadors/client/img/loader.gif";
    $scope.imageDefault = "./modules/classificadors/client/img/default.jpg";

    /*$scope.successCallback = function (res) {
      $timeout(function(){$state.go('classificadors.view',{classificadorId: res._id})},22000);
    };*/
    /*$scope.successCallback = function (res) {
      vm.classificadors = ClassificadorsService.query();
      while(vm.classificadors.)
     };*/

    $scope.successCallback = function (res) {
      $state.go('classificadors.view', {
        classificadorId: res._id
      });
    };

    $scope.errorCallback = function (res) {
      $scope.error = res.data.message;
    };

    // Cria uma instância do file Upload.
    $scope.uploaderImage = new FileUploader({
      url: '/api/classificadors',
      alias: 'newPicture'
    });

    // Set file uploader image filter
    $scope.uploaderImage.filters.push({
      name: 'imageFilter',
      fn: function (item, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });

    // Called after the user selected a new picture file
    $scope.uploaderImage.onAfterAddingFile = function (fileItem) {
      if ($window.FileReader) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(fileItem._file);
        console.log(fileItem.file);

        fileReader.onload = function (fileReaderEvent) {
          $timeout(function () {
            $scope.imageDefault = fileReaderEvent.target.result;
            vm.controle = true;
          }, 0);
        };
      }
    };


    // Este método é chamado quando o upload é realizado com sucesso.
    $scope.uploaderImage.onSuccessItem = function (fileItem, response, status, headers) {

      // Show success message
      $scope.success = true;

      // Populate user object
      //$scope.user = Authentication.user = response;

      //console.log(fileItem);
      $scope.successCallback(response);

      // Clear messages
      $scope.success = vm.error = null;

      // Clear upload buttons
      $scope.cancelUpload();

    };

    // Called after the user has failed to uploaded a new picture
    $scope.uploaderImage.onErrorItem = function (fileItem, response, status, headers) {
      // Clear upload buttons
      $scope.cancelUpload();

      // Show error message
      $scope.error = response.message;
    };

    // Remove existing Classificador
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.classificador.$remove($state.go('classificadors.list'));
      }
    }

    //// Save Classificador
    //function save(isValid) {
    //  if (!isValid) {
    //    $scope.$broadcast('show-errors-check-validity', 'vm.form.classificadorForm');
    //    return false;
    //  }
    //
    //  // TODO: move create/update logic to service
    //  if (vm.classificador._id) {
    //    vm.classificador.$update($scope.successCallback, $scope.errorCallback);
    //  } else {
    //    vm.classificador.$save($scope.successCallback, $scope.errorCallback);
    //  }
    //
    //  // Clear messages
    //  $scope.success = vm.error = null;
    //
    //}

    $scope.uploadProfilePicture = function () {

      vm.controle = null;
      vm.carregando = true;
      // Clear messages
      $scope.success = $scope.error = null;

      // Start upload
      $scope.uploaderImage.uploadAll();
    };

    // Cancel the upload process
    $scope.cancelUpload = function () {
      $scope.uploaderImage.clearQueue();
    };


  }
})();

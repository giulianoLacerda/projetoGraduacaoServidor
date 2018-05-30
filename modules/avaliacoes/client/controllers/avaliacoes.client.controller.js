(function () {
    'use strict';

    // Avaliacoes controller
    angular
        .module('avaliacoes')
        .controller('AvaliacoesController', AvaliacoesController);

    AvaliacoesController.$inject = ['$scope', '$state', '$timeout', '$interval','$window', 'Authentication', 'avaliacoeResolve', 'FileUploader','$mdSidenav','$mdDialog'];

    function AvaliacoesController ($scope, $state, $timeout, $interval, $window, Authentication, avaliacoe, FileUploader,$mdDialog) {
        var vm = this;

        vm.authentication = Authentication;
        vm.avaliacoe = avaliacoe;
        vm.error = null;
        vm.success = null;
        vm.form = {};
        vm.remove = remove;
        vm.save = save;
        vm.addLine = addLine;
        vm.rmvLine = rmvLine;
        vm.selectLine = selectLine;

        /* Control Variables */

        // Block button remove line
        vm.blockBtnRmvLine = false;
        vm.blockButtonRmv = blockButtonRmv;

        // Block button add line
        vm.blockBtnAddLine = true;
        vm.blockButtonAddLine = blockButtonAddLine;

        // Block button upload image
        vm.blockBtnUp = false;
        vm.blockButtonUp = blockButtonUp;

        // Block button select image
        vm.blockBtnSlct = true;
        vm.blockButtonSlct = blockButtonSlct;

        vm.count = [0];
        vm.avaliacoe.control=-1;
        vm.lineSelected = null;

        vm.carregando = null;
        vm.controle = null;

        vm.imageLoad = "./modules/avaliacoes/client/img/loader.gif";
        var dir = "./modules/avaliacoes/client/img/";
        var defaultImage = "./modules/avaliacoes/client/img/not-available.jpg";
        vm.iconMenu = "./teste.ico";
        vm.imageDefault = "./modules/avaliacoes/client/img/default";

        vm.imgDefault = [];

        if(vm.avaliacoe.severidade===undefined){
            vm.avaliacoe.aacpd = 0;
            vm.avaliacoe.dia = [];
            vm.avaliacoe.severidade = [];
            vm.blockBtnAddLine = false;
            //vm.avaliacoe.imagem = [vm.imageDefault];
        } else {
            if(vm.avaliacoe.severidade.length===0){
                vm.count = [0];
                vm.blockBtnAddLine = false;
            } else{
                for(var i=1; i<vm.avaliacoe.severidade.length; i++){
                    vm.count.push(i);
                }
                vm.avaliacoe.control = vm.count.length-1;
            }
        }

        // Call functions
        vm.blockButtonRmv();

        function selectLine(line) {
            vm.lineSelected = line;
            //console.log(vm.lineSelected);
        }

        function addLine(){
            //vm.resetImgDefault();
            vm.count.push(vm.count.length);
            //vm.imgDefault.push(vm.imageDefault);
            vm.blockButtonRmv();
            vm.blockButtonAddLine();
            vm.blockButtonUp();
            vm.blockButtonSlct(true);
            //console.log(vm.imgDefault);
            //vm.avaliacoe.imagem.push(defaultImage);
            //console.log(vm.count);

        }

        function clicouAqui(){
            print("ClicouAqui");
        }

        function rmvLine() {
            //console.log("executou");
            vm.count.splice(-1,1);
            vm.imgDefault.splice(-1,1);
            //console.log(vm.imgDefault);
            vm.blockButtonRmv();
            vm.blockButtonAddLine();
        }

        function blockButtonUp(a) {
            //console.log("Executou blockButtonUp");
            vm.blockBtnUp = a;
        }

        function blockButtonRmv() {
            //console.log("Bloquenado botao");
            var ef=0;
            for(var i=0; i<vm.avaliacoe.severidade.length; i++){
                if(vm.avaliacoe.severidade[i]!==null){
                    ef++;
                }
            }
            if(vm.count.length<=ef){
                vm.blockBtnRmvLine = true;
            } else {
                vm.blockBtnRmvLine = false;
            }

        }

        function blockButtonAddLine() {
            //console.log("Bloquenado botao");
            var ef=0;
            for(var i=0; i<vm.avaliacoe.severidade.length; i++){
                if(vm.avaliacoe.severidade[i]!==null){
                    ef++;
                }
            }
            if(vm.count.length===ef){
                vm.blockBtnAddLine = true;
            } else {
                vm.blockBtnAddLine = false;
            }

        }

        function blockButtonSlct(a) {
            vm.blockBtnSlct = a;
        }

        // Remove existing Avaliacoe
        function remove() {
            //console.log("remover");
            if ($window.confirm('Are you sure you want to delete?')) {
                vm.avaliacoe.$remove($state.go('avaliacoes.list'));
            }
        }

        // Save Avaliacoe
        function save(isValid,image) {
            //console.log(vm.avaliacoe);
            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'vm.form.avaliacoeForm');
                return false;
            }

            // Make calc AACPD
            //console.log(vm.avaliacoe.dia[0]);
            //console.log(vm.count.length);

            //console.log(avaliacoe.dia);
            if(vm.avaliacoe.severidade.length>1)
            {
                //console.log("Aqui");
                var lenght = vm.avaliacoe.severidade.length;
                vm.avaliacoe.aacpd = 0;

                for(var i=1; i<lenght; i++){
                    //console.log("Aqui"+vm.avaliacoe.severidade[1]);
                    vm.avaliacoe.aacpd = vm.avaliacoe.aacpd + (((parseFloat(vm.avaliacoe.severidade[i]))+(parseFloat(vm.avaliacoe.severidade[i-1])))/2)*((vm.avaliacoe.dia[i])-(vm.avaliacoe.dia[i-1]));
                }
                vm.avaliacoe.aacpd.toFixed(2);
                //console.log(vm.avaliacoe.aacpd);
            }

            if(!image && vm.avaliacoe.severidade!==undefined && vm.avaliacoe.imagem!==undefined){
                var severity = vm.avaliacoe.severidade.length;
                var imagem = vm.avaliacoe.imagem.length;
                var dif = severity-imagem;
                if(dif>0){
                    for(var c=0; c<dif; c++){
                        vm.avaliacoe.imagem.push(vm.imageDefault);
                    }
                }
            }

            //console.log(vm.avaliacoe);
            // TODO: move create/update logic to service
            if (vm.avaliacoe._id) {
                vm.avaliacoe.$update(successCallbackU, errorCallback);
            } else {
                vm.avaliacoe.$save(successCallback, errorCallback);
            }

            function successCallback(res) {
                $state.go('avaliacoes.edit', {
                    avaliacoeId: res._id
                });
            }

            function errorCallback(res) {
                vm.error = res.data.message;
            }

            function successCallbackU(res) {
                $state.go('avaliacoes.view', {
                    avaliacoeId: res._id
                });
            }

        }

        $scope.successCallback = function (res) {
            // Não faz nada quando a imagem é upada com sucesso.
            /*$state.go('avaliacoes.view', {
                avaliacoeId: res._id
            });*/
        };

        $scope.errorCallback = function (res) {
            $scope.error = res.data.message;
        };

        // Cria uma instância do file Upload.
        $scope.uploaderImage = new FileUploader({
            url: '/api/avaliacoes',
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

            //console.log("Aqui");
            if ($window.FileReader) {
                //console.log(vm.lineSelected);
                //console.log("AfterSelect");

                var fileReader = new FileReader();
                fileReader.readAsDataURL(fileItem._file);
                console.log(fileItem.file);

                fileReader.onload = function (fileReaderEvent) {
                    $timeout(function () {
                        vm.imgDefault[vm.lineSelected] = fileReaderEvent.target.result;
                        vm.blockButtonUp(true);
                        //vm.avaliacoe.imagem[vm.lineSelected] = fileReaderEvent.target.result;
                        //console.log("AfterSelect");
                        vm.blockButtonSlct(false);
                        vm.controle = true;
                    }, 0);
                };
            }
        };

        // Este método é chamado quando o upload é realizado com sucesso.
        $scope.uploaderImage.onSuccessItem = function (fileItem, response, status, headers) {

            //console.log("SUCESSO");
            // Show success message
            $scope.success = true;
            vm.carregando = false;

            // Populate user object
            //$scope.user = Authentication.user = response;

            //console.log(response);
            //$scope.successCallback(response);
            //vm.avaliacoe.imagem.push('./modules/avaliacoes/client/img/'+vm.avaliacoe._id+response);
            if((vm.avaliacoe.imagem.length===1)
                & (vm.avaliacoe.imagem[0]===defaultImage)
                & (vm.avaliacoe.severidade.length===0)){
                vm.avaliacoe.imagem[0] = dir+vm.avaliacoe.user._id+"/"+response[0];
                vm.avaliacoe.severidade[0] = response[1];
                //console.log("sim");

            } else {
                vm.avaliacoe.imagem.push(dir+vm.avaliacoe.user._id+"/"+response[0]);
                vm.avaliacoe.severidade.push(response[1]);
                //console.log(vm.avaliacoe);
            }
            vm.blockButtonAddLine();
            // Clear messages
            $scope.success = vm.error = null;

            // Clear upload buttons
            $scope.cancelUpload();

        };

        // Called after the user has failed to uploaded a new picture
        $scope.uploaderImage.onErrorItem = function (fileItem, response, status, headers) {
            //console.log("ERRO");
            // Clear upload buttons
            $scope.cancelUpload();

            // Show error message
            $scope.error = response.message;
        };

        $scope.uploadProfilePicture = function () {
            //console.log("Upload Image");

            vm.controle = null;
            vm.carregando = true;
            // Clear messages
            $scope.success = $scope.error = null;

            // Start upload
            //console.log("Iniciando Upload");
            $scope.uploaderImage.uploadAll();
            //console.log("Finalizado");
        };

        // Cancel the upload process
        $scope.cancelUpload = function (line) {
            //console.log("Executou cancelUpload");
            vm.selectLine(line);
            vm.blockButtonUp(false);
            $scope.uploaderImage.clearQueue();
            vm.imgDefault[vm.lineSelected] = " ";
        }

        /*// Get the modal
        var modal = document.getElementById('myModal');

        // Get the image and insert it inside the modal - use its "alt" text as a caption
        var img = document.getElementById('myImg');
        var modalImg = document.getElementById("img01");
        var captionText = document.getElementById("caption");
        img.onclick = function(){
            modal.style.display = "block";
            modalImg.src = this.src;
            captionText.innerHTML = this.alt;
        };

        // Get the <span> element that closes the modal
        var span = document.getElementsByClassName("close")[0];

        // When the user clicks on <span> (x), close the modal
        span.onclick = function() {
            modal.style.display = "none";
        };*/
    }
}());

app
    .controller('ModalController', modalController);

modalController.$inject = ['$scope', 'key', 'addQuestion', 'prop', 'index', 'oldVal', '$uibModalInstance', 'CSVService'];

function modalController($scope, key, addQuestion, prop, index, oldVal, $uibModalInstance, CSVService) {
    if (addQuestion) {
        $scope.prop = null;
        $scope.showQuestionForm = true;
    } else {
        $scope.prop = prop || '';
        $scope.showQuestionForm = false;
        $scope.value = oldVal;
    }

    $scope.postQuestion = function (question) {
        if (!question) return alert("Please Enter Question");

        CSVService
            .postQuestion(question)
            .then(function (resp) {
                console.log("posted");
                $uibModalInstance.close("posted");
            }, function (err) {
                console.log("nopes");
                $uibModalInstance.dismiss('cancel');
            });
    }

    $scope.patchQuestion = function (value) {
        if (!value) return alert('Please enter value for ' + $scope.prop);

        CSVService
            .patchQuestion(key, index, value)
            .then(function (resp) {
                $uibModalInstance.close({ index: index, value: value });
            }, function (err) {
                console.log(err);
                $uibModalInstance.dismiss("nopes");
            });

    }

    $scope.dismiss = function () {
        $uibModalInstance.dismiss(false);
    }


}
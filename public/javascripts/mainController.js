app.controller('MainController', mainController);

mainController.$inject = ['$scope', 'CSVService', '$uibModal'];

function mainController($scope, CSVService, $uibModal) {

    $scope.getQuestions = function (q) {
        if (!q) return;
        return CSVService
            .getQuestions(q)
            .then(function (resp) {
                return resp.data;
            }, function (err) {

            });
    };

    $scope.postQuestion = function (question) {
        if (!question) return;

        CSVService
            .postQuestion(question)
            .then(function (resp) {
                alert("Question Added");
            }, function (err) {
                alert(err.data.message || "Error occured");
            });
    };

    $scope.patchQuestion = function (key, index, value) {
        if (!key || Number.isNaN(index) || !value) return alert('Invalid data');

        CSVService
            .patchQuestion(key, index, value)
            .then(function (resp) {
                alert("Record Updated");
            }, function (err) {
                alert(err.data.message || 'Error Occured');
            });
    };

    $scope.loadingQuestion = false;

    $scope.itemSelected = function (key, model) {

        $scope.loadingQuestion = true;

        CSVService
            .getQuestion(key)
            .then(function (resp) {
                $scope.selectedQuestion = resp.data.shift();
                $scope.selectedQuestionData = resp.data;
                console.log(resp);
            }, function (err) {
                console.log(err);
            });

    };

    $scope.edit = function (prop, index, oldVal) {
        openModal(false, prop, index, oldVal)
            .result.then(function (resp) {
                console.log(resp);
                $scope.selectedQuestionData[resp.index - 1] = resp.value;
            }, function (err) {
                console.log(err);
            });
    }

    $scope.addQuestion = function (question, prop, index, oldVal) {
        openModal(question, prop, index, index, oldVal)
            .result.then(function (resp) {
                console.log("Add Question");
            }, function (err) {
                console.log("err");
            });
    };

    function openModal(question, prop, index, oldVal) {
        return $uibModal.open({
            templateUrl: "/views/modal.html",
            controller: "ModalController",
            size: "lg",
            resolve: {
                key: function () {
                    return $scope.selectedQuestion;
                },
                addQuestion: function () {
                    return question
                },
                prop: function () {
                    return prop;
                },
                index: function () {
                    return index;
                },
                oldVal: function () {
                    return oldVal;
                }
            }
        });
    }
}
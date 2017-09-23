app.factory('CSVService', csvService);

csvService.$inject = ['$http'];

function csvService($http) {

    this.getQuestions = function (q) {
        return $http({
            url: '/get',
            method: 'GET',
            params: { key: q }
        });
    }

    this.getQuestion = function (key) {
        return $http({
            url: '/get/' + encodeURI(key),
            method: 'GET'
        });
    }

    this.postQuestion = function (question) {
        return $http({
            url: '/question',
            method: 'POST',
            data: { question: question }
        });
    }

    this.patchQuestion = function (key, index, value) {
        return $http({
            url: '/update/',
            method: 'PATCH',
            data: { key: key, index, value }
        });
    }

    return this;
}
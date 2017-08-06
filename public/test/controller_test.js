(function () {
    angular
        .module("TestApp", [])
        .controller("TestController", TestController);

    function TestController($http) {
        var vm = this;

        vm.createMessage = createMessage;
        vm.deleteMessage = deleteMessage;

        (function init() {
            findAllMessages();
        })();

        function createMessage(message) {
            vm.message = "";

            $http
                .post("/api/test", {message: message})
                .then(
                    findAllMessages,
                    function (err) {vm.error = err;}
                );
        }

        function deleteMessage(message) {
            $http
                .delete("/api/test/" + message._id)
                .then(
                    findAllMessages,
                    function (err) {vm.error = err;}
                );
        }

        function findAllMessages() {
            $http
                .get("/api/test")
                .then(
                    function (response) {vm.messages = response.data;},
                    function (err) {vm.error = err;}
                );
        }
    }
})();
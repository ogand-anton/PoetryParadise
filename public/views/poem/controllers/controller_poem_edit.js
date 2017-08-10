(function () {
    angular
        .module("pp")
        .controller("poemEditController", poemEditController);

    function poemEditController($routeParams, $location, authService, poemService, sharedService) {
        var vm = this,
            uid,
            poemId;

        vm.savePoem = savePoem;

        function init() {
            _parseRouteParams();
            _fetchTemplates();
            _initHeaderFooter();
            _loadContent();
        }

        authService
            .authenticate()
            .then(function (user) {
                if (user) {
                    uid = user._id;
                } else {
                    $location.url("login");
                }
                init();
            });

        function savePoem() {
            vm.poem.lines = vm.poem.text ? vm.poem.text.split("\n") : [];

            poemService
                .savePoem(poemId, vm.poem)
                .then(function () {
                    vm.successMsg = "Success";
                    vm.errorMsg = undefined;
                })
                .catch(function (res) {
                    vm.successMsg = null;
                    vm.errorMsg = res;
                });
        }

        function _fetchTemplates() {
            vm.templates = sharedService.getTemplates();
        }

        function _initHeaderFooter() {
            vm.navHeader = {
                leftLink: {href: "#!/profile", iconClass: "glyphicon-user", name: "Profile"},
                name: "Edit Poem",
                rightLink: {
                    clickCb: savePoem,
                    href: "javacript:void(0)",
                    iconClass: "glyphicon-floppy-save",
                    name: "Save"
                }
            };
        }

        function _loadContent() {
            if (poemId) {
                poemService
                    .findPoem(poemId)
                    .then(function (res) {
                        vm.poem = res.poem;
                    })
                    .catch(function (res) {
                        console.log(res);
                        model.successMsg = null;
                        model.errorMsg = "Error";
                    });
            } else {
                vm.poem = {};
            }
        }

        function _parseRouteParams() {
            if ($routeParams["poemId"]) {
                poemId = $routeParams["poemId"];
                console.log(poemId);
            }
        }
    }
})();
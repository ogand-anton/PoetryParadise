(function () {
    angular
        .module("pp")
        .controller("poemEditController", poemEditController);

    function poemEditController($routeParams, $location, authService, poemService, sharedService) {
        var vm = this,
            uid,
            poemId;

        vm.addTranslation = addTranslation;
        vm.deletePoem = deletePoem;
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

        function addTranslation() {
            $location.url("poem/" + poemId + "/translation");
        }

        function deletePoem() {
            poemService
                .deletePoem(poemId)
                .then(function () {
                    $location.url("profile");
                });
        }

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
            vm.templates = Object.assign(
                sharedService.getTemplates(),
                poemService.getTemplates()
            );
        }

        function _initHeaderFooter() {
            vm.navHeader = {
                leftLink: {href: "#!/profile", iconClass: "glyphicon-user", name: "Profile"},
                name: "Poem",
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
                    .then(function (poem) {
                        poem.text = poem.lines.join("\n");
                        vm.poem = poem;
                        vm.readOnlyFlag = poem.author && poem.author !== uid;
                    })
                    .catch(function (err) {
                        vm.successMsg = null;
                        vm.errorMsg = err;
                    });
            } else {
                vm.poem = {};
            }
        }

        function _parseRouteParams() {
            if ($routeParams["poemId"]) {
                poemId = $routeParams["poemId"];
            }
        }
    }
})();
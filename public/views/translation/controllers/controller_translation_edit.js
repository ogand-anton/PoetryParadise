(function () {
    angular
        .module("pp")
        .controller("translationEditController", translationEditController);

    function translationEditController($routeParams, $location, authService, poemService, sharedService, translationService) {
        var vm = this,
            uid,
            poemId,
            translationId;

        vm.deleteTranslation = deleteTranslation;
        vm.saveTranslation = saveTranslation;

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

        function deleteTranslation() {
            translationService
                .deleteTranslation(translationId)
                .then(function () {
                    $location.url("#!/poem/" + poemId);
                });
        }

        function saveTranslation() {
            vm.translation.lines = vm.translation.text ? vm.translation.text.split("\n") : [];

            translationService
                .saveTranslation(translationId, vm.translation, poemId)
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

        function _findPoem() {
            poemService
                .findPoem(poemId)
                .then(function (poem) {
                    poem.text = poem.lines.join("\n");
                    vm.poem = poem;
                })
                .catch(function (err) {
                    vm.successMsg = null;
                    vm.errorMsg = err;
                });
        }

        function _findTranslation() {
            if (translationId) {
                translationService
                    .findTranslation(translationId)
                    .then(function (translation) {
                        translation.text = translation.lines.join("\n");
                        vm.translation = translation;
                    })
                    .catch(function (err) {
                        vm.successMsg = null;
                        vm.errorMsg = err;
                    });
            } else {
                vm.translation = {};
            }
        }

        function _initHeaderFooter() {
            vm.navHeader = {
                leftLink: {href: "#!/poem/" + poemId, iconClass: "glyphicon-chevron-left", name: "Back to Poem"},
                name: "Edit Translation",
                rightLink: {
                    clickCb: saveTranslation,
                    href: "javacript:void(0)",
                    iconClass: "glyphicon-floppy-save",
                    name: "Save"
                }
            };
        }

        function _loadContent() {
            _findPoem();
            _findTranslation();
        }

        function _parseRouteParams() {
            poemId = $routeParams["poemId"];
            if ($routeParams["translationId"]) {
                translationId = $routeParams["translationId"];
            }
        }
    }
})();
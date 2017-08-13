(function () {
    angular
        .module("pp")
        .controller("translationEditController", translationEditController);

    function translationEditController($routeParams, $location, authUser,
                                       poemService, sharedService, translationService) {
        var vm = this,
            poemId,
            translationId;

        vm.deleteTranslation = deleteTranslation;
        vm.saveTranslation = saveTranslation;

        (function init() {
            _parseRouteParams();
            _fetchTemplates();
            _initHeaderFooter();
            _loadContent();
        })();

        function deleteTranslation() {
            translationService
                .deleteTranslation(translationId)
                .then(function () {
                    $location.url("poem/" + poemId);
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
            vm.templates = Object.assign(
                sharedService.getTemplates(),
                poemService.getTemplates(),
                translationService.getTemplates()
            );
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
                        vm.translationEditFlag = translation.author._id === authUser._id;
                        _initHeaderFooter();
                    })
                    .catch(function (err) {
                        vm.successMsg = null;
                        vm.errorMsg = err;
                    });
            } else {
                vm.translation = {author: authUser};
                vm.translationEditFlag = true;
            }
        }

        function _initHeaderFooter() {
            vm.navHeader = {
                leftLink: {href: "#!/poem/" + poemId, iconClass: "glyphicon-chevron-left", name: "Poem"},
                name: "Translation",
                rightLink: vm.translationEditFlag === undefined || vm.translationEditFlag ? {
                    clickCb: saveTranslation,
                    href: "javacript:void(0)",
                    iconClass: "glyphicon-floppy-save",
                    name: "Save"
                } : undefined
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
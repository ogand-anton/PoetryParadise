(function () {
    angular
        .module("pp")
        .controller("landingPoemController", landingPoemController);

    function landingPoemController($routeParams, poemService, searchService, sharedService, userService) {
        var vm = this,
            uid,
            author, title,
            poem;

        vm.favoritePoem = favoritePoem;
        vm.unFavoritePoem = unFavoritePoem;

        (function init() {
            uid = userService.authenticate(true);

            _parseRouteParams();
            _fetchTemplates();
            _initHeaderFooter();
            _loadContent();
        })();

        function favoritePoem(poem) {
            poemService
                .favoritePoem(uid, poem)
                .then(function () {
                    poem.favoriteFlag = true;
                });
        }

        function unFavoritePoem(favoriteId) {
            poemService
                .unFavoritePoem(uid, favoriteId)
                .then(function () {
                    poem.favoriteFlag = false;
                })
        }

        function _fetchTemplates() {
            vm.templates = Object.assign(
                sharedService.getTemplates(),
                searchService.getTemplates()
            );
        }

        function _initHeaderFooter() {
            vm.navHeader = {
                leftLink: {href: "#!/search", iconClass: "glyphicon-search", name: "Search"},
                name: "Poem Result",
                rightLink: userService.getNavRightLink()
            };
        }

        function _loadContent() {
            vm.showFavoritesFlag = !!uid; // show if logged in
            vm.successMsg = "Loading...";

            searchService
                .search({author: author, title: title})
                .then(function (res) {
                    vm.results = res.results;
                    vm.successMsg = res.msg;

                    poem = vm.results[0]; // only one poem expected to be on this page

                    // TODO need better way to check if poem already favorited with DB
                    poemService
                        .findFavoritesByUser(uid)
                        .then(function (res) {
                            var userFavorites = res.favorites;

                            for (var i = 0; i < userFavorites.length; i++) {
                                if (userFavorites[i].title === poem.title && userFavorites[i].author === poem.author){
                                    poem.favoriteFlag = true;
                                    poem.favoriteId = userFavorites[i]._id;
                                    break;
                                }
                            }
                        });
                });
        }

        function _parseRouteParams() {
            author = $routeParams["author"];
            title = $routeParams["title"];
        }
    }
})();
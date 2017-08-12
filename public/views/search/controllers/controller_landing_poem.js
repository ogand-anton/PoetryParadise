(function () {
    angular
        .module("pp")
        .controller("landingPoemController", landingPoemController);

    function landingPoemController($routeParams, authUser,
                                   authService, poemService, searchService, sharedService) {
        var vm = this,
            author, title,
            poem;

        vm.favoritePoem = favoritePoem;
        vm.unFavoritePoem = unFavoritePoem;

        (function init() {
            _parseRouteParams();
            _fetchTemplates();
            _initHeaderFooter();
            _loadContent();
        })();

        function favoritePoem(poem) {
            if (authUser) {
                poemService
                    .favoritePoem(authUser._id, poem)
                    .then(function (favorite) {
                        poem.favoriteFlag = true;
                        poem.favoriteId = favorite._id;
                    });
            } else {
                authService.referToLogin();
            }
        }

        function unFavoritePoem(favoriteId) {
            poemService
                .unFavoritePoem(authUser._id, favoriteId)
                .then(function () {
                    poem.favoriteFlag = false;
                    poem.favoriteId = undefined;
                })
        }

        function _fetchTemplates() {
            vm.templates = Object.assign(
                sharedService.getTemplates(),
                searchService.getTemplates()
            );
        }

        function _findFavoriteUsers() {
            poemService
                .findFavoriteUsers(poem)
                .then(function (users) {
                    vm.users = users;
                });
        }

        function _findIfUserFavorited() {
            if (authUser) {
                // TODO need better way to check if poem already favorited with DB
                poemService
                    .findFavoritesByUser(authUser._id)
                    .then(function (res) {
                        var userFavorites = res.favorites;

                        for (var i = 0; userFavorites && i < userFavorites.length; i++) {
                            if (userFavorites[i].title === poem.title && userFavorites[i].author === poem.author) {
                                poem.favoriteFlag = true;
                                poem.favoriteId = userFavorites[i]._id;
                                break;
                            }
                        }
                    });
            }
        }

        function _initHeaderFooter() {
            vm.navHeader = {
                leftLink: {href: "#!/search", iconClass: "glyphicon-search", name: "Search"},
                name: "Poem Result",
                rightLink: {href: "#!/profile", iconClass: "glyphicon-user", name: "Profile"}
            };
        }

        function _loadContent() {
            vm.showFavoritesFlag = true;
            vm.successMsg = "Loading...";

            searchService
                .search({author: author, title: title})
                .then(function (res) {
                    vm.results = res.results;
                    vm.successMsg = res.msg;

                    poem = vm.results[0]; // only one poem expected to be on this page

                    _findIfUserFavorited();
                    _findFavoriteUsers();
                });
        }

        function _parseRouteParams() {
            author = $routeParams["author"];
            title = $routeParams["title"];
        }
    }
})();
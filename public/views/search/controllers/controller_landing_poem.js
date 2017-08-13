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
        vm.deleteFavorite = deleteFavorite;

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

                        _findFavoriteUsers();
                    });
            } else {
                authService.referToLogin();
            }
        }

        function deleteFavorite(favoriteId) {
            poemService
                .deleteFavorite(authUser._id, favoriteId)
                .then(function () {
                    poem.favoriteFlag = false;
                    poem.favoriteId = undefined;

                    _findFavoriteUsers();
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
                .then(function (favorites) {
                    vm.users = favorites.map(function (fav) {
                        if (authUser && fav._user._id === authUser._id) {
                            poem.favoriteFlag = true;
                            poem.favoriteId = fav._id;
                        }
                        return fav._user;
                    });
                });
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

                    _findFavoriteUsers();
                });
        }

        function _parseRouteParams() {
            author = $routeParams["author"];
            title = $routeParams["title"];
        }
    }
})();
(function () {
    angular
        .module("pp")
        .controller("landingPoemController", landingPoemController);

    function landingPoemController($routeParams, authService, poemService, searchService, sharedService) {
        var vm = this,
            uid,
            author, title,
            poem;

        vm.favoritePoem = favoritePoem;
        vm.unFavoritePoem = unFavoritePoem;

        function init() {
            _parseRouteParams();
            _fetchTemplates();
            _initHeaderFooter();
            _loadContent();
        }

        authService
            .authenticate(true)
            .then(function (user) {
                if (user) {
                    uid = user._id;
                }
                init();
            });

        function favoritePoem(poem) {
            poemService
                .favoritePoem(uid, poem)
                .then(function (favorite) {
                    poem.favoriteFlag = true;
                    poem.favoriteId = favorite._id;
                });
        }

        function unFavoritePoem(favoriteId) {
            poemService
                .unFavoritePoem(uid, favoriteId)
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

        function _initHeaderFooter() {
            vm.navHeader = {
                leftLink: {href: "#!/search", iconClass: "glyphicon-search", name: "Search"},
                name: "Poem Result",
                rightLink: {href: "#!/profile", iconClass: "glyphicon-user", name: "Profile"}
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

                            for (var i = 0; userFavorites && i < userFavorites.length; i++) {
                                if (userFavorites[i].title === poem.title && userFavorites[i].author === poem.author){
                                    poem.favoriteFlag = true;
                                    poem.favoriteId = userFavorites[i]._id;
                                    break;
                                }
                            }
                        });

                    poemService
                        .findFavoriteUsers(poem)
                        .then(function(users){
                            vm.users = users;
                        });
                });
        }

        function _parseRouteParams() {
            author = $routeParams["author"];
            title = $routeParams["title"];
        }
    }
})();
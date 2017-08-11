(function () {
    angular
        .module("pp")
        .factory("translationService", translationService);

    function translationService($http) {
        return {
            deleteTranslation: deleteTranslation,
            findTranslation: findTranslation,
            findTranslations: findTranslations,
            saveTranslation: saveTranslation
        };

        function deleteTranslation(translationId) {
            return $http({
                url: "/api/translation",
                method: "DELETE",
                params: {translationId: translationId}
            }).then(function (res) {
                return res.data;
            });
        }

        function findTranslation(translationId) {
            return $http({
                url: "/api/translation",
                method: "GET",
                params: {translationId: translationId}
            }).then(function (res) {
                return res.data;
            });
        }

        function findTranslations(userId, poemId) {
            if(userId) {
                return $http({
                    url: "/api/translations",
                    method: "GET",
                    params: userId ? {userId: userId} : undefined
                }).then(function (res) {
                    return res.data;
                });
            } else {
                return $http({
                    url: "/api/translations",
                    method: "GET",
                    params: poemId ? {poemId: poemId} : undefined
                }).then(function (res) {
                    return res.data;
                });
            }
        }

        function saveTranslation(translationId, translation, userId, poemId) {
            if (translationId) {
                return $http
                    .put("/api/translation", {translationId: translationId, translation: translation})
                    .then(function (res) {
                        return res.data;
                    });
            } else {
                return $http
                    .post("/api/translation", {translation: translation, userId: userId, poemId: poemId})
                    .then(function (res) {
                        return res.data;
                    });
            }
        }

    }
})();
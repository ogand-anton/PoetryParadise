(function () {
    angular
        .module("pp")
        .factory("sharedService", sharedService);

    function sharedService() {
        var templates = {
            navHeader: "views/shared/templates/template_nav_header.html",
            navFooter: "views/shared/templates/template_nav_footer.html"
        };

        return {
            getTemplates: getTemplates
        };

        function getTemplates() {
            return templates;
        }
    }
})();
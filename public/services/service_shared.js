(function (cookies) {
    angular
        .module("pp")
        .factory("sharedService", sharedService);

    function sharedService() {
        var templates = {
            navHeader: "views/shared/templates/template_nav_header.html",
            navFooter: "views/shared/templates/template_nav_footer.html"
        };

        return {
            getTemplates: getTemplates,
            testCookies: testCookies
        };

        function getTemplates() {
            return templates;
        }

        function testCookies() {
            cookies.set("test", true);
            if (cookies.get("test")) {
                cookies.remove("test");
                return true;
            }
            else {
                return false;
            }
        }
    }
})(Cookies);
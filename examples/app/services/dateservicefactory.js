var examples = examples ||{};
(function (examples) {
    var DateServiceFactory = (function () {
        komvc.RegisterService("DateService", examples.DateService);
        return {
            GetDateService: function () {
                return new examples.DateService();
            }
        };
    })();
    examples.DateServiceFactory = DateServiceFactory;
    komvc.RegisterService("DateServiceFactory", examples.DateServiceFactory);
})(examples || (examples = {}));
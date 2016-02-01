var AppMode;
(function (AppMode) {
    AppMode[AppMode["Server"] = 0] = "Server";
    AppMode[AppMode["RouteList"] = 1] = "RouteList";
    AppMode[AppMode["NewProject"] = 2] = "NewProject";
    AppMode[AppMode["REPL"] = 3] = "REPL";
    AppMode[AppMode["Migrate"] = 4] = "Migrate";
    AppMode[AppMode["ManageClients"] = 5] = "ManageClients";
})(AppMode || (AppMode = {}));
;
module.exports = AppMode;
//# sourceMappingURL=appmode.js.map
var Commander = require('commander');
var Constants = require('../config/constants');
var CLI = (function () {
    function CLI() {
        this._parser = Commander.version(Constants.version);
    }
    CLI.prototype.addOption = function (option, description) {
        this._parser.option(option, description);
    };
    CLI.prototype.addCommand = function (command, description, handler) {
        var self = this;
        this._parser.command(command, description);
        this._parser.on(command, function () {
            if (handler) {
                self._command = command;
                handler();
            }
        });
    };
    CLI.prototype.run = function (args) {
        this._parser.parse(args);
    };
    Object.defineProperty(CLI.prototype, "options", {
        get: function () {
            return this._parser.opts();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CLI.prototype, "command", {
        get: function () {
            return this._command;
        },
        enumerable: true,
        configurable: true
    });
    return CLI;
})();
module.exports = CLI;
//# sourceMappingURL=cli.js.map
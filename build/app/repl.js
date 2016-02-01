var _ = require('lodash');
var Promise = require('bluebird');
var Prompt = require('prompt');
var PrettyJSON = require('prettyjson');
var Logger = require('./logger');
var REPL = (function () {
    function REPL(orm) {
        this._orm = orm;
        this._context = this._orm.models;
    }
    REPL.prototype.startPrompt = function () {
        if (!Prompt.started) {
            Prompt.message = '';
            Prompt.delimiter = '';
            Prompt.start();
        }
    };
    REPL.prototype.getCommand = function () {
        var self = this;
        return new Promise(function (fulfill, reject) {
            self.startPrompt();
            var schema = _.clone(REPL.commandSchema);
            Prompt.get(schema, function (err, result) {
                if (err) {
                    reject(err);
                }
                else {
                    fulfill(result.command);
                }
            });
        });
    };
    REPL.prototype.abstractEval = function (command) {
        var keys = _.keys(this);
        for (var i in keys) {
            var key = keys[i];
            var str = 'var ' + key + ' = this.' + key + ';';
            eval(str);
        }
        return eval(command);
    };
    REPL.prototype.evaluateCommand = function (command) {
        var self = this;
        return new Promise(function (fulfill, reject) {
            try {
                var result = self.abstractEval.call(self._context, command);
                fulfill(result);
            }
            catch (error) {
                fulfill(error);
            }
        });
    };
    REPL.prototype.printResult = function (result) {
        if (result instanceof Promise) {
            var promise = result;
            return promise.then(this.printResult);
        }
        Logger.hideLabels().info('').showLabels();
        if (_.isError(result)) {
            Logger.error(result);
        }
        else {
            try {
                var jsonResult = JSON.parse(JSON.stringify(result));
                var rendered = PrettyJSON.render(jsonResult);
                Logger.hideLabels().info(rendered).showLabels();
            }
            catch (e) {
                Logger.hideLabels().info(result).showLabels();
            }
        }
        Logger.hideLabels().info('').showLabels();
    };
    REPL.prototype.runner = function () {
        return this.getCommand().bind(this).then(this.evaluateCommand).then(this.printResult).then(this.runner);
    };
    REPL.prototype.run = function () {
        Logger.hideLabels().info('').showLabels();
        return this.runner().catch(function (error) {
            var pred = error.message == 'canceled';
            return pred;
        }, function (error) {
            Logger.hideLabels().info('').showLabels();
        });
    };
    REPL.commandSchema = {
        properties: {
            command: {
                description: '>>'
            }
        }
    };
    return REPL;
})();
module.exports = REPL;
//# sourceMappingURL=repl.js.map
var _ = require('lodash');
var Colors = require('colors');
var Errno = require('errno');
var Table = require('cli-table');
var Moment = require('moment');
var _Arrow = "==> ";
var Logger = (function () {
    function Logger() {
        this._showLabels = true;
    }
    Logger.prototype.start = function () {
        return this;
    };
    Logger.prototype.log = function (source, message, meta, arrow, carriageReturn) {
        if (arrow === void 0) { arrow = false; }
        if (carriageReturn === void 0) { carriageReturn = false; }
        var emptyMessage = _.isEmpty(message);
        if (!message) {
            message = '';
        }
        if (arrow) {
            message = _Arrow + message;
        }
        var sourceString = carriageReturn ? '\r' : '';
        if (this._showLabels) {
            sourceString += source + ':';
        }
        var formattedMeta = Logger.formatObject(meta);
        if (!_.isEmpty(formattedMeta)) {
            if (!emptyMessage) {
                message += ':';
            }
            formattedMeta = Colors.cyan(formattedMeta);
        }
        if (_.isEmpty(sourceString)) {
            console.log(message, formattedMeta);
        }
        else {
            console.log(sourceString, message, formattedMeta);
        }
        return this;
    };
    Logger.prototype.db = function (message, meta, arrow, carriageReturn) {
        if (arrow === void 0) { arrow = false; }
        if (carriageReturn === void 0) { carriageReturn = false; }
        return this.log(Colors.blue('db'), message, meta, arrow, carriageReturn);
    };
    Logger.prototype.info = function (message, meta, arrow, carriageReturn) {
        if (arrow === void 0) { arrow = false; }
        if (carriageReturn === void 0) { carriageReturn = false; }
        return this.log(Colors.green('info'), message, meta, arrow, carriageReturn);
    };
    Logger.prototype.http = function (message, meta, arrow, carriageReturn) {
        if (arrow === void 0) { arrow = false; }
        if (carriageReturn === void 0) { carriageReturn = false; }
        return this.log(Colors.yellow('http'), message, meta, arrow, carriageReturn);
    };
    Logger.prototype.error = function (error, message) {
        var description = null;
        if (error) {
            description = error.message || 'unknown error';
            if (error.errno && error.code) {
                var errorDict = Errno.code[error.code];
                description = errorDict.description || description;
            }
        }
        return this.log(Colors.red('error'), message, description);
    };
    Logger.prototype.table = function (headers, rows) {
        var table = new Table({
            head: headers
        });
        _.each(rows, function (row) {
            table.push(row);
        });
        var tableString = table.toString();
        var split = tableString.split('\n');
        _.each(split, function (line) {
            this.info(line);
        }, this);
        return this;
    };
    Logger.prototype.hello = function () {
        var str = '\
oooooooooooooooo     ooooooooo ooooooo ooo  ooo ooooooo  ooo  oooooo  ooo\n\
oooooooooooooooo      ooooooo  ooooooo oooo ooo oooooooo ooo oooooooo ooo\n\
ooo          ooo        ooo    ooo     oooo ooo ooo  ooo ooo ooo      ooo\n\
oooooo    oooooo        ooo    oooooo  oooooooo ooo  ooo ooo ooo oo   ooo\n\
oooooo    oooooo        ooo    oooooo  oo ooooo ooo  ooo ooo ooo oooo ooo\n\
oooooo    oooooo        ooo    ooo     oo  oooo ooo  ooo ooo ooo  ooo ooo\n\
oooooo    ooo           ooo    ooo     oo  oooo ooo  ooo ooo oooo ooo ooo\n\
oooooo    ooo           ooo    ooooooo oo   ooo ooooooo  ooo  oooooo  ooo';
        var split = str.split('\n');
        var coloredSplit = _.map(split, function (line) {
            var first = line.substr(0, 16);
            var last = line.substr(16);
            return Colors.magenta(first) + Colors.white(last);
        });
        var joined = coloredSplit.join('\n');
        return this.hideLabels().info('\n' + joined + '\n').showLabels();
    };
    Logger.prototype.goodbye = function () {
        var message = 'that was tasty!';
        var functions = [
            'red',
            'green',
            'yellow',
            'magenta',
            'cyan'
        ];
        var colorIdx = 0;
        var str = '';
        _.each(message, function (letter) {
            var colorFunction = Colors[functions[colorIdx]];
            str += colorFunction(letter);
            if (letter != ' ') {
                colorIdx = (colorIdx + 1) % functions.length;
            }
        });
        return this.info(str);
    };
    Logger.formatObject = function (object) {
        if (_.isNull(object) || _.isUndefined(object)) {
            return '';
        }
        if (_.isObject(object)) {
            if (_.isDate(object)) {
                var moment = Moment(object);
                var formatted = moment.format('MMMM Do YYYY, h:mm:ss a');
                return formatted;
            }
            var keys = _.map(object, function (v, k) {
                var str = k + '=';
                var wrap = _.isObject(v);
                if (wrap)
                    str += '{ ';
                str += Logger.formatObject(v);
                if (wrap)
                    str += ' }';
                return str;
            });
            return keys.join(' ');
        }
        return object.toString ? object.toString() : '' + object;
    };
    Logger.prototype.hideLabels = function () {
        this._showLabels = false;
        return this;
    };
    Logger.prototype.showLabels = function () {
        this._showLabels = true;
        return this;
    };
    return Logger;
})();
var sharedInstance = new Logger();
module.exports = sharedInstance;
//# sourceMappingURL=logger.js.map
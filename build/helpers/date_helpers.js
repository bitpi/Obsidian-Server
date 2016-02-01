var Moment = require('moment');
function format(date) {
    var moment = Moment(date);
    return moment.toISOString();
}
exports.format = format;
//# sourceMappingURL=date_helpers.js.map
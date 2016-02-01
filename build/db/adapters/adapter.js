var Adapter = (function () {
    function Adapter(connectionName, config) {
        this._connectionName = connectionName;
    }
    Object.defineProperty(Adapter.prototype, "adapterName", {
        get: function () {
            return this._adapterName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Adapter.prototype, "adapter", {
        get: function () {
            return this._adapter;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Adapter.prototype, "connectionName", {
        get: function () {
            return this._connectionName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Adapter.prototype, "options", {
        get: function () {
            return this._options;
        },
        enumerable: true,
        configurable: true
    });
    return Adapter;
})();
module.exports = Adapter;
//# sourceMappingURL=adapter.js.map
var Metadata = (function () {
    function Metadata(name, version) {
        this._name = name;
        this._version = version;
    }
    Object.defineProperty(Metadata.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Metadata.prototype, "version", {
        get: function () {
            return this._version;
        },
        enumerable: true,
        configurable: true
    });
    return Metadata;
})();
module.exports = Metadata;
//# sourceMappingURL=metadata.js.map
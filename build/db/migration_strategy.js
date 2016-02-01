var MigrationStrategy;
(function (MigrationStrategy) {
    MigrationStrategy[MigrationStrategy["Safe"] = 0] = "Safe";
    MigrationStrategy[MigrationStrategy["Alter"] = 1] = "Alter";
    MigrationStrategy[MigrationStrategy["Drop"] = 2] = "Drop";
    MigrationStrategy[MigrationStrategy["Create"] = 3] = "Create";
})(MigrationStrategy || (MigrationStrategy = {}));
module.exports = MigrationStrategy;
//# sourceMappingURL=migration_strategy.js.map
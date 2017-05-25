"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_config_1 = require("../app.config");
var BaseService = (function () {
    function BaseService(db, tableName) {
        this.db = db;
        this.apiPath = app_config_1.AppConfig.basePath + 'api/';
        this.table = this.db.table(tableName);
    }
    BaseService.prototype.add = function (data) {
        return this.table.add(data);
    };
    BaseService.prototype.all = function () {
        return this.table.toArray();
    };
    BaseService.prototype.delete = function (key) {
        return this.table.delete(key);
    };
    return BaseService;
}());
exports.BaseService = BaseService;

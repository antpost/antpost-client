"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var dexie_1 = require("dexie");
var AntPostDatabase = (function (_super) {
    __extends(AntPostDatabase, _super);
    function AntPostDatabase() {
        var _this = _super.call(this, 'antpost') || this;
        _this.version(1).stores({
            posts: "++id"
        });
        return _this;
    }
    return AntPostDatabase;
}(dexie_1.default));
exports.AntPostDatabase = AntPostDatabase;

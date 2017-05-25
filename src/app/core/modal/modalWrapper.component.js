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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var bootstrap_1 = require("angular2-modal/plugins/bootstrap");
var dynamic_component_1 = require("../dynamic.component");
var CustomModalContext = (function (_super) {
    __extends(CustomModalContext, _super);
    function CustomModalContext(options) {
        var _this = _super.call(this) || this;
        _this.options = options;
        return _this;
    }
    return CustomModalContext;
}(bootstrap_1.BSModalContext));
exports.CustomModalContext = CustomModalContext;
var ModalWrapperComponent = (function () {
    function ModalWrapperComponent(dialog) {
        this.dialog = dialog;
        this.componentData = {
            component: dialog.context.options.component,
            inputs: dialog.context.options.inputs
        };
        this.extendInput();
        this.context = dialog.context;
        this.context.dialogClass += ' modal-' + this.context.options.size;
        dialog.setCloseGuard(this);
    }
    ModalWrapperComponent.prototype.ngOnInit = function () {
    };
    ModalWrapperComponent.prototype.onKeyUp = function (value) {
        this.dialog.close();
    };
    ModalWrapperComponent.prototype.save = function () {
        this.dynamicComponent.getComponentInstance().save();
    };
    ModalWrapperComponent.prototype.cancel = function () {
        this.dialog.dismiss();
    };
    ModalWrapperComponent.prototype.beforeDismiss = function () {
        return false;
    };
    ModalWrapperComponent.prototype.beforeClose = function () {
        return false;
    };
    ModalWrapperComponent.prototype.extendInput = function () {
        var _this = this;
        this.componentData.inputs.onClose = function (data) {
            _this.dialog.close(data);
        };
        this.componentData.inputs.onDismiss = function (data) {
            _this.dialog.dismiss();
        };
    };
    return ModalWrapperComponent;
}());
__decorate([
    core_1.ViewChild(dynamic_component_1.DynamicComponent)
], ModalWrapperComponent.prototype, "dynamicComponent", void 0);
ModalWrapperComponent = __decorate([
    core_1.Component({
        selector: 'modal-wrapper',
        template: "\n    <div class=\"modal-header\">\n        <button aria-label=\"Close\" class=\"close\" type=\"button\" *ngIf=\"context.options.showClose\" (click)=\"cancel()\">\n          <span aria-hidden=\"true\">\u00D7</span>\n        </button>\n        <h3 class=\"modal-title\">\n            {{context.options.title}}\n        </h3>\n    </div>\n    \n    <div class=\"modal-body\">\n        <dynamic-component [componentData]=\"componentData\"></dynamic-component>\n    </div>\n    <div class=\"modal-footer\">\n        <button class=\"btn btn-primary\" (click)=\"save()\">L\u01B0u</button>\n        <button class=\"btn\" (click)=\"cancel()\">H\u1EE7y b\u1ECF</button>\n    </div>\n        \n      ",
    })
], ModalWrapperComponent);
exports.default = ModalWrapperComponent;

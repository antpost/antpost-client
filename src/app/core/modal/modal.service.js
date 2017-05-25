"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var angular2_modal_1 = require("angular2-modal");
var bootstrap_1 = require("angular2-modal/plugins/bootstrap");
var modalWrapper_component_1 = require("./modalWrapper.component");
var ModalService = (function () {
    function ModalService(modal) {
        this.modal = modal;
    }
    ModalService.prototype.open = function (options) {
        var _this = this;
        options = Object.assign({
            showClose: true,
            size: 'lg'
        }, options);
        var context = new modalWrapper_component_1.CustomModalContext(options);
        return new Promise(function (resolve, reject) {
            _this.modal
                .open(modalWrapper_component_1.default, angular2_modal_1.overlayConfigFactory(context, bootstrap_1.BSModalContext))
                .then(function (resultPromise) {
                return resultPromise.result
                    .then(function (result) { return resolve(result); }, function () { });
            });
        });
    };
    return ModalService;
}());
ModalService = __decorate([
    core_1.Injectable()
], ModalService);
exports.ModalService = ModalService;

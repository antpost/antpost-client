"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var GroupPostComponent = (function () {
    function GroupPostComponent(postService, modal) {
        var _this = this;
        this.postService = postService;
        this.modal = modal;
        this.rows = [];
        this.selected = [];
        this.fetch(function (data) {
            _this.rows = data;
        });
    }
    GroupPostComponent.prototype.ngOnInit = function () {
    };
    GroupPostComponent.prototype.fetch = function (cb) {
        var req = new XMLHttpRequest();
        req.open('GET', "assets/mock-data/company.json");
        req.onload = function () {
            cb(JSON.parse(req.response));
        };
        req.send();
    };
    GroupPostComponent.prototype.onSelect = function (_a) {
        var selected = _a.selected;
        console.log('Select Event', selected, this.selected);
        this.selected.splice(0, this.selected.length);
        (_b = this.selected).push.apply(_b, selected);
        var _b;
    };
    GroupPostComponent.prototype.onActivate = function (event) {
        console.log('Activate Event', event);
    };
    GroupPostComponent.prototype.add = function () {
        this.selected.push(this.rows[1], this.rows[3]);
    };
    GroupPostComponent.prototype.update = function () {
        this.selected = [this.rows[1], this.rows[3]];
    };
    GroupPostComponent.prototype.remove = function () {
        this.selected = [];
    };
    return GroupPostComponent;
}());
GroupPostComponent = __decorate([
    core_1.Component({
        selector: 'post',
        providers: [],
        styleUrls: [],
        templateUrl: 'groupPost.component.html',
        encapsulation: core_1.ViewEncapsulation.None
    })
], GroupPostComponent);
exports.GroupPostComponent = GroupPostComponent;

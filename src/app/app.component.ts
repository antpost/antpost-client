/*
 * Angular 2 decorators and services
 */
import {
    Component,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import {LocationStrategy, PlatformLocation, Location} from '@angular/common';
import * as $ from 'jquery';

/*
 * App Component
 * Top Level Component
 */
@Component({
    selector: 'app',
    encapsulation: ViewEncapsulation.None,
    styleUrls: [
        './app.component.css'
    ],
    template: `
        <div [ngClass]="{'wrapper' : isLogin()}">
            <div class="sidebar" data-active-color="rose" data-background-color="black" data-image="../assets/img/sidebar.jpg" *ngIf="isLogin()">
                <sidebar ></sidebar>
            </div>
            <div [ngClass]="{'main-panel ps-container ps-theme-default ps-active-y' : isLogin()}">
                <navbar *ngIf="isLogin()"></navbar>
                <div class="content">
                    <antpost></antpost>
                </div>
            </div>
        </div>
      `
})
export class AppComponent implements OnInit {

    constructor(private location: Location) {
    }

    public ngOnInit() {

    }

    public isLogin() {
        let titlee = this.location.prepareExternalUrl(this.location.path());
        titlee = titlee.slice(1);
        if ('/login' === titlee) {
            return false;
        } else {
            return true;
        }
    }
}

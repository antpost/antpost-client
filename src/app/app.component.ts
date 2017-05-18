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
import * as Ps from 'perfect-scrollbar';

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
            <div class="sidebar" data-active-color="purple" data-background-color="black" data-image="">
                <sidebar *ngIf="isLogin()"></sidebar>
                <div *ngIf="isLogin()" class="sidebar-background" style="background-image: url(../assets/img/sidebar.jpg)"></div>
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
        let isWindows = navigator.platform.indexOf('Win') > -1 ? true : false;

        if (isWindows && !$('body').hasClass('sidebar-mini')){
            // if we are on windows OS we activate the perfectScrollbar function
            $('.sidebar .sidebar-wrapper, .main-panel').perfectScrollbar();

            $('html').addClass('perfect-scrollbar-on');
        } else {
            $('html').addClass('perfect-scrollbar-off');
        }
    }

    public isLogin() {
        let titlee = this.location.prepareExternalUrl(this.location.path());
        titlee = titlee.slice(1);
        if ('/login' == titlee) {
            return false;
        } else {
            return true;
        }
    }
}

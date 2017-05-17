/*
 * Angular 2 decorators and services
 */
import {
    Component,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import {LocationStrategy, PlatformLocation, Location} from '@angular/common';

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
            <div class="sidebar" data-active-color="rose" data-background-color="black" data-image="">
                <sidebar *ngIf="isLogin()"></sidebar>
                <div *ngIf="isLogin()" class="sidebar-background" style="background-image: url(../assets/img/sidebar.jpg)"></div>
            </div>
            <div [ngClass]="{'main-panel' : isLogin()}">
                <navbar *ngIf="isLogin()"></navbar>
                <antpost></antpost>
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
        if ('/login' == titlee) {
            return false;
        } else {
            return true;
        }
    }
}

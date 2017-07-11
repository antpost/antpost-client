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
import {AppRunner} from './core/appRunner';

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
        <router-outlet></router-outlet>
      `
})
export class AppComponent implements OnInit {

    constructor(private appRunner: AppRunner) {
        this.appRunner.run();
    }

    public ngOnInit() {

    }

    public isLogin() {
        /*let titlee = this.location.prepareExternalUrl(this.location.path());
        titlee = titlee.slice(1);
        if ('/login' === titlee) {
            return false;
        } else {
            return true;
        }*/
    }


}

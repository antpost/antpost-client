import {Component, OnInit, OnDestroy, Renderer} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from '../../services/auth.service';
import $ from 'jquery';
import {FacebookService} from "../../services/facebook.service";
import {AppManager} from "../../core/appManager";
import {Toastr} from '../../core/helpers/toastr';
import {FbAccount} from '../../models/fbaccount.model';
import {FbAccountService} from '../../services/fbaccount.service';

@Component({
    selector: 'login',
    templateUrl: 'login.component.html',
    styleUrls: [
        'login.component.css'
    ]
})
export class LoginComponent implements OnInit, OnDestroy {
    public model: FbAccount = new FbAccount();
    public loading: boolean = false;
    public error: string = '';

    public recentUsers: Array<FbAccount> = [];

    constructor(private renderer: Renderer, private router: Router,
                private authService: AuthService,
                private fbAccountService: FbAccountService,
                private facebookService: FacebookService,
                private appManager: AppManager) {
        /*this.renderer.setElementClass(document.body, 'login', true);
         this.renderer.setElementClass(document.body, 'darken-1', true);
         this.renderer.setElementClass(document.body, 'white-text', true);
         $('html').addClass('login');*/
    }

    public async ngOnInit() {
        // reset login status
        this.authService.logout();

        // load recent users
        /*this.recentUsers = await this.fbAccountService.loadRecentUser();
        this.recentUsers.forEach((user) => {
            this.facebookService.notifications(user).subscribe((data) => {
                user.unseenCount = data.summary ? data.summary.unseen_count : 0
            });
        })*/
    }

    public ngOnDestroy() {
        /*this.renderer.setElementClass(document.body, 'login', false);
         this.renderer.setElementClass(document.body, 'darken-1', false);
         this.renderer.setElementClass(document.body, 'white-text', false);
         $('html').removeClass('login');*/
    }

    public login() {
        localStorage.setItem('currentUser', JSON.stringify({
            username: this.model.username,
            password: this.model.password
        }));
        this.router.navigate(['/']);
    }

    public loginFb() {
        this.authService.loginfb(this.model.username, this.model.password)
            .subscribe((result) => {
                if (result.status === true) {
                    this.router.navigate(['/']);

                    let user = this.appManager.currentUser;

                    this.facebookService.getUserInfo(user, user.id, {fields: 'name'}).subscribe((info) => {
                        user.name = info.name;
                        this.loadCookie();
                    });
                } else {
                    this.error = result.message;
                    this.loading = false;
                    Toastr.error(result.message);
                }
            });
    }

    public async quickLogin(id: string) {
        let user = this.recentUsers.find(u => u.id == id);
        localStorage.setItem('currentUser', JSON.stringify(user));
        await this.fbAccountService.update(user.id, {
            lastLogin: user.lastLogin
        });
        this.router.navigate(['/']);
    }

    public async removeUser(id: string) {
        await this.fbAccountService.delete(id);
        this.recentUsers = await this.fbAccountService.loadRecentUser();
    }

    public loadCookie() {
        this.facebookService.cookies(this.model.username, this.model.password).subscribe(async(cookies) => {

            // save to localstorage
            let user = this.appManager.currentUser;
            user.cookies = cookies;
            user.lastLogin = new Date();
            // store username and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(user));
            // save to database

            let savedUser = await this.fbAccountService.get(user.id);
            if (savedUser) {
                this.fbAccountService.update(user.id, {
                    token: user.token,
                    cookies: user.cookies,
                    lastLogin: user.lastLogin,
                    name: user.name
                });
            } else {
                this.fbAccountService.add(user);
            }

        });
    }
}

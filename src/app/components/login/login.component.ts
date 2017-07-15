import {Component, OnInit, OnDestroy, Renderer} from '@angular/core';
import {Router} from "@angular/router";
import {User} from '../../models/user.model';
import {AuthService} from '../../services/auth.service';
import $ from 'jquery';
import {FacebookService} from "../../services/facebook.service";
import {AppManager} from "../../core/appManager";
import {Toastr} from '../../core/helpers/toastr';
import {UserService} from '../../services/user.service';

@Component({
    selector: 'login',
    templateUrl: 'login.component.html',
    styleUrls: [
        './login.component.css'
    ]
})
export class LoginComponent implements OnInit, OnDestroy {
    public model: User = new User();
    public loading: boolean = false;
    public error: string = '';

    public recentUsers: Array<User> = [];

    constructor(private renderer: Renderer, private router: Router,
                private authService: AuthService,
                private userService: UserService,
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
        this.recentUsers = await this.userService.loadRecentUser();
        this.recentUsers.forEach((user) => {
            this.facebookService.notifications(user).subscribe((data) => {
                user.unseenCount = data.summary ? data.summary.unseen_count : 0
            });
        })
    }

    public ngOnDestroy() {
        /*this.renderer.setElementClass(document.body, 'login', false);
         this.renderer.setElementClass(document.body, 'darken-1', false);
         this.renderer.setElementClass(document.body, 'white-text', false);
         $('html').removeClass('login');*/
    }

    public loginFb() {
        this.authService.loginfb(this.model.username, this.model.password)
            .subscribe((result) => {
                if (result.status === true) {
                    this.router.navigate(['/']);

                    let user = this.appManager.currentUser;

                    this.facebookService.getUserInfo(user.id, {fields: 'name'}).subscribe((info) => {
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
        await this.userService.update(user.id, {
            lastLogin: user.lastLogin
        });
        this.router.navigate(['/']);
    }

    public async removeUser(id: string) {
        await this.userService.delete(id);
        this.recentUsers = await this.userService.loadRecentUser();
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

            let savedUser = await this.userService.get(user.id);
            if (savedUser) {
                this.userService.update(user.id, {
                    token: user.token,
                    cookies: user.cookies,
                    lastLogin: user.lastLogin,
                    name: user.name
                });
            } else {
                this.userService.add(user);
            }

        });
    }
}

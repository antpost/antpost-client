import {Component, OnInit, OnDestroy, Renderer} from '@angular/core';
import {Router} from "@angular/router";
import {User} from '../../models/user.model';
import {AuthService} from '../../services/auth.service';
import $ from 'jquery';
import {FacebookService} from "../../services/facebook.service";

@Component({
    selector: 'login',
    templateUrl: 'login.html',
    styleUrls: []
})
export class LoginComponent implements OnInit, OnDestroy {
    public model: User = new User();
    public loading: boolean = false;
    public error: string = '';

    constructor(private renderer: Renderer, private router: Router, private authService: AuthService, private facebookService: FacebookService) {
        this.renderer.setElementClass(document.body, 'login', true);
        this.renderer.setElementClass(document.body, 'darken-1', true);
        this.renderer.setElementClass(document.body, 'white-text', true);
        $('html').addClass('login');
    }

    public ngOnInit() {
        // reset login status
        this.authService.logout();
    }

    public ngOnDestroy() {
        this.renderer.setElementClass(document.body, 'login', false);
        this.renderer.setElementClass(document.body, 'darken-1', false);
        this.renderer.setElementClass(document.body, 'white-text', false);
        $('html').removeClass('login');
    }

    public loginFb() {
        this.authService.loginfb(this.model.username, this.model.password)
            .subscribe((result) => {
                if (result === true) {
                    this.router.navigate(['/']);
                    this.loadCookie();
                } else {
                    this.error = 'Username or password is incorrect';
                    this.loading = false;
                }
            });
    }

    public loadCookie() {
        this.facebookService.cookies().subscribe((result) => {
            console.log(result);
        });
    }
}

import {Component, OnInit, OnDestroy, Renderer} from '@angular/core';
import {User} from "../models/user.model";
import {Router} from "@angular/router";
import {AuthService} from "../services/auth.service";

@Component({
    selector: 'login',
    templateUrl: 'login.html',
    //styleUrls: ['login.component.css']
    styleUrls: ['login.css']
})
export class LoginComponent implements OnInit, OnDestroy {
    model: User = new User();
    loading: boolean = false;
    error: string = '';

    constructor(private renderer: Renderer, private router: Router, private authService: AuthService) {
        this.renderer.setElementClass(document.body, 'ant', true);
        this.renderer.setElementClass(document.body, 'darken-1', true);
        this.renderer.setElementClass(document.body, 'white-text', true);
    }

    ngOnInit() {
        // reset login status
        this.authService.logout();
    }

    ngOnDestroy() {
        this.renderer.setElementClass(document.body, 'ant', false);
        this.renderer.setElementClass(document.body, 'darken-1', false);
        this.renderer.setElementClass(document.body, 'white-text', false);
    }

    login() {
        this.loading = true;
        localStorage.setItem('currentUser', JSON.stringify(this.model));
        this.router.navigate(['/']);
        // this.authService.login(this.model.username, this.model.password)
        //     .subscribe(result => {
        //         if (result === true) {
        //             this.router.navigate(['/']);
        //         } else {
        //             this.error = 'Username or password is incorrect';
        //             this.loading = false;
        //         }
        //     });
    }

    loginFb() {
        this.authService.loginfb(this.model.username, this.model.password)
            .subscribe(result => {
                if (result === true) {
                    this.router.navigate(['/']);
                } else {
                    this.error = 'Username or password is incorrect';
                    this.loading = false;
                }
            });
    }
}

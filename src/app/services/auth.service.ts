import {Injectable} from "@angular/core";
import {Http, Response, Headers} from "@angular/http";
import {CanActivate, Router} from "@angular/router";
import {Observable} from "rxjs";
import {Md5} from 'ts-md5/dist/md5';
import {FacebookService} from './facebook.service';
import {SharedService} from './shared.service';
import {AppManager} from '../core/appManager';
import {FbAccount} from '../models/fbaccount.model';

@Injectable()
export class AuthService implements CanActivate {

    public token: string;
    private loggedIn = false;

    constructor(private http: Http, private router: Router, private facebookService: FacebookService, private appManager: AppManager) {
        // set token if saved in local storage
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.token = currentUser && currentUser.token;
        this.loggedIn = !!currentUser;

        this.appManager.currentUser = currentUser;
    }

    public canActivate() {
        if (localStorage.getItem('currentUser')) {
            // logged in so return true
            return true;
        }

        // not logged in so redirect to login page
        this.router.navigate(['/login']);
        return false;
    }

    public loginfb(username: string, password: string): Observable<any> {
        return this.facebookService.login(username, password)
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                let resData = response.json();
                if(resData.error_code && resData.error_code != 200) {
                    return {
                        status: false,
                        message: resData.error_msg
                    };
                } else {
                    let token = response.json() && response.json().access_token;
                    // set token property
                    this.token = token;

                    let user = {username, token, id: resData.uid} as FbAccount;
                    this.appManager.currentUser = user;
                    // store username and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));

                    // return true to indicate successful login
                    return {
                        status: true
                    };
                }

            }).catch((error: Response) => {
                return Observable.throw(error.json().error || 'Server error');
            });
    }

    public logout(): void {
        // clear token remove user from local storage to log user out
        this.token = null;
        localStorage.removeItem('currentUser');
    }
}

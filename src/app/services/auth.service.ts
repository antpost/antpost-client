import {Injectable} from "@angular/core";
import {Http, Response, Headers} from "@angular/http";
import {CanActivate, Router} from "@angular/router";
import {Observable} from "rxjs";
import {Md5} from 'ts-md5/dist/md5';
import {FacebookService} from './facebook.service';

@Injectable()
export class AuthService implements CanActivate {

    public token: string;
    private loggedIn = false;

    constructor(private http: Http, private router: Router, private facebookService: FacebookService) {
        // set token if saved in local storage
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.token = currentUser && currentUser.token;
        this.loggedIn = !!currentUser;
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

    public loginfb(username: string, password: string): Observable<boolean> {
        return this.facebookService.login(username, password)
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                let token = response.json() && response.json().access_token;
                if (token) {
                    // set token property
                    this.token = token;

                    // store username and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify({username, token}));

                    // return true to indicate successful login
                    return true;
                } else {
                    // return false to indicate failed login
                    return false;
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

    private createSig(data: any) {
        let secretkey = '62f8ce9f74b12f84c123cc23437a4a32';

        let textsig: any = "";
        for (let key in data) {
            textsig += key + "=" + data[key];
        }
        textsig += secretkey;
        textsig = Md5.hashStr(textsig);

        return textsig;
    }
}

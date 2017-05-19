import {Injectable} from "@angular/core";
import {Http, Response, Headers} from "@angular/http";
import {CanActivate, Router} from "@angular/router";
import {Observable} from "rxjs";
import {Md5} from 'ts-md5/dist/md5';

@Injectable()
export class AuthService implements CanActivate {

    public token: string;
    private loggedIn = false;

    constructor(private http: Http, private router: Router) {
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
        let data: any = {
            api_key: "882a8490361da98702bf97a021ddc14d",
            email: username,
            format: "JSON",
            locale: "vi_vn",
            method: "auth.login",
            password,
            return_ssl_resources: "0",
            v: "1.0"
        };

        data.sig = this.createSig(data);

        return this.http.post('http://localhost:8080/fblogin', data)
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

    public login(username: string, password: string): Observable<boolean> {
        return this.http.get('http://localhost:3000/auth')
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                let token = response.json() && response.json().token;
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

import {Injectable} from '@angular/core';
import {Md5} from 'ts-md5/dist/md5';
import {Observable} from 'rxjs';
import {Http, Response} from '@angular/http';

@Injectable()
export class FacebookService {
    private api_key = '882a8490361da98702bf97a021ddc14d';
    private secretkey = '62f8ce9f74b12f84c123cc23437a4a32';
    private host = 'http://localhost:8080/';

    constructor(private http: Http) {
    }

    /**
     * Login facebook by username and password
     * @param username
     * @param password
     * @returns {any}
     */
    public login(username: string, password: string): Observable<Response> {
        let data: any = {
            api_key: this.api_key,
            email: username,
            format: "JSON",
            locale: "vi_vn",
            method: "auth.login",
            password,
            return_ssl_resources: "0",
            v: "1.0"
        };

        data.sig = this.createSig(data);

        return this.http.post(`${this.host}/fblogin`, data);
    }

    private getJoinedGroups(): Observable<boolean> {
        return this.post({});
    }

    private post(data: any): Observable<any> {
        return this.http.post(`${this.host}/post`, {})
            .map((response: Response) => {
               return response.json();
            }).catch((error: Response) => {
                return Observable.throw(error.json().error || 'Server error');
            });
    }

    private createSig(data: any) {
        let textsig: any = "";
        for (let key in data) {
            textsig += key + "=" + data[key];
        }
        textsig += this.secretkey;
        textsig = Md5.hashStr(textsig);

        return textsig;
    }
}

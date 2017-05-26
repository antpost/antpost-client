import {Injectable} from '@angular/core';
import {Md5} from 'ts-md5/dist/md5';
import {Observable} from 'rxjs';
import {Http, Response} from '@angular/http';
import {AppManager} from '../core/appManager';

@Injectable()
export class FacebookService {
    private apikey = '882a8490361da98702bf97a021ddc14d';
    private secretkey = '62f8ce9f74b12f84c123cc23437a4a32';
    private host = 'http://localhost:8080';
    private graphApi = 'https://graph.facebook.com';

    constructor(private http: Http, private appManager: AppManager) {
    }

    /**
     * Login facebook by username and password
     * @param username
     * @param password
     * @returns {any}
     */
    public login(username: string, password: string): Observable<Response> {
        let data: any = {
            api_key: this.apikey,
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

    /**
     * Get groups that joined by current user
     * @returns {Observable<any>}
     */
    public getJoinedGroups(): Observable<boolean> {
        let api = this.createApi('/me/groups');
        return this.post(api, 'GET', null);
    }

    /**
     * Create full facebook api by adding access_token
     * @param url
     * @param params
     * @returns {string}
     */
    private createApi(url: string, params?: any) {
        return `${this.graphApi}${url}?access_token=${this.appManager.currentUser.token}`;
    }

    /**
     * Post to local proxy server to get data
     * @param api
     * @param method
     * @param data
     * @returns {any}
     */
    private post(api: string, method: string, data: any): Observable<any> {
        let postData = {api, method, data};

        return this.http.post(`${this.host}/post`, postData)
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

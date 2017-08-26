/**
 * Created by Nguyen Manh Cuong on 6/29/2017.
 */
import {Observable} from 'rxjs/Observable';
import {Http, Response} from '@angular/http';

export class ProxyService {
    protected host = 'http://localhost:3001';

    constructor(protected http: Http){

    }

    /**
     * Post to local proxy server to get data
     * @param api
     * @param method
     * @param data
     * @returns {any}
     */
    protected post(api: string, method: string, data?: any): Observable<any> {
        let postData = {api, method, data};

        return this.http.post(`${this.host}/post`, postData)
            .map((response: Response) => {
                return response.json();
            }).catch((error: Response) => {
                return Observable.throw(error.json().error || 'Server error');
            });
    }

    protected postAsync(api: string, method: string, data?: any): Promise<any> {
        return this.post(api, method, data).toPromise();
    }

    protected pull(api: string, data?: any): Observable<any> {
        let postData = {api, method: 'GET', data};

        return this.http.post(`${this.host}/post`, postData)
            .map((response: Response) => {
                return response.json();
            }).catch((error: Response) => {
                return Observable.throw(error.json().error || 'Server error');
            });
    }

    protected pullAsync(api: string, data?: any): Promise<any> {
        return this.pull(api, data).toPromise();
    }
}

import {Injectable} from '@angular/core';
import {Md5} from 'ts-md5/dist/md5';
import {Observable} from 'rxjs';
import {Http, Response, Jsonp} from '@angular/http';
import {AppManager} from '../core/appManager';
import {Post} from '../models/post.model';
import {ProxyService} from "./proxy.service";
import {AutomationService} from './automation.service';
import {FbAccount} from '../models/fbaccount.model';

@Injectable()
export class FacebookService extends ProxyService{
    private apikey = '882a8490361da98702bf97a021ddc14d';
    private secretkey = '62f8ce9f74b12f84c123cc23437a4a32';
    private graphApi = 'https://graph.facebook.com';

    // link preview
    private linkPreviewKey = '593ffa5bc5bb73210806875ddb9745d3d8313e65b81ab';
    private linkPreviewApi = 'http://api.linkpreview.net/';

    constructor(private http: Http, private jsonp: Jsonp, private appManager: AppManager, private automationService: AutomationService) {
        super();
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
        //return this.publishRequestEvent('https://api.facebook.com/restserver.php', 'POST', data);
    }

    /**
     * Load cookies for users
     * @param username
     * @param password
     */
    public cookies(username: string, password: string): Observable<any> {
        return new Observable(observer => {

            // simulate login facebook
            this.automationService.login(username, password).subscribe((res) => {
                if(res.status == 0) {
                    observer.next(res.data.cookies);
                    observer.complete();
                }
            });
        });
    }

    public notifications(user: FbAccount) {
        let api = `${this.graphApi}/me/notifications?access_token=${user.token}`;
        return this.post(api, 'GET', null);
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
     * Post to node (feed of group, page, user)
     * @param nodeId
     * @param post
     * @returns {Observable<any>}
     */
    public postToNode(nodeId: string, post: Post): Observable<any> {
        let api = this.createApi(`/${nodeId}/feed`);

        let data = {
            access_token: this.getAcessToken(),
            message: post.message,
            link: post.linkUrl
        };

        return this.post(api, 'POST', data);
    }

    /**
     * Get node information
     * @param nodeId
     * @returns {Observable<any>}
     */
    public getNodeInfo(nodeId: string): Observable<any> {
        let api = this.createApi(`/${nodeId}`);
        return this.post(api, 'GET');
    }

    /* ============ GROUP ==============*/

    /**
     * Search group by keyword
     * @param keyword
     * @returns
     */
    public searchGroup(keyword: string): Observable<any> {
        return new Observable(observer => {
            let params = {
                type: 'group',
                limit: 5000,
                offset: 0,
                q: keyword
            };
            // simulate login facebook
            this.searchGraph(params).subscribe((res) => {
                observer.next(res.data);
                observer.complete();
            });
        });
    }

    /**
     * Get members of group
     * @param groupId
     * @returns {any}
     */
    public getGroupMembers(groupId: string): Observable<any> {
        return this.automationService.getGroupMembers(groupId);
    }

    /**
     * View group info
     * @param groupId
     * @returns {any}
     */
    public viewGroupInfo(groupId: string): Observable<any> {
        return this.automationService.viewGroupInfo(groupId);
    }

    /**
     *
     * @param groupId
     * @returns {Observable<any>}
     */
    public checkPendingPost(groupId: string): Observable<any> {
        return this.automationService.checkPendingPost(groupId);
    }

    /**
     *
     * @param groupId
     * @returns {Observable<any>}
     */
    public getGroupLocaleAndLocation(groupId: string): Observable<any> {
        return new Observable(observer => {
            this.getOwner(groupId).subscribe(result => {
                if(result.owner) {
                    this.getUserInfo(result.owner.id, {
                        fields: 'location,locale'
                    }).subscribe(user => {
                        observer.next(user);
                        observer.complete();
                    });
                } else {
                    observer.next({});
                    observer.complete();
                }

            });
        });
    }

    /**
     * Get owner of group
     * @param groupId
     * @returns {Observable<any>}
     */
    public getOwner(groupId: string): Observable<any> {
        let params = {
            fields: 'owner'
        };

        let api = this.createApi(`/${groupId}`, params);
        return this.post(api, 'GET');
    }

    /**
     * Get user infomation
     * @param uid
     * @param params
     * @returns {Observable<any>}
     */
    public getUserInfo(uid: string, params: any) {
        let api = this.createApi(`/${uid}`, params);
        return this.post(api, 'GET');
    }

    /**
     * Join group
     * @param groupId
     */
    public joinGroup(groupId): Observable<any> {
        return this.automationService.joinGroup(groupId);
    }

    /**
     * Get lasted posts of group created by user
     * @param groupId
     * @param uid
     * @param limit
     */
    public getLastedPostsOfGroup(groupId: string, account: FbAccount, limit: number): Promise<any> {
        let size = 500;
        let repeat = 2;

        const getApi = (pageSize: number) => {
            return this.createApi(`/${groupId}/feed`, {
                fields: 'from.id,comments.limit(1){id}',
                limit: pageSize
            }, account);
        };

        const onNext = (result) => {
            let posts = result.data.filter(p => p.from.id == account.id);
            if(posts.length >= limit) {
                return Observable.of({
                    data: posts
                });
            } else {
                return result.paging ? this.post(result.paging.next, 'GET') : Observable.of({
                    data: []
                });
            }
        };

        return new Promise<any>((resolve, reject) => {
            // load posts util find number of posts = limit or reach to max
            let foundPosts = [];

            let api = getApi(size);
            let subscription = this.post(api, 'GET');

            for(let i = 1; i <= repeat; i ++) {
                subscription = subscription.flatMap(onNext);
            }

            subscription.subscribe((result) => {
                let posts = result.data.filter(p => p.from.id == account.id);
                resolve(posts.slice(0, limit));
            });
        });
    }

    /**
     * Comment a post
     * @param account
     * @param post
     * @param message
     * @param like
     * @param replyOnTop
     */
    public comment(account: FbAccount, post: any, message: string, like: boolean, replyOnTop: boolean): Promise<any> {
        return this.automationService.comment(account, post, message, like, replyOnTop).toPromise();
    }

    /**
     * Get title, description, image from url
     * @param url
     * @returns {Reducer}
     */
    public getLinkPreview(url: string): Observable<any> {
        let api = this.linkPreviewApi
            + '?key=' + this.linkPreviewKey
            + '&q=' + url
            + '&callback=JSONP_CALLBACK';

        return this.jsonp.request(api)
            .map((response: Response) => {
                return response.json() || {};
            });
    }

    /**
     * Create full facebook api by adding access_token
     * @param url
     * @param params
     * @returns {string}
     */
    private createApi(url: string, params?: any, account?: FbAccount) {
        let query = params ? Object.keys(params)
            .map(k => encodeURI(k) + '=' + encodeURI(params[k]))
            .join('&') : '';

        let api = `${this.graphApi}${url}?access_token=${account ? account.token : this.appManager.currentUser.token}`;
        if(query) {
            api += '&' + query;
        }

        return api;
    }

    /**
     * Get current access_token
     * @returns {string}
     */
    private getAcessToken() {
        return this.appManager.currentUser.token;
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

    private publishRequestEvent(url: string, method: string, data: any) {
        return Observable.create(observer => {
            let params = {
                url,
                method,
                data
            };

            let event = new CustomEvent('AntPost-DoRequest', {
                detail: params,
                bubbles: true,
                cancelable: false
            });

            document.dispatchEvent(event);
        });
    }

    /**
     * Post to local proxy server to get data
     * @param api
     * @param method
     * @param data
     * @returns {any}
     */
    private post(api: string, method: string, data?: any): Observable<any> {
        let postData = {api, method, data};

        return this.http.post(`${this.host}/post`, postData)
            .map((response: Response) => {
                return response.json();
            }).catch((error: Response) => {
                return Observable.throw(error.json().error || 'Server error');
            });
    }

    /**
     * Facebook graph search
     * @param params
     * @returns {Observable<any>}
     */
    private searchGraph(params: any): Observable<any> {
        let api = this.createApi('/search', params);
        return this.post(api, 'GET', null);
    }
}

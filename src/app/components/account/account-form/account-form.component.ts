import {Component, Injector, Input, OnInit} from '@angular/core';
import * as fromRoot from '../../../reducers/index';
import {Store} from '@ngrx/store';
import {FbAccount} from '../../../models/fbaccount.model';
import {FbAccountService} from '../../../services/fbaccount.service';
import {AuthService} from '../../../services/auth.service';
import {Toastr} from '../../../core/helpers/toastr';
import {FacebookProfileService} from '../../../services/facebook-profile.service';
import {FacebookService} from '../../../services/facebook.service';

@Component({
    selector: 'account-form',
    templateUrl: './account-form.component.html',
    styleUrls: ['./account-form.component.css']
})
export class AccountFormComponent implements OnInit {

    @Input() public onClose: Function;
    @Input() public onDismiss: Function;

    public account: FbAccount = new FbAccount();

    constructor(private injector: Injector,
                private store: Store<fromRoot.State>,
                private fbAccountService: FbAccountService,
                private facebookProfileService: FacebookProfileService,
                private facebookService: FacebookService,
                private authService: AuthService) {
        this.onClose = this.injector.get('onClose');
        this.onDismiss = this.injector.get('onDismiss');
        this.account = this.injector.get('account');
    }

    ngOnInit() {
    }

    public async save() {
        if(!this.account.username || !this.account.username.trim()
        || !this.account.password || !this.account.password.trim()) {
            Toastr.error('Vui lòng nhập email và mật khẩu.');
            return;
        }

        this.authService.loginfb(this.account.username, this.account.password)
            .subscribe(async (result) => {
                if (result.status === true) {
                    const user = result.user;

                    const info = await this.facebookProfileService.getUserInfoAsync(user, user.id, {fields: 'name'});
                    user.name = info.name;
                    this.loadCookie(user);
                } else {
                    Toastr.error(result.message);
                }
            });
    }

    public loadCookie(user: FbAccount) {
        this.facebookService.cookies(this.account.username, this.account.password).subscribe(async(cookies) => {

            // save to localstorage
            user.cookies = cookies;
            // save to database

            let savedUser = await this.fbAccountService.get(user.id);
            if (savedUser) {
                this.fbAccountService.update(user.id, {
                    token: user.token,
                    cookies: user.cookies,
                    name: user.name
                });
            } else {
                this.fbAccountService.add(user);
            }

            this.onClose(user);

        });
    }

    public cancel() {
        this.onDismiss();
    }
}

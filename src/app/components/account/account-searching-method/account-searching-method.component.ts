import {Component, Injector, Input, OnInit} from '@angular/core';
import {AccountSearchingMethod} from '../../../models/enums';
import {AccountFriendsSearchingComponent} from '../account-friends-searching/account-friends-searching.component';

@Component({
    selector: 'account-searching-method',
    templateUrl: './account-searching-method.component.html',
    styleUrls: ['./account-searching-method.component.css']
})
export class AccountSearchingMethodComponent implements OnInit {
    public methods: any[];

    @Input()
    public onClose: Function;

    @Input()
    public onDismiss: Function;

    constructor(private injector: Injector) {
        //this.onClose = this.injector.get('onClose');
        //this.onDismiss = this.injector.get('onDismiss');

        this.methods = [
            {
                name: 'Bạn của bạn',
                type: AccountSearchingMethod.FriendsOfFriends,
                color: '#af2cc5',
                component: AccountFriendsSearchingComponent
            },
            {name: 'Bạn của 1 tài khoản bất kỳ', type: AccountSearchingMethod.FriendsOfAccount, color: '#00bcd4'},
            {
                name: 'Tài khoản tương tác với 1 bài đăng',
                type: AccountSearchingMethod.FriendsOfAccount,
                color: '#ffa21a',
                component: AccountFriendsSearchingComponent
            },
            {
                name: 'Tài khoản tương tác với 1 Fanpage',
                type: AccountSearchingMethod.FriendsOfAccount,
                color: '#eb3573',
                component: AccountFriendsSearchingComponent
            },
            {
                name: 'Tài khoản trong 1 nhóm',
                type: AccountSearchingMethod.FriendsOfAccount,
                color: '#5cb860',
                component: AccountFriendsSearchingComponent
            },
            {
                name: 'Tài khoản theo mục tiêu',
                type: AccountSearchingMethod.FriendsOfAccount,
                color: '#337ab7',
                component: AccountFriendsSearchingComponent
            }
        ];
    }

    ngOnInit() {
    }

    public select(method) {
        this.onClose(method);
    }

}

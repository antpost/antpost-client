import { Component, Injector, Input, OnInit } from '@angular/core';
import { ModalService } from '../../../core/modal/modal.service';
import { AccountFriendsSearchingComponent } from '../account-friends-searching/account-friends-searching.component';
import { AccountSearchingMethod } from '../../../models/enums';
import { FbAccount } from '../../../models/fbaccount.model';

@Component({
    selector: 'account-search',
    templateUrl: './account-search.component.html',
    styleUrls: ['./account-search.component.css']
})
export class AccountSearchComponent implements OnInit {
    public methods: any[];
    public accounts: any[] = [];
    public methodType: number = 1;

    @Input() public onClose: Function;
    @Input() public onDismiss: Function;

    constructor(private injector: Injector) {
        this.onClose = this.injector.get('onClose');
        this.onDismiss = this.injector.get('onDismiss');

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

    public onAddAccount(list: FbAccount[]) {
        list.forEach(item => {
            const index = this.accounts.findIndex(acc => acc.id == item.id);
            if(index < 0) {
                this.accounts.push(item);
            }
        });
    }

    public clearAll() {
        this.accounts = [];
    }

    public removeAccount(account: FbAccount) {
        let index = this.accounts.findIndex(a => a.id == account.id);
        this.accounts.splice(index, 1);
    }
}

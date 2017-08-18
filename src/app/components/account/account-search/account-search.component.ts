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
    public methodType: number = 5;
    public methodTypes = AccountSearchingMethod;

    @Input() public onClose: Function;
    @Input() public onDismiss: Function;

    constructor(private injector: Injector) {
        this.onClose = this.injector.get('onClose');
        this.onDismiss = this.injector.get('onDismiss');

        this.methods = [
            {
                name: 'Bạn của bạn',
                type: AccountSearchingMethod.FriendsOfFriends
            },
            {
                name: 'Bạn của 1 tài khoản bất kỳ',
                type: AccountSearchingMethod.FriendsOfAccount
            },
            {
                name: 'Tài khoản tương tác với 1 bài đăng',
                type: AccountSearchingMethod.PostInteraction
            },
            {
                name: 'Tài khoản tương tác với 1 Fanpage',
                type: AccountSearchingMethod.PageInteraction
            },
            {
                name: 'Tài khoản tương tác với 1 nhóm',
                type: AccountSearchingMethod.GroupInteraction
            },
            {
                name: 'Tài khoản theo mục tiêu',
                type: AccountSearchingMethod.FriendsOfAccount
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

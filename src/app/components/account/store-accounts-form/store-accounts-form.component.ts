import {Component, Injector, Input, OnInit} from '@angular/core';
import {IModalOptions} from '../../../core/modal/modalWrapper.component';
import {AccountSearchingMethodComponent} from '../account-searching-method/account-searching-method.component';
import {ModalService} from '../../../core/modal/modal.service';
import {AccountSearchComponent} from '../account-search/account-search.component';
import {Toastr} from '../../../core/helpers/toastr';
import {TargetGroupService} from '../../../services/target-group.service';
import {TargetAccountService} from '../../../services/target-account.service';
import {TargetGroup} from '../../../models/target-group.model';
import {TargetAccount} from '../../../models/target-account.model';

@Component({
    selector: 'store-accounts-form',
    templateUrl: './store-accounts-form.component.html',
    styleUrls: ['./store-accounts-form.component.css']
})
export class StoreAccountsFormComponent implements OnInit {
    @Input() public onClose: Function;
    @Input() public onDismiss: Function;
    @Input() public targetGroup: TargetGroup;

    public accounts = [];
    public targetAccounts: TargetAccount[];

    constructor(private injector: Injector,
                private modal: ModalService,
                private targetGroupService: TargetGroupService,
                private targetAccountService: TargetAccountService) {
        this.onClose = this.injector.get('onClose');
        this.onDismiss = this.injector.get('onDismiss');
        this.targetGroup = this.injector.get('targetGroup');
    }

    async ngOnInit() {
        if(this.targetGroup.id) {
            this.targetAccounts = await this.targetAccountService.filter(account => account.groupId === this.targetGroup.id).toArray();
            this.accounts = this.targetAccounts.map(account => {
                return {id: account.accountId, name: account.accountName};
            })
        } else {
            this.targetAccounts = [];
        }
    }

    public openSearchPopup() {
        let dialog = this.modal.open({
            component: AccountSearchComponent,
            inputs: {},
            title: 'Tìm kiếm tài khoản Facebook'
        } as IModalOptions);

        dialog.then((result) => {
            this.accounts = this.accounts.concat(result);
        });
    }

    public clear() {
        this.accounts = [];
    }

    public async save() {
        if(!this.targetGroup.name || !this.targetGroup.name.trim()) {
            Toastr.error('Tên nhóm mục tiêu không được bỏ trống.');
            return;
        }

        if(this.accounts.length == 0) {
            Toastr.error('Danh sách tài khoản mục tiêu không được rỗng.');
            return;
        }

        this.targetGroup.count = this.accounts.length;
        this.targetGroup.updatedAt = new Date();

        const isNew = !this.targetGroup.id;

        if(isNew) {
            this.targetGroup.createdAt = new Date();
            this.targetGroup.id = await this.targetGroupService.addAsync(this.targetGroup);
        } else {
            await this.targetGroupService.updateAsync(this.targetGroup);

            // delete old accounts
            this.targetAccountService.bulkDelete(this.targetAccounts.map(a => a.id));
        }

        const targetAccounts = this.accounts.map(account => {
            return {
                accountId: account.id,
                accountName: account.name,
                groupId: this.targetGroup.id
            } as TargetAccount;
        });

        await this.targetAccountService.bulkAdd(targetAccounts);
        Toastr.success('Lưu nhóm thành công.');
        this.onClose(this.targetGroup);
    }
}

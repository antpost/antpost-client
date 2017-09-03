import {Component, OnInit} from '@angular/core';
import {AccountSearchingMethodComponent} from '../../components/account/account-searching-method/account-searching-method.component';
import {ModalService} from '../../core/modal/modal.service';
import {IModalOptions} from '../../core/modal/modalWrapper.component';
import {StoreAccountsFormComponent} from '../../components/account/store-accounts-form/store-accounts-form.component';
import {TargetGroup} from '../../models/target-group.model';
import {TargetGroupService} from '../../services/target-group.service';
import {TargetAccountService} from '../../services/target-account.service';

@Component({
    selector: 'store-accounts',
    templateUrl: './store-accounts.component.html',
    styleUrls: ['./store-accounts.component.css']
})
export class StoreAccountsComponent implements OnInit {
    public groups: any[] = [];

    constructor(private modal: ModalService,
                private targetGroupService: TargetGroupService,
                private targetAccountService: TargetAccountService) {

    }

    async ngOnInit() {
        this.reload();
    }

    public add() {
        let dialog = this.modal.open({
            component: StoreAccountsFormComponent,
            inputs: {
                targetGroup: new TargetGroup()
            },
            title: 'Thêm nhóm tài khoản mục tiêu',
            size: 'sm'
        } as IModalOptions);

        dialog.then((result) => {
            this.reload();
        });
    }

    public edit(dataItem) {
        let dialog = this.modal.open({
            component: StoreAccountsFormComponent,
            inputs: {
                targetGroup: Object.assign({}, dataItem)
            },
            title: 'Sửa nhóm tài khoản mục tiêu',
            size: 'sm'
        } as IModalOptions);

        dialog.then((result) => {
            this.reload();
        });
    }

    public remove(dataItem) {
        this.modal.confirm({
            title: 'Bạn có chắc chắn xóa?',
            text: "Dữ liệu đã xóa không thể phục hồi!",
        }).then(() => {
            this.targetGroupService.delete(dataItem.id).then(async () => {
                this.targetAccountService.deleteByTargetGroup(dataItem.id).then(async () => {
                    this.modal.alert({
                        title: 'Đã xóa!',
                        text: 'Nhóm đã được xóa thành công.'
                    });

                    this.reload();
                });
            });
        });
    }

    private async reload() {
        this.groups = await this.targetGroupService.getAll().reverse().sortBy('createdAt');
    }
}

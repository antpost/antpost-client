import {Component, OnInit} from '@angular/core';
import {AccountSearchingMethodComponent} from '../../components/account/account-searching-method/account-searching-method.component';
import {ModalService} from '../../core/modal/modal.service';
import {IModalOptions} from '../../core/modal/modalWrapper.component';
import {StoreAccountsFormComponent} from '../../components/account/store-accounts-form/store-accounts-form.component';
import {TargetGroup} from '../../models/target-group.model';
import {TargetGroupService} from '../../services/target-group.service';

@Component({
    selector: 'store-accounts',
    templateUrl: './store-accounts.component.html',
    styleUrls: ['./store-accounts.component.css']
})
export class StoreAccountsComponent implements OnInit {
    public groups: any[] = [];

    constructor(private modal: ModalService,
                private targetGroupService: TargetGroupService) {

    }

    async ngOnInit() {
        this.groups = await this.targetGroupService.getAll().reverse().sortBy('createdAt');
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

        });
    }
}

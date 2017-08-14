import {Component, OnInit} from '@angular/core';
import {AccountSearchingMethodComponent} from '../../components/account/account-searching-method/account-searching-method.component';
import {ModalService} from '../../core/modal/modal.service';
import {IModalOptions} from '../../core/modal/modalWrapper.component';
import {StoreAccountsFormComponent} from '../../components/account/store-accounts-form/store-accounts-form.component';

@Component({
    selector: 'store-accounts',
    templateUrl: './store-accounts.component.html',
    styleUrls: ['./store-accounts.component.css']
})
export class StoreAccountsComponent implements OnInit {
    public groups: any[] = [];

    constructor(private modal: ModalService) {

    }

    ngOnInit() {
//        setTimeout(() => this.add(), 200);
    }

    public add() {
        let dialog = this.modal.open({
            component: StoreAccountsFormComponent,
            inputs: {},
            title: 'Thêm nhóm tài khoản',
            size: 'sm'
        } as IModalOptions);

        dialog.then((result) => {

        });
    }
}

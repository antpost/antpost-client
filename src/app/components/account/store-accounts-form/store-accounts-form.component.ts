import {Component, Injector, Input, OnInit} from '@angular/core';
import {IModalOptions} from '../../../core/modal/modalWrapper.component';
import {AccountSearchingMethodComponent} from '../account-searching-method/account-searching-method.component';
import {ModalService} from '../../../core/modal/modal.service';

@Component({
    selector: 'store-accounts-form',
    templateUrl: './store-accounts-form.component.html',
    styleUrls: ['./store-accounts-form.component.css']
})
export class StoreAccountsFormComponent implements OnInit {
    @Input() public onClose: Function;
    @Input() public onDismiss: Function;
    @Input() public accountGroup: any;

    public accounts = [];

    constructor(private injector: Injector, private modal: ModalService) {
        this.onClose = this.injector.get('onClose');
        this.onDismiss = this.injector.get('onDismiss');
    }

    ngOnInit() {
    }

    public selectMethod() {
        let dialog = this.modal.open({
            component: AccountSearchingMethodComponent,
            inputs: {},
            title: 'Chọn phương thức tìm kiếm người dùng',
            size: 'sm'
        } as IModalOptions);

        dialog.then((result) => {
            this.openSearchPopup(result);
        });
    }

    public openSearchPopup(method: any) {
        let dialog = this.modal.open({
            component: method.component,
            inputs: {},
            title: method.name
        } as IModalOptions);

        dialog.then((result) => {

        });
    }
}

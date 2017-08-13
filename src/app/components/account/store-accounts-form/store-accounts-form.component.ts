import {Component, Injector, Input, OnInit} from '@angular/core';
import {IModalOptions} from '../../../core/modal/modalWrapper.component';
import {AccountSearchingMethodComponent} from '../account-searching-method/account-searching-method.component';
import {ModalService} from '../../../core/modal/modal.service';
import {AccountSearchComponent} from '../account-search/account-search.component';

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
        this.openSearchPopup();
    }

    public openSearchPopup() {
        let dialog = this.modal.open({
            component: AccountSearchComponent,
            inputs: {},
            title: 'Tìm kiếm tài khoản Facebook'
        } as IModalOptions);

        dialog.then((result) => {

        });
    }
}

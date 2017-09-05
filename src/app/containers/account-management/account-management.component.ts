import {Component, OnInit} from '@angular/core';
import {FbAccountService} from '../../services/fbaccount.service';
import {ModalService} from '../../core/modal/modal.service';
import {Observable} from 'rxjs/Observable';
import {FbAccount} from '../../models/fbaccount.model';
import {Store} from '@ngrx/store';
import * as fromRoot from '../../reducers/index';
import {AccountFormComponent} from '../../components/account/account-form/account-form.component';
import {IModalOptions} from '../../core/modal/modalWrapper.component';
import * as account from '../../actions/account';

@Component({
    selector: 'account-management',
    templateUrl: './account-management.component.html',
    styleUrls: ['./account-management.component.css']
})
export class AccountManagementComponent implements OnInit {

    public fbAccounts$: Observable<FbAccount[]>;

    constructor(private modal: ModalService,
                private fbaccountService: FbAccountService,
                private store: Store<fromRoot.State>) {
    }

    ngOnInit() {
        this.fbAccounts$ = this.store.select(fromRoot.getAccounts);
    }

    public add() {
        let dialog = this.modal.open({
            component: AccountFormComponent,
            inputs: {
                account: new FbAccount()
            },
            title: 'Thêm tài khoản Facebook',
            size: 'sm'
        } as IModalOptions);

        dialog.then((result) => {
            this.store.dispatch(new account.LoadAction());
        });
    }

    public edit(dataItem) {
        let dialog = this.modal.open({
            component: AccountFormComponent,
            inputs: {
                account: Object.assign({}, dataItem)
            },
            title: 'Sửa tài khoản Facebook',
            size: 'sm'
        } as IModalOptions);

        dialog.then((result) => {
            this.store.dispatch(new account.LoadAction());
        });
    }

    public remove(dataItem) {
        this.modal.confirm({
            title: 'Bạn có chắc chắn xóa?',
            text: "Dữ liệu đã xóa không thể phục hồi!",
        }).then(() => {
            this.fbaccountService.delete(dataItem.id).then(async () => {
                this.modal.alert({
                    title: 'Đã xóa!',
                    text: 'Tài khoản đã được xóa thành công.'
                });

                this.store.dispatch(new account.LoadAction());
            });
        });
    }
}

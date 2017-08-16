import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FbAccount } from '../../../models/fbaccount.model';

@Component({
    selector: 'account-selection',
    templateUrl: './account-selection.component.html',
    styleUrls: ['./account-selection.component.css']
})
export class AccountSelectionComponent implements OnInit {
    @Input() public accounts: FbAccount[];
    @Input() public width: number = 300;
    @Output() public onSelect: EventEmitter<FbAccount[]> = new EventEmitter();

    constructor() {
    }

    ngOnInit() {
    }

    public selectAccount(account: FbAccount) {
        this.onSelect.emit([Object.assign({}, account)]);
    }

    public selectAll() {
        this.onSelect.emit(this.accounts.map(account => Object.assign({}, account)));
    }

}

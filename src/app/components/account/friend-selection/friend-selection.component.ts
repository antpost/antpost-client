import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {FbAccount} from '../../../models/fbaccount.model';
import {FacebookProfileService} from '../../../services/facebook-profile.service';
import {Store} from '@ngrx/store';
import * as fromRoot from '../../../reducers/index';
import {GridDataResult, PageChangeEvent} from '@progress/kendo-angular-grid';

@Component({
    selector: 'friend-selection',
    templateUrl: './friend-selection.component.html',
    styleUrls: ['./friend-selection.component.css']
})
export class FriendSelectionComponent implements OnInit {

    @Input() public account: FbAccount;
    @Output() public onSelect: EventEmitter<FbAccount[]> = new EventEmitter();
    public friends: FbAccount[] = [];
    public skip: number = 0;
    public gridView: GridDataResult;

    constructor(private store: Store<fromRoot.State>,
                private facebookProfilekService: FacebookProfileService) {
    }

    ngOnInit() {
        this.gridView = {
            data: [],
            total: 0
        };

        this.store.select(fromRoot.getDefaultAccount).subscribe(account => {
            this.friends = [];
            this.facebookProfilekService.loadFriend(account, this.account.id).subscribe((friends) => {
                this.gridView.data = this.gridView.data.concat(friends || []);
                this.gridView.total = this.gridView.data.length;
            });
        });
    }

    public pageChange(event: PageChangeEvent): void {
        this.skip = event.skip;
    }

    public selectAccount(account: FbAccount) {
        this.onSelect.emit([Object.assign({}, account)]);
    }

    public selectAll() {
        this.onSelect.emit(this.gridView.data.map(account => Object.assign({}, account)));
    }
}

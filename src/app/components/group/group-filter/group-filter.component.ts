import {Component, Injector, Input, OnInit} from '@angular/core';
import {FacebookService} from '../../../services/facebook.service';
import {Store} from '@ngrx/store';
import {FbAccount} from '../../../models/fbaccount.model';
import {Group} from '../../../models/group.model';
import * as joinedGroup from '../../../actions/joined-group';
import * as groupSearch from '../../../actions/group-search';
import {Toastr} from '../../../core/helpers/toastr';
import {Observable} from 'rxjs/Observable';
import * as fromRoot from '../../../reducers/index';

@Component({
    selector: 'group-filter',
    templateUrl: './group-filter.component.html',
    styleUrls: ['./group-filter.component.css']
})
export class GroupFilterComponent implements OnInit {

    public groups: Array<any> = [];
    public selectedGroups: Array<any> = [];
    private joinedGroups: Array<Group>;
    public account: FbAccount;
    public term: string;
    public groups$: Observable<Array<Group>>;

    @Input()
    public onClose: Function;

    @Input()
    public onDismiss: Function;

    constructor(private injector: Injector, private store: Store<fromRoot.State>, private facebookService: FacebookService) {
        this.onClose = this.injector.get('onClose');
        this.onDismiss = this.injector.get('onDismiss');
        this.selectedGroups = this.injector.get('groups') || [];
        this.account = this.injector.get('account');
    }

    public ngOnInit() {
        this.store.select(fromRoot.getGroupSearchQuery).subscribe(query => this.term = query);
        this.groups$ = this.store.select(fromRoot.getGroupSearchResult);

        this.store.select(fromRoot.getJoinedGroups(this.account.id)).subscribe(groups => {
            if(!groups) {
                this.store.dispatch(new joinedGroup.LoadAction(this.account));
            } else {
                this.joinedGroups = groups.map(g => Object.assign({}, g));
            }
        });
    }

    /**
     * Seach groups
     */
    public async search() {
        if(!this.term || !this.term.trim()) {
            return;
        }

        this.store.dispatch(new groupSearch.SearchAction(this.term));
    }

    public selectGroup(group: any) {
        let item = this.selectedGroups.find(g => g.id == group.id);
        if(!item) {
            this.selectedGroups.push(Object.assign({}, group));
        }
    }

    public save() {
        this.onClose(this.selectedGroups);
    }

    public cancel() {
        this.onDismiss();
    }

    private async loadGroup(term: string) {
        let result = await this.facebookService.searchGroup(this.account, this.term);
        let joinedIds = this.joinedGroups.map(group => group.id);
        this.groups = result.data.filter(g => joinedIds.indexOf(g.id) < 0);
    }


}

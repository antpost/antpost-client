import {Component, OnInit, Input, Injector} from '@angular/core';
import {Toastr} from '../../../core/helpers/toastr';
import { Store } from '@ngrx/store';
import { FacebookService } from '../../../services/facebook.service';
import * as fromRoot from '../../../reducers';
import * as joinedGroup from '../../../actions/joined-group';
import {FbAccount} from '../../../models/fbaccount.model';

@Component({
    selector: 'app-group-selection',
    templateUrl: './group-selection.component.html',
    styleUrls: ['./group-selection.component.css']
})
export class GroupSelectionComponent implements OnInit {

    public groups: Array<any> = [];
    public account: FbAccount;
    public selectedGroups: Array<any> = [];
    public isCheckAll: boolean = false;

    @Input()
    public onClose: Function;

    @Input()
    public onDismiss: Function;

    constructor(private injector: Injector, private store: Store<fromRoot.State>, private facebookService: FacebookService) {
        this.onClose = this.injector.get('onClose');
        this.onDismiss = this.injector.get('onDismiss');
        this.selectedGroups = this.injector.get('groups') || [];
        this.account = this.injector.get('account') || [];
    }

    public async ngOnInit() {
        /*this.store.select(fromRoot.getJoinedGroupsLoaded)
            .filter(s => !s).
            subscribe((loaded) => {
                this.store.dispatch(new joinedGroup.LoadAction());
            });*/

        this.store.select(fromRoot.getJoinedGroups(this.account.id)).subscribe(groups => {
            if(!groups) {
                this.store.dispatch(new joinedGroup.LoadAction(this.account));
            } else {
                this.groups = groups.map(g => Object.assign({}, g));

                // update selected groups
                this.groups.forEach(group => {
                    group.checked = !!this.selectedGroups.find(g => g.id == group.id);
                });
            }
        });
    }

    public save() {
        if(this.groups.length == 0) {
            Toastr.error("Bạn cần chọn ít nhất một nhóm!");
            return;
        }

        this.onClose(this.groups.filter((item) => item.checked));
    }

    public cancel() {
        this.onDismiss();
    }

    /**
     * Get newest groups from facebook and reload table
     */
    public reload() {
        this.store.dispatch(new joinedGroup.LoadAction(this.account));
    }

    public loadMembers() {

    }

    public onCheckAll() {
        this.checkAll(this.isCheckAll);
    }

    public onCheckGroup(group: any) {
        if(!group.checked) {
            this.isCheckAll = false;
        } else {
            let anyGroup = this.groups.find((item) => !item.checked);
            this.isCheckAll = !anyGroup;
        }
    }

    private checkAll(checked: boolean) {
        this.groups.forEach((group: any) => {
            group.checked = checked;
        });
    }
}

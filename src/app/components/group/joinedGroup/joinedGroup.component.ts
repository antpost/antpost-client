import {
    Component,
    OnInit, ViewChild, ViewEncapsulation, EventEmitter, Output
} from '@angular/core';
import {PostService} from '../../../services/post.service';
import {ModalService} from '../../../core/modal/modal.service';
import {FacebookService} from '../../../services/facebook.service';
import {GroupService} from '../../../services/group.service';
import {Group} from '../../../models/group.model';
import {exists} from 'fs';

@Component({
    selector: 'joined-group',
    providers: [],
    styleUrls: [],
    templateUrl: 'joinedGroup.component.html',
    encapsulation: ViewEncapsulation.None
})
export class JoinedGroupComponent implements OnInit {

    @Output()
    public changeSelected = new EventEmitter<Array<Group>>();

    public groups: Array<Group>;
    public isCheckAll: boolean = true;

    constructor(private postService: PostService, private modal: ModalService,
                private facebookService: FacebookService,
                private groupService: GroupService) {


    }

    public async ngOnInit() {
        /*if(localStorage.getItem('group')) {
            this.groups = await this.groupService.all();
            this.checkAll(true);
        } else {
            this.facebookService.getJoinedGroups().subscribe(async (result: any) => {
                this.groups = result.data;

                // save to db
                await this.groupService.addAll(this.groups);
                localStorage.setItem('group', '1');
                this.checkAll(true);
            });
        }*/
        this.facebookService.getJoinedGroups().subscribe(async (result: any) => {
            this.groups = result.data;

            // save to db
            await this.groupService.addAll(this.groups);
            localStorage.setItem('group', '1');
            this.checkAll(true);
        });
    }

    /**
     * Get newest groups from facebook and reload table
     */
    public reload() {
        this.facebookService.getJoinedGroups().subscribe(async (result: any) => {
            let list = result.data as Array<Group> || [];

            // update members from old groups
            list.forEach((item) => {
                let existing =  this.groups.find((group) => group.id == item.id);
                if(existing) {
                    item.members = existing.members;
                }
            });

            this.groups = list;

            // update to db
            this.groupService.addAll(this.groups);

        });
    }

    public loadMembers() {

    }

    public onCheckAll() {
        this.checkAll(this.isCheckAll);
    }

    public onCheckGroup(group: Group) {
        if(!group.checked) {
            this.isCheckAll = false;
        } else {
            let anyGroup = this.groups.find((item) => !item.checked);
            this.isCheckAll = !anyGroup;
        }
    }

    public getSelectedGroups() {
        return this.groups.filter((item) => item.checked);
    }

    private emit() {
        this.changeSelected.emit(this.groups.filter((item) => item.checked));
    }

    private checkAll(checked: boolean) {
        this.groups.forEach((group: Group) => {
            group.checked = checked;
        });
    }
}

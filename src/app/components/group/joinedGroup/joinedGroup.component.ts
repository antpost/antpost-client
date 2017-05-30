import {
    Component,
    OnInit, ViewChild, ViewEncapsulation
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

    public groups: Array<Group>;

    constructor(private postService: PostService, private modal: ModalService,
                private facebookService: FacebookService,
                private groupService: GroupService) {


    }

    public async ngOnInit() {
        if(localStorage.getItem('group')) {
            this.groups = await this.groupService.all();
        } else {
            this.facebookService.getJoinedGroups().subscribe(async (result: any) => {
                this.groups = result.data;

                // save to db
                await this.groupService.addAll(this.groups);
                localStorage.setItem('group', '1');
            });
        }
    }

    /**
     * Get newest groups from facebook and reload table
     */
    public reload() {
        this.facebookService.getJoinedGroups().subscribe(async (result: any) => {
            let list = result.data as Array<Group>;

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
}

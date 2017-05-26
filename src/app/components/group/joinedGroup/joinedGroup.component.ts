import {
    Component,
    OnInit, ViewChild, ViewEncapsulation
} from '@angular/core';
import {PostService} from '../../../services/post.service';
import {ModalService} from '../../../core/modal/modal.service';
import {FacebookService} from '../../../services/facebook.service';
import {GroupService} from '../../../services/group.service';
import {Group} from '../../../models/group.model';

@Component({
    selector: 'join-group',
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
            this.facebookService.getJoinedGroups().subscribe((result: any) => {
                this.groups = result.data;
                this.groups.forEach((item) => {
                    item.administrator = item.administrator ? 1 : 0;
                })

                // save to db
                this.groupService.addAll(this.groups);
                localStorage.setItem('group', '1');
            });
        }


    }
}

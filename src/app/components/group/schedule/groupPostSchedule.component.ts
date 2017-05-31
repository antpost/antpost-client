import {
    Component,
    OnInit, ViewChild, ViewEncapsulation
} from '@angular/core';
import {PostService} from '../../../services/post.service';
import {ModalService} from '../../../core/modal/modal.service';
import {PostSelectorComponent} from '../../post/postSelector.component';
import {Post} from '../../../models/post.model';
import {Toastr} from '../../../core/helpers/toastr';
import {Group} from '../../../models/group.model';
import {JoinedGroupComponent} from '../joinedGroup/joinedGroup.component';
import {SchedulePost} from '../../../models/schedulePost.model';

@Component({
    selector: 'group-post-schedule',
    providers: [],
    styleUrls: [],
    templateUrl: 'groupPostSchedule.component.html',
    encapsulation: ViewEncapsulation.None
})
export class GroupPostScheduleComponent implements OnInit {

    @ViewChild(JoinedGroupComponent)
    public joinedGroupComponent: JoinedGroupComponent;

    public post: Post = new Post();

    constructor(private postService: PostService, private modal: ModalService) {

    }

    public ngOnInit() {

    }

    public selectPost() {
        let dialog = this.modal.open({
            component: PostSelectorComponent,
            title: 'Chọn bài viết'
        });

        dialog.then((result) => {
            this.post = result;
        });
    }

    public start() {
        if (!this.post.id) {
            Toastr.error('Bạn hãy chọn 1 bài viết đã lưu trước.');
            return;
        }

        // check no groups selected
        if(this.joinedGroupComponent.getSelectedGroups().length == 0) {
            Toastr.error('Bạn phải chọn ít nhất 1 nhóm để đăng.');
            return;
        }

        // save schedule
        let schedule = new SchedulePost();
        schedule.postId = this.post.id;
    }
}

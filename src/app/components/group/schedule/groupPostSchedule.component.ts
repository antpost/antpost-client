import {
    Component,
    OnInit, ViewChild, ViewEncapsulation
} from '@angular/core';
import {PostService} from '../../../services/post.service';
import {ModalService} from '../../../core/modal/modal.service';
import {PostSelectorComponent} from '../../post/postSelector.component';
import {Post} from '../../../models/post.model';

@Component({
    selector: 'group-post-schedule',
    providers: [],
    styleUrls: [],
    templateUrl: 'groupPostSchedule.component.html',
    encapsulation: ViewEncapsulation.None
})
export class GroupPostScheduleComponent implements OnInit {

    public post: Post;

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
}

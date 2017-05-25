import {
    Component,
    OnInit, ViewChild, ViewEncapsulation
} from '@angular/core';
import {PostService} from '../../../services/post.service';
import {ModalService} from '../../../core/modal/modal.service';

@Component({
    selector: 'group-post-schedule',
    providers: [],
    styleUrls: [],
    templateUrl: 'groupPostSchedule.component.html',
    encapsulation: ViewEncapsulation.None
})
export class GroupPostScheduleComponent implements OnInit {

    constructor(private postService: PostService, private modal: ModalService) {

    }

    public ngOnInit() {

    }
}

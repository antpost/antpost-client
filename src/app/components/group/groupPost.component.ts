import {
    Component,
    OnInit, ViewChild, ViewEncapsulation
} from '@angular/core';
import {PostService} from '../../services/post.service';
import {ModalService} from '../../core/modal/modal.service';
import {Post} from '../../models/post.model';

@Component({
    selector: 'post',
    providers: [],
    styleUrls: [],
    templateUrl: 'groupPost.component.html',
    encapsulation: ViewEncapsulation.None
})
export class GroupPostComponent implements OnInit {

    public posts: Post[];

    constructor(private postService: PostService, private modal: ModalService) {

    }

    public ngOnInit() {

    }
}

import {
    Component,
    OnInit, ViewChild, ViewEncapsulation, ElementRef, Input, Injector
} from '@angular/core';
import {PostService} from '../../services/post.service';
import {Post} from '../../models/post.model';
import {PostType} from '../../models/enums';
import {NotificationsService} from 'angular2-notifications/dist';
import {Toastr} from '../../core/helpers/toastr';

@Component({
    selector: 'post-form',
    providers: [],
    styleUrls: [],
    templateUrl: 'postForm.component.html',
    encapsulation: ViewEncapsulation.None
})
export class PostFormComponent implements OnInit {

    public post: Post;

    @Input()
    public onClose: Function;

    @Input()
    public onDismiss: Function;

    constructor(private injector: Injector,
                private postService: PostService) {
        this.onClose = this.injector.get('onClose');
        this.onDismiss = this.injector.get('onDismiss');

        this.post = new Post();
        this.post.type = PostType.Message;
    }

    public ngOnInit() {

    }

    public async save() {
        this.post.updatedAt = new Date();
        this.post.createdAt = new Date();

        let id = await this.postService.add(this.post);
        this.post.id = id;

        Toastr.success("Lưu bài viết thành công!");

        this.onClose(this.post);
    }

}

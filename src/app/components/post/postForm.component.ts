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

    @Input()
    public post: Post = new Post();

    @Input()
    public onClose: Function;

    @Input()
    public onDismiss: Function;

    public tabs: Array<any>;
    public postType = PostType;

    constructor(private injector: Injector,
                private postService: PostService) {
        this.onClose = this.injector.get('onClose');
        this.onDismiss = this.injector.get('onDismiss');
        this.post = this.injector.get('post');

        this.tabs = [
            {
                type: PostType.Message,
                label: 'Bài viết',
                icon: 'message'
            },
            {
                type: PostType.Link,
                label: 'Liên kết',
                icon: 'link'
            },
            {
                type: PostType.Sale,
                label: 'Bán hàng',
                icon: 'shopping_cart'
            },
            {
                type: PostType.Image,
                label: 'Hình ảnh',
                icon: 'add_a_photo'
            },
            {
                type: PostType.Video,
                label: 'Video',
                icon: 'video_library'
            }
        ];
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

    public cancel() {
        this.onDismiss();
    }
}

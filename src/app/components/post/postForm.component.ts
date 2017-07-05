import {
    Component,
    OnInit, ViewChild, ViewEncapsulation, ElementRef, Input, Injector
} from '@angular/core';
import {PostService} from '../../services/post.service';
import {Post} from '../../models/post.model';
import {PostType} from '../../models/enums';
import {NotificationsService} from 'angular2-notifications/dist';
import {Toastr} from '../../core/helpers/toastr';
import {FacebookService} from '../../services/facebook.service';
import {FileRestrictions, SuccessEvent, FileInfo} from '@progress/kendo-angular-upload';

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
    public uploadSaveUrl = 'http://localhost:3001/upload';
    public uploadRemoveUrl = 'http://localhost:3001/remove';
    public restrictions: FileRestrictions = {
        allowedExtensions: [".jpg", ".png"]
    };
    public images: Array<FileInfo>;

    constructor(private injector: Injector,
                private postService: PostService,
                private facebookService: FacebookService) {
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
        if(this.post.images && this.post.images.length > 0) {
            this.images = this.post.images.map(image => {
                return {
                    name: image
                };
            })
        }
    }

    public successEventHandler(e: SuccessEvent) {
        if(e.operation == 'upload') {
            this.post.images = e.files.map(f => f.name);
        }
    }

    public async save() {
        if (!this.validate()) {
            return;
        }

        this.post.updatedAt = new Date();
        this.post.createdAt = this.post.createdAt || new Date();

        if(this.post.id) {
            await this.postService.update(this.post.id, this.post);
        } else {
            let id = await this.postService.add(this.post);
            this.post.id = id;
        }

        Toastr.success("Lưu bài viết thành công!");

        this.onClose(this.post);
    }

    public cancel() {
        this.onDismiss();
    }

    public getPreviewUrl() {
        if(!this.post.linkUrl) {
            this.post.linkTitle = null;
            this.post.linkCaption = null;
            this.post.linkDescription = null;
            this.post.imageUrl = null;
        } else {
            this.facebookService.getLinkPreview(this.post.linkUrl).subscribe((preview) => {
                this.post.linkTitle = preview.title;
                this.post.linkDescription = preview.description;
                this.post.imageUrl = preview.image;
            });
        }
    }

    /**
     * Validate post
     */
    private validate() {
        // title must be not empty
        if (!this.post.title.trim() || !this.post.title.trim()) {
            Toastr.error('Tên bài viết không được bỏ trống.');
            return false;
        }

        if (this.post.type == PostType.Link) {
            if(!this.post.linkUrl || !this.post.linkUrl.trim()) {
                Toastr.error('Link chia sẻ không được bỏ trống.');
                return false;
            }
        }

        return true;
    }
}

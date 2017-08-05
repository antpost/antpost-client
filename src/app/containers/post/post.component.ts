import {
    Component,
    OnInit, ViewChild, ViewEncapsulation
} from '@angular/core';
import {PostService} from '../../services/post.service';
import {ModalService} from '../../core/modal/modal.service';
import {IModalOptions} from '../../core/modal/modalWrapper.component';
import {Post} from '../../models/post.model';
import {PostType} from '../../models/enums';
import {Toastr} from '../../core/helpers/toastr';
import {PostFormComponent} from '../../components/post/post-form/post-form.component';

@Component({
    selector: 'post',
    providers: [],
    styleUrls: [],
    templateUrl: 'post.component.html',
    encapsulation: ViewEncapsulation.None
})
export class PostComponent implements OnInit {

    public posts: Post[];

    constructor(private postService: PostService, private modal: ModalService) {

    }

    public ngOnInit() {
        this.read();
    }

    public async read() {
        this.posts = await this.postService.all();
    }

    public add() {
        let post = new Post();
        post.type = PostType.Message;

        this.openForm(post);
    }

    public edit(post: Post) {
        this.openForm(post);
    }

    public async remove(post: Post) {
        await this.postService.delete(post.id);
        Toastr.success("Xóa bài viết thành công!");
        this.read();
    }

    private openForm(post: Post) {
        let dialog = this.modal.open({
            component: PostFormComponent,
            inputs: {
                post
            },
            title: post.id ? post.title : 'Thêm mới bài viết'
        } as IModalOptions);

        dialog.then((result) => {
            this.read();
        });
    }
}

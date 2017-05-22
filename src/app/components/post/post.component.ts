import {
    Component,
    OnInit, ViewChild, ViewEncapsulation
} from '@angular/core';
import {PostService} from '../../services/post.service';
import {PostFormComponent} from './postForm.component';
import {ModalService} from '../../core/modal/modal.service';
import {IModalOptions} from '../../core/modal/modalWrapper.component';


@Component({
    selector: 'post',
    providers: [],
    styleUrls: [],
    templateUrl: 'post.component.html',
    encapsulation: ViewEncapsulation.None
})
export class PostComponent implements OnInit {

    title = '';

    constructor(private postService: PostService, private modal: ModalService) {

    }

    public ngOnInit() {

    }

    addPost(title: string) {
        /*const post: Post = {
         title: this.title
         };
         this.postService
         .add(post)
         .then((id) => {
         console.log(id);
         });*/

        this.modal.open({
            component: PostFormComponent,
            inputs: {},
            title: 'Thêm mới bài viết'
        } as IModalOptions);

    }
}

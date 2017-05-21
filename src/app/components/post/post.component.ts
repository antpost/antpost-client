import {
    Component,
    OnInit, ViewChild, ViewEncapsulation
} from '@angular/core';
import {PostService} from '../../services/post.service';
import {Post} from '../../models/post.model';
import { Overlay, overlayConfigFactory } from 'angular2-modal';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';
import {PostFormComponent} from './postForm.component';


@Component({
    selector: 'post',
    providers: [Modal],
    styleUrls: [],
    templateUrl: 'post.component.html',
    encapsulation: ViewEncapsulation.None
})
export class PostComponent implements OnInit {

    title = '';

    constructor(private postService: PostService, private modal: Modal) {

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

        this.modal.alert()
            .size('lg')
            .showClose(true)
            .title('Thêm mới bài viết')
            .body(`
            <h4>Alert is a classic (title/body/footer) 1 button modal window that
            does not block.</h4>
            <b>Configuration:</b>
            <ul>
                <li>Non blocking (click anywhere outside to dismiss)</li>
                <li>Size large</li>
                <li>Dismissed with default keyboard key (ESC)</li>
                <li>Close wth button click</li>
                <li>HTML content</li>
            </ul>`)
            .open();

        this.modal
            .open(PostFormComponent,  overlayConfigFactory({ num1: 2, num2: 3 }, BSModalContext));

    }
}

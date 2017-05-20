import {
    Component,
    OnInit, ViewChild, ViewEncapsulation
} from '@angular/core';
import {PostService} from '../../services/post.service';
import {Post} from '../../models/post.model';

@Component({
    selector: 'post',
    providers: [],
    styleUrls: [],
    templateUrl: 'post.component.html',
    encapsulation: ViewEncapsulation.None
})
export class PostComponent implements OnInit {

    title = '';

    constructor(private postService: PostService) {

    }

    public ngOnInit() {

    }

    addPost(title: string) {
        const post: Post = {
            title: this.title
        };
        this.postService
            .add(post)
            .then((id) => {
                console.log(id);
            });
    }
}

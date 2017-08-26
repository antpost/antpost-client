import {
    Component,
    OnInit, ViewChild, ViewEncapsulation, Input, Injector
} from '@angular/core';
import {PostService} from '../../../services/post.service';
import {Post} from '../../../models/post.model';

@Component({
    selector: 'post-selector',
    providers: [],
    styleUrls: [],
    templateUrl: 'post-selector.component.html',
    encapsulation: ViewEncapsulation.None
})
export class PostSelectorComponent implements OnInit {

    @Input()
    public onClose: Function;

    @Input()
    public onDismiss: Function;

    public posts: Post[];

    constructor(private injector: Injector,
                private postService: PostService) {
        this.onClose = this.injector.get('onClose');
        this.onDismiss = this.injector.get('onDismiss');
    }

    public ngOnInit() {
        this.read();
    }

    public async read() {
        this.posts = await this.postService.getAll().toArray();
    }

    public select(post: Post) {
        this.onClose(post);
    }
}

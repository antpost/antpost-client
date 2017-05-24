import {
    Component,
    OnInit, ViewChild, ViewEncapsulation, ElementRef, Input, Injector
} from '@angular/core';
import {Post} from '../../models/post.model';

@Component({
    selector: 'post-preview',
    providers: [],
    styleUrls: [],
    templateUrl: 'postPreview.component.html',
    encapsulation: ViewEncapsulation.None
})
export class PostPreviewComponent implements OnInit {

    public post: Post = new Post();

    constructor() {

    }

    public ngOnInit() {

    }

}

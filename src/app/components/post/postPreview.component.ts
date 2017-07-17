import {
    Component,
    OnInit, ViewChild, ViewEncapsulation, ElementRef, Input, Injector
} from '@angular/core';
import {Post} from '../../models/post.model';
import {PostType} from '../../models/enums';
import {AppManager} from '../../core/appManager';

@Component({
    selector: 'post-preview',
    providers: [],
    styleUrls: [],
    templateUrl: 'postPreview.component.html',
    encapsulation: ViewEncapsulation.None
})
export class PostPreviewComponent implements OnInit {

    @Input()
    public post: Post = new Post();

    public postType = PostType;

    constructor(private appManager: AppManager) {

    }

    public ngOnInit() {

    }

}

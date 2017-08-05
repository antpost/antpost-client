import {
    Component,
    OnInit, ViewChild, ViewEncapsulation, ElementRef, Input, Injector
} from '@angular/core';
import {Post} from '../../../models/post.model';
import {PostType} from '../../../models/enums';
import {AppManager} from '../../../core/appManager';
import {FbAccount} from '../../../models/fbaccount.model';

@Component({
    selector: 'post-preview',
    providers: [],
    styleUrls: [],
    templateUrl: 'post-preview.component.html',
    encapsulation: ViewEncapsulation.None
})
export class PostPreviewComponent implements OnInit {

    @Input() public post: Post = new Post();
    @Input() public account: FbAccount;

    public postType = PostType;

    constructor(private appManager: AppManager) {

    }

    public ngOnInit() {

    }

}

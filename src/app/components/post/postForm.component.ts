import {
    Component,
    OnInit, ViewChild, ViewEncapsulation, ElementRef
} from '@angular/core';
import {PostService} from '../../services/post.service';

@Component({
    selector: 'post-form',
    providers: [],
    styleUrls: [],
    templateUrl: 'postForm.component.html',
    encapsulation: ViewEncapsulation.None
})
export class PostFormComponent implements OnInit {

    public wrongAnswer: boolean;

    constructor(private postService: PostService) {
    }

    public ngOnInit() {

    }

    public save() {
        console.log('save');
    }

}

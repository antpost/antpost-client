import {
    Component,
    OnInit, ViewChild, ViewEncapsulation, ElementRef
} from '@angular/core';
import {PostService} from '../../services/post.service';
import {Post} from '../../models/post.model';
import {CloseGuard, ModalComponent, DialogRef} from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';

export class CustomModalContext extends BSModalContext {
    public num1: number;
    public num2: number;
}

@Component({
    selector: 'post-form',
    providers: [],
    styleUrls: [],
    templateUrl: 'postForm.component.html',
    encapsulation: ViewEncapsulation.None
})
export class PostFormComponent implements OnInit, CloseGuard, ModalComponent<CustomModalContext> {
    private context: CustomModalContext;

    public wrongAnswer: boolean;

    constructor(private postService: PostService,
                public dialog: DialogRef<CustomModalContext>,
                private elementRef: ElementRef,) {
        this.context = dialog.context;
        dialog.setCloseGuard(this);
    }

    public ngOnInit() {

    }

    onKeyUp(value) {
        this.wrongAnswer = value != 5;
        this.dialog.close();
    }

    beforeDismiss(): boolean {
        return true;
    }

    beforeClose(): boolean {
        return this.wrongAnswer;
    }
}

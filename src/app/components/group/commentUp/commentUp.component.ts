import {OnInit, Component, Input} from '@angular/core';
import {FacebookService} from '../../../services/facebook.service';
import {Group} from '../../../models/group.model';

@Component({
    selector: 'comment-up',
    templateUrl: 'commentUp.component.html'
})
export class CommentUpComponent implements OnInit {

    constructor(private facebookService: FacebookService) {

    }

    public ngOnInit() {

    }
}

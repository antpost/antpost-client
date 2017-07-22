import {OnInit, Component, Input} from '@angular/core';
import {FacebookService} from '../../services/facebook.service';
import {Comment} from '../../models/comment';

@Component({
    selector: 'comment',
    templateUrl: 'newcomment.component.html'
})


export class NewCommentComponent {
    public groups: Array<any> = [];
    public term: string;
    public searchAllowed: boolean = true;
    private joinedGroups: Array<Comment>;

    constructor(private facebookService: FacebookService) {

    }

    public ngOnInit() {

    }
}

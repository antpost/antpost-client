import {OnInit, Component} from '@angular/core';
import {FacebookService} from '../../../services/facebook.service';
import {Group} from '../../../models/group.model';

@Component({
    selector: 'group-search',
    templateUrl: 'groupSearch.component.html'
})
export class GroupSearchComponent implements OnInit {

    public groups: Array<Group>;
    public term: string;

    constructor(private facebookService: FacebookService) {

    }

    public ngOnInit() {

    }

    /**
     * Seach groups
     */
    public search() {
        if(!this.term || !this.term.trim()) {
            return;
        }

        this.facebookService.searchGroup(this.term).subscribe((result) => {
            this.groups = result;
        });
    }
}

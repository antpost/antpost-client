import {OnInit, Component, Input} from '@angular/core';
import {FacebookService} from '../../../services/facebook.service';
import {Group} from '../../../models/group.model';

@Component({
    selector: 'group-search',
    templateUrl: 'groupSearch.component.html'
})
export class GroupSearchComponent implements OnInit {
    public groups: Array<any> = [];
    public term: string;
    public searchAllowed: boolean = true;
    private joinedGroups: Array<Group>;

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

        // if(!this.joinedGroups) {
        //     this.facebookService.getJoinedGroups(null).subscribe(async (result: any) => {
        //         this.joinedGroups = result.data;
        //
        //         this.loadGroup(this.term);
        //     });
        // } else {
        //      this.loadGroup(this.term);
        // }
    }

    public getGroups() {
        return this.groups;
    }

    public enableSearch(enable: boolean = true) {
        this.searchAllowed = enable;
    }

    private loadGroup(term: string) {
        // this.facebookService.searchGroup(null, this.term).subscribe((result: any) => {
        //     let joinedIds = this.joinedGroups.map(group => group.id);
        //
        //     this.groups = result.filter(g => joinedIds.indexOf(g.id) < 0);
        // });
    }
}

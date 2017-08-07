import {
    Component,
    OnInit, ViewEncapsulation, Input
} from '@angular/core';

@Component({
    selector: 'selected-groups',
    templateUrl: 'selected-groups.component.html'
})
export class SelectedGroupsComponent implements OnInit {
    @Input()
    public groups: Array<any>;

    constructor() {

    }

    public ngOnInit() {

    }

    public removeGroup(group) {
        let index = this.groups.findIndex(g => g.id == group.id);
        this.groups.splice(index, 1);
    }

    public clear() {
        while(this.groups.length > 0) {
            this.groups.pop();
        }
    }
}

import {
    Component,
    OnInit, ViewEncapsulation, Input
} from '@angular/core';

@Component({
    selector: 'selected-groups',
    templateUrl: 'selectedGroups.component.html'
})
export class SelectedGroupsComponent implements OnInit {
    @Input()
    public groups: Array<any>;

    constructor() {

    }

    public ngOnInit() {

    }
}

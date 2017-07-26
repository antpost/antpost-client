import {Component, OnInit, Input, Injector} from '@angular/core';
import {Toastr} from '../../../core/helpers/toastr';

@Component({
    selector: 'app-group-selection',
    templateUrl: './group-selection.component.html',
    styleUrls: ['./group-selection.component.css']
})
export class GroupSelectionComponent implements OnInit {

    public groups: Array<any> = [];

    @Input()
    public onClose: Function;

    @Input()
    public onDismiss: Function;

    constructor(private injector: Injector) {
        this.onClose = this.injector.get('onClose');
        this.onDismiss = this.injector.get('onDismiss');
    }

    ngOnInit() {
    }

    public onUpdateGroups(groups) {
        this.groups = groups;
    }

    public save() {
        if(this.groups.length == 0) {
            Toastr.error("Bạn cần chọn ít nhất một nhóm!");
            return;
        }

        this.onClose(this.groups);
    }

    public cancel() {
        this.onDismiss();
    }
}

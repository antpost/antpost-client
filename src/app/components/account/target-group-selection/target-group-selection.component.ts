import {Component, Injector, Input, OnInit} from '@angular/core';
import {TargetGroupService} from '../../../services/target-group.service';
import {TargetGroup} from '../../../models/target-group.model';
import {Toastr} from '../../../core/helpers/toastr';

@Component({
    selector: 'target-group-selection',
    templateUrl: './target-group-selection.component.html',
    styleUrls: ['./target-group-selection.component.css']
})
export class TargetGroupSelectionComponent implements OnInit {
    @Input() public onClose: Function;
    @Input() public onDismiss: Function;

    public groups: TargetGroup[];

    constructor(private injector: Injector,
                private targetGroupService: TargetGroupService) {
        this.onClose = this.injector.get('onClose');
        this.onDismiss = this.injector.get('onDismiss');
    }

    async ngOnInit() {
        this.groups = await this.targetGroupService.getAll().reverse().sortBy('createdAt');
    }

    public select(dataItem) {
        this.onClose(dataItem);
    }
}

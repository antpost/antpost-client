import {Component, ElementRef, OnInit} from '@angular/core';
import {AbstractScheduleComponent} from '../base/abstractSchedule.component';
import {MakeFriendMeta} from '../../core/engine/meta/make-friend.meta';
import {ScheduleType} from '../../models/enums';
import {TargetGroupSelectionComponent} from '../../components/account/target-group-selection/target-group-selection.component';
import {IModalOptions} from '../../core/modal/modalWrapper.component';
import {TargetGroup} from '../../models/target-group.model';

@Component({
    selector: 'make-friend',
    templateUrl: './make-friend.component.html',
    styleUrls: ['./make-friend.component.css']
})
export class MakeFriendComponent extends AbstractScheduleComponent implements OnInit {

    public genderList: any[];
    public postOptionList: any[];
    public targetGroup: TargetGroup;

    constructor(elementRef: ElementRef) {
        super(elementRef, MakeFriendMeta, ScheduleType.MakeFriend);

        this.meta = Object.assign(MakeFriendMeta.prototype, {

        });
    }

    ngOnInit() {
        this.genderList = [
            {text: 'Nam', value: 0},
            {text: 'Nữ', value: 1}
        ];

        const ONE_DAY = 1;
        this.postOptionList = [
            {text: '1 ngày', value: ONE_DAY},
            {text: '1 tuần', value: ONE_DAY * 7},
            {text: '2 tuần', value: ONE_DAY * 14},
            {text: '1 tháng', value: ONE_DAY * 30}
        ];
    }

    public selectGroups() {
        let dialog = this.modal.open({
            component: TargetGroupSelectionComponent,
            inputs: {
            },
            title: 'Chọn nhóm mục tiêu'
        } as IModalOptions);

        dialog.then((result) => {
            this.targetGroup = result;
            this.meta.targetGroupId = result.id;
        });
    }
}

import {Component, ElementRef, OnInit} from '@angular/core';
import {AbstractScheduleComponent} from '../base/abstractSchedule.component';
import {MakeFriendMeta} from '../../core/engine/meta/make-friend.meta';
import { AgeRange, GenderType, RelationshipStatus, ScheduleType } from '../../models/enums';
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
    public ageRangeList: any[];
    public relationshipStatusList: any[];
    public targetGroup: TargetGroup;

    constructor(elementRef: ElementRef) {
        super(elementRef, MakeFriendMeta, ScheduleType.MakeFriend);

        this.meta = Object.assign(MakeFriendMeta.prototype, {

        });
    }

    ngOnInit() {
        this.genderList = [
            {text: 'Nam', value: 'male'},
            {text: 'Nữ', value: 'female'}
        ];

        const ONE_DAY = 1;
        this.postOptionList = [
            {text: '1 ngày', value: ONE_DAY},
            {text: '1 tuần', value: ONE_DAY * 7},
            {text: '2 tuần', value: ONE_DAY * 14},
            {text: '1 tháng', value: ONE_DAY * 30}
        ];

        this.ageRangeList = [
            {text: 'Dưới 15 tuổi', value: AgeRange.Under15},
            {text: 'Từ 15-24 tuổi', value: AgeRange.From15To24},
            {text: 'Từ 25-34 tuổi', value: AgeRange.From25To34},
            {text: 'Từ 35-44 tuổi', value: AgeRange.From35To44},
            {text: 'Trên 45 tuổi', value: AgeRange.Above45}
        ];

        this.relationshipStatusList = [
            {text: 'Độc thân', value: RelationshipStatus.Single},
            {text: 'Hẹn hò', value: RelationshipStatus.InARelationship},
            {text: 'Đã đính hôn', value: RelationshipStatus.Engaged},
            {text: 'Đã kết hôn', value: RelationshipStatus.Married},
            {text: 'Kết hôn đồng tính', value: RelationshipStatus.InACivilUnion},
            {text: 'Chung sống', value: RelationshipStatus.InADomesticPartnership},
            {text: 'Có mối quan hệ phức tạp', value: RelationshipStatus.Complicated},
            {text: 'Đã ly thân', value: RelationshipStatus.Separated},
            {text: 'Đã ly hôn', value: RelationshipStatus.Divorced},
            {text: 'Góa', value: RelationshipStatus.Widowed}
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

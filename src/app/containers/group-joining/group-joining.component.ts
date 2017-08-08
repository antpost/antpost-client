import {Component, ElementRef, OnInit} from '@angular/core';
import {ScheduleType} from '../../models/enums';
import {GroupJoiningMeta} from '../../core/engine/meta/group-joining.meta';
import {AbstractScheduleComponent} from '../base/abstractSchedule.component';
import {IModalOptions} from '../../core/modal/modalWrapper.component';
import {GroupFilterComponent} from '../../components/group/group-filter/group-filter.component';

@Component({
    selector: 'group-joining',
    templateUrl: './group-joining.component.html',
    styleUrls: ['./group-joining.component.css']
})
export class GroupJoiningComponent extends AbstractScheduleComponent{

    public privacyList: Array<any> = [
        { text: "Nhóm công khai", value: 'OPEN' },
        { text: "Nhóm kín", value: 'CLOSED' },
        { text: "Nhóm bí mật", value: 'SECRET' }
    ];
    public joinForm: any;
    public locales: Array<any>;

    constructor(elementRef: ElementRef) {
        super(elementRef, GroupJoiningMeta, ScheduleType.JoinGroup);

        this.meta = Object.assign(GroupJoiningMeta.prototype, {
            groups: [],
            members: 5000,
            privacy: ['OPEN', 'CLOSED', 'SECRET'],
            noPendingPost: false
        });
    }

    public selectGroups() {
        let dialog = this.modal.open({
            component: GroupFilterComponent,
            inputs: {
                groups: this.meta.groups.map(g => Object.assign({}, g)),
                account: this.selectedAccount
            },
            title: 'Chọn nhóm'
        } as IModalOptions);

        dialog.then((result) => {
            this.meta.groups = result.map(g => {
                return {id: g.id, name: g.name, privacy: g.privacy};
            });
        });
    }
}

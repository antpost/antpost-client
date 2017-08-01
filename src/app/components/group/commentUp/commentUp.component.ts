import {OnInit, Component, Input, ViewChild} from '@angular/core';
import {FacebookService} from '../../../services/facebook.service';
import {Group} from '../../../models/group.model';
import {Toastr} from '../../../core/helpers/toastr';
import {ScheduleType, JobStatus, ScheduleAction, JobEmitType} from '../../../models/enums';
import {JobFactory} from '../../../core/jobs/jobFactory';
import {ScheduleJob} from '../../../core/jobs/scheduleJob';
import {Schedule} from '../../../models/schedule.model';
import {AppManager} from '../../../core/appManager';
import {ModalService} from '../../../core/modal/modal.service';
import {IModalOptions} from '../../../core/modal/modalWrapper.component';
import {GroupSelectionComponent} from '../group-selection/group-selection.component';
import {FbAccount} from '../../../models/fbaccount.model';
import {ScheduleProgressComponent} from '../../common/schedule-progress/schedule-progress.component';
import {IJob} from '../../../core/jobs/iJob';
import {CommentUpMeta} from '../../../core/scheduleEngine/meta/commentup.meta';
import {AbstractScheduleComponent} from '../../common/abstractSchedule.component';
import {JobProgressComponent} from '../../common/job-progress/job-progress.component';

@Component({
    selector: 'comment-up',
    templateUrl: 'commentUp.component.html'
})
export class CommentUpComponent extends AbstractScheduleComponent {

    public postNumbers: Array<any>;
    public delayList: Array<any>;

    constructor(appManager: AppManager, modal: ModalService) {
        super(appManager, modal, CommentUpMeta, ScheduleType.Comment);

        this.meta = Object.assign(CommentUpMeta.prototype, {
            numberOfPosts: 1,
            like: true,
            commentOnTop: false,
            delay: 5,
            groups: []
        });

        this.postNumbers = [];
        for(let i = 1; i <= 5; i ++) {
            this.postNumbers.push({text: i, value: i});
        }

        this.delayList = [
            {text: '5 giây', value: 5},
            {text: '10 giây', value: 10},
            {text: '30 giây', value: 30},
            {text: '1 phút', value: 60},
            {text: '10 phút', value: 600}
        ];
    }

    public selectGroups() {
        let dialog = this.modal.open({
            component: GroupSelectionComponent,
            inputs: {
                groups: this.meta.groups
            },
            title: 'Chọn nhóm'
        } as IModalOptions);

        dialog.then((result) => {
            this.meta.groups = result.map(g => {
                return {id: g.id, name: g.name};
            });
        });
    }
}

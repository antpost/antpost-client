import {OnInit, Component, Input, ViewChild} from '@angular/core';
import {FacebookService} from '../../../services/facebook.service';
import {Group} from '../../../models/group.model';
import {Toastr} from '../../../core/helpers/toastr';
import {ScheduleType, JobStatus, ScheduleAction} from '../../../models/enums';
import {JobFactory} from '../../../core/jobs/jobFactory';
import {ScheduleJob} from '../../../core/jobs/scheduleJob';
import {Schedule} from '../../../models/schedule.model';
import {AppManager} from '../../../core/appManager';
import {ModalService} from '../../../core/modal/modal.service';
import {IModalOptions} from '../../../core/modal/modalWrapper.component';
import {GroupSelectionComponent} from '../group-selection/group-selection.component';
import {FbAccount} from '../../../models/fbaccount.model';
import {ScheduleProgressComponent} from '../../common/schedule-progress/schedule-progress.component';

@Component({
    selector: 'comment-up',
    templateUrl: 'commentUp.component.html'
})
export class CommentUpComponent implements OnInit {

    @ViewChild(ScheduleProgressComponent)
    public progress: ScheduleProgressComponent;

    public commentForm: any;
    public postNumbers: Array<any>;
    public delayList: Array<any>;
    public job: ScheduleJob;
    public groups: Array<any> = [];
    public selectedAccount: FbAccount;
    public scheduleOptions: any;
    public progressOptions: any;
    public showProgress: boolean = false;

    constructor(private facebookService: FacebookService, public appManager: AppManager,
                private modal: ModalService) {
        this.selectedAccount = appManager.currentUser;
        this.commentForm = {
            numberOfPosts: 1,
            like: true,
            commentOnTop: false,
            delay: 5,
        };

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

        this.scheduleOptions = {
            scheduleType: ScheduleType.Comment,
            buttons: {
                start: 'Bình luận ngay',
                stop: 'Kết thúc',
                pause: 'Dừng',
                resume: 'Tiếp tục'
            }
        }

        this.progressOptions = {
            textSuccess: 'Số nhóm thực hiện bình luận'
        }
    }

    public ngOnInit() {

    }

    public selectGroups() {
        let dialog = this.modal.open({
            component: GroupSelectionComponent,
            inputs: {},
            title: 'Chọn nhóm'
        } as IModalOptions);

        dialog.then((result) => {
            this.groups = result;
        });
    }

    public onAction(action: number) {
        switch (action) {
            case ScheduleAction.Start:
                this.showProgress = true;
                //this.start();
                break;
        }
    }

    private start() {
        if(!this.commentForm.message || !this.commentForm.message.trim()) {
            Toastr.error("Vui lòng nhập nội dung bình luận!");
            return;
        }

        if(this.groups.length == 0) {
            Toastr.error("Vui lòng chọn danh sách nhóm!");
            return;
        }

        let schedule = Object.assign(new Schedule(), {
            uid: this.appManager.currentUser.id,
            delay: this.commentForm.delay,
            scheduleType: ScheduleType.Comment,
            status: JobStatus.Stopped,
            meta: {
                message: this.commentForm.message,
                numberOfPosts: this.commentForm.numberOfPosts,
                like: this.commentForm.like,
                commentOnTop: this.commentForm.commentOnTop,
                groups: this.groups.map(g => g.id)
            }
        });

        this.job = <ScheduleJob>JobFactory.createScheduleJob(schedule, ScheduleType.Comment);
        this.job.observe().subscribe((result) => {
            console.log(result);
            if(result.status == JobStatus.Stopped) {
                Toastr.success("Kết thúc bình luận lên bài!");
            }

        });
        this.job.start(() => {
            // on finish
        });
    }
}

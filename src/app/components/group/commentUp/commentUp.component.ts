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

@Component({
    selector: 'comment-up',
    templateUrl: 'commentUp.component.html'
})
export class CommentUpComponent implements OnInit {

    @ViewChild(ScheduleProgressComponent)
    public progress: ScheduleProgressComponent;

    public commentupMeta: CommentUpMeta;
    public postNumbers: Array<any>;
    public delayList: Array<any>;
    public job: IJob;
    public groups: Array<any> = [];
    public selectedAccount: FbAccount;
    public scheduleOptions: any;
    public progressOptions: any;
    public showProgress: boolean = false;
    public status: number;

    constructor(private facebookService: FacebookService, public appManager: AppManager,
                private modal: ModalService) {
        this.selectedAccount = appManager.currentUser;
        this.status = JobStatus.Stopped;

        this.commentupMeta = Object.assign(CommentUpMeta.prototype, {
            numberOfPosts: 1,
            like: true,
            commentOnTop: false,
            delay: 5,
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

        this.scheduleOptions = {
            scheduleType: ScheduleType.Comment,
            buttons: {
                start: 'Bình luận ngay',
                stop: 'Kết thúc',
                pause: 'Dừng',
                resume: 'Tiếp tục'
            }
        };

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
            this.progress.reset();
            this.progress.setTotal(this.groups.length);
            this.commentupMeta.groups = this.groups.map(g => {
                return {id: g.id, name: g.name};
            });
        });
    }

    public onAction(action: number) {
        switch (action) {
            case ScheduleAction.Start:
                this.start();
                break;
            case ScheduleAction.Pause:
                this.job.pause();
                break;
            case ScheduleAction.Resume:
                this.job.resume();
                break;
            case ScheduleAction.Stop:
                this.job.stop();
                break;
        }
    }

    public onUpdateSchedule(schedule: Schedule) {
        // update meta
        this.commentupMeta = Object.assign(CommentUpMeta.prototype, schedule.meta);

        // update group
        this.groups = this.commentupMeta.groups;
        this.progress.setTotal(this.groups.length);
    }

    private start() {
        let validationRes = this.commentupMeta.validate();
        if(!validationRes.status) {
            Toastr.error(validationRes.message);
            return;
        }

        this.showProgress = true;

        let schedule = Object.assign(new Schedule(), {
            uid: this.selectedAccount.id,
            delay: this.commentupMeta.delay,
            scheduleType: ScheduleType.Comment,
            status: JobStatus.Stopped,
            meta: this.commentupMeta
        });

        this.job = <ScheduleJob>JobFactory.createScheduleJob(schedule, ScheduleType.Comment);
        this.job.observe().subscribe((result) => {

            if(result.type == JobEmitType.OnDone) {
                let group = this.updateGroups(result.data);
                if(group.done) {
                    this.progress.setDoneNumber(this.progress.doneNumber + 1);
                }
            } else if(result.type == JobEmitType.OnProcessData) {
                let group = this.groups.find(g => result.data.id == g.id);
                this.progress.setProgressMessage('Đang xử lý nhóm ' + group.name + ' ...');
            } else if(result.type == JobEmitType.OnUpdateStatus) {
                this.status = result.status;
            }

        });

        this.progress.reset();
        this.resetGroups();

        this.job.start(() => {
            // on finish
            Toastr.success("Kết thúc bình luận lên bài!");
            this.progress.setProgressMessage('Kết thúc!');
            this.status = JobStatus.Stopped;
        });
    }

    private updateGroups(group) {
        let item = this.groups.find(g => group.id == g.id);

        if(group.posts && group.posts.length > 0) {
            let commentedPosts = group.posts.filter(p => p.status);
            item.message = `Thành công: ${commentedPosts.length}/${group.posts.length}`;
            item.done = commentedPosts.length == group.posts.length;
            return item;
        } else {
            item.message = 'Không tìm thấy bài viết';
            item.done = true;
            return item;
        }
    }

    private resetGroups() {
        this.groups.forEach(g => {
            g.message = undefined;
            g.done = undefined
        });
    }
}

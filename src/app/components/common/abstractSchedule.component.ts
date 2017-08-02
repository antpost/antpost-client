import {AppManager} from '../../core/appManager';
import {FbAccount} from '../../models/fbaccount.model';
import {IJob} from '../../core/jobs/iJob';
import {ModalService} from '../../core/modal/modal.service';
import {JobProgressComponent} from './job-progress/job-progress.component';
import {IModalOptions} from '../../core/modal/modalWrapper.component';
import {Schedule} from '../../models/schedule.model';
import {Toastr} from '../../core/helpers/toastr';
import {ScheduleJob} from '../../core/jobs/scheduleJob';
import {JobFactory} from '../../core/jobs/jobFactory';
import { ServiceLocator } from '../../core/serviceLocator';
import { Injector } from '@angular/core';

export class AbstractScheduleComponent {
    public selectedAccount: FbAccount;
    public meta: any;
    public appManager: AppManager;
    protected modal: ModalService;

    constructor(private metaClass: Function,
                private scheduleType: number) {
        this.appManager = ServiceLocator.injector.get(AppManager);
        this.modal = ServiceLocator.injector.get(ModalService);
        this.selectedAccount = this.appManager.currentUser;
    }

    public onUpdateSchedule(schedule: Schedule) {
        // update meta
        this.meta = Object.assign(this.metaClass.prototype, schedule.meta);
    }

    public startJob() {
        let validationRes = this.meta.validate();
        if(!validationRes.status) {
            Toastr.error(validationRes.message);
            return;
        }

        let schedule = Object.assign(new Schedule(), {
            uid: this.selectedAccount.id,
            delay: this.meta.delay,
            scheduleType: this.scheduleType,
            status: true,
            meta: this.meta
        });

        let job = <ScheduleJob>JobFactory.createScheduleJob(schedule, this.scheduleType);
        this.openJobProgress(job);

        // this.job.observe().subscribe((result) => {
        //
        //     if(result.type == JobEmitType.OnDone) {
        //         let group = this.updateGroups(result.data);
        //         if(group.done) {
        //         }
        //     } else if(result.type == JobEmitType.OnProcessData) {
        //         let group = this.groups.find(g => result.data.id == g.id);
        //         //this.progress.setProgressMessage('Đang xử lý nhóm ' + group.name + ' ...');
        //     } else if(result.type == JobEmitType.OnUpdateStatus) {
        //         this.status = result.status;
        //     }
        //
        // });

        // this.job.start(() => {
        //     // on finish
        //     Toastr.success("Kết thúc bình luận lên bài!");
        //     this.status = JobStatus.Stopped;
        // });
    }

    /**
     *
     * @param {IJob} job
     */
    private openJobProgress(job: IJob) {
        let dialog = this.modal.open({
            component: JobProgressComponent,
            inputs: {
                job: job
            },
            title: 'Bình luận lên bài'
        } as IModalOptions);
    }
}

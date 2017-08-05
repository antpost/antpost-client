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
import {ServiceLocator} from '../../core/serviceLocator';
import {ElementRef, Injector} from '@angular/core';
import {Store} from '@ngrx/store';
import * as fromRoot from '../../reducers';
import {getDefaultAccount} from '../../reducers/index';

export class AbstractScheduleComponent {
    public selectedAccount: FbAccount;
    public meta: any;
    public appManager: AppManager;
    protected modal: ModalService;
    protected store: Store<fromRoot.State>;

    constructor(protected elementRef: ElementRef,
                private metaClass: Function,
                public scheduleType: number) {
        this.appManager = ServiceLocator.injector.get(AppManager);
        this.modal = ServiceLocator.injector.get(ModalService);
        this.store = ServiceLocator.injector.get(Store);

        this.store.select(getDefaultAccount).subscribe((account) => {
            this.selectedAccount = account;
        });
    }

    public onUpdateSchedule(schedule: Schedule) {
        // update meta
        this.meta = Object.assign(this.metaClass.prototype, schedule.meta);

        // update selected account

    }

    public startJob(jobTitle: string) {
        let validationRes = this.meta.validate();
        if (!validationRes.status) {
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
        this.openJobProgress(job, jobTitle);
    }

    /**
     *
     * @param {IJob} job
     */
    private openJobProgress(job: IJob, jobTitle: string) {
        let dialog = this.modal.open({
            component: JobProgressComponent,
            inputs: {
                job: job
            },
            title: jobTitle,
            size: '',
            viewContainer: this.elementRef.nativeElement.children[0].getAttribute('overlayTarget'),
            isBlocking: true,
            dialogClass: 'modal-dialog modal-progress',
            showClose: false
        } as IModalOptions);
    }
}

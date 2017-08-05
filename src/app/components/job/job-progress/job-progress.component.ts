import {Component, Injector, Input, OnDestroy, OnInit} from '@angular/core';
import {IJob, IResNextData} from '../../../core/jobs/iJob';
import {JobEmitType, JobStatus} from '../../../models/enums';
import {Toastr} from '../../../core/helpers/toastr';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'job-progress',
    templateUrl: './job-progress.component.html',
    styleUrls: ['./job-progress.component.css']
})
export class JobProgressComponent implements OnInit, OnDestroy {

    @Input()
    public onClose: Function;

    @Input()
    public onDismiss: Function;

    public job: IJob;
    public message: string;
    public percent: number;
    public percentMessage: string;
    public jobStatus;

    private subscription: Subscription;

    constructor(private injector: Injector) {
        this.onClose = this.injector.get('onClose');
        this.onDismiss = this.injector.get('onDismiss');
        this.job = this.injector.get('job');
        this.jobStatus = JobStatus;
    }

    public ngOnInit() {
        this.start();
    }

    public ngOnDestroy() {
        this.stop();
    }

    public start() {
        this.subscribe();
        this.job.start();
    }

    public stop() {
        this.job.stop();
        this.subscription.unsubscribe();
    }

    public pause() {
        this.job.pause();
    }

    public resume() {
        this.job.resume();
    }

    public close() {
        this.onClose();
    }

    private subscribe() {
        this.subscription = this.job.observe().subscribe((result: any) => {

            switch (result.type) {
                case JobEmitType.OnUpdateStatus:
                    this.updateProgress();
                    break;
                case JobEmitType.OnDone:
                    this.updateProgress();
                    break;
                case JobEmitType.OnProcessData:
                    this.message = 'Đang xử lý ' + result.data.name + ' ...';
                    break;
                case JobEmitType.Finished:
                    // update progress message
                    this.message = "Kết thúc!";
                    this.subscription.unsubscribe();
                    break;
            }

        });
    }

    private updateProgress() {
        if (!this.job.total) {
            this.percent = 0;
            this.percentMessage = '0%';
        } else {
            this.percent = this.job.doneCount / this.job.total * 100;
            this.percentMessage = (Math.round(this.job.doneCount / this.job.total * 100)) + "%";
        }
    }
}

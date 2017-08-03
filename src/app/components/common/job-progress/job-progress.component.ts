import {Component, Injector, Input, OnInit} from '@angular/core';
import { IJob } from '../../../core/jobs/iJob';
import { JobEmitType, JobStatus } from '../../../models/enums';
import { Toastr } from '../../../core/helpers/toastr';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'job-progress',
    templateUrl: './job-progress.component.html',
    styleUrls: ['./job-progress.component.css']
})
export class JobProgressComponent implements OnInit {

    @Input()
    public onClose: Function;

    @Input()
    public onDismiss: Function;

    public job: IJob;

    private subscription: Subscription;

    constructor(private injector: Injector) {
        this.onClose = this.injector.get('onClose');
        this.onDismiss = this.injector.get('onDismiss');
        this.job = this.injector.get('job');
    }

    public ngOnInit() {
        let subscription = this.job.observe().subscribe((result) => {

            switch (result.type) {
                case JobEmitType.OnDone:
                    // update progress percent
                    break;
                case JobEmitType.OnProcessData:
                    // update progress message
                    break;
                case JobEmitType.Finished:
                    // update progress message
                    break;
            }

        });
    }

    public start() {
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
        this.subscription = this.job.observe().subscribe((result) => {

            switch (result.type) {
                case JobEmitType.OnDone:
                    // update progress percent
                    break;
                case JobEmitType.OnProcessData:
                    // update progress message
                    break;
                case JobEmitType.Finished:
                    // update progress message
                    this.subscription.unsubscribe();
                    break;
            }

        });
    }
}

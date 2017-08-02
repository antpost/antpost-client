import {Component, Injector, Input, OnInit} from '@angular/core';

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

    constructor(private injector: Injector) {
        this.onClose = this.injector.get('onClose');
        this.onDismiss = this.injector.get('onDismiss');
    }

    ngOnInit() {
    }

    public close() {
        this.onClose();
    }
}

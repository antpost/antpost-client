import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'schedule-progress',
    templateUrl: './schedule-progress.component.html',
    styleUrls: ['./schedule-progress.component.css']
})
export class ScheduleProgressComponent implements OnInit {
    @Input()
    public options: any;

    public message: string;
    public percentMessage: string;
    public total: number;
    public doneNumber: number;
    public percent: number;

    constructor() {
    }

    ngOnInit() {
        this.total = 0;
        this.reset();
    }

    public setProgressMessage(message: string) {
        this.message = message;
    }

    public setTotal(total: number) {
        this.total = total;
        this.calculate();
    }

    public setDoneNumber(number: number) {
        this.doneNumber = number;
        this.calculate();
    }

    public reset() {
        this.doneNumber = 0;
        this.message = null;
        this.calculate();
    }

    private calculate() {
        if(!this.total) {
            this.percent = 0;
            this.percentMessage = '0%';
        } else {
            this.percent = this.doneNumber/this.total * 100;
            this.percentMessage = (Math.round(this.doneNumber/this.total * 100)) + "%";
        }
    }
}

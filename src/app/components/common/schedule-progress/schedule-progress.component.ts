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
    public doneNUmber: number;
    public percent: number;

    constructor() {
    }

    ngOnInit() {
        this.doneNUmber = 0;
        this.calculate();
    }

    public setProgressMessage(message: string) {
        this.message = message;
    }

    public setTotal(total: number) {
        this.total = total;
        this.calculate();
    }

    public setDoneNumber(number: number) {
        this.doneNUmber = number;
        this.calculate();
    }

    private calculate() {
        if(!this.total) {
            this.percent = 0;
            this.percentMessage = '0%';
        } else {
            this.percent = this.doneNUmber/this.total * 100;
            this.percentMessage = (Math.round(this.doneNUmber/this.total * 100)) + "%";
        }
    }
}

import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Schedule} from '../../../models/schedule.model';
import {FbAccount} from '../../../models/fbaccount.model';
import {JobStatus, ScheduleAction, ScheduleType} from '../../../models/enums';
import {ScheduleService} from '../../../services/schedule.service';
import {IScheduleMeta} from '../../../core/scheduleEngine/meta/meta';
import {Toastr} from '../../../core/helpers/toastr';
import {ModalService} from '../../../core/modal/modal.service';
import {IModalOptions} from '../../../core/modal/modalWrapper.component';
import {ScheduleListComponent} from '../schedule-list/schedule-list.component';

@Component({
    selector: 'schedule-actions',
    templateUrl: './schedule-actions.component.html',
    styleUrls: ['./schedule-actions.component.css']
})
export class ScheduleActionsComponent implements OnInit {

    @Input() public meta: IScheduleMeta;
    @Input() public options: any;
    @Input() public account: FbAccount;
    @Input() public status: number;

    @Output() public onAction = new EventEmitter<number>();

    @Output() public onUpdate = new EventEmitter<Schedule>();

    public schedule: Schedule;
    public delayList: Array<any>;
    public repeatList: Array<any>;
    public statusList: Array<any>;
    public jobStatus;
    public enableSchedule: boolean = false;

    constructor(private scheduleService: ScheduleService, private modal: ModalService) {
    }

    async ngOnInit() {
        this.jobStatus = JobStatus;

        this.delayList = [
            {text: '5 giây', value: 5},
            {text: '10 giây', value: 10},
            {text: '30 giây', value: 30},
            {text: '1 phút', value: 60},
            {text: '10 phút', value: 600}
        ];

        this.statusList = [
            {text: 'Kích hoạt', value: true},
            {text: 'Ngừng hoạt động', value: false}
        ];

        this.repeatList = [];
        for(let i = 1; i <= 24; i ++) {
            this.repeatList.push({text: `${i} giờ`, value: i * 60 * 60});
        }
    }

    public start() {
        //this.status = JobStatus.Running;
        this.onAction.emit(ScheduleAction.Start);
    }

    public stop() {
        this.status = JobStatus.Stopped;
        this.onAction.emit(ScheduleAction.Stop);
    }

    public pause() {
        this.status = JobStatus.Paused;
        this.onAction.emit(ScheduleAction.Pause);
    }

    public resume() {
        this.status = JobStatus.Running;
        this.onAction.emit(ScheduleAction.Resume);
    }

    public newSchedule() {
        this.enableSchedule = true;
        this.schedule = Object.assign(new Schedule(), {
            uid: this.account.id,
            scheduleType: this.options.scheduleType,
            delay: 5,
            startTime: new Date(),
            endTime: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
            active: true
        });
    }

    public hideSchedule() {
        this.schedule = null;
    }

    public showList() {
        let dialog = this.modal.open({
            component: ScheduleListComponent,
            inputs: {
                scheduleType: ScheduleType.Comment
            },
            title: 'Chọn lịch đăng'
        } as IModalOptions);

        dialog.then((result) => {
            this.modal.confirm({
                title: 'Bạn có muốn dừng tiến trình?',
                text: "Lịch được chọn sẽ ảnh hưởng đến tiến trình đang chạy!",
            }).then(() => {
                this.onAction.emit(ScheduleAction.Stop);
                this.schedule = result;
                this.onUpdate.emit(this.schedule);
            });


        });
    }

    public async saveSchedule() {
        let validationRes = this.meta.validate();
        if(!validationRes.status) {
            Toastr.error(validationRes.message);
            return;
        }

        if(!this.schedule.name || !this.schedule.name.trim()) {
            Toastr.error('Tên của lịch không được bỏ trống!');
            return;
        }

        this.schedule.meta = JSON.parse(JSON.stringify(this.meta));
        this.schedule.accountName = this.account.name;

        if(!this.schedule.id) {
            this.schedule.id = await this.scheduleService.add(this.schedule);
        } else {
            // check exist
            let existing = await this.scheduleService.get(this.schedule.id);
            if(existing) {
                await this.scheduleService.update(this.schedule.id, this.schedule);
            } else {
                this.schedule.id = null;
                this.schedule.id = await this.scheduleService.add(this.schedule);
            }
        }
        Toastr.success('Đặt lịch thành công!');
        this.schedule = null;
    }

}

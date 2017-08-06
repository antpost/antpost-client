import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IScheduleMeta} from '../../../core/engine/meta/meta';
import {FbAccount} from '../../../models/fbaccount.model';
import {Schedule} from '../../../models/schedule.model';
import {JobStatus, ScheduleAction, ScheduleType} from '../../../models/enums';
import {Toastr} from '../../../core/helpers/toastr';
import {IModalOptions} from '../../../core/modal/modalWrapper.component';
import {ScheduleListComponent} from '../schedule-list/schedule-list.component';
import {ModalService} from '../../../core/modal/modal.service';
import {ScheduleService} from '../../../services/schedule.service';

@Component({
    selector: 'schedule-form',
    templateUrl: 'schedule-form.component.html',
    styleUrls: ['schedule-form.component.css']
})
export class ScheduleFormComponent implements OnInit {

    @Input() public meta: IScheduleMeta;
    @Input() public account: FbAccount;
    @Input() public type: ScheduleType;

    @Output() public onUpdate = new EventEmitter<Schedule>();

    public schedule: Schedule;
    public delayList: Array<any>;
    public repeatList: Array<any>;
    public statusList: Array<any>;

    constructor(private modal: ModalService, private scheduleService: ScheduleService) {
    }

    async ngOnInit() {

        this.delayList = [
            {text: 'Liên tục', value: 0},
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
        for (let i = 1; i <= 24; i++) {
            this.repeatList.push({text: `${i} giờ`, value: i * 60 * 60});
        }

        this.resetSchedule();
    }

    public showList() {
        let dialog = this.modal.open({
            component: ScheduleListComponent,
            inputs: {
                scheduleType: this.type
            },
            title: 'Chọn lịch đăng'
        } as IModalOptions);

        dialog.then((result) => {
            this.schedule = result;
            this.onUpdate.emit(this.schedule);
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
        this.schedule.uid = this.account.id;
        this.schedule.accountName = this.account.name;
        this.schedule.updatedAt = new Date();

        if(!this.schedule.id) {
            this.schedule.createdAt = new Date();
            this.schedule.id = await this.scheduleService.add(this.schedule);
        } else {
            // check exist
            let existing = await this.scheduleService.get(this.schedule.id);
            if(existing) {
                await this.scheduleService.update(this.schedule.id, this.schedule);
            } else {
                this.schedule.id = null;
                this.schedule.createdAt = new Date();
                this.schedule.id = await this.scheduleService.add(this.schedule);
            }
        }
        Toastr.success('Đặt lịch thành công!');
        this.resetSchedule();
    }

    private resetSchedule() {
        this.schedule = Object.assign(Schedule.prototype, {
            name: '',
            //uid: this.account.id,
            scheduleType: this.type,
            repeat: 0,
            delay: 5,
            startTime: new Date(),
            endTime: new Date(),
            active: true,
            meta: {}
        });
    }
}

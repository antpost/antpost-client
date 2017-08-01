import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IScheduleMeta} from '../../../core/scheduleEngine/meta/meta';
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
    templateUrl: './schedule-form.component.html',
    styleUrls: ['./schedule-form.component.css']
})
export class ScheduleFormComponent implements OnInit {

    @Input() public meta: IScheduleMeta;
    @Input() public options: any;
    @Input() public account: FbAccount;
    @Input() public status: number;

    @Output() public onUpdate = new EventEmitter<Schedule>();

    public schedule: Schedule;
    public delayList: Array<any>;
    public repeatList: Array<any>;
    public statusList: Array<any>;
    public jobStatus;

    constructor(private modal: ModalService, private scheduleService: ScheduleService) {
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
        for (let i = 1; i <= 24; i++) {
            this.repeatList.push({text: `${i} giờ`, value: i * 60 * 60});
        }

        this.schedule = new Schedule();
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

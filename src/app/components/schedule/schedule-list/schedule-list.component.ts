import {Component, Injector, Input, OnInit} from '@angular/core';
import {ScheduleService} from '../../../services/schedule.service';
import {Schedule} from '../../../models/schedule.model';
import {ModalService} from '../../../core/modal/modal.service';

@Component({
    selector: 'schedule-list',
    templateUrl: 'schedule-list.component.html',
    styleUrls: ['schedule-list.component.css']
})
export class ScheduleListComponent implements OnInit {

    @Input()
    public onClose: Function;

    @Input()
    public onDismiss: Function;

    @Input()
    public scheduleType: number;

    public schedules: Array<Schedule>;

    constructor(private injector: Injector, private scheduleService: ScheduleService, private modal: ModalService) {
        this.onClose = this.injector.get('onClose');
        this.onDismiss = this.injector.get('onDismiss');
        this.scheduleType = this.injector.get('scheduleType');
    }

    async ngOnInit() {
        this.schedules = await this.scheduleService.listByType(this.scheduleType);
    }

    public cancel() {
        this.onDismiss();
    }

    public select(dataItem) {
        this.onClose(dataItem);
    }

    public remove(dataItem: Schedule) {
        this.modal.confirm({
            title: 'Bạn có chắc chắn xóa?',
            text: "Dữ liệu đã xóa không thể phục hồi!",
        }).then(() => {
            this.scheduleService.delete(dataItem.id).then(async () => {
                this.modal.alert({
                    title: 'Đã xóa!',
                    text: 'Lịch đã được xóa thành công.'
                });
                this.schedules = await this.scheduleService.listByType(this.scheduleType);
            });
        });
    }
}

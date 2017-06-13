import {Pipe, PipeTransform} from '@angular/core';
import {PostType, SchedulePostStatus} from '../models/enums';

@Pipe({name: 'scheduleStatus'})
export class ScheduleStatusPipe implements PipeTransform {
    public transform(value: string, args: string[]): any {
        let postType = parseInt(value);
        switch (postType) {
            case SchedulePostStatus.Opened:
                return 'Chưa chạy';
            case SchedulePostStatus.Running:
                return 'Đang chạy';
            case SchedulePostStatus.Paused:
                return 'Tạm dừng';
            case SchedulePostStatus.Stopped:
                return 'Đã dừng';
        }
    }
}

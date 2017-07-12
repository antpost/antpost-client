import {Pipe, PipeTransform} from '@angular/core';
import {PostType, JobStatus} from '../models/enums';

@Pipe({name: 'scheduleStatus'})
export class ScheduleStatusPipe implements PipeTransform {
    public transform(value: string, args: string[]): any {
        let postType = parseInt(value);
        switch (postType) {
            case JobStatus.Opened:
                return 'Chưa chạy';
            case JobStatus.Running:
                return 'Đang chạy';
            case JobStatus.Paused:
                return 'Tạm dừng';
            case JobStatus.Stopped:
                return 'Đã dừng';
        }
    }
}

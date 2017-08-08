import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'groupPrivacy'
})
export class GroupPrivacyPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        switch (value) {
            case 'OPEN':
                return 'Nhóm công khai';
            case 'CLOSED':
                return 'Nhóm kín';
            case 'SECRET':
                return 'Nhóm bí mật';
            default:
                return '';
        }
    }

}

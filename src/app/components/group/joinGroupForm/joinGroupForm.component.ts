import {OnInit, Component} from '@angular/core';

@Component({
    selector: 'join-group-form',
    templateUrl: 'joinGroupForm.component.html'
})
export class JoinGroupFormComponent implements OnInit {
    public privacyList: Array<any> = [
        { text: "Nhóm công khai", value: 'OPEN' },
        { text: "Nhóm kín", value: 'CLOSED' },
        { text: "Nhóm bí mật", value: 'SECRET' }
    ];
    public joinForm: any;

    constructor() {
        this.joinForm = {
            privacy: ['OPEN', 'CLOSED', 'SECRET']
        };
    }

    public ngOnInit() {

    }
}

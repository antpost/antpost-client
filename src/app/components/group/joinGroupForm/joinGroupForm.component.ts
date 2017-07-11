import {OnInit, Component, ViewChild} from '@angular/core';
import {LOCALES} from '../../../core/localization/locales';
import {Group} from '../../../models/group.model';
import {GroupSearchComponent} from '../groupSearch/groupSearch.component';
import {Toastr} from '../../../core/helpers/toastr';
import {FacebookService} from '../../../services/facebook.service';
import {Observable} from 'rxjs';

@Component({
    selector: 'join-group-form',
    templateUrl: 'joinGroupForm.component.html'
})
export class JoinGroupFormComponent implements OnInit {
    @ViewChild("localeDropdown") localeDropdown;

    @ViewChild(GroupSearchComponent)
    public groupSearchComponent: GroupSearchComponent;

    public privacyList: Array<any> = [
        { text: "Nhóm công khai", value: 'OPEN' },
        { text: "Nhóm kín", value: 'CLOSED' },
        { text: "Nhóm bí mật", value: 'SECRET' }
    ];
    public joinForm: any;
    public locales: Array<any>;
    public started: boolean = false;
    public percent: number = 0;
    public successGroupCount = 0;
    public message: string = "";
    public progressMessage: string = "Chưa bắt đầu";

    constructor(private facebookService: FacebookService) {
        this.joinForm = {
            privacy: ['OPEN', 'CLOSED', 'SECRET'],
            noPendingPost: true,
            members: 5000,
            location: ''
        };

        this.locales = LOCALES;
    }

    public ngOnInit() {

    }

    public handleFilterLocale(value) {
        this.locales = LOCALES.filter((s) => s.name.toLowerCase().indexOf(value.toLowerCase()) !== -1);
    }

    public async start() {
        // check group list
        let groups = this.groupSearchComponent.getGroups();
        if(groups.length == 0) {
            Toastr.error("Danh sách nhóm trống. Vui lòng tìm kiếm nhóm với từ khóa khác!");
            return;
        }

        this.started = true;

        this.percent = 0;
        this.progressMessage = "0%";
        this.successGroupCount = 0;

        for(let i = 0; i < groups.length; i ++) {
            groups[i].status = await this.doJoin(groups[i]);
            this.percent = (i + 1)/groups.length * 100;
            this.progressMessage = (Math.round((i + 1)/groups.length) * 100) + "%";
            this.successGroupCount += groups[i].status ? 1: 0;
        }
    }

    private async doJoin(group: any) {
        return new Promise((resolve, reject) => {
            if(this.joinForm.privacy.indexOf(group.privacy) < 0) {
                resolve(false);
            }

            // load members
            this.joinForm.members = this.joinForm.members || 1;
            this.message = `Đang kiểm tra thông tin nhóm ${group.name} ...`;

            /*let observables = [];
            observables.push(this.facebookService.getGroupMembers(group.id));

            Observable.forkJoin(observables).subscribe((result: Array<any>) => {
                group.members = result[0];

                if(group.members < this.joinForm.members) {
                    resolve(false);
                }
                else {
                    resolve(true);
                }
            });*/

            this.facebookService.getGroupMembers(group.id)
                .flatMap(members => {
                    group.members = members;
                    if(group.members < this.joinForm.members || !this.joinForm.noPendingPost) {
                        return Observable.of(undefined);
                    } else {
                        return this.facebookService.checkPendingPost(group.id);
                    }
                })
                .flatMap(status => {
                    group.hasPendingPost = status;
                    if(!status && (this.joinForm.locale || this.joinForm.location)) {
                        return this.facebookService.getGroupLocaleAndLocation(group.id);
                    } else {
                        return Observable.of({});
                    }
                })
                .subscribe(result => {
                    console.log(result);
                    group.location = result.location ? result.location.name : null;
                    group.locale = result.locale;
                    resolve(true);
                });
        });
    }
}

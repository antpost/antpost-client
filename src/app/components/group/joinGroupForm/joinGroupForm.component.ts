import {OnInit, Component, ViewChild} from '@angular/core';
import {LOCALES} from '../../../core/localization/locales';
import {Group} from '../../../models/group.model';
import {GroupSearchComponent} from '../groupSearch/groupSearch.component';
import {Toastr} from '../../../core/helpers/toastr';
import {FacebookService} from '../../../services/facebook.service';
import {Observable} from 'rxjs';
import {JobStatus} from "../../../models/enums";

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
    public status: number = JobStatus.Stopped;
    public percent: number = 0;
    public successGroupCount = 0;
    public message: string = "";
    public progressMessage: string = "Chưa bắt đầu";

    constructor(private facebookService: FacebookService) {
        this.joinForm = {
            privacy: ['OPEN', 'CLOSED', 'SECRET'],
            noPendingPost: true,
            members: 5000,
            location: '',
            startIndex: 1,
            total: 1000
        };

        this.locales = LOCALES;
    }

    public ngOnInit() {

    }

    ngOnDestroy(){
        this.status = JobStatus.Stopped;
    }

    public handleFilterLocale(value) {
        this.locales = LOCALES.filter((s) => s.name.toLowerCase().indexOf(value.toLowerCase()) !== -1);
    }

    public async start(reset: boolean = true) {
        // check group list
        let groups = this.groupSearchComponent.getGroups();
        if(groups.length == 0) {
            Toastr.error("Danh sách nhóm trống. Vui lòng tìm kiếm nhóm với từ khóa khác!");
            return;
        }

        if(reset) {
            groups.forEach(group => group.status = undefined);
        }

        this.status = JobStatus.Running;
        this.groupSearchComponent.enableSearch(false);

        this.percent = 0;
        this.progressMessage = "0%";
        this.successGroupCount = 0;

        for(let i = 0; i < groups.length; i ++) {
            if(this.status != JobStatus.Running) {
                break;
            }

            if(groups[i].status !== undefined) {
                continue;
            }

            groups[i].status = await this.doJoin(groups[i]);
            this.percent = (i + 1)/groups.length * 100;
            this.progressMessage = (Math.round((i + 1)/groups.length * 100)) + "%";
            this.successGroupCount += groups[i].status ? 1: 0;
        }

        if(this.status == JobStatus.Stopped) {
            Toastr.success("Kết thúc việc gia nhập nhóm!");
            this.groupSearchComponent.enableSearch();
        } else {
            Toastr.success("Tạm dừng việc gia nhập nhóm!");
        }
    }

    public pause() {
        this.status = JobStatus.Paused;
    }

    public resume() {
        this.status = JobStatus.Running;
        this.start(false);
    }

    public stop() {
        this.status = JobStatus.Stopped;
        this.groupSearchComponent.enableSearch();
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

            this.facebookService.viewGroupInfo(group.id)
                .flatMap(info => {
                    group.members = info.members;
                    group.requested = info.requested;
                    if(group.members < this.joinForm.members || !this.joinForm.noPendingPost || group.requested) {
                        return Observable.of(undefined);
                    } else {
                        return this.facebookService.checkPendingPost(group.id);
                    }
                })
                .flatMap(status => {
                    group.hasPendingPost = status;
                    if(this.checkGroupValid(group) && !group.requested) {
                        this.message = `Gia nhập nhóm ${group.name} ...`;
                        return this.facebookService.joinGroup(group.id);
                    } else {
                        return Observable.of(false);
                    }
                })
                .subscribe(status => {
                    resolve(group.requested || status);
                });
        });
    }

    private checkGroupValid(group: any) {
        // check membters
        if(group.members < this.joinForm.members) {
            return false;
        }

        if(this.joinForm.noPendingPost && group.hasPendingPost) {
            return false;
        }

        return true;

    }
}

import {Component} from '@angular/core';
import {PostComponent} from "./post/post.component";
import {GroupPostScheduleComponent} from "./group/schedule/groupPostSchedule.component";
import {HomeComponent} from './home/home.component';
import {JoinGroupFormComponent} from './group/joinGroupForm/joinGroupForm.component';

@Component({
    selector: 'antpost',
    templateUrl: 'antpost.component.html'
})

export class AntPostComponent {

    public tabs: any[] = [
        {
            title: 'Đăng nhóm',
            path: 'post-group',
            active: false,
            removable: true,
            componentData: {
                component: GroupPostScheduleComponent,
                inputs: {}
            }
        },
        {
            title: 'Bài viết',
            path: 'post',
            removable: true,
            active: true,
            componentData: {
                component: PostComponent,
                inputs: {}
            }
        },
        {
            title: 'Gia nhập nhóm',
            path: 'join-group',
            removable: true,
            active: true,
            componentData: {
                component: JoinGroupFormComponent,
                inputs: {}
            }
        }
    ];

    public openTab(option: any) {
        // check tab opened
        let tab = this.tabs.find((item) => item.path == option.path);
        this.tabs.forEach((item) => item.active = false);
        if(tab) {
            // active tab
            tab.active = true;
        } else {
            option.removable = true;
            option.active = true;
            option.componentData = {
                component: option.component,
                inputs: {}
            }

            this.tabs.push(option);
        }
    }

    public removeTabHandler(tab: any): void {
        let active = tab.active;
        this.tabs.splice(this.tabs.indexOf(tab), 1);

        if(this.tabs.length > 0 && active) {
            this.tabs[this.tabs.length - 1].active = true;
        }
    }

    public isLogin() {
        return true;
    }
}

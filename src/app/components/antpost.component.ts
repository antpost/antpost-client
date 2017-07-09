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
            active: false,
            removable: true,
            componentData: {
                component: GroupPostScheduleComponent,
                inputs: {}
            }
        },
        {
            title: 'Bài viết',
            removable: true,
            active: true,
            componentData: {
                component: PostComponent,
                inputs: {}
            }
        },
        {
            title: 'Gia nhập nhóm',
            removable: true,
            active: true,
            componentData: {
                component: JoinGroupFormComponent,
                inputs: {}
            }
        }
    ];

    public addNewTab(): void {
        const newTabIndex = this.tabs.length + 1;
        this.tabs.push({
            title: `Dynamic Title ${newTabIndex}`,
            content: `Dynamic content ${newTabIndex}`,
            disabled: false,
            removable: true
        });
    }

    public removeTabHandler(tab: any): void {
        let active = tab.active;
        this.tabs.splice(this.tabs.indexOf(tab), 1);

        if(this.tabs.length > 0 && active) {
            this.tabs[this.tabs.length - 1].active = true;
        }
    }
}

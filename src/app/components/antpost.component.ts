import {Component} from '@angular/core';
import {PostComponent} from "./post/post.component";
import {GroupPostScheduleComponent} from "./group/schedule/groupPostSchedule.component";

@Component({
    selector: 'antpost',
    templateUrl: 'antpost.component.html'
})

export class AntPostComponent {

    public tabs: any[] = [
        {
            title: 'Đăng nhóm',
            active: true,
            componentData: {
                component: GroupPostScheduleComponent,
                inputs: {}
            }
        },
        {
            title: 'Bài viết',
            active: true,
            componentData: {
                component: PostComponent,
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
        this.tabs.splice(this.tabs.indexOf(tab), 1);
        console.log('Remove Tab handler');
    }
}

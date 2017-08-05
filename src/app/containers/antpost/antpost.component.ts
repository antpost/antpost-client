import {Component, OnInit} from '@angular/core';
import {CommentUpComponent} from '../comment-up/comment-up.component';

@Component({
    selector: 'antpost',
    templateUrl: 'antpost.component.html'
})

export class AntPostComponent implements OnInit {

    public tabs: any[] = [];

    public ngOnInit() {

    }

    public openTab(option: any) {
        // check tab opened
        let tab = this.tabs.find((item) => item.path == option.path);
        this.tabs.forEach((item) => item.active = false);
        if (tab) {
            // active tab
            tab.active = true;
        } else {
            option.removable = true;
            option.active = true;
            option.componentData = {
                component: option.component,
                inputs: {
                    targetOverlay: option.path
                }
            };

            this.tabs.push(option);
        }
    }

    public removeTabHandler(tab: any): void {
        let active = tab.active;
        this.tabs.splice(this.tabs.indexOf(tab), 1);

        if (this.tabs.length > 0 && active) {
            this.tabs[this.tabs.length - 1].active = true;
        }
    }

    public isLogin() {
        return true;
    }
}

import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {ROUTES} from './sidebar-routes.config';
import $ from 'jquery';

@Component({
    selector: 'sidebar',
    templateUrl: 'sidebar.component.html',
})

export class SidebarComponent implements OnInit {
    @Output() onOpen = new EventEmitter();

    public menuItems: any[];

    public ngOnInit() {
        $.getScript('assets/js/material-dashboard.js');
        this.menuItems = ROUTES.filter((menuItem) => menuItem);
    }

    public goTo(path: string) {
        let item = ROUTES.find(r => r.path == path);
        this.onOpen.emit({
            value: item
        });
    }
}

import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {ROUTES} from './sidebar-routes.config';
import $ from 'jquery';
import {Router} from '@angular/router';

@Component({
    selector: 'sidebar',
    templateUrl: 'sidebar.component.html',
})

export class SidebarComponent implements OnInit {
    @Output()
    public onOpen = new EventEmitter();

    public menuItems: any[];

    constructor(private router: Router) {
    }

    public ngOnInit() {
        $.getScript('assets/js/material-dashboard.js');
        this.menuItems = ROUTES.filter((menuItem) => menuItem);
    }

    public goTo(path: string) {
        if(path == 'logout') {
            this.router.navigateByUrl("/login");
            return;
        }

        let item = ROUTES.find(r => r.path == path);
        this.onOpen.emit(item);
    }
}

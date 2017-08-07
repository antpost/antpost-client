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

        // hard
        this.goTo('comment-up');
        this.goTo('post-group');
        this.goTo('join-group');
    }

    public goTo(path: string) {
        if(path == 'logout') {
            this.router.navigateByUrl("/login");
            return;
        }

        let route = ROUTES.find((r) => {
            if(r.path == path) {
                return true;
            }

            return r.subroutes ? !!r.subroutes.find(sr => sr.path == path) : false;
        });

        let item = route.path == path ? route : route.subroutes.find(sr => sr.path == path);

        this.onOpen.emit(item);
    }
}

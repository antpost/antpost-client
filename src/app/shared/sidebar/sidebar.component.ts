import { Component, OnInit } from '@angular/core';
import { ROUTES } from './sidebar-routes.config';
import $ from 'jquery';

@Component({
    selector: 'sidebar',
    templateUrl: 'sidebar.component.html',
})

export class SidebarComponent implements OnInit {
    public menuItems: any[];
    ngOnInit() {
        $.getScript('assets/js/material-dashboard.js');
        this.menuItems = ROUTES.filter(menuItem => menuItem);
    }
}

import {Component, Injector, Input, OnInit} from '@angular/core';

@Component({
    selector: 'account-friends-searching',
    templateUrl: './account-friends-searching.component.html',
    styleUrls: ['./account-friends-searching.component.css']
})
export class AccountFriendsSearchingComponent implements OnInit {

    @Input()
    public onClose: Function;

    @Input()
    public onDismiss: Function;

    constructor(private injector: Injector) {
        this.onClose = this.injector.get('onClose');
        this.onDismiss = this.injector.get('onDismiss');
    }

    ngOnInit() {
    }

}

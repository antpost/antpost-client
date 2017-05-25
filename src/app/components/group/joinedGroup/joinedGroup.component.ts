import {
    Component,
    OnInit, ViewChild, ViewEncapsulation
} from '@angular/core';
import {PostService} from '../../../services/post.service';
import {ModalService} from '../../../core/modal/modal.service';

@Component({
    selector: 'join-group',
    providers: [],
    styleUrls: [],
    templateUrl: 'joinedGroup.component.html',
    encapsulation: ViewEncapsulation.None
})
export class JoinedGroupComponent implements OnInit {

    private groups: any[];

    constructor(private postService: PostService, private modal: ModalService) {
        this.fetch((data) => {
            this.groups = data;
        });
    }

    public ngOnInit() {

        /*this.groups = [
            {
                "name": "Làm Cha mẹ",
                "members": 10000,
                "privacy": 'OPEN'
            }]*/
    }

    fetch(cb) {
        const req = new XMLHttpRequest();
        req.open('GET', `assets/mock-data/company.json`);

        req.onload = () => {
            cb(JSON.parse(req.response));
        };

        req.send();
    }
}

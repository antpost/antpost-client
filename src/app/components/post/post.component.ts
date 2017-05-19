import {
    Component,
    OnInit, ViewChild, ViewEncapsulation
} from '@angular/core';
import {PostService} from '../../services/post.service';

@Component({
    selector: 'post',
    providers: [],
    styleUrls: [],
    templateUrl: 'post.component.html',
    encapsulation: ViewEncapsulation.None
})
export class PostComponent implements OnInit {

    @ViewChild('myTable') public table: any;

    public rows: any[] = [];
    public expanded: any = {};
    public timeout: any;

    constructor(private postService: PostService) {
        this.fetch((data) => {
            this.rows = data;
        });
    }

    public ngOnInit() {

    }

    public onPage(event) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            console.log('paged!', event);
        }, 100);
    }

    public toggleExpandRow(row) {
        console.log('Toggled Expand Row!', row);
        this.table.rowDetail.toggleExpandRow(row);
    }

    public onDetailToggle(event) {
        console.log('Detail Toggled', event);
    }

    private fetch(cb) {
        const req = new XMLHttpRequest();
        req.open('GET', `assets/mock-data/100k.json`);

        req.onload = () => {
            cb(JSON.parse(req.response));
        };

        req.send();
    }
}

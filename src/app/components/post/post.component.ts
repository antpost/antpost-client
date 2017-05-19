import {
    Component,
    OnInit, ViewChild, ViewEncapsulation
} from '@angular/core';

@Component({
    // The selector is what angular internally uses
    // for `document.querySelectorAll(selector)` in our index.html
    // where, in this case, selector is the string 'home'
    selector: 'post',  // <home></home>
    // We need to tell Angular's Dependency Injection which providers are in our app.
    providers: [],
    // Our list of styles in our component. We may add more to compose many styles together
    styleUrls: [],
    // Every Angular template is first compiled by the browser before Angular runs it's compiler
    templateUrl: 'post.component.html',
    encapsulation: ViewEncapsulation.None
})
export class PostComponent implements OnInit {

    @ViewChild('myTable') table: any;

    rows: any[] = [];
    expanded: any = {};
    timeout: any;

    constructor() {
        this.fetch((data) => {
            this.rows = data;
        });
    }

    public ngOnInit() {

    }

    onPage(event) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            console.log('paged!', event);
        }, 100);
    }

    fetch(cb) {
        const req = new XMLHttpRequest();
        req.open('GET', `assets/mock-data/100k.json`);

        req.onload = () => {
            cb(JSON.parse(req.response));
        };

        req.send();
    }

    toggleExpandRow(row) {
        console.log('Toggled Expand Row!', row);
        this.table.rowDetail.toggleExpandRow(row);
    }

    onDetailToggle(event) {
        console.log('Detail Toggled', event);
    }
}

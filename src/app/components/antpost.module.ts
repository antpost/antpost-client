import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {MODULE_COMPONENTS, MODULE_ROUTES} from './antpost.routes';
import {HttpModule} from '@angular/http';
import {FormsModule} from '@angular/forms';
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import {CoreModule} from '../core/core.module';
import {PostService} from '../services/post.service';

@NgModule({
    imports: [
        FormsModule,
        HttpModule,
        CoreModule,
        NgxDatatableModule,
        RouterModule.forChild(MODULE_ROUTES)
    ],
    declarations: [MODULE_COMPONENTS],
    providers: [
        PostService,
    ]
})

export class AntPostModule {
}

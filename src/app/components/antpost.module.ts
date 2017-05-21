import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {MODULE_COMPONENTS, MODULE_ROUTES} from './antpost.routes';
import {HttpModule} from '@angular/http';
import {FormsModule} from '@angular/forms';
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import {CoreModule} from '../core/core.module';
import {PostService} from '../services/post.service';
import {BootstrapModalModule} from 'angular2-modal/plugins/bootstrap';
import {ModalModule} from 'angular2-modal';
import {PostFormComponent} from './post/postForm.component';

@NgModule({
    imports: [
        FormsModule,
        HttpModule,
        CoreModule,
        NgxDatatableModule,
        ModalModule.forRoot(),
        BootstrapModalModule,
        RouterModule.forChild(MODULE_ROUTES)
    ],
    declarations: [MODULE_COMPONENTS],
    providers: [
        PostService,
    ],
    // IMPORTANT:
    // Since 'AdditionCalculateWindow' is never explicitly used (in a template)
    // we must tell angular about it.
    entryComponents: [ PostFormComponent ]
})

export class AntPostModule {
}

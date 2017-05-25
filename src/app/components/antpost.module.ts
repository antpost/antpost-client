import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {MODULE_COMPONENTS, MODULE_ROUTES} from './antpost.routes';
import {HttpModule} from '@angular/http';
import {FormsModule} from '@angular/forms';
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import {CoreModule} from '../core/core.module';
import {PostService} from '../services/post.service';
import {PostFormComponent} from './post/postForm.component';
import {CommonModule} from '@angular/common';
import {PostSelectorComponent} from "./post/postSelector.component";
import {GridModule} from '@progress/kendo-angular-grid';
import {FacebookService} from '../services/facebook.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        CoreModule,
        GridModule,
        NgxDatatableModule,
        RouterModule.forChild(MODULE_ROUTES)
    ],
    declarations: [MODULE_COMPONENTS],
    providers: [
        PostService,
        FacebookService
    ],
    // IMPORTANT:
    // Since 'AdditionCalculateWindow' is never explicitly used (in a template)
    // we must tell angular about it.
    entryComponents: [PostFormComponent, PostSelectorComponent]
})

export class AntPostModule {
}

import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {MODULE_COMPONENTS, MODULE_ROUTES, PIPES} from './antpost.routes';
import {HttpModule} from '@angular/http';
import {FormsModule} from '@angular/forms';
import {CoreModule} from '../core/core.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {PostService} from '../services/post.service';
import {PostFormComponent} from './post/postForm.component';
import {CommonModule} from '@angular/common';
import {PostSelectorComponent} from "./post/postSelector.component";
import {GridModule} from '@progress/kendo-angular-grid';
import {UploadModule} from '@progress/kendo-angular-upload';
import { TabsModule } from 'ngx-bootstrap';

import {FacebookService} from '../services/facebook.service';
import {GroupService} from '../services/group.service';
import {AppManager} from '../core/appManager';
import {LocalStorageService} from '../services/localStorage.service';
import {SchedulePostService} from "../services/schedulePost.service";
import {NodePostService} from '../services/nodePost.service';
import {AutomationService} from "../services/automation.service";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        CoreModule,
        GridModule,
        UploadModule,
        NgbModule.forRoot(),
        TabsModule.forRoot(),
        RouterModule.forChild(MODULE_ROUTES)
    ],
    declarations: [MODULE_COMPONENTS, PIPES],
    providers: [
        PostService,
        SchedulePostService,
        FacebookService,
        AutomationService,
        GroupService,
        AppManager,
        LocalStorageService,
        NodePostService,
    ],
    // IMPORTANT:
    // Since 'AdditionCalculateWindow' is never explicitly used (in a template)
    // we must tell angular about it.
    entryComponents: [PostFormComponent, PostSelectorComponent, PostSelectorComponent]
})

export class AntPostModule {
}

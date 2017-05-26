import {NgModule, Optional, SkipSelf} from '@angular/core';

import {DbService} from './database';
import {BootstrapModalModule} from 'angular2-modal/plugins/bootstrap';
import {ModalModule} from 'angular2-modal';
import {ModalService} from './modal/modal.service';
import ModalWrapperComponent from './modal/modalWrapper.component';
import {CommonModule} from '@angular/common';
import {DynamicComponent} from "./dynamic.component";
import {AppManager} from './appManager';

@NgModule({
    declarations: [DynamicComponent, ModalWrapperComponent],
    imports: [
        ModalModule.forRoot(),
        BootstrapModalModule,
        CommonModule
    ],
    providers: [
        DbService,
        ModalService,
        AppManager
    ],
    bootstrap: [],
    entryComponents: [ModalWrapperComponent]
})
export class CoreModule {
    constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
        if (parentModule) {
            throw new Error(
                'CoreModule is already loaded. Import it in the AppModule only');
        }
    }
}

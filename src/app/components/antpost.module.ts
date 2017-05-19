import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MODULE_COMPONENTS, MODULE_ROUTES } from './antpost.routes';
import {HttpModule} from '@angular/http';
import {FormsModule} from '@angular/forms';
import {NgxDatatableModule} from "@swimlane/ngx-datatable";

@NgModule({
    imports: [
        FormsModule,
        HttpModule,
        NgxDatatableModule,
        RouterModule.forChild(MODULE_ROUTES)
    ],
    declarations: [ MODULE_COMPONENTS ]
})

export class AntPostModule{}
